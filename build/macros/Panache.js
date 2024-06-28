/* {"name":"Panache","img":"systems/pf2e/icons/features/classes/panache.webp","_id":"6yeZBx2HjHHrQIRp"} */
const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)

let testArgs

if (!args.length)
  testArgs = (await Sequencer.EffectManager.getEffects({
    origin: "panache",
    source: tokenD,
  }).length)
    ? "off"
    : "on"

const assets = game.modules.get("JB2A_DnD5e")?.active
  ? ["jb2a.token_border.circle.static.blue.004"]
  : ["jb2a.token_border.circle.static.blue.008"]

if (args[0] == "on" || testArgs === "on") {
  new Sequence({ moduleName: "PF2e Animations", softFail: true })
    .effect()
    .file("jb2a.antilife_shell.blue_no_circle")
    .origin("panache")
    .name(tokenD.name + "'s Panache")
    .attachTo(tokenD)
    .tieToDocuments(args.length ? args[1].item : [])
    .filter("ColorMatrix", {
      hue: 190,
    })
    .scaleToObject(2 * tokenScale)
    .waitUntilFinished(-1500)
    .effect()
    .file("jb2a.wind_stream.white")
    .origin("panache")
    .name(tokenD.name + "'s Panache")
    .attachTo(tokenD)
    .tieToDocuments(args.length ? args[1].item : [])
    .scaleToObject(tokenScale)
    .rotate(90)
    .fadeOut(1500)
    .mask()
    .fadeIn(700)
    .persist(true, { persistTokenPrototype: true })
    .effect()
    .file(assets[0])
    .origin("panache")
    .name(tokenD.name + "'s Panache")
    .attachTo(tokenD)
    .tieToDocuments(args.length ? args[1].item : [])
    .filter("ColorMatrix", {
      hue: 190,
    })
    .fadeOut(3000)
    .scaleToObject(2 * tokenScale)
    .fadeIn(700)
    .persist(true, { persistTokenPrototype: true })
    .play()
} else if (testArgs === "off") {
  await Sequencer.EffectManager.endEffects({
    origin: "panache",
    object: tokenD,
  })
}
