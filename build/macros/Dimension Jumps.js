/* {"name":"Dimension Jumps","img":"icons/magic/movement/pinwheel-turning-blue.webp","_id":"lmKZBrfclq8V6sJI"} */
// Cannot be used standalone.

let opts = {};
let seq = new Sequence({moduleName: "PF2e Animations", softFail: true})
const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)
let movementSpeed = args[0].actor.attributes.speed.total;

// Determine spell level, this is BS though.
// What I am basically doing is searching the latest messages for a spellLevel tag and see if they have it. Whichever is latest wins, rather than which one caused the damage roll.
// The flag is also created by checking the HTML of the spell than the actual data, since there is no official spell level flag.
let spellLevel = args[0].data.flags.pf2e?.casting?.level ?? [...args[0].collection].filter(x => x.data.flags?.pf2e?.casting).slice(-1)[0].data.flags.pf2e.casting.level

// Determine Spells Range
switch (args[0].item.system.slug) {
    case "dimensional-assault": opts.range = movementSpeed / 2; break;
    case "snare-hopping": opts.range = 10 * spellLevel; opts.reverseTeleport = true; break;
    case "abundant-step": opts.range = Math.max(15, movementSpeed); break;
    case "blink-charge": opts.range = (spellLevel - 4) * 60; break;
    case "collective-transposition": opts.range = 30; opts.reverseTeleport = true; opts.possibleTargets = 2 + (spellLevel - 6); break;
    case "dimension-door":
    case "translocate": opts.range = spellLevel < 5 ? 120 : 1000; break;
    case "dimensional-steps": opts.range = 20 + 5 * (spellLevel - 4); break;
    case "shadow-jump": opts.range = 120; break;
    case "teleport": opts.range = 100 * (10 * (spellLevel - 6)); break;
    case "unexpected-transposition": opts.range = 30; opts.switcheroo = true; ui.notifications.info("PF2e Animations | Select a target to switch places with!"); break;
    case "terrain-transposition": {
        let rangeMenu = await warpgate.menu({
            buttons: [{
                label: 'Yes',
                value: 2
            }, {
                label: 'No',
                value: 1
            }]
        }, {
            title: 'Are you in Favoured Terrain?'
        })
        opts.range = 90 * rangeMenu.buttons
        break;
    }
}

console.log(opts)

tokenD.actor.sheet.minimize();
const tokenCenter = tokenD.center;
let cachedDistance = 0;
const checkDistance = async (crosshairs) => {

    while (crosshairs.inFlight) {

        //wait for initial render
        await warpgate.wait(100);

        const ray = new Ray(tokenCenter, crosshairs);

        const distance = canvas.grid.measureDistances([{ ray }], { gridSpaces: true })[0]

        //only update if the distance has changed
        if (cachedDistance !== distance) {
            cachedDistance = distance;
            if (distance > opts.range) {
                crosshairs.icon = 'icons/svg/hazard.svg'
            } else {
                crosshairs.icon = tokenD.data.texture.src
            }
            crosshairs.draw()
            crosshairs.label = `${distance} ft`
        }
    }
}

const callbacks = {
    show: checkDistance
}

let targetLocation = await warpgate.crosshairs.show({ size: tokenD.data.width, icon: tokenD.data.texture.src, label: '0 ft.', interval: tokenD.data.width % 2 === 0 ? 1 : -1 }, callbacks)

if (targetLocation.cancelled) { tokenD.actor.sheet.maximize(); return; }
if (cachedDistance > opts.range) {
    ui.notifications.error(`Your teleport has a maximum range of ${opts.range} ft. Last try.`)
    targetLocation = await warpgate.crosshairs.show({ size: tokenD.data.width, icon: tokenD.data.texture.src, label: '0 ft.', interval: -1 }, callbacks)
}
if (cachedDistance > opts.range) {
    ui.notifications.error(`Your teleport has a maximum range of ${opts.range} ft.`)
    return
}

let targetToken = warpgate.crosshairs.collect(targetLocation).filter(token => !canvas.tokens.controlled.map(t => t.id).includes(tokenD.id))[0]?.object;

switch (args[0].item.system.slug) {
    case "dimensional-assault": {
        await Sequencer.Preloader.preloadForClients(["jb2a.misty_step.02.purple", "jb2a.misty_step.01.purple", "jb2a.energy_strands.range.standard.purple.04"])
        seq.effect()
            .file("jb2a.misty_step.01.purple", true)
            .atLocation(tokenD)
            .scaleToObject(2)
            .wait(600)
        .animation()
            .on(tokenD)
            .opacity(0)
            .waitUntilFinished()
        .effect()
            .file("jb2a.energy_strands.range.standard.purple.04", true)
            .atLocation(tokenD)
            .stretchTo(targetLocation)
        .animation()
            .on(tokenD)
            .teleportTo(targetLocation)
            .snapToGrid()
            .waitUntilFinished()
        .effect()
            .file("jb2a.misty_step.02.purple", true)
            .attachTo(tokenD)
            .scaleToObject(2)
            .wait(1500)
        .animation()
            .on(tokenD)
            .opacity(1.0)
        break;
    };
    case "snare-hopping": {
        break;
    };
    case "ki-rush":
    case "abundant-step": {
        seq.effect()
            .file(tokenD.data.texture.src, true)
            .atLocation(tokenD)
            .attachTo(tokenD, {bindAlpha: false})
            .loopProperty("spriteContainer", "position.x", { values: [0, 15, 0 -15], duration: 50})
            .loopProperty("spriteContainer", "position.y", { values: [0, -15, 0, 15], duration: 50})
            .from(tokenD)
            .filter("Blur", { blurX: 5, blurY: 0, quality: 5 })
            .fadeIn(500)
            .fadeOut(500)
            .wait(300)
        .animation()
            .opacity(0)
            .on(tokenD)
            .moveTowards(targetLocation)
            .moveSpeed(50)
            .snapToGrid()
            .waitUntilFinished()
        .animation()
            .opacity(1)
            .on(tokenD)
        break;
    };
    case "dimension-door":
    case "translocate": {
        await Sequencer.Preloader.preloadForClients(["jb2a.magic_signs.rune.conjuration.intro.blue", "jb2a.portals.vertical.vortex.blue"])
        const portalScale = tokenD.w / canvas.grid.size * 0.7;
        seq.effect()
            .file('jb2a.magic_signs.rune.conjuration.intro.blue', true)
            .atLocation(tokenD)
            .scale(portalScale * 0.7)
            .opacity(0.5)
            .waitUntilFinished(-600)
        .effect()
            .file('jb2a.portals.vertical.vortex.blue', true)
            .atLocation(tokenD, {offset: {y: -(tokenD.h)}})
            .scale(portalScale)
            .duration(1200)
            .fadeIn(200)
            .fadeOut(500)
        .animation()
            .on(tokenD)
            .opacity(0)
        .effect()
            .from(tokenD)
            .moveTowards({ x: tokenD.center.x, y: tokenD.center.y - tokenD.h }, { ease: 'easeInCubic', rotate: false })
            .zeroSpriteRotation()
            .fadeOut(500)
            .scale(tokenD.document.texture.scaleX)
            .duration(500)
            .wait(250)
        .effect()
            .file('jb2a.portals.vertical.vortex.blue', true)
            .atLocation(targetLocation, {offset: { y: -(tokenD.h)}})
            .scale(portalScale)
            .duration(1200)
            .fadeOut(500)
            .fadeIn(200)
        .effect()
            .from(tokenD)
            .atLocation({ x: targetLocation.x, y: targetLocation.y - tokenD.h }, { ease: 'easeInCubic', rotate: false })
            .scale(tokenD.document.texture.scaleX)
            .fadeIn(500)
            .duration(500)
            .moveTowards(targetLocation)
            .rotate(90)
            .waitUntilFinished()
        .animation()
            .on(tokenD)
            .teleportTo(targetLocation, { relativeToCenter: true })
            .opacity(1)
        break;
    };
    case "dimensional-steps": {
        await Sequencer.Preloader.preloadForClients(["jb2a.misty_step.02.blue", "jb2a.misty_step.01.blue", "jb2a.energy_strands.range.standard.blue.04"])
        seq.effect()
            .file("jb2a.misty_step.01.blue", true)
            .atLocation(tokenD)
            .scaleToObject(2)
            .wait(600)
        .animation()
            .on(tokenD)
            .opacity(0)
            .waitUntilFinished()
        .animation()
            .on(tokenD)
            .teleportTo(targetLocation)
            .snapToGrid()
            .waitUntilFinished()
        .effect()
            .file("jb2a.misty_step.02.blue", true)
            .attachTo(tokenD)
            .scaleToObject(2)
            .wait(1500)
        .animation()
            .on(tokenD)
            .opacity(1.0)
        break;
    };
    case "blink-charge": {
        await Sequencer.Preloader.preloadForClients([
            "jb2a.misty_step.02.blue",
            "jb2a.misty_step.01.blue",
            "jb2a.energy_strands.range.standard.blue.04",
            "jb2a.energy_strands.overlay.blue.01"
        ])
        seq.effect()
            .file("jb2a.energy_strands.overlay.blue.01", true)
            .atLocation(tokenD)
            .attachTo(tokenD)
            .fadeIn(500)
            .scaleToObject(tokenScale)
            .wait(600)
        .effect()
            .file("jb2a.misty_step.01.blue", true)
            .atLocation(tokenD)
            .scaleToObject(2)
            .wait(600)
        .animation()
            .on(tokenD)
            .opacity(0)
            .waitUntilFinished()
        .effect()
            .file("jb2a.energy_strands.range.standard.blue.04", true)
            .atLocation(tokenD)
            .stretchTo(targetLocation)
        .animation()
            .on(tokenD)
            .teleportTo(targetLocation)
            .snapToGrid()
            .waitUntilFinished()
        .effect()
            .file("jb2a.misty_step.02.blue", true)
            .attachTo(tokenD)
            .scaleToObject(2)
            .wait(1500)
        .animation()
            .on(tokenD)
            .opacity(1.0)
        if (Array.from(game.user.targets)[0]) {
            await Sequencer.Preloader.preloadForClients(["jb2a.divine_smite.target.blueyellow"])
            seq.effect()
                .waitUntilFinished(-500)
                .file("jb2a.divine_smite.target.blueyellow", true)
                .atLocation(Array.from(game.user.targets)[0])
                .scale({ x: 1, y: 1 })
        }
        break;
    };
    case "shadow-jump": {
        await Sequencer.Preloader.preloadForClients(["jb2a.misty_step.02.dark_black", "jb2a.misty_step.01.dark_black"])
        seq.effect()
            .file("jb2a.misty_step.01.dark_black", true)
            .atLocation(tokenD)
            .scaleToObject(2)
            .wait(600)
        .animation()
            .on(tokenD)
            .opacity(0)
            .waitUntilFinished()
        .effect()
            .file("jb2a.drop_shadow.dark_black", true)
            .atLocation(tokenD)
            .moveTowards(targetLocation)
            .scale({ x: 1, y: 1 })
            .waitUntilFinished(-1500)
        .animation()
            .on(tokenD)
            .teleportTo(targetLocation)
            .snapToGrid()
            .waitUntilFinished()
        .effect()
            .file("jb2a.misty_step.02.dark_black", true)
            .attachTo(tokenD)
            .scaleToObject(2)
            .wait(1500)
        .animation()
            .on(tokenD)
            .opacity(1.0)
        break;
    };
    case "terrain-transposition": {
        await Sequencer.Preloader.preloadForClients(["jb2a.swirling_leaves.complete.01.green.0", "jb2a.energy_strands.range.standard.dark_green.03"])
        seq.effect()
            .file("jb2a.swirling_leaves.complete.01.green.0", true)
            .atLocation(tokenD)
            .attachTo(tokenD)
            .fadeIn(500)
            .scaleToObject(tokenScale * 2)
            .waitUntilFinished(-2000)
            .fadeOut(500)
        .effect()
            .from(tokenD)
            .fadeOut(500)
            .atLocation(tokenD)
            .attachTo(tokenD, {bindAlpha: false})
        .animation()
            .on(tokenD)
            .fadeOut(500)
            .opacity(0)
            .waitUntilFinished()
        .animation()
            .on(tokenD)
            .teleportTo(targetLocation)
            .snapToGrid()
        .effect()
            .file("jb2a.energy_strands.range.standard.dark_green", true)
            .atLocation(tokenD)
            .stretchTo(targetLocation)
            .waitUntilFinished(-1300)
        .animation()
            .on(tokenD)
            .fadeIn(500)
            .opacity(1.0)
        break;
    };
    case "collective-transposition": {
        break;
    };
    case "Teleport": {
        break;
    };
    case "unexpected-transposition": {
        seq.effect()
            .file("jb2a.smoke.puff.centered", true)
            .atLocation(tokenD)
            .attachTo(tokenD)
            .scaleToObject(2)
        .effect()
            .file("jb2a.smoke.puff.centered", true)
            .atLocation(targetToken)
            .attachTo(targetToken)
            .scaleToObject(2)
        .animation()
            .on(tokenD)
            .opacity(0)
        .animation()
            .on(targetToken)
            .opacity(0)
        .animation()
            .on(tokenD)
            .teleportTo(targetToken)
            .fadeIn(500)
        .animation()
            .on(targetToken)
            .teleportTo(tokenD)
            .fadeIn(500)
        break;
    };
}

await seq.play()

tokenD.actor.sheet.maximize();