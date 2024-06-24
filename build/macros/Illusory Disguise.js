/* {"name":"Illusory Disguise","img":"systems/pf2e/icons/spells/illusory-disguise.webp","_id":"JVtjNvoMoxsfddd7"} */
// Original Author: EskieMoh#2969
// Remastered by: MrVauxs#8622

const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)

let testArgs

if (!args.length)
  testArgs = (await Sequencer.EffectManager.getEffects({
    origin: "Illusory Disguise",
    source: tokenD,
  }).length)
    ? "off"
    : "on"

if (args[0] === "on" || testArgs === "on") {
  let tokenName = tokenD.name.toLowerCase().split("").reverse().join("")
  tokenName = tokenName[0].toUpperCase() + tokenName.slice(1)

  let disguiseDefault = [
    tokenName,
    tokenD.document.texture.src,
    tokenD.document.texture.scaleX,
    false,
  ]

  if (Array.from(game.user.targets).length) {
    disguiseDefault = [
      Array.from(game.user.targets)[0].name,
      Array.from(game.user.targets)[0].document.texture.src,
      Array.from(game.user.targets)[0].document.texture.scaleX,
    ]
  }

  pf2eAnimations.requireModule("warpgate")
  let disguise = await warpgate.menu(
    {
      inputs: [
        {
          type: "text",
          label: `🎩 ${game.i18n.localize(
            "pf2e-jb2a-macros.macro.disguise.name"
          )}`,
          options: `${disguiseDefault[0]}`,
        },
        {
          type: "text",
          label: `✨ ${game.i18n.localize(
            "pf2e-jb2a-macros.macro.disguise.tokenImage"
          )} <u style="cursor: help;" title="${game.i18n.localize(
            "pf2e-jb2a-macros.macro.disguise.tokenImageHint"
          )}">URL</u>`,
          options: `${disguiseDefault[1]}`,
        },
        {
          type: "text",
          label: `📷 <u style="cursor: help;" title="${game.i18n.localize(
            "pf2e-jb2a-macros.macro.disguise.tokenScaleHint"
          )}">${game.i18n.localize(
            "pf2e-jb2a-macros.macro.disguise.tokenScale"
          )}</u>`,
          options: `${disguiseDefault[2]}`,
        },
        {
          type: "checkbox",
          label: `<u style="cursor: help;" title="${game.i18n.localize(
            "pf2e-jb2a-macros.macro.disguise.invisibleHint"
          )}">${game.i18n.localize(
            "pf2e-jb2a-macros.macro.disguise.invisible"
          )}</u>`,
          options: true,
          value: true,
        },
      ],
    },
    {
      title: game.i18n.localize(
        "pf2e-jb2a-macros.macro.disguise.illusoryDisguise"
      ),
      defaultButton: game.i18n.localize("pf2e-jb2a-macros.macro.disguise.cast"),
    }
  )

  if (!disguise) return

  if (args.length === 1)
    ui.notifications.info(
      "PF2e x JB2A Macros | You are not using the Active Effect version of this spell, thus requiring you to remove the effect by going into the <i class='fas fa-film'></i> Sequencer Effect Manager."
    )

  // No funny business with empty inputs.
  disguise = disguise.inputs.map((x, index) =>
    x.length === 0 ? disguiseDefault[index] : x
  )

  console.log(
    `Transformed ${tokenD.name} into ${disguise[0]} with ${
      disguise[1]
    } image with scale of ${disguise[2]}.${
      disguise[3] ? "The original token has been turned invisible." : ""
    }`
  )

  new Sequence({ moduleName: "PF2e Animations", softFail: true })
    .effect()
    .file("jb2a.markers.circle_of_stars.blue")
    .atLocation(tokenD)
    .delay(200)
    .duration(8000)
    .fadeIn(500)
    .fadeOut(7500)
    .scaleToObject(1.3 * Math.min(tokenD.document.texture.scaleX, 1))
    .attachTo(tokenD)
    .tieToDocuments(args.length ? args[1].item : [])
    .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 60000 })
    .zIndex(1)
    .effect()
    .file("jb2a.sneak_attack.blue")
    .atLocation(tokenD)
    .delay(200)
    .scaleToObject(2 * Math.min(tokenD.document.texture.scaleX, 1))
    .attachTo(tokenD)
    .tieToDocuments(args.length ? args[1].item : [])
    .playbackRate(1)
    .zIndex(2)
    .waitUntilFinished(-1000)
    .animation()
    .playIf(disguise[3])
    .fadeOut(500)
    .on(tokenD)
    .effect()
    .file(disguise[1])
    .origin("Illusory Disguise")
    .name("Illusory Disguise")
    .scaleToObject(Number(disguise[2]))
    .opacity(0.9)
    .scaleIn(0, 200, { ease: "easeOutCubic" })
    .attachTo(tokenD, { bindAlpha: false })
    .tieToDocuments(args.length ? args[1].item : [])
    .persist(true, { persistTokenPrototype: true })
    .fadeIn(760)
    .fadeOut(2500)
    .effect()
    .file("jb2a.particles.outward.purple.02.03")
    .origin("Illusory Disguise")
    .name("Illusory Disguise - Particles")
    .delay(200)
    .scaleToObject(1.5 * Math.min(1, Number(disguise[2])))
    .zIndex(2)
    .scaleIn(0, 200, { ease: "easeOutCubic" })
    .attachTo(tokenD)
    .tieToDocuments(args.length ? args[1].item : [])
    .persist(true, { persistTokenPrototype: true })
    .fadeIn(760)
    .fadeOut(2500)
    .waitUntilFinished(-2500)
    .animation()
    .playIf(disguise[3])
    .fadeIn(2500)
    .on(tokenD)
    .play()
} else if (testArgs === "off") {
  Sequencer.EffectManager.endEffects({
    origin: "Illusory Disguise",
    object: tokenD,
  })
}
