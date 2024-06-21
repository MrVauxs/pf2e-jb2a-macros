/* {"name":"Bane","img":"systems/pf2e/icons/spells/bane.webp","_id":"LxFkyULbmva8yGDm"} */
const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)

if (!args.length)
  args[0] = (await Sequencer.EffectManager.getEffects({
    origin: "aura-effect-bane",
    source: tokenD,
  }).length)
    ? "off"
    : "on"

const auraRadius = tokenD.auras.get("aura-effect-bane")?.radius
const gridUnits = 1.5 + 3 * (isNaN(auraRadius) ? 1 : auraRadius / 5)

if (args[0] == "on") {
  new Sequence({ moduleName: "PF2e Animations", softFail: true })
    .effect()
    .file("jb2a.bless.400px.intro.purple", true)
    .scaleIn(0, 1000, { ease: "easeInBounce" })
    .atLocation(tokenD)
    .attachTo(tokenD)
    .name("Pf2e x JB2A Aura - Bane Intro")
    .origin("aura-effect-bane")
    .opacity(0.9)
    .size(gridUnits, { gridUnits: true })
    .effect()
    .delay(1500)
    .file("jb2a.bless.400px.loop.purple", true)
    .atLocation(tokenD)
    .fadeOut(500)
    .persist(true, { persistTokenPrototype: true })
    .attachTo(tokenD)
    .belowTokens(true)
    .origin("aura-effect-bane")
    .name("Pf2e x JB2A Aura - Bane")
    .scaleOut(2, 2500, { ease: "easeOutCubic" })
    .fadeOut(1000)
    .size(gridUnits, { gridUnits: true })
    .play()
} else if (args[0] == "off") {
  await Sequencer.EffectManager.endEffects({
    origin: "aura-effect-bane",
    source: tokenD,
  })
}
