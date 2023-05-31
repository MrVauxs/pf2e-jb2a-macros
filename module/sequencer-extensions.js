Hooks.once('sequencer.ready', () => {
    Sequencer.Presets.add("pf2eAnimations.breathe", (effect, args) => {
        return effect
            .loopProperty("spriteContainer", "scale.x", { from: 0.9, to: 1.1, duration: args?.duration ?? 3000, pingPong: true, ease: "easeInOutSine" })
            .loopProperty("spriteContainer", "scale.y", { from: 0.9, to: 1.1, duration: args?.duration ?? 3000, pingPong: true, ease: "easeInOutSine" });
    });
    Sequencer.Presets.add("pf2eAnimations.orbit", (effect, args) => {
        args = args ?? { duration: 9000, spriteOffset: 0.5 };
        return effect
            .loopProperty("spriteContainer", "rotation", { from: 0, to: 360, duration: args.duration })
            .spriteOffset({ x: args.spriteOffset }, { gridUnits: true })
    });
    Sequencer.Presets.add("pf2eAnimations.fade", (effect, args) => {
        args = args ?? { duration: 500, options: {} };
        return effect
            .fadeIn(args.duration, args.options)
            .fadeOut(args.duration, args.options)
    });
});