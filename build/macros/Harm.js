/* {"name":"Harm","img":"systems/pf2e/icons/spells/harm.webp","_id":"kz6IN257FJ58SgmE"} */
if (!game.version.startsWith("11")) return ui.notifications.warn("PF2e Animations | This version of the Harm macro has been created for Foundry V11!")
if (!scope?.args) return ui.notifications.warn("PF2e Animations | Harm macro has been triggered with no arguments. If this was a manual activation, please use the actual spell instead.")

function undeadOrNot(actor) {
    let modeOfBeing = actor?.modeOfBeing === "living" ? false : true;

    // If it has negative healing, or dhampir trait, or undead trait, it's undead.
    if (actor?.system?.attributes?.hp?.negativeHealing || actor?.traits?.find(trait => trait === "dhampir" || trait === "undead")) modeOfBeing = true;

    return modeOfBeing;
}

const sourceToken = args[1].sourceToken;
const targets = args[1].hitTargets
const seq = new Sequence({ inModuleName: "PF2e Animations", softFail: true })

seq.effect()
    .file("jb2a.cast_generic.01.dark_purple.0")
    .from(sourceToken)
    .scaleToObject(1.5)
    .aboveLighting()
    .waitUntilFinished()

if (args[0]?.collectionName === "templates") {
    const template = args[0]

    // Burst
    seq.effect()
        .file("jb2a.template_circle.out_pulse.02.burst.purplepink")
        .scaleToObject()
        .atLocation(template, { bindVisibility: false })
        .thenDo(() => { if (args[2].deleteTemplate) template.delete() });

    // Every Target in Range
    canvas.tokens.placeables.filter(x => x.actor.type === "npc" || x.actor.type === "character").forEach((token) => {
        const ray = new Ray(token.center, template);
        const distance = canvas.grid.measureDistances([{ ray }])

        // Living casters don't want to hurt themselves, do they?
        if ((token.id === sourceToken.id) && !undeadOrNot(sourceToken.actor)) return;

        // Exit early if out of range.
        if (distance > template.distance) return;

        seq.effect()
            .file("jb2a.magic_missile.dark_red")
            .stretchTo(token, { randomOffset: 0.5 })
            .from(sourceToken)
            .filter("ColorMatrix", {
                hue: 280
            })
            .randomizeMirrorY()
            .repeats(2)
            .effect()
            .delay(1000)
            .file(undeadOrNot(token.actor) ? "jb2a.healing_generic.200px.purple" : "jb2a.divine_smite.target.dark_purple")
            .scaleToObject(1.5)
            .attachTo(token)
    })
} else {
    targets.forEach((token) => {
        seq.effect()
            .stretchTo(token, { randomOffset: 0.5 })
            .from(sourceToken)
            .file(sourceToken.distanceTo(token) > sourceToken.actor.attributes.reach.base ? "jb2a.magic_missile.dark_red" : "jb2a.unarmed_strike.magical.01.dark_purple")
            .waitUntilFinished(-1000)

        if (sourceToken.distanceTo(token) > sourceToken.actor.attributes.reach.base) {
            seq.filter("ColorMatrix", {
                hue: 280
            })
            .randomizeMirrorY()
            .repeats(2)
        }

        seq.effect()
            .file(undeadOrNot(token.actor) ? "jb2a.healing_generic.200px.purple" : "jb2a.divine_smite.target.dark_purple")
            .scaleToObject(1.5)
            .attachTo(token)
    })
}

seq.play()