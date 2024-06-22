/* {"name":"Overdrive","img":"systems/pf2e/icons/features/feats/overdrive-success.webp","_id":"ZxnGGJn7z4fbBfcq"} */
const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)

let testArgs

if (!args.length)
  testArgs = (await Sequencer.EffectManager.getEffects({
    origin: "overdrive",
    source: tokenD,
  }).length)
    ? "off"
    : "on"

const assets = game.modules.get("JB2A_DnD5e")?.active
  ? ["jb2a.token_border.circle.static.blue.002"]
  : ["jb2a.token_border.circle.static.blue.010"]

if (args[0] == "on" || testArgs === "on") {
  new Sequence({ moduleName: "PF2e Animations", softFail: true })
    .effect()
    .file("jb2a.divine_smite.caster.blueyellow")
    .origin("overdrive")
    .name(tokenD.name + "'s Overdrive")
    .filter("ColorMatrix", {
      hue: 100,
      contrast: 1,
      saturate: 0,
    })
    .tint("#7DF9FF")
    .attachTo(tokenD)
    .tieToDocuments(args.length ? args[1].item : [])
    .scaleToObject(2 * tokenScale)
    .waitUntilFinished(-1500)
    .effect()
    .playIf(args[1]?.itemName.includes("Critical"))
    .file("jb2a.static_electricity.03.blue")
    .origin("overdrive")
    .name(tokenD.name + "'s Overdrive")
    .attachTo(tokenD)
    .tieToDocuments(args.length ? args[1].item : [])
    .scaleToObject(1.5 * tokenScale)
    .fadeOut(500)
    .persist(true, { persistTokenPrototype: true })
    .effect()
    .file(assets[0])
    .origin("overdrive")
    .name(tokenD.name + "'s Overdrive")
    .attachTo(tokenD)
    .tieToDocuments(args.length ? args[1].item : [])
    .fadeOut(500)
    .scaleToObject(2 * tokenScale)
    .fadeIn(700)
    .persist(true, { persistTokenPrototype: true })
    .play()
} else if (testArgs == "off") {
  await Sequencer.EffectManager.endEffects({
    origin: "overdrive",
    object: tokenD,
  })
}
