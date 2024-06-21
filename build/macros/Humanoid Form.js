/* {"name":"Humanoid Form","img":"systems/pf2e/icons/spells/humanoid-form.webp","_id":"7nrt0AppNUZDPmYk"} */
// Original Author: EskieMoh#2969
// Rebuilt by: MrVauxs#8622
// To go back to your original form, click the Revert button at the top of the sheet that's been transformed.

const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)

if (args[0] !== "off") {
    let disguise
    if (args[2].name || args[2].image || args[2].scale) {
        if (args[2].bestiaryPack) {
            args[2].image = game.modules.get("pf2e-tokens-bestiaries") ? args[2].image : tokenD.document.texture.src
        } else {
            args[2].scale = tokenD.document.texture.scaleX
        }
        disguise = [
                args[2].name ?? tokenD.name, 
                args[2].image ?? tokenD.document.texture.src, 
                args[2].scale ?? tokenD.document.texture.scaleX
        ]
    } else {
        let tokenName = tokenD.name.toLowerCase().split("").reverse().join("")
        tokenName = tokenName[0].toUpperCase() + tokenName.slice(1)

        let disguiseDefault = [tokenName, tokenD.document.texture.src, tokenD.document.texture.scaleX]

        if (Array.from(game.user.targets).length) {
            disguiseDefault = [
                Array.from(game.user.targets)[0].name, 
                Array.from(game.user.targets)[0].document.texture.src, 
                Array.from(game.user.targets)[0].document.texture.scaleX
            ]
        }

        disguise = await warpgate.dialog([
            {
                type: 'text',
                label: `🎩 ${game.i18n.localize("pf2e-jb2a-macros.macro.disguise.name")}`,
                options: `${disguiseDefault[0]}`
            },
            {
                type: 'text',
                label: `✨ ${game.i18n.localize("pf2e-jb2a-macros.macro.disguise.tokenImage")} <u style="cursor: help;" title="${game.i18n.localize("pf2e-jb2a-macros.macro.disguise.tokenImageHint")}">URL</u>`,
                options: `${disguiseDefault[1]}`
            },
            {
                type: 'text',
                label: `📷 <u style="cursor: help;" title="${game.i18n.localize("pf2e-jb2a-macros.macro.disguise.tokenScaleHint")}">${game.i18n.localize("pf2e-jb2a-macros.macro.disguise.tokenScale")}</u>`,
                options: `${disguiseDefault[2]}`
            },
        ],
        game.i18n.localize("pf2e-jb2a-macros.macro.disguise.humanoidForm"),
        await game.i18n.localize("pf2e-jb2a-macros.macro.disguise.cast"))

        if (!disguise) return;

        // No funny business with empty inputs.
        disguise = disguise.map((x, index) => x.length === 0 ? disguiseDefault[index] : x)
    }
   
    console.log(`PF2e x JB2A Macros | Transformed ${tokenD.name} into ${disguise[0]} with ${disguise[1]} image with scale of ${disguise[2]}.`)

    new Sequence({moduleName: "PF2e Animations", softFail: true})
        .effect()
            .origin("Humanoid Form")
            .name("Humanoid Form - Intro (Casting)")
            .attachTo(tokenD)
            .file("jb2a.magic_signs.circle.02.transmutation.intro", true)
            .scaleToObject(1 * tokenScale)
            .waitUntilFinished(-500)
            .animateProperty("sprite", "rotation", { from: 0, to: 360, duration: 3000, ease: "easeOutExpo"})
        .effect()
            .origin("Humanoid Form")
            .name("Humanoid Form - Intro (Transformation)")
            .file(disguise[1], true)
            .scaleToObject(Number(disguise[2]))
            .fadeIn(800)
            .attachTo(tokenD)
        /*.animation()
            .on(tokenD)
            .fadeOut(200)
        .effect()
            .origin("Humanoid Form")
            .name("Humanoid Form - Intro (Fade In)")
            .file(disguise[1], true)
            .fadeIn(800)
            .scaleToObject(Number(disguise[2]))
            .duration(900)
        .effect()
            .origin("Humanoid Form")
            .name("Humanoid Form - Intro (Fade Out)")
            .from(tokenD)
            .fadeOut(800)
            .scaleToObject(Number(disguise[2]))
            .waitUntilFinished(-50)
        .animation()
            .on(tokenD)
            .opacity(1)*/
        .thenDo(async () => {
                let mutation = await warpgate.mutate(
                    tokenD.document,
                    {
                        token: {
                            name: disguise[0],
                            texture: {
                                src: disguise[1],
                                scaleX: Number(disguise[2]),
                                scaleY: Number(disguise[2])
                            },
                            flags: {pf2e: {autoscale: false}}
                        }
                    },
                    {},
                    {
                        name: `Humanoid Form`,
                        description: `This token has used the <a class="entity-link content-link" draggable="true" data-pack="pf2e.spells-srd" data-id="2qGqa33E4GPUCbMV"><i class="fas fa-suitcase"></i> Humanoid Form</a> spell and has turned into ${disguise[0]}!`
                    }
                );
                console.log(tokenD, mutation);
                // See https://github.com/trioderegion/warpgate/issues/72
                /* 
                await warpgate.event.trigger(
                    warpgate.EVENT.REVERT,
                    () => {
                        new Sequence({moduleName: "PF2e Animations", softFail: true})
                        .effect()
                            .origin("Humanoid Form")
                            .name("Humanoid Form - Exit")
                            .file(disguise[1], true)
                            .scaleToObject(Number(disguise[2]))
                            .attachTo(tokenD)
                            .fadeOut(1000)
                        .play()
                    }
                )
                */
            }
        )
        .play();
} else if (args[0] === "off") {
    Sequencer.EffectManager.endEffects({ origin: "Humanoid Form", object: tokenD })
    warpgate.revert(tokenD.document, "Humanoid Form")
}