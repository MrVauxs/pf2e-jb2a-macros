/* {"name":"Unleash Psyche","img":"systems/pf2e/icons/features/classes/unleash-psyche.webp","_id":"O0RE17QySMEMVdHd"} */
const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)

let testArgs

if (!args.length)
  testArgs = (await Sequencer.EffectManager.getEffects({
    origin: "UnleashPsyche",
    source: tokenD,
  }).length)
    ? "off"
    : "on"

const assets = game.modules.get("JB2A_DnD5e")?.active
  ? [
      "jb2a.particles.outward.greenyellow.01.03",
      "jb2a.token_border.circle.static.blue.007",
    ]
  : [
      "jb2a.particles.outward.orange.01.03",
      "jb2a.token_border.circle.static.orange.012",
    ]

const nameOfEffect = `${tokenD.name}'s Unleashed Psyche`

let preload = [
  "jb2a.thunderwave.center.blue",
  "jb2a.particles.inward.greenyellow.01.02",
  "jb2a.particles.swirl.greenyellow.01.01",
].concat(assets)

await Sequencer.Preloader.preloadForClients(preload)

if (args[0] == "on" || testArgs === "on") {
  new Sequence({ moduleName: "PF2e Animations", softFail: true })
    .effect()
    .origin("UnleashPsyche")
    .name(nameOfEffect + " - Explosion")
    .file("jb2a.thunderwave.center.blue")
    .attachTo(tokenD)
    .tieToDocuments(args.length ? args[1].item : [])
    .filter("ColorMatrix", { hue: 100 })
    .scaleToObject(3.5 * tokenScale)
    .waitUntilFinished(-900)
    .effect()
    .origin("UnleashPsyche")
    .name(nameOfEffect + " - Particles (Inward)")
    .file("jb2a.particles.inward.greenyellow.01.02")
    .attachTo(tokenD)
    .tieToDocuments(args.length ? args[1].item : [])
    .fadeOut(1500)
    .filter("ColorMatrix", { hue: 250 })
    .scaleToObject(tokenScale)
    .fadeIn(300)
    .persist(true, { persistTokenPrototype: true })
    .effect()
    .origin("UnleashPsyche")
    .name(nameOfEffect + " - Particles (Swirl)")
    .file("jb2a.particles.swirl.greenyellow.01.01")
    .attachTo(tokenD)
    .tieToDocuments(args.length ? args[1].item : [])
    .fadeOut(500)
    .filter("ColorMatrix", { hue: 250 })
    .scaleToObject(1.7 * tokenScale)
    .fadeIn(300)
    .persist(true, { persistTokenPrototype: true })
    .effect()
    .origin("UnleashPsyche")
    .name(nameOfEffect + " - Token Border")
    .file(assets[1])
    .atLocation(tokenD)
    .attachTo(tokenD)
    .tieToDocuments(args.length ? args[1].item : [])
    .opacity(0.6)
    .fadeOut(3000)
    .scaleToObject(2 * tokenScale)
    .filter("ColorMatrix", { hue: 250 })
    .persist(true, { persistTokenPrototype: true })
    .play()
} else if (testArgs === "off") {
  await Sequencer.EffectManager.endEffects({
    origin: "UnleashPsyche",
    object: tokenD,
  })
}
