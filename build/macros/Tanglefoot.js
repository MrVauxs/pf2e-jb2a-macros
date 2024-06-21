/* {"name":"Tanglefoot","img":"systems/pf2e/icons/spells/tanglefoot.webp","_id":"AtmVxd86VXE3PhQf"} */
// Cannot be used standalone

const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)
let target = Array.from(game.user.targets)[0]

const assets = game.modules.get("JB2A_DnD5e")?.active
  ? ["jb2a.eldritch_blast.purple", { hue: 180 }, "jb2a.entangle.green"]
  : ["jb2a.eldritch_blast.lightgreen", {}, "jb2a.entangle.green02"]

if (typeof args[0] === "string") {
  if (args[0] == "on") {
    new Sequence({ moduleName: "PF2e Animations", softFail: true })
      .effect()
      .name("Tanglefoot")
      .scaleToObject(1.2)
      .atLocation(tokenD)
      .fadeOut(500)
      .attachTo(tokenD)
      .fadeIn(500)
      .persist(true, { persistTokenPrototype: true })
      .file("jb2a.entangle.green", true)
      .play()
  } else if (args[0] == "off") {
    await Sequencer.EffectManager.endEffects({
      name: "Tanglefoot",
      object: tokenD,
    })
  }
} else {
  new Sequence({ moduleName: "PF2e Animations", softFail: true })
    .effect()
    .atLocation(tokenD)
    .stretchTo(target)
    .file(assets[0], true)
    .filter("ColorMatrix", assets[1])
    .waitUntilFinished(-3000)
    .effect()
    .scaleToObject(1.2)
    .atLocation(target)
    .attachTo(target)
    .fadeOut(500)
    .repeats(2)
    .fadeIn(500)
    .file(assets[2], true)
    .play()
}
