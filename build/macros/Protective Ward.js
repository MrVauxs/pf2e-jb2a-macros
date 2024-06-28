/* {"name":"Protective Ward","img":"systems/pf2e/icons/spells/protective-ward.webp","_id":"IaIxaOh0D7roiQz1"} */
const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)

if (!args.length)
  args[0] = (await Sequencer.EffectManager.getEffects({
    origin: "protective-ward-aura",
    source: tokenD,
  }).length)
    ? "off"
    : "on"

const auraRadius = tokenD.auras.get("aura-effect-bless")?.radius
const gridUnits = 1.5 + 3 * (isNaN(auraRadius) ? 1 : auraRadius / 5)

if (args[0] == "on") {
  new Sequence({ moduleName: "PF2e Animations", softFail: true })
    .effect()
    .file("jb2a.shield.01.complete.01.yellow")
    .attachTo(tokenD)
    .origin("protective-ward-aura")
    .name("Pf2e x JB2A Aura - Protective Ward")
    .persist()
    .opacity(0.8)
    .size(4.5, { gridUnits: true })
    .play()
} else if (args[0] == "off") {
  await Sequencer.EffectManager.endEffects({
    origin: "protective-ward-aura",
    source: tokenD,
  })
}
