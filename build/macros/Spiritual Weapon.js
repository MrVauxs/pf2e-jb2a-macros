/* {"name":"Spiritual Weapon","img":"systems/pf2e/icons/spells/spiritual-weapon.webp","_id":"FjmWOtfj64kCFydm"} */
/* Spiritual Weapon Animations for PF2e
 * The collect target part at the beginning of the macro is made by
 * MIT License (C) 2022 Matthew Haentschke
 * The rest is modified heavily by Jules | JB2A
 * And then heavily modified again by MrVauxs, perhaps to the point of this whole section not being really eligible.
 * 
 * CANNOT be used standalone
 */
let [tokenD, tokenScale, allTargets, hitTargets, targets, target, origin ] = await pf2eAnimations.macroHelpers(args)

if (Object.keys(args[2]).length > 0) {
    file = args[2].weapon ?? "jb2a.spiritual_weapon.mace.spectral.blue";
    entry = args[2].entry ?? (file.startsWith("jb2a") ? `jb2a.impact.003.${file.split(".").at(-1)}` : "jb2a.impact.003.blue");
    exit = args[2].exit ?? (file.startsWith("jb2a") ? `jb2a.misty_step.02.${file.split(".").at(-1)}` : "jb2a.misty_step.02.blue");
    duration = Number(args[2].duration) ?? (3 * 60 * 1000);
}

target = allTargets[0]

async function spiritualWeaponIN() {
    let position = await warpgate.crosshairs.show(
        {
            rememberControlled: true,
            icon: Sequencer.Database.getEntry(file).file,
            drawOutline: false,
            label: args[1]?.item?.name ?? "Spiritual Weapon"
        }
    );
    if (position.cancelled) return;

    new Sequence({moduleName: "PF2e Animations", softFail: true})
        .effect()
            .file(entry, true)
            .atLocation(position)
            .origin(origin)
            .waitUntilFinished(-800)
        .effect()
            .file(file, true)
            .atLocation(position)
            .origin(origin)
            .duration(duration)
            .name(`${tokenD.actor.name} - Spiritual Weapon`)
            .scaleOut(0, (duration / 4))
            .fadeOut(duration / 2)
        .play()
}

async function spiritualWeaponOUT() {
    let persistentEffect = Sequencer.EffectManager.getEffects({ origin })[0];
    new Sequence({moduleName: "PF2e Animations", softFail: true})
        .effect()
            .file(exit, true)
            .atLocation(persistentEffect, { cacheLocation: true })
            .scale(0.4)
            .waitUntilFinished(-4100)
            .thenDo(async function () {
                Sequencer.EffectManager.endEffects({ origin })
                await spiritualWeaponIN()
            })
        .play()
}

if (!Sequencer.EffectManager.getEffects({ origin }).length) {
    await spiritualWeaponIN()
}
else {
    await spiritualWeaponOUT()
}