/* {"name":"Brain Drain","img":"systems/pf2e/icons/spells/brain-drain.webp","_id":"BCeeFyLkQhbiqF4b"} */
// Original Author: @Trueprophet#9165
// Modified by: @MrVauxs#8622

let targets = Array.from(game.user.targets);
let [tokenD] = await pf2eAnimations.macroHelpers(args)

if (!(args && args[2] && args[2].length)) args[2] = {color: "orange"} // or "orange"

let files = args[2]?.color === "purple" ? [
    "jb2a.divine_smite.caster.reversed.purplepink",
    "jb2a.eldritch_blast.purple",
    "jb2a.eyes.01.bluegreen.single.2",
    "jb2a.eyes.01.bluegreen.single.2",
    "jb2a.energy_strands.range.standard.purple"
] : [
    "jb2a.divine_smite.caster.reversed.orange",
    "jb2a.eldritch_blast.yellow",
    "jb2a.eyes.01.orangeyellow.single.2",
    "jb2a.eyes.01.orangeyellow.single.2",
    "jb2a.energy_strands.range.standard.orange"
]

let cyanToPurple = {
    hue: 90
}

for (let target of targets) {
    new Sequence({moduleName: "PF2e Animations", softFail: true})
        .effect()
            .file(files[0], true)
            .fadeIn(200)
            .atLocation(tokenD)
            .playbackRate(3)
            .scale(0.75)
            .fadeOut(50)
        .effect()
            .file(files[1], true)
            .fadeIn(200)
            .atLocation(tokenD)
            .stretchTo(target)
            .fadeOut(200)
            .wait(1000)
        .effect()
            .file(files[2], true)
            .filter("ColorMatrix", args[2]?.color === "purple" ? cyanToPurple : {})
            .atLocation(tokenD)
            .scale(0.3)
            .scaleIn(0, 500, {ease: "easeInCubic", Delay: 100})
            .moveTowards(target, {rotate:false, ease:"easeInOutQuart"})
            .moveSpeed(500)
            .fadeOut(200)
            .waitUntilFinished(-120)
        .effect()
            .file(files[3], true)
            .filter("ColorMatrix", args[2]?.color === "purple" ? cyanToPurple : {})
            .atLocation(target, {offset: {x: 0, y: -25}})
            .fadeIn(100)
            .scaleToObject(0.5)
            .animateProperty("spriteContainer", "scale.x", {from:0, to: 2, duration: 700})
            .animateProperty("spriteContainer", "scale.y", {from:0, to: 2, duration: 700})
            .fadeOut(50)
            .waitUntilFinished(-5000) 
        .effect()
            .file(files[4], true)
            .scale(0.8, 1)
            .fadeIn(50)
            .atLocation(target)
            .stretchTo(tokenD)
            .repeats(7, 300, 400)
            .randomizeMirrorY()
            .fadeOut(50)
        .play()
};