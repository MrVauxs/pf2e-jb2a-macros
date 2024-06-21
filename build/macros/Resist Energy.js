/* {"name":"Resist Energy","img":"systems/pf2e/icons/spells/resist-energy.webp","_id":"b8famAvfE5pMj2TM"} */
if (!args.length) {
    const actors = canvas.tokens.controlled.flatMap((token) => token.actor ?? []);
    if (actors.length === 0 && game.user.character) actors.push(game.user.character);
    if (actors.length === 0) {
        return ui.notifications.error(game.i18n.localize("PF2E.ErrorMessage.NoTokenSelected"));
    }

    const ITEM_UUID = "Compendium.pf2e.spell-effects.con2Hzt47JjpuUej"; // Spell Effect: Resist Energy
    const source = (await fromUuid(ITEM_UUID)).toObject();
    source.flags = mergeObject(source.flags ?? {}, { core: { sourceId: ITEM_UUID } });

    for (const actor of actors) {
        const existing = actor.itemTypes.effect.find((e) => e.flags.core?.sourceId === ITEM_UUID);
        if (existing) {
            await existing.delete();
        } else {
            await actor.createEmbeddedDocuments("Item", [source]);
        }
    }
} else {
if (args[0] === "off") return;

const colors = {
    "acid": -80,
    "cold": 45,
    "electricity": -130,
    "fire": -150,
    "sonic": 0
}

const item = args[1].item
const type = item.flags.pf2e.rulesSelections.resistEnergyType;
const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args);
const color = colors[type]

new Sequence({moduleName: "PF2e Animations", softFail: true})
    .effect()
        .origin(item.uuid)
        .tieToDocuments(item)
        .attachTo(tokenD)
        .persist()
        .fadeIn(500)
        .fadeOut(500)
        .file("jb2a.energy_field.01.blue", true)
        .mask()
        .scaleToObject(1.6 * tokenScale)
        .loopProperty("spriteContainer", "scale.x", { from: 0.9, to: 1.1, duration: 3000, pingPong: true, ease: "easeInOutSine" })
        .loopProperty("spriteContainer", "scale.y", { from: 0.9, to: 1.1, duration: 3000, pingPong: true, ease: "easeInOutSine" })
        .filter("ColorMatrix", { hue: color })
    .effect()
        .origin(item.uuid)
        .attachTo(tokenD)
        .persist()
        .fadeIn(500)
        .fadeOut(500)
        .tieToDocuments(item)
        .file("jb2a.energy_field.01.blue", true)
        .mask()
        .scaleToObject(1.5 * tokenScale)
        .filter("ColorMatrix", { hue: color })
    .effect()
        .origin(item.uuid)
        .attachTo(tokenD)
        .persist()
        .fadeIn(500)
        .playIf(type === "electricity")
        .fadeOut(500)
        .tieToDocuments(item)
        .file("jb2a.static_electricity.01.yellow", true)
        .mask()
        .scaleToObject(1.2 * tokenScale)
    .effect()
        .origin(item.uuid)
        .attachTo(tokenD)
        .persist()
        .fadeIn(500)
        .playIf(type === "cold")
        .fadeOut(500)
        .tieToDocuments(item)
        .loopProperty("sprite", "rotation", { values: [0, 20, 0, -20, 0], duration: 2500})
        .file("jb2a.shield_themed.above.ice.03.blue", true)
        .mask()
        .scaleToObject(1.5 * tokenScale)
    .effect()
        .origin(item.uuid)
        .attachTo(tokenD)
        .persist()
        .fadeIn(500)
        .belowTokens()
        .playIf(type === "cold")
        .loopProperty("sprite", "rotation", { values: [0, 20, 0, -20, 0], duration: 2500})
        .fadeOut(500)
        .tieToDocuments(item)
        .file("jb2a.shield_themed.below.ice.03.blue", true)
        .mask()
        .scaleToObject(1.5 * tokenScale)
    .effect()
        .origin(item.uuid)
        .attachTo(tokenD)
        .persist()
        .fadeIn(500)
        .repeats(3, 3000)
        .playIf(type === "acid")
        .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 4000})
        .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: 9000})
        .spriteOffset({ x: 0.6 }, { gridUnits: true })
        .fadeOut(500)
        .zeroSpriteRotation()
        .tieToDocuments(item)
        .file("jb2a.liquid.blob.green", true)
        .scaleToObject(0.2 * tokenScale)
        .waitUntilFinished(-500)
    .effect()
        .origin(item.uuid)
        .attachTo(tokenD)
        .fadeIn(500)
        .playIf(type === "acid")
        .fadeOut(500)
        .belowTokens()
        .zeroSpriteRotation()
        .tieToDocuments(item)
        .file("jb2a.liquid.splash.green", true)
        .scaleToObject(2 * tokenScale)
        .waitUntilFinished()
    .effect()
        .origin(item.uuid)
        .attachTo(tokenD, { align: "top-right" })
        .fadeIn(500)
        .persist()
        .playIf(type === "fire")
        .fadeOut(500)
        .belowTokens()
        .tieToDocuments(item)
        .file("jb2a.fumes.fire.orange", true)
        .scaleToObject(1.5 * tokenScale)
    .effect()
        .origin(item.uuid)
        .attachTo(tokenD)
        .fadeIn(500)
        .persist()
        .playIf(type === "sonic")
        .fadeOut(500)
        .tieToDocuments(item)
        .file("jb2a.extras.tmfx.border.circle.outpulse.02.normal", true)
        .scaleToObject(1.2 * tokenScale)
    .play()
}