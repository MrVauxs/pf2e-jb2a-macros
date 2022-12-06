/*
    "esmodules": [
        "module/sequencer-extensions.js"
    ],
*/
Hooks.once('sequencer.ready', () => {
    Sequencer.Presets.add("pf2eAnimations.breathe", (effect, args) => {
        return effect
            .loopProperty("spriteContainer", "scale.x", { from: 0.9, to: 1.1, duration: args?.duration ?? 3000, pingPong: true, ease: "easeInOutSine" })
            .loopProperty("spriteContainer", "scale.y", { from: 0.9, to: 1.1, duration: args?.duration ?? 3000, pingPong: true, ease: "easeInOutSine" });
    });
})