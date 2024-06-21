/* {"name":"Action Counter","img":"systems/pf2e/icons/actions/TwoThreeActions.webp","_id":"9OXIrvvLr3djpsxE"} */
if (args?.length === 0) {
  const actors = canvas.tokens.controlled.flatMap((token) => token.actor ?? [])
  if (actors.length === 0 && game.user.character)
    actors.push(game.user.character)
  if (actors.length === 0) {
    const message = game.i18n.localize("PF2E.ErrorMessage.NoTokenSelected")
    return ui.notifications.error(message)
  }

  const ITEM_UUID = "Compendium.pf2e-jb2a-macros.Actions.slQlwROqkytVGKKk" // Action Counter
  const source = (await fromUuid(ITEM_UUID)).toObject()
  source.flags = mergeObject(source.flags ?? {}, {
    core: { sourceId: ITEM_UUID },
  })

  for (const actor of actors) {
    const existing = actor.itemTypes.effect.find(
      (e) => e.flags.core?.sourceId === ITEM_UUID
    )
    if (existing) {
      await existing.delete()
    } else {
      await actor.createEmbeddedDocuments("Item", [source])
    }
  }
  return
}

if (args[0] === "off") {
  const hook = pf2eAnimations.hooks.actionCounter.find(
    (h) => h.uuid === args[1].item.uuid
  )
  Hooks.off("preUpdateItem", hook.id)
  pf2eAnimations.hooks.actionCounter =
    pf2eAnimations.hooks.actionCounter.filter(
      (h) => h.uuid !== args[1].item.uuid
    )
  return
}

const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)

function amountOfImages(origin) {
  return Sequencer.EffectManager.getEffects({ origin }).length
}

async function updateImages(data, changes) {
  if (!changes?.system?.badge?.value) return
  if (!pf2eAnimations.hooks.actionCounter.find((h) => h.uuid === data.uuid))
    return

  let badgeValue = changes.system.badge.value

  pf2eAnimations.debug("Action Counter", {
    badgeValue,
    imagesOnScreen: amountOfImages(data.uuid),
  })

  if (badgeValue < amountOfImages(data.uuid)) {
    Sequencer.EffectManager.endEffects(
      Sequencer.EffectManager.getEffects({ origin: data.uuid }).at(-1).data
    )
  } else if (badgeValue > amountOfImages(data.uuid)) {
    new Sequence({ moduleName: "PF2e Animations", softFail: true })
      .addSequence(actionCounter(amountOfImages(data.uuid), data))
      .play()
  }
}

const actionCounter = (number, origin) =>
  new Sequence({ moduleName: "PF2e Animations", softFail: true })
    .effect()
    .name(tokenD.name + " Action " + (1 + number))
    .file("modules/pf2e-jb2a-macros/assets/actions/one.png", true)
    .origin(origin.uuid)
    .fadeIn(1000)
    .animateProperty("sprite", `position.y`, {
      from: 0.3,
      to: 0,
      gridUnits: true,
      duration: 1000,
    })
    .animateProperty("sprite", `position.y`, {
      from: 0,
      to: -0.3,
      gridUnits: true,
      duration: 1000,
      fromEnd: true,
    })
    .tieToDocuments([origin])
    .fadeOut(500)
    .attachTo(tokenD, {
      align: "top",
      edge: "outer",
      offset: { x: [-0.25, 0, 0.25].at(number) },
      gridUnits: true,
      followRotation: false,
    })
    .persist(true)
    .scaleToObject(0.2)
    .aboveLighting()
    .opacity(0.8)
    .wait(250)

const seq = new Sequence({ moduleName: "PF2e Animations", softFail: true })

seq.thenDo(async () => {
  // hides the ugly icons in favour of our own
  tokenD.actor.items
    .find((x) => x.uuid === args[1].item.uuid)
    .update({
      system: {
        rules: [],
      },
    })
})

console.log(args)

for (let i = 0; i < 3; i++) {
  seq.addSequence(actionCounter(i, args[1].item))
}

seq.thenDo(async () => {
  const id = Hooks.on("preUpdateItem", updateImages)
  pf2eAnimations.hooks.actionCounter = [
    ...(pf2eAnimations.hooks.actionCounter ?? []),
    { id, uuid: args[1].item.uuid },
  ]
})

seq.play()
