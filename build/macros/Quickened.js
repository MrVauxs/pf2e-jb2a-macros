/* {"name":"Quickened","img":"systems/pf2e/icons/conditions/quickened.webp","_id":"E1eKr1GPbMu11gDZ"} */
const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)

let testArgs

if (!args.length)
  testArgs = (await Sequencer.EffectManager.getEffects({
    origin: "quickened",
    source: tokenD,
  }).length)
    ? "off"
    : "on"

if (args[0] === "on" || testArgs === "on") {
  new Sequence({ moduleName: "PF2e Animations", softFail: true })
    .effect()
    .file("jb2a.wind_stream.white")
    .origin("quickened")
    .name("Quickened" + tokenD.name)
    .attachTo(tokenD)
    .tieToDocuments(args.length ? args[1].item : [])
    .scaleToObject(tokenScale)
    .rotate(90)
    .tint("#00FFFF")
    .fadeOut(1500)
    .mask()
    .fadeIn(700)
    .persist(true, { persistTokenPrototype: true })
    .effect()
    .file("jb2a.token_border.circle.static.blue.003")
    .origin("quickened")
    .name("Quickened" + tokenD.name)
    .attachTo(tokenD)
    .tieToDocuments(args.length ? args[1].item : [])
    .fadeOut(3000)
    .scaleToObject(2 * tokenScale)
    .fadeIn(700)
    .persist(true, { persistTokenPrototype: true })
    .play()
} else if (testArgs === "off") {
  await Sequencer.EffectManager.endEffects({
    origin: "quickened",
    object: tokenD,
  })
}
