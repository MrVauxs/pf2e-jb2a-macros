/*
	"esmodules": [
		"module/sequencer-extensions.js"
	],
*/
Hooks.once('sequencer.ready', () => {
    class pulseInAndOut extends Sequence.prototype {

        constructor(inSequence) {
            super(inSequence);
        }

        pulseInAndOut({ from, to, duration, pingPong }) {
            this.loopProperty("spriteContainer", "scale.x", { from: from ?? 0.9, to: to ?? 1.1, duration: duration ?? 5000, pingPong: pingPong ?? true })
            this.loopProperty("spriteContainer", "scale.y", { from: from ?? 0.9, to: to ?? 1.1, duration: duration ?? 5000, pingPong: pingPong ?? true })
            return this;
        }

        run() {
            // this.loopProperty("spriteContainer", "scale.x", { from: from ?? 0.9, to: to ?? 1.1, duration: duration ?? 5000, pingPong: pingPong ?? true })
            // this.loopProperty("spriteContainer", "scale.y", { from: from ?? 0.9, to: to ?? 1.1, duration: duration ?? 5000, pingPong: pingPong ?? true })
        }
    }

    Sequencer.SectionManager.registerSection("pf2e-jb2a-macros", "effect", pulseInAndOut, true)
})