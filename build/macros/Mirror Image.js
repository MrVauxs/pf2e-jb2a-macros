/* {"name":"Mirror Image","img":"systems/pf2e/icons/spells/mirror-image.webp","_id":"QNZOHlyOqO58lVdZ"} */
const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)

if (args.length === 0) {
  const actors = canvas.tokens.controlled.flatMap((token) => token.actor ?? [])
  if (actors.length === 0 && game.user.character)
    actors.push(game.user.character)
  if (actors.length === 0) {
    const message = game.i18n.localize("PF2E.ErrorMessage.NoTokenSelected")
    return ui.notifications.error(message)
  }

  const ITEM_UUID = "Compendium.pf2e-jb2a-macros.Actions.15XurJzUEax6FhA7" // Mirror Image
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

if (args[0] === "off") return

function amountOfImages() {
  return Sequencer.EffectManager.getEffects({ origin: args[1].item.uuid })
    .length
}

Hooks.off("preUpdateItem", pf2eAnimations.hooks.mirrorImage ?? 123)

async function updateImages(data, changes) {
  if (!changes?.system?.badge?.value) return
  if (!(data.name === "Mirror Image")) return

  let badgeValue = changes.system.badge.value

  pf2eAnimations.debug("Mirror Image", {
    badgeValue,
    imagesOnScreen: amountOfImages(),
  })

  if (badgeValue < amountOfImages()) {
    Sequencer.EffectManager.endEffects(
      Sequencer.EffectManager.getEffects({ origin: data.uuid }).at(-1).data
    )
  } else if (badgeValue > amountOfImages()) {
    new Sequence({ moduleName: "PF2e Animations", softFail: true })
      .addSequence(mirrorImage(amountOfImages(), data))
      .play()
  }
}

const mirrorImage = (number, origin) =>
  new Sequence({ moduleName: "PF2e Animations", softFail: false })
    .effect()
    .name("Mirror Image Nr." + (1 + number))
    .from(tokenD)
    .origin(origin.uuid)
    .fadeIn(1000)
    .tieToDocuments([origin])
    .fadeOut(1000)
    .attachTo(tokenD, { followRotation: !tokenD.document.lockRotation })
    .persist(true, { persistTokenPrototype: true })
    .loopProperty("spriteContainer", "rotation", {
      from: 0,
      to: 360,
      duration: 4000,
    })
    .loopProperty("sprite", "position.x", {
      values: [0, -1],
      duration: Sequencer.Helpers.random_int_between(500, 4000),
      gridUnits: true,
      pingPong: true,
    })
    .spriteOffset({ x: 0.5 }, { gridUnits: true })
    .rotate(120 * (1 + number))
    .spriteRotation(120 * (1 + number))
    .zeroSpriteRotation()
    .scaleToObject(1 * tokenD.document.texture.scaleX)
    .opacity(0.5)

const seq = new Sequence({ moduleName: "PF2e Animations", softFail: true })
  // Blast
  .effect()
  .file("jb2a.impact.004.blue", true)
  .atLocation(tokenD)
  .fadeIn(500)
  .tieToDocuments([args[1].item])
  .randomRotation()
  .fadeOut(1500)
  // Illusion Mark
  .effect()
  .file("jb2a.extras.tmfx.runes.circle.simple.illusion", true)
  .atLocation(tokenD)
  .duration(2000)
  .fadeIn(500)
  .fadeOut(1500)
  .tieToDocuments([args[1].item])
  .scale(0.5)
  .filter("Glow", {
    color: 0x0096ff,
  })
  .scaleIn(0, 500, {
    ease: "easeOutCubic",
  })
  .waitUntilFinished(-1000)

for (let i = 0; i < 3; i++) {
  seq.addSequence(mirrorImage(i, args[1].item))
}

seq.thenDo(async () => {
  pf2eAnimations.hooks.mirrorImage = Hooks.on("preUpdateItem", updateImages)
})

seq.play()
