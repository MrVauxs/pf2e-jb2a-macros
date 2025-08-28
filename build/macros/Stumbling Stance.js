/* {"name":"Stumbling Stance","img":"systems/pf2e/icons/features/feats/stumbling-stance.webp","_id":"ya0hNKP4l4uOfoGJ"} */
if (!args || args.length === 0) {
  const actors = canvas.tokens.controlled.flatMap((token) => token.actor ?? [])
  if (actors.length === 0 && game.user.character)
    actors.push(game.user.character)
  if (actors.length === 0) {
    return ui.notifications.error(
      game.i18n.localize("PF2E.ErrorMessage.NoTokenSelected")
    )
  }

  const ITEM_UUID = "Compendium.pf2e.feat-effects.BCyGDKcplkJiSAKJ" // Stance: Stumbling Stance
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
}

const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)

const tokenMagic = game.settings.get("pf2e-jb2a-macros", "tmfx")

if (args[0] === "on") {
  let bubbles = args[2]?.bubbles ?? 50
  let sobriety = args[2]?.sobriety ?? 2000

  if (tokenMagic) {
    let params = [
      {
        filterId: "drunk-adjustment",
        filterType: "adjustment",
        brightness: 1.75,
        red: 0.52,
        green: 0.37,
        blue: 0.26,
      },
      {
        filterId: "drunk-transform",
        filterType: "transform",
        animated: {
          rotation: {
            animType: "sinOscillation",
            val1: 356,
            val2: 369,
          },
        },
      },
    ]
    TokenMagic.addFilters(tokenD, params)
  }

  new Sequence({ moduleName: "PF2e Animations", softFail: true })
    .effect()
    .name("Stumbling Stance Token")
    .origin(args[1].item.uuid)
    .tieToDocuments([args[1].item])
    .copySprite(tokenD)
    .playIf(!tokenMagic)
    .zIndex(1)
    .scaleToObject(tokenD.document.texture.scaleX)
    .attachTo(tokenD, { followRotation: !tokenD.document.lockRotation })
    .preset("pf2eAnimations.fade")
    .loopProperty("sprite", "rotation", {
      values: [0, -4, 0, 6, 0],
      duration: 1500,
    })
    .persist()
    .wait(500)
    .animation()
    .on(tokenD)
    .playIf(!tokenMagic)
    .opacity(0)
    .effect()
    .name("Stumbling Stance Bubble")
    .zIndex(3)
    .origin(args[1].item.uuid)
    .file("jb2a.markers.bubble.loop.blue")
    .atLocation(tokenD, { randomOffset: 0.5 })
    .repeats(bubbles, 100, sobriety)
    .preset("pf2eAnimations.fade")
    .filter("ColorMatrix", { hue: 210 })
    .duration(3000)
    .tieToDocuments([args[1].item])
    .scaleIn(0, 500)
    .scaleOut(10, 500)
    .loopProperty("sprite", "position.y", { from: 0, to: -50, duration: 3000 })
    .scaleToObject(0.1)
    .effect()
    .name("Stumbling Stance Token Drunk")
    .zIndex(2)
    .origin(args[1].item.uuid)
    .tieToDocuments([args[1].item])
    .copySprite(tokenD)
    .playIf(!tokenMagic)
    .scaleToObject(tokenD.document.texture.scaleX)
    .attachTo(tokenD, { followRotation: !tokenD.document.lockRotation })
    .opacity(0.35)
    .preset("pf2eAnimations.fade")
    .tint("#8B4513")
    .loopProperty("sprite", "rotation", {
      values: [0, -4, 0, 6, 0],
      duration: 1500,
    })
    .persist()
    .waitUntilFinished(-500)
    .animation()
    .on(tokenD)
    .playIf(!tokenMagic)
    .opacity(1)
    .play()
} else if (args[0] == "off" && tokenMagic) {
  await TokenMagic.deleteFilters(tokenD, "drunk-transform")
  await TokenMagic.deleteFilters(tokenD, "drunk-adjustment")
}
