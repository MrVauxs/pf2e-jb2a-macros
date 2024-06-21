/* {"name":"Bardic Cantripry","img":"icons/magic/sonic/scream-wail-shout-teal.webp","_id":"blSU13HzwUtDVjJZ"} */
// Cannot be used standalone.

let targets = args[1].hitTargets
const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)
if (!args[1]?.item?.system?.slug) return;
let spellName = args[1]?.item?.system?.slug.replaceAll("spell-effect-", "").trim()

if (typeof args[0] === "string") {
    if (args[0] == "on") {
        switch (spellName) {
            case "inspire-courage":
            case "courageous-anthem": {
                new Sequence({moduleName: "PF2e Animations", softFail: true})
                .wait(100, 5000)
                .effect()
                    .file("jb2a.wind_stream.white", true)
                    .name(spellName)
                    .attachTo(tokenD)
                    .scaleToObject(tokenScale)
                    .rotate(90)
                    .tieToDocuments(args.length ? args[1].item : [])
                    .fadeOut(3000)
                    .fadeIn(500)
                    .mask()
                    .filter("ColorMatrix", {saturate: 1})
                    .tint("#FF0000")
                    .persist(true, { persistTokenPrototype: true })
                .effect()
                    .file("jb2a.token_border.circle.static.blue.001", true)
                    .name(spellName)
                    .attachTo(tokenD)
                    .opacity(0.6)
                    .tieToDocuments(args.length ? args[1].item : [])
                    .fadeOut(3000)
                    .fadeIn(500)
                    .scaleToObject(2 * tokenScale)
                    .filter("ColorMatrix", {saturate: 1})
                    .tint("#FF0000")
                    .persist(true, { persistTokenPrototype: true })
                .play()
                break;
            }
            case "inspire-defense":
            case "rallying-anthem": {
                let randomD = Sequencer.Helpers.random_int_between(0, 360)
                new Sequence({moduleName: "PF2e Animations", softFail: true})
                .wait(100, 5000)
                .effect()
                    .file("jb2a.shield_themed.below.ice.01.blue", true)
                    .name(spellName)
                    .belowTokens()
                    .rotate(randomD)
                    .tieToDocuments(args.length ? args[1].item : [])
                    .attachTo(tokenD)
                    .fadeIn(3000)
                    .fadeOut(3000)
                    .scaleToObject(1.5 * tokenScale)
                    .persist(true, { persistTokenPrototype: true })
                .effect()
                    .file("jb2a.shield_themed.above.ice.01.blue", true)
                    .name(spellName)
                    .attachTo(tokenD)
                    .rotate(randomD)
                    .tieToDocuments(args.length ? args[1].item : [])
                    .fadeIn(3000)
                    .fadeOut(3000)
                    .scaleToObject(1.5 * tokenScale)
                    .persist(true, { persistTokenPrototype: true })
                .play()
                break;
            }
        }
    } else if (args[0] == "off") {
        await Sequencer.EffectManager.endEffects({ name: spellName, object: token })
    }
} else {
    let target = args[1].hitTargets[0] ?? args[1].sourceToken;

    let songOfMarching = Sequencer.EffectManager.getEffects({ name: "Song of Marching", source: token })[0]
    let dirgeOfDoom = Sequencer.EffectManager.getEffects({ name: "Dirge of Doom", source: token })[0]
    if (songOfMarching || dirgeOfDoom) {
        let menu = await warpgate.menu({
            inputs: [{ type: 'info', label: `End ${songOfMarching ? "Song of Marching" : dirgeOfDoom ? "Dirge of Doom" : "an unknown spell"}?` },],
            buttons: [{
                label: 'End',
                value: 1
            }, {
                label: 'Keep',
                value: 2
            }]
        }, { title: "Bard Cantrip" })
        if (menu.buttons === 1) {
            Sequencer.EffectManager.endEffects({ name: `Bardic Cantrips - ${songOfMarching ? "Song of Marching" : dirgeOfDoom ? "Dirge of Doom" : "*"}`, source: token })
        }
    } else {
        switch (spellName) {
            case "hymn-of-healing": {
                new Sequence({moduleName: "PF2e Animations", softFail: true})
                    .effect()
                    .atLocation(tokenD)
                    .scaleToObject(2)
                    .file("jb2a.bardic_inspiration.greenorange", true)
                    .waitUntilFinished(-1000)
                    .effect()
                    .atLocation(target)
                    .scaleToObject(1.5)
                    .file("jb2a.healing_generic.400px.green", true)
                    .play()
                break;
            }
            case "inspire-competence":
            case "uplifting-overture": {
                new Sequence({moduleName: "PF2e Animations", softFail: true})
                    .effect()
                    .atLocation(tokenD)
                    .scaleToObject(2)
                    .file("jb2a.bardic_inspiration.pink", true)
                    .effect()
                    .atLocation(target)
                    .scaleToObject(2)
                    .file("jb2a.bardic_inspiration.pink", true)
                    .play()
                break;
            }
            case "inspire-courage":
            case "courageous-anthem": {
                let seq = new Sequence({moduleName: "PF2e Animations", softFail: true})
                    .effect()
                    .atLocation(tokenD)
                    .scaleToObject(2)
                    .file("jb2a.bardic_inspiration.dark_red", true)
                targets.forEach((element, index) => {
                    seq.effect()
                        .atLocation(targets[index])
                        .scaleToObject(1.5)
                        .file("jb2a.divine_smite.caster.blueyellow", true)
                })
                seq.play()
                break;
            }
            case "inspire-defense":
            case "rallying-anthem": {
                let seq = new Sequence({moduleName: "PF2e Animations", softFail: true})
                    .effect()
                    .atLocation(tokenD)
                    .scaleToObject(2)
                    .file("jb2a.bardic_inspiration.blueyellow", true)
                targets.forEach((element, index) => {
                    seq.effect()
                        .atLocation(targets[index])
                        .scaleToObject(1.5)
                        .file("jb2a.divine_smite.caster.blueyellow", true)
                })
                seq.play()
                break;
            }
            case "allegro": {
                new Sequence({moduleName: "PF2e Animations", softFail: true})
                    .effect()
                    .atLocation(tokenD)
                    .scaleToObject(2)
                    .file("jb2a.bardic_inspiration.blueyellow", true)
                    .effect()
                    .atLocation(target)
                    .scaleToObject(1.5)
                    .file("jb2a.divine_smite.caster.blueyellow", true)
                    .play()
                break;
            }
            case "song-of-marching": {
                new Sequence({moduleName: "PF2e Animations", softFail: true})
                    .effect()
                    .atLocation(tokenD)
                    .scaleToObject(2)
                    .file("jb2a.bardic_inspiration.greenorange", true)
                    .effect()
                    .atLocation(tokenD)
                    .attachTo(tokenD)
                    .belowTokens()
                    .size({ width: 3, height: 3 }, { gridUnits: true })
                    .scaleIn(0, 1000)
                    .rotateIn(180, 1000)
                    .scaleOut(0, 1000)
                    .rotateOut(180, 1000)
                    .persist()
                    .opacity(0.5)
                    .persist()
                    .name("Bardic Cantrips - Song of Marching")
                    .file("jb2a.markers.music.greenorange", true)
                    .play()
                ui.notifications.info("Persistent Effect created, once you don't want it playing you can remove it in <i class=\"fas fa-film\"></i> Sequencers Effect Manager.")
                break;
            }
            case "dirge-of-doom": {
                new Sequence({moduleName: "PF2e Animations", softFail: true})
                    .effect()
                    .atLocation(tokenD)
                    .scaleToObject(2)
                    .file("jb2a.bardic_inspiration.dark_red", true)
                    .effect()
                    .atLocation(tokenD)
                    .attachTo(tokenD)
                    .belowTokens()
                    .size({ width: 15, height: 15 }, { gridUnits: true })
                    .scaleIn(0, 1000)
                    .scaleOut(0, 1000)
                    .fadeIn(900)
                    .fadeOut(900)
                    .persist()
                    .opacity(0.5)
                    .persist()
                    .name("Bardic Cantrips - Dirge of Doom")
                    .file("jb2a.spirit_guardians.dark_red.ring", true)
                    .effect()
                    .atLocation(tokenD)
                    .attachTo(tokenD)
                    .belowTokens()
                    .persist()
                    .scaleToObject(3)
                    .noLoop(true)
                    .scaleOut(0, 600)
                    .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 6000 })
                    .endTime(600)
                    .name("Bardic Cantrips - Dirge of Doom")
                    .file("jb2a.divine_smite.caster.dark_red", true)
                    .play()
                ui.notifications.info("Persistent Effect created, once you don't want it playing you can remove it in <i class=\"fas fa-film\"></i> Sequencers Effect Manager.")
                break;
            }
            case "song-of-strength": {
                let seq = new Sequence({moduleName: "PF2e Animations", softFail: true})
                    .effect()
                    .atLocation(tokenD)
                    .scaleToObject(2)
                    .file("jb2a.bardic_inspiration.greenorange", true)
                targets.forEach((element, index) => {
                    seq.effect()
                        .atLocation(targets[index])
                        .scaleToObject(1.5)
                        .file("jb2a.divine_smite.caster.greenyellow", true)
                })
                seq.play()
                break;
            }
            default: console.log(`Can't find "${spellName}", probably unimplemented!`)
        }
    }
}