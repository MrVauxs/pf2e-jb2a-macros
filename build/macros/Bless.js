/* {"name":"Bless","img":"systems/pf2e/icons/spells/bless.webp","_id":"y2Hundr4PzbGNeys"} */
const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)

if (!args.length) args[0] = await Sequencer.EffectManager.getEffects({ origin: "aura-effect-bless", name: "Pf2e x JB2A Aura - Bless*", source: tokenD }).length ? "off" : "on";

const auraRadius = tokenD.auras.get("aura-effect-bless")?.radius
const gridUnits = 1.5 + 3 * (isNaN(auraRadius) ? 1 : auraRadius / 5)

if (args[0] == "on") {
    new Sequence({moduleName: "PF2e Animations", softFail: true})
        .effect()
            .file("jb2a.bless.400px.intro.yellow", true)
            .scaleIn(0, 1000, {ease: "easeInBounce"})
            .atLocation(tokenD)
            .attachTo(tokenD)
            .name("Pf2e x JB2A Aura - Bless Intro")
            .origin("aura-effect-bless")
            .opacity(0.9)
            .size(gridUnits, { gridUnits: true })
            .waitUntilFinished(-2000)
        .effect()
            .delay(1500)
            .file("jb2a.bless.400px.loop.yellow", true)
            .atLocation(tokenD)
            .fadeOut(500)
            .persist(true, { persistTokenPrototype: true })
            .attachTo(tokenD)
            .belowTokens(true)
            .origin("aura-effect-bless")
            .name("Pf2e x JB2A Aura - Bless")
            .scaleOut(2, 2500, {ease: "easeOutCubic"})
            .fadeOut(1000)
            .size(gridUnits, { gridUnits: true })
        .play()
} else if (args[0] == "off") {
    await Sequencer.EffectManager.endEffects({ origin: "aura-effect-bless", name: "Pf2e x JB2A Aura - Bless*", source: tokenD })
}