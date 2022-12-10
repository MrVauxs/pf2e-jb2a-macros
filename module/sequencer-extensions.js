/*
    "esmodules": [
        "module/sequencer-extensions.js"
    ],
*/
Hooks.once('sequencer.ready', () => {
    if (isNewerVersion(game.modules.get("sequencer").version, "2.4.1")) {
        Sequencer.Presets.add("pf2eAnimations.breathe", (effect, args) => {
            return effect
                .loopProperty("spriteContainer", "scale.x", { from: 0.9, to: 1.1, duration: args?.duration ?? 3000, pingPong: true, ease: "easeInOutSine" })
                .loopProperty("spriteContainer", "scale.y", { from: 0.9, to: 1.1, duration: args?.duration ?? 3000, pingPong: true, ease: "easeInOutSine" });
        });
        Sequencer.Presets.add("pf2eAnimations.orbit", (effect, args) => {
            let args = args ?? { duration: 9000, spriteOffset: 0.5};
            return effect
                .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: args.duration})
                .spriteOffset({ x: args.spriteOffset }, { gridUnits: true })
        });
    }
})