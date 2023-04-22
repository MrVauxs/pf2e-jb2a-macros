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
})

Hooks.on("sequencer.ready", async () => {
    const fileLocation = 'modules/pf2e-jb2a-macros/assets/Runes_Pathfinder_Sins';
    const extraDatabase = {};
    async function jb2aExtraDatabase(prefix) {
        extraDatabase.magic_signs = {
            rune: {
                '03': {
                    complete: {
                        _markers: {
                            loop: { start: 1500, end: 6500 }
                        },
                        '01': {
                            blue: `${prefix}/Rune03Complete_01_01_Regular_Blue_400x400.webm`,
                            green: `${prefix}/Rune03Complete_01_01_Regular_Green_400x400.webm`,
                            grey: `${prefix}/Rune03Complete_01_01_Regular_Grey_400x400.webm`,
                            orange: `${prefix}/Rune03Complete_01_01_Regular_Orange_400x400.webm`,
                            pink: `${prefix}/Rune03Complete_01_01_Regular_Pink_400x400.webm`,
                            purple: `${prefix}/Rune03Complete_01_01_Regular_Purple_400x400.webm`,
                            red: `${prefix}/Rune03Complete_01_01_Regular_Red_400x400.webm`,
                            yellow: `${prefix}/Rune03Complete_01_01_Regular_Yellow_400x400.webm`
                        },
                        '02': {
                            blue: `${prefix}/Rune03Complete_01_02_Regular_Blue_400x400.webm`,
                            green: `${prefix}/Rune03Complete_01_02_Regular_Green_400x400.webm`,
                            grey: `${prefix}/Rune03Complete_01_02_Regular_Grey_400x400.webm`,
                            orange: `${prefix}/Rune03Complete_01_02_Regular_Orange_400x400.webm`,
                            pink: `${prefix}/Rune03Complete_01_02_Regular_Pink_400x400.webm`,
                            purple: `${prefix}/Rune03Complete_01_02_Regular_Purple_400x400.webm`,
                            red: `${prefix}/Rune03Complete_01_02_Regular_Red_400x400.webm`,
                            yellow: `${prefix}/Rune03Complete_01_02_Regular_Yellow_400x400.webm`
                        },
                        '03': {
                            blue: `${prefix}/Rune03Complete_01_03_Regular_Blue_400x400.webm`,
                            green: `${prefix}/Rune03Complete_01_03_Regular_Green_400x400.webm`,
                            grey: `${prefix}/Rune03Complete_01_03_Regular_Grey_400x400.webm`,
                            orange: `${prefix}/Rune03Complete_01_03_Regular_Orange_400x400.webm`,
                            pink: `${prefix}/Rune03Complete_01_03_Regular_Pink_400x400.webm`,
                            purple: `${prefix}/Rune03Complete_01_03_Regular_Purple_400x400.webm`,
                            red: `${prefix}/Rune03Complete_01_03_Regular_Red_400x400.webm`,
                            yellow: `${prefix}/Rune03Complete_01_03_Regular_Yellow_400x400.webm`
                        },
                        '04': {
                            blue: `${prefix}/Rune03Complete_01_04_Regular_Blue_400x400.webm`,
                            green: `${prefix}/Rune03Complete_01_04_Regular_Green_400x400.webm`,
                            grey: `${prefix}/Rune03Complete_01_04_Regular_Grey_400x400.webm`,
                            orange: `${prefix}/Rune03Complete_01_04_Regular_Orange_400x400.webm`,
                            pink: `${prefix}/Rune03Complete_01_04_Regular_Pink_400x400.webm`,
                            purple: `${prefix}/Rune03Complete_01_04_Regular_Purple_400x400.webm`,
                            red: `${prefix}/Rune03Complete_01_04_Regular_Red_400x400.webm`,
                            yellow: `${prefix}/Rune03Complete_01_04_Regular_Yellow_400x400.webm`
                        },
                        '05': {
                            blue: `${prefix}/Rune03Complete_01_05_Regular_Blue_400x400.webm`,
                            green: `${prefix}/Rune03Complete_01_05_Regular_Green_400x400.webm`,
                            grey: `${prefix}/Rune03Complete_01_05_Regular_Grey_400x400.webm`,
                            orange: `${prefix}/Rune03Complete_01_05_Regular_Orange_400x400.webm`,
                            pink: `${prefix}/Rune03Complete_01_05_Regular_Pink_400x400.webm`,
                            purple: `${prefix}/Rune03Complete_01_05_Regular_Purple_400x400.webm`,
                            red: `${prefix}/Rune03Complete_01_05_Regular_Red_400x400.webm`,
                            yellow: `${prefix}/Rune03Complete_01_05_Regular_Yellow_400x400.webm`
                        },
                        '06': {
                            blue: `${prefix}/Rune03Complete_01_06_Regular_Blue_400x400.webm`,
                            green: `${prefix}/Rune03Complete_01_06_Regular_Green_400x400.webm`,
                            grey: `${prefix}/Rune03Complete_01_06_Regular_Grey_400x400.webm`,
                            orange: `${prefix}/Rune03Complete_01_06_Regular_Orange_400x400.webm`,
                            pink: `${prefix}/Rune03Complete_01_06_Regular_Pink_400x400.webm`,
                            purple: `${prefix}/Rune03Complete_01_06_Regular_Purple_400x400.webm`,
                            red: `${prefix}/Rune03Complete_01_06_Regular_Red_400x400.webm`,
                            yellow: `${prefix}/Rune03Complete_01_06_Regular_Yellow_400x400.webm`
                        },
                        '07': {
                            blue: `${prefix}/Rune03Complete_01_07_Regular_Blue_400x400.webm`,
                            green: `${prefix}/Rune03Complete_01_07_Regular_Green_400x400.webm`,
                            grey: `${prefix}/Rune03Complete_01_07_Regular_Grey_400x400.webm`,
                            orange: `${prefix}/Rune03Complete_01_07_Regular_Orange_400x400.webm`,
                            pink: `${prefix}/Rune03Complete_01_07_Regular_Pink_400x400.webm`,
                            purple: `${prefix}/Rune03Complete_01_07_Regular_Purple_400x400.webm`,
                            red: `${prefix}/Rune03Complete_01_07_Regular_Red_400x400.webm`,
                            yellow: `${prefix}/Rune03Complete_01_07_Regular_Yellow_400x400.webm`
                        },
                        '08': {
                            blue: `${prefix}/Rune03Complete_01_08_Regular_Blue_400x400.webm`,
                            green: `${prefix}/Rune03Complete_01_08_Regular_Green_400x400.webm`,
                            grey: `${prefix}/Rune03Complete_01_08_Regular_Grey_400x400.webm`,
                            orange: `${prefix}/Rune03Complete_01_08_Regular_Orange_400x400.webm`,
                            pink: `${prefix}/Rune03Complete_01_08_Regular_Pink_400x400.webm`,
                            purple: `${prefix}/Rune03Complete_01_08_Regular_Purple_400x400.webm`,
                            red: `${prefix}/Rune03Complete_01_08_Regular_Red_400x400.webm`,
                            yellow: `${prefix}/Rune03Complete_01_08_Regular_Yellow_400x400.webm`
                        }
                    },
                    loop: {
                        '01': {
                            blue: `${prefix}/Rune03Loop_01_01_Regular_Blue_400x400.webm`,
                            green: `${prefix}/Rune03Loop_01_01_Regular_Green_400x400.webm`,
                            grey: `${prefix}/Rune03Loop_01_01_Regular_Grey_400x400.webm`,
                            orange: `${prefix}/Rune03Loop_01_01_Regular_Orange_400x400.webm`,
                            pink: `${prefix}/Rune03Loop_01_01_Regular_Pink_400x400.webm`,
                            purple: `${prefix}/Rune03Loop_01_01_Regular_Purple_400x400.webm`,
                            red: `${prefix}/Rune03Loop_01_01_Regular_Red_400x400.webm`,
                            yellow: `${prefix}/Rune03Loop_01_01_Regular_Yellow_400x400.webm`
                        },
                        '02': {
                            blue: `${prefix}/Rune03Loop_01_02_Regular_Blue_400x400.webm`,
                            green: `${prefix}/Rune03Loop_01_02_Regular_Green_400x400.webm`,
                            grey: `${prefix}/Rune03Loop_01_02_Regular_Grey_400x400.webm`,
                            orange: `${prefix}/Rune03Loop_01_02_Regular_Orange_400x400.webm`,
                            pink: `${prefix}/Rune03Loop_01_02_Regular_Pink_400x400.webm`,
                            purple: `${prefix}/Rune03Loop_01_02_Regular_Purple_400x400.webm`,
                            red: `${prefix}/Rune03Loop_01_02_Regular_Red_400x400.webm`,
                            yellow: `${prefix}/Rune03Loop_01_02_Regular_Yellow_400x400.webm`
                        },
                        '03': {
                            blue: `${prefix}/Rune03Loop_01_03_Regular_Blue_400x400.webm`,
                            green: `${prefix}/Rune03Loop_01_03_Regular_Green_400x400.webm`,
                            grey: `${prefix}/Rune03Loop_01_03_Regular_Grey_400x400.webm`,
                            orange: `${prefix}/Rune03Loop_01_03_Regular_Orange_400x400.webm`,
                            pink: `${prefix}/Rune03Loop_01_03_Regular_Pink_400x400.webm`,
                            purple: `${prefix}/Rune03Loop_01_03_Regular_Purple_400x400.webm`,
                            red: `${prefix}/Rune03Loop_01_03_Regular_Red_400x400.webm`,
                            yellow: `${prefix}/Rune03Loop_01_03_Regular_Yellow_400x400.webm`
                        },
                        '04': {
                            blue: `${prefix}/Rune03Loop_01_04_Regular_Blue_400x400.webm`,
                            green: `${prefix}/Rune03Loop_01_04_Regular_Green_400x400.webm`,
                            grey: `${prefix}/Rune03Loop_01_04_Regular_Grey_400x400.webm`,
                            orange: `${prefix}/Rune03Loop_01_04_Regular_Orange_400x400.webm`,
                            pink: `${prefix}/Rune03Loop_01_04_Regular_Pink_400x400.webm`,
                            purple: `${prefix}/Rune03Loop_01_04_Regular_Purple_400x400.webm`,
                            red: `${prefix}/Rune03Loop_01_04_Regular_Red_400x400.webm`,
                            yellow: `${prefix}/Rune03Loop_01_04_Regular_Yellow_400x400.webm`
                        },
                        '05': {
                            blue: `${prefix}/Rune03Loop_01_05_Regular_Blue_400x400.webm`,
                            green: `${prefix}/Rune03Loop_01_05_Regular_Green_400x400.webm`,
                            grey: `${prefix}/Rune03Loop_01_05_Regular_Grey_400x400.webm`,
                            orange: `${prefix}/Rune03Loop_01_05_Regular_Orange_400x400.webm`,
                            pink: `${prefix}/Rune03Loop_01_05_Regular_Pink_400x400.webm`,
                            purple: `${prefix}/Rune03Loop_01_05_Regular_Purple_400x400.webm`,
                            red: `${prefix}/Rune03Loop_01_05_Regular_Red_400x400.webm`,
                            yellow: `${prefix}/Rune03Loop_01_05_Regular_Yellow_400x400.webm`
                        },
                        '06': {
                            blue: `${prefix}/Rune03Loop_01_06_Regular_Blue_400x400.webm`,
                            green: `${prefix}/Rune03Loop_01_06_Regular_Green_400x400.webm`,
                            grey: `${prefix}/Rune03Loop_01_06_Regular_Grey_400x400.webm`,
                            orange: `${prefix}/Rune03Loop_01_06_Regular_Orange_400x400.webm`,
                            pink: `${prefix}/Rune03Loop_01_06_Regular_Pink_400x400.webm`,
                            purple: `${prefix}/Rune03Loop_01_06_Regular_Purple_400x400.webm`,
                            red: `${prefix}/Rune03Loop_01_06_Regular_Red_400x400.webm`,
                            yellow: `${prefix}/Rune03Loop_01_06_Regular_Yellow_400x400.webm`
                        },
                        '07': {
                            blue: `${prefix}/Rune03Loop_01_07_Regular_Blue_400x400.webm`,
                            green: `${prefix}/Rune03Loop_01_07_Regular_Green_400x400.webm`,
                            grey: `${prefix}/Rune03Loop_01_07_Regular_Grey_400x400.webm`,
                            orange: `${prefix}/Rune03Loop_01_07_Regular_Orange_400x400.webm`,
                            pink: `${prefix}/Rune03Loop_01_07_Regular_Pink_400x400.webm`,
                            purple: `${prefix}/Rune03Loop_01_07_Regular_Purple_400x400.webm`,
                            red: `${prefix}/Rune03Loop_01_07_Regular_Red_400x400.webm`,
                            yellow: `${prefix}/Rune03Loop_01_07_Regular_Yellow_400x400.webm`
                        },
                        '08': {
                            blue: `${prefix}/Rune03Loop_01_08_Regular_Blue_400x400.webm`,
                            green: `${prefix}/Rune03Loop_01_08_Regular_Green_400x400.webm`,
                            grey: `${prefix}/Rune03Loop_01_08_Regular_Grey_400x400.webm`,
                            orange: `${prefix}/Rune03Loop_01_08_Regular_Orange_400x400.webm`,
                            pink: `${prefix}/Rune03Loop_01_08_Regular_Pink_400x400.webm`,
                            purple: `${prefix}/Rune03Loop_01_08_Regular_Purple_400x400.webm`,
                            red: `${prefix}/Rune03Loop_01_08_Regular_Red_400x400.webm`,
                            yellow: `${prefix}/Rune03Loop_01_08_Regular_Yellow_400x400.webm`
                        }

                    }
                }
            }
        }
    }
    await jb2aExtraDatabase(fileLocation)

    Sequencer.Database.registerEntries("jb2a-extra", extraDatabase);
});
