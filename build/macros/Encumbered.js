/* {"name":"Encumbered","img":"icons/commodities/stone/stone-pile-grey.webp","_id":"nA5gqHtwwwsyOtih"} */
const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)

const tokenMagic = game.settings.get("pf2e-jb2a-macros", "tmfx")

if (!args.length) args[0] = tokenMagic ? 
    TokenMagic.hasFilterId(tokenD, "encumbered") ? "off" : "on" : 
    Sequencer.EffectManager.getEffects(
        { 
            name: `${tokenD.name} - Encumbered`, 
            source: tokenD 
        }
    ).length ? "off" : "on";

if (args[0] == "on") {
    if (tokenMagic) {
        let params = [{
            filterId: "encumbered",
            filterType: "transform",
            animated: {
                scaleY:
                    {
                        animType: "cosOscillation",
                        val2: 1.05,
                        val1: 1,
                    },
                scaleX:
                    {
                        animType: "cosOscillation",
                        val2: 1.05,
                        val1: 1,
                    }
            }
        }]
        TokenMagic.addFilters(tokenD, params)
    } else {
        const arrayOfThings = [1 * tokenD.document.data.scale, 0.9 * tokenD.document.data.scale]
        new Sequence({moduleName: "PF2e Animations", softFail: true})
            .effect()
                .name(`${tokenD.name} - Encumbered`)
                .attachTo(tokenD, {bindAlpha: false})
                .from(tokenD)
                .persist()
                .loopProperty("spriteContainer", "scale.x", { values: arrayOfThings, duration: 2000, pingPong: true})
                .loopProperty("spriteContainer", "scale.y", { values: arrayOfThings, duration: 2000, pingPong: true})
                .filter("Glow", { color: 000000, distance: 20, outerStrength: 1, innerStrength: 0 })
                .fadeOut(500)
            .wait(100)
            .animation()
                .fadeOut(100)
                .on(tokenD)
            .play()
    }
} else if (args[0] == "off") {
    if (tokenMagic) {
     await TokenMagic.deleteFilters(tokenD, "encumbered")
    } else {
        new Sequence({moduleName: "PF2e Animations", softFail: true})
            .animation()
                .fadeIn(100)
                .on(tokenD)
            .play()
        await Sequencer.EffectManager.endEffects({ name: `${tokenD.name} - Encumbered`, object: tokenD });
    }
}