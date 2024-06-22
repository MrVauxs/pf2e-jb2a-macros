/* {"name":"Drain Bonded Item","img":"icons/magic/defensive/shield-barrier-blades-teal.webp","_id":"PiernEW8sh3FaeG0"} */
const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)

const assets = game.modules.get("JB2A_DnD5e")?.active
  ? [
      "jb2a.divine_smite.caster.blueyellow",
      { saturate: -1 },
      "jb2a.shimmer.01.blue",
    ]
  : ["jb2a.divine_smite.caster.greenyellow", {}, "jb2a.shimmer.01.green"]

new Sequence({ moduleName: "PF2e Animations", softFail: true })
  .effect()
  .atLocation(tokenD)
  .attachTo(tokenD)
  .origin("drain bonded item")
  .filter("ColorMatrix", assets[1])
  .name("Drain Bonded Item - Energy Strands")
  .scaleToObject(2)
  .file("jb2a.energy_strands.in.green.01.1")
  .effect()
  .atLocation(tokenD)
  .attachTo(tokenD)
  .scaleToObject(2)
  .origin("drain bonded item")
  .name("Drain Bonded Item - Charging")
  .filter("ColorMatrix", assets[1])
  .file(assets[0])
  .waitUntilFinished(300)
  .effect()
  .atLocation(tokenD)
  .attachTo(tokenD)
  .origin("drain bonded item")
  .name("Drain Bonded Item - Shimmer")
  .filter("ColorMatrix", assets[1])
  .scaleToObject(1.5)
  .file(assets[2])
  .play()
