/* {"name":"Rage","img":"icons/skills/wounds/injury-face-impact-orange.webp","_id":"gU05Ao19uKUf5H2h"} */
// Original Author: EskieMoh#2969
// Remastered by: MrVauxs#8622

const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)

let testArgs

if (!args.length)
  testArgs = (await Sequencer.EffectManager.getEffects({
    origin: "rage",
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

let preload = [
  "jb2a.extras.tmfx.outpulse.circle.02.normal",
  "jb2a.impact.ground_crack.orange.01",
  "jb2a.impact.ground_crack.still_frame.01",
  "jb2a.wind_stream.white",
].concat(assets)

await Sequencer.Preloader.preloadForClients(preload)

if (args[0] === "on" || testArgs === "on") {
  new Sequence({ moduleName: "PF2e Animations", softFail: true })
    .effect()
    .file("jb2a.extras.tmfx.outpulse.circle.02.normal")
    .atLocation(tokenD)
    .size(4, { gridUnits: true })
    .opacity(0.25)
    .effect()
    .file("jb2a.impact.ground_crack.orange.01")
    .atLocation(tokenD)
    .belowTokens()
    .filter("ColorMatrix", { hue: -15, saturate: 1 })
    .size(3.5, { gridUnits: true })
    .zIndex(1)
    .effect()
    .file("jb2a.impact.ground_crack.still_frame.01")
    .atLocation(tokenD)
    .belowTokens()
    .fadeIn(2000)
    .filter("ColorMatrix", { hue: -15, saturate: 1 })
    .size(3.5, { gridUnits: true })
    .fadeOut(20000)
    .zIndex(0)
    .effect()
    .file("jb2a.wind_stream.white")
    .atLocation(tokenD, { offset: { y: -75 } })
    .size(1.75, { gridUnits: true })
    .rotate(90)
    .opacity(0.9)
    .filter("ColorMatrix", { saturate: 1 })
    .tint("#FF0000")
    .loopProperty("sprite", "position.y", {
      from: -5,
      to: 5,
      duration: 50,
      pingPong: true,
    })
    .duration(8000)
    .fadeOut(3000)
    .effect()
    .file(assets[0])
    .atLocation(tokenD)
    .scaleToObject(2.5)
    .filter("ColorMatrix", { hue: -15, saturate: 1 })
    .opacity(1)
    .fadeIn(200)
    .tint(
      assets[0] === "jb2a.particles.outward.greenyellow.01.03" ? "#FF0000" : ""
    )
    .fadeOut(3000)
    .loopProperty("sprite", "position.x", {
      from: -5,
      to: 5,
      duration: 50,
      pingPong: true,
    })
    .animateProperty("sprite", "position.y", {
      from: 0,
      to: -100,
      duration: 6000,
      pingPong: true,
      delay: 2000,
    })
    .duration(8000)
    .effect()
    .file("jb2a.wind_stream.white")
    .atLocation(tokenD)
    .origin("rage")
    .name(tokenD.name + "'s Rage")
    .attachTo(tokenD)
    .tieToDocuments(args.length ? args[1].item : [])
    .scaleToObject(tokenScale)
    .rotate(90)
    .fadeOut(3000)
    .opacity(1)
    .mask()
    .filter("ColorMatrix", { saturate: 1 })
    .tint("#FF0000")
    .persist(true, { persistTokenPrototype: true })
    .effect()
    .file(assets[1])
    .atLocation(tokenD)
    .origin("rage")
    .name(tokenD.name + "'s Rage")
    .attachTo(tokenD)
    .tieToDocuments(args.length ? args[1].item : [])
    .opacity(0.6)
    .fadeOut(3000)
    .scaleToObject(2 * tokenScale)
    .filter("ColorMatrix", { saturate: 1 })
    .tint("#FF0000")
    .persist(true, { persistTokenPrototype: true })
    .play()
} else if (testArgs === "off") {
  Sequencer.EffectManager.endEffects({ origin: "rage", source: tokenD })
}
