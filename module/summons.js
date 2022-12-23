// Creates dummy NPC and PC actors for summoning purposes.
// Keeps the IDs of these actors in settings. If one of them is missing, it will create a new one and save the new ones ID.
pf2eAnimations.createIfMissingDummy = async function createIfMissingDummy() {
    let message = `PF2e Animations | ${pf2eAnimations.localize("pf2e-jb2a-macros.notifications.noDummy")}`;
    let npcFolder = game.folders.get(game.settings.get("pf2e-jb2a-macros", "dummyNPCId-folder"));

    if (!npcFolder) {
        npcFolder = await Folder.create({ name: "PF2e Animations Dummy NPCs", type: "Actor", parent: null });
        game.settings.set("pf2e-jb2a-macros", "dummyNPCId-folder", npcFolder.id);
    }

    let npcActor1 = game.actors.get(game.settings.get("pf2e-jb2a-macros", "dummyNPCId-tiny"));
    let npcActor2 = game.actors.get(game.settings.get("pf2e-jb2a-macros", "dummyNPCId-medium"));
    let npcActor3 = game.actors.get(game.settings.get("pf2e-jb2a-macros", "dummyNPCId-large"));
    let npcActor4 = game.actors.get(game.settings.get("pf2e-jb2a-macros", "dummyNPCId-huge"));
    let npcActor5 = game.actors.get(game.settings.get("pf2e-jb2a-macros", "dummyNPCId-garg"));
    if (!(npcActor1 && npcActor2 && npcActor3 && npcActor4 && npcActor5)) {
        message += ` ${pf2eAnimations.localize("pf2e-jb2a-macros.notifications.creatingDummy")} `;
        ui.notifications.info(message);
        if (!npcActor1) {
            npcActor1 = await Actor.create({
                name: "Dummy NPC (tiny)",
                type: "npc",
                folder: npcFolder.id,
                img: "icons/svg/cowled.svg",
                size: "tiny",
                prototypeToken: {
                    width: 0.5,
                    height: 0.5,
                },
                system: {
                    attributes: {
                        hp: {
                            max: 999,
                            value: 999,
                            base: 999,
                            slug: "hp"
                        }
                    },
                    traits: {
                        size: {
                            value: "tiny"
                        }
                    }
                },
            })
            await game.settings.set("pf2e-jb2a-macros", "dummyNPCId-tiny", npcActor1.id);
        }
        if (!npcActor2) {
            npcActor2 = await Actor.create({
                name: "Dummy NPC (med)",
                type: "npc",
                folder: npcFolder.id,
                img: "icons/svg/cowled.svg",
                system: {
                    attributes: {
                        hp: {
                            max: 999,
                            value: 999,
                            base: 999,
                            slug: "hp"
                        }
                    },
                    traits: {
                        size: {
                            value: "med"
                        }
                    }
                },
                size: "med",
                prototypeToken: {
                    width: 1,
                    height: 1,
                },
            })
            await game.settings.set("pf2e-jb2a-macros", "dummyNPCId-medium", npcActor2.id);
        }
        if (!npcActor3) {
            npcActor3 = await Actor.create({
                name: "Dummy NPC (lg)",
                type: "npc",
                folder: npcFolder.id,
                img: "icons/svg/cowled.svg",
                system: {
                    attributes: {
                        hp: {
                            max: 999,
                            value: 999,
                            base: 999,
                            slug: "hp"
                        }
                    },
                    traits: {
                        size: {
                            value: "lg"
                        }
                    }
                },
                size: "lg",
                prototypeToken: {
                    width: 2,
                    height: 2,
                },
            })
            await game.settings.set("pf2e-jb2a-macros", "dummyNPCId-large", npcActor3.id);
        }
        if (!npcActor4) {
            npcActor4 = await Actor.create({
                name: "Dummy NPC (huge)",
                type: "npc",
                folder: npcFolder.id,
                img: "icons/svg/cowled.svg",
                system: {
                    attributes: {
                        hp: {
                            max: 999,
                            value: 999,
                            base: 999,
                            slug: "hp"
                        }
                    },
                    traits: {
                        size: {
                            value: "huge"
                        }
                    }
                },
                size: "huge",
                prototypeToken: {
                    width: 3,
                    height: 3,
                },

            })
            await game.settings.set("pf2e-jb2a-macros", "dummyNPCId-huge", npcActor4.id);
        }
        if (!npcActor5) {
            npcActor5 = await Actor.create({
                name: "Dummy NPC (grg)",
                type: "npc",
                folder: npcFolder.id,
                img: "icons/svg/cowled.svg",
                system: {
                    attributes: {
                        hp: {
                            max: 999,
                            value: 999,
                            base: 999,
                            slug: "hp"
                        }
                    },
                    traits: {
                        size: {
                            value: "grg"
                        }
                    }
                },
                size: "grg",
                prototypeToken: {
                    width: 4,
                    height: 4,
                },
            })
            await game.settings.set("pf2e-jb2a-macros", "dummyNPCId-garg", npcActor5.id);
        }
    }
}

/**
 *
 * @param {Object} args Args passed down in the macro.
 * @param {Object} importedActor Actor to spawn.
 * @param {Object} spawnArgs Arguments to be passed down to Warpgate spawnAt function, order insensitive.
 */
pf2eAnimations.playerSummons = async function playerSummons({ args = [], importedActor = {}, spawnArgs = {} }) {
    const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args);

    // If no actor is passed, prompt a player to select one.
    if (!Object.keys(importedActor).length) {
        // packs is an outdated term, it currently means the indexed actors
        let packs = await game.pf2e.compendiumBrowser.tabs.bestiary.indexData;

        if (!packs.length) {
            await game.pf2e.compendiumBrowser.tabs.bestiary.loadData();
            packs = await game.pf2e.compendiumBrowser.tabs.bestiary.indexData;
        }

        // adding size and alignment traits
        packs = packs.map(pack => { return { ...pack, traits: pack.traits.concat(pack.actorSize, pf2eAnimations.alignmentStringToTraits(pack.alignment)) } });

        pf2eAnimations.debug("Summon Creature Options", packs)

        let sortedHow = {
            type: "info",
            label: pf2eAnimations.localize("pf2e-jb2a-macros.macro.summoning.player.label")
        }

        let randomCreature, randomAmount, multiplier;

        if (args && args[2]?.length) {
            pf2eAnimations.debug("Summoning Args", args);
            let unique, uniqueString, alignment;
            if (args[2].find(x => x.includes("unique"))) {
                unique = args[2].find(x => x.includes("unique-"))?.replace('unique-', '')
                if (unique && args[2].length > 1) return ui.notifications.error("You can only select one unique summon type.");
                switch (unique) {
                    case "lesser-servitor": {
                        // spell level
                        let multiplier = -1;
                        if (args[0].flags.pf2e.casting.level >= 2) multiplier = 1;
                        if (args[0].flags.pf2e.casting.level >= 3) multiplier = 2;
                        if (args[0].flags.pf2e.casting.level >= 4) multiplier = 3;
                        packs = packs.filter(x => x.level <= multiplier)
                        packs = packs.filter(x =>
                            // celestial, monitor, or fiend
                            ["celestial", "monitor", "fiend"].some(traitOr => x.traits.includes(traitOr))
                            // or any of the below animal names
                            || ["Eagle", "Guard Dog", "Raven", "Black Bear", "Giant Bat", "Leopard", "Tiger", "Great White Shark"].some(v => x.name === v)
                        )
                        // get the actors alignment
                        alignment = args[1].sourceToken.actor?.deity?.system?.alignment?.own ?? args[1].sourceToken.actor?.details?.alignment?.value;
                        packs = packs.filter(x => pf2eAnimations.alignmentStringToTraits(alignment, true).some(t => !x.traits.includes(t)))
                        // create string for the dialog
                        uniqueString = `<a class="content-link" draggable="true" data-pack="pf2e.spells-srd" data-uuid="Compendium.pf2e.spells-srd.B0FZLkoHsiRgw7gv" data-id="B0FZLkoHsiRgw7gv"><i class="fas fa-suitcase"></i>Summon Lesser Servitor</a>`
                        break;
                    }
                }
            }
            const summon = args[2].includes("summon-spell-") ? args[2].find(x => x.includes("summon-spell-"))?.replace('summon-spell-', '').split('-') : args[2].includes("summon-spell")
            const traitsOr = args[2].find(x => x.includes("trait-or-"))?.replace('trait-or-', '').split('-')
            const traitsAnd = args[2].find(x => x.includes("trait-and"))?.replace('trait-and-', '').split('-')
            const uncommon = args[2].find(x => x.includes("uncommon") || x.includes("rare") || x.includes("unique")) ?? game.settings.get("pf2e-jb2a-macros", "allowUncommonSummons")
            const exactLevel = args[2].find(x => x.includes("exact-level"))?.replace('exact-level-', '')
            const level = args[2].find(x => x.includes("level") && !x.includes("exact-level"))?.replace('level-', '').replaceAll("-1", "~1").split('-')
            const hasImage = game.settings.get("pf2e-jb2a-macros", "onlyImageSummons") || args[2].find(x => x.includes("has-image"))
            const source = args[2].find(x => x.includes("source"))?.replace('source-', '').split("|").map(x => x.trim()) // separate by | for multiple sources
            const name = args[2].find(x => x.includes("name"))?.replace('name-', '').split("|").map(x => x.trim()) // separate by | for multiple names
            randomCreature = args[2].includes("random-creature")
            randomAmount = args[2].find(x => x.includes("random-amount"))?.replace('random-amount-', '').split('-')

            if ([exactLevel, level, summon].filter(Boolean).length > 1) return ui.notifications.error(game.i18n.format("pf2e-jb2a-macros.notifications.tooManyArgs", { issues: "exactLevel, level, summon-spell" }));

            if (source) {
                // source filter
                packs = packs.filter(x => source.some(src => x.source === src))
            }
            if (summon) {
                multiplier = -1;
                if (args[0].flags.pf2e.casting.level >= 2) multiplier = 1;
                if (args[0].flags.pf2e.casting.level >= 3) multiplier = 2;
                if (args[0].flags.pf2e.casting.level >= 4) multiplier = 3;
                if (args[0].flags.pf2e.casting.level >= 5) multiplier = 5;
                if (args[0].flags.pf2e.casting.level >= 6) multiplier = 7;
                if (args[0].flags.pf2e.casting.level >= 7) multiplier = 9;
                if (args[0].flags.pf2e.casting.level >= 8) multiplier = 11;
                if (args[0].flags.pf2e.casting.level >= 9) multiplier = 13;
                if (args[0].flags.pf2e.casting.level >= 10) multiplier = 15;
                // level equal or less filter
                packs = packs.filter(x => x.level <= multiplier)
            }

            if (name) {
                // name filter
                packs = packs.filter(x => name.some(n => x.name === n))
            }

            if (level) {
                // level equal or greater filter
                packs = packs.filter(x => x.level >= Number(level[0].replace("~", "-")))
                // level equal or less filter
                if (level[1]) packs = packs.filter(x => x.level <= Number(level[1].replace("~", "-")))
            }
            if (exactLevel) {
                // level equal filter
                packs = packs.filter(x => x.level == Number(exactLevel.replace("~", "-")))
            }
            if (hasImage) {
                // non default icons
                packs = packs.filter(x => !x.img.includes("systems/pf2e/icons/default-icons"))
            }
            if (traitsOr) {
                // traits OR filter
                packs = packs.filter(x => traitsOr.some(traitOr => x.traits.includes(traitOr)))
            }
            if (traitsAnd) {
                // traits AND filter
                packs = packs.filter(x => traitsAnd.every(traitAnd => x.traits.includes(traitAnd)))
            }
            if (!uncommon) {
                // common rarity
                packs = packs.filter(x => x.rarity === "common")
            }

            const allTraits = (traitsOr || []).concat(traitsAnd || []).filter(n => n)

            packs = packs.sort((a, b) => b.level - a.level || a.name.localeCompare(b.name));
            sortedHow.label = [
                `<p>${pf2eAnimations.localize("pf2e-jb2a-macros.macro.summoning.player.sorted")}</p>`,
                args[2].length ? [
                    unique ? `<p>${game.i18n.format("pf2e-jb2a-macros.macro.summoning.player.unique", { unique: uniqueString })}</p>` : "",
                    summon ? `<p>${game.i18n.format("pf2e-jb2a-macros.macro.summoning.player.summonArg", { multiplier: multiplier, spellLevel: args[0].flags.pf2e.casting.level })}</p>` : "",
                    level ? `<p>${game.i18n.format("pf2e-jb2a-macros.macro.summoning.player.levelArg", { level1: level[0].replace("~", "-"), level2: level[1]?.replace("~", "-") ?? "<span style=\"font-size:18px\">∞</span>" })}</p>` : "",
                    exactLevel ? `<p>${game.i18n.format("pf2e-jb2a-macros.macro.summoning.player.levelArg", { levels: `${exactLevel}` })}</p>` : "",
                    traitsOr || traitsAnd ? `<p>${game.i18n.format("pf2e-jb2a-macros.macro.summoning.player.traitsArg", { traits: allTraits.join(", ") })}</p>` : "",
                    uncommon ? `<p>${pf2eAnimations.localize("pf2e-jb2a-macros.macro.summoning.player.uncommonArg")}</p>` : "",
                    hasImage ? `<p>${pf2eAnimations.localize("pf2e-jb2a-macros.macro.summoning.player.hasImageArg")}</p>` : "",
                    source ? `<p>${game.i18n.format("pf2e-jb2a-macros.macro.summoning.player.sourceArg", { sources: source.join(", ") })}</p>` : "",
                ].join("") : ""
            ].join("")
        }

        let inputs = [
            sortedHow,
        ]

        if (packs.length === 0) packs.push({ level: 420, name: pf2eAnimations.localize("pf2e-jb2a-macros.macro.summoning.player.nothingFound") })

        if (!randomCreature) {
            inputs.push({
                type: "select",
                label: pf2eAnimations.localize("pf2e-jb2a-macros.macro.summoning.player.creature"),
                options: packs.map(x => `${game.i18n.format("pf2e-jb2a-macros.macro.summoning.player.level", { level: x.level })} | ${x.name}`),
            })
        }

        if (!randomAmount) {
            inputs.push({
                type: "number",
                label: pf2eAnimations.localize("pf2e-jb2a-macros.macro.summoning.player.amount"),
                options: 1
            })
        }

        let options = [];
        if (!(randomAmount && randomCreature)) {
            options = await warpgate.menu(
                {
                    inputs: inputs
                },
                {
                    title: pf2eAnimations.localize("pf2e-jb2a-macros.macro.summoning.player.title")
                }
            )

            if (options.buttons === false) return;
        }

        const actor = randomCreature ?
            packs[Math.floor(Math.random() * packs.length)]
            : (await packs.filter(x => x.name === options.inputs[1].split("|")[1].trim())[0]);
        importedActor = await fromUuid(actor.uuid);
        (spawnArgs.options ??= {}).duplicates = randomAmount ? Sequencer.Helpers.random_int_between(randomAmount[0], randomAmount[1]) : options.inputs[randomCreature ? 1 : 2];
    }

    spawnArgs.origins = { tokenUuid: tokenD.data.uuid, itemUuid: args?.[1]?.itemUuid, itemName: args?.[1]?.itemName }

    spawnArgs.options = { ...spawnArgs.options, ...{ controllingActor: tokenD.actor } }

    let importedToken = importedActor.prototypeToken
    Object.assign(importedToken.flags,
        {
            "pf2e-jb2a-macros": {
                "scrollingText": game.settings.get("core", "scrollingStatusText"),
                "bloodsplatter": game.modules.get("splatter")?.active ? game.settings.get("splatter", "enableBloodsplatter") : null
            }
        }
    )

    spawnArgs.updates = { token: importedToken, actor: importedActor.data.toObject() }

    //if (importedActor.type === "character") { spawnArgs.actorName = "Dummy PC" } else if (importedActor.type === "npc") { spawnArgs.actorName = "Dummy NPC" }
    spawnArgs.actorName = `Dummy NPC (${spawnArgs.updates.token.actor.size === "sm" ? "med" : spawnArgs.updates.token.actor.size})`

    let crossHairConfig = {
        label: importedToken.name,
        interval: importedToken.height < 1 ? 4 : importedToken.height % 2 === 0 ? 1 : -1,
        lockSize: true,
        drawIcon: true,
        size: importedToken.height,
        icon: importedToken.texture.src
    }

    tokenD.actor.sheet.minimize();
    const crosshairs = await warpgate.crosshairs.show(crossHairConfig)
    if (crosshairs.cancelled) return;

    spawnArgs.location = (await canvas.scene.createEmbeddedDocuments('MeasuredTemplate', [crosshairs]))[0]

    pf2eAnimations.debug("Requesting to GM", spawnArgs)
    await warpgate.event.notify("askGMforSummon", spawnArgs)
    tokenD.actor.sheet.maximize();
}

pf2eAnimations.askGMforSummon = async function askGMforSummon(args) {
    if (!warpgate.util.isFirstGM()) return;

    // Checks if Dummy NPC/PC actors exist. If not, creates them.
    pf2eAnimations.createIfMissingDummy();
    pf2eAnimations.debug("Summoning Request", args);
    let template = await canvas.templates.get(args.location.id ?? args.location._id);

    if (!args.callbacks) args.callbacks = {};

    if (args?.callbacks?.pre) ui.notifications.error("PF2e Animations | You are providing a callbacks.pre function to the summoning macro. Please note it is going to be overriden in the module.");

    args.callbacks.pre = async (location, updates) => {
        mergeObject(updates, {
            "token": {
                "alpha": 0
            }
        })
        await game.settings.set("core", "scrollingStatusText", false);
        if (game.modules.get("splatter")?.active) game.settings.set("splatter", "enableBloodsplatter", false);
    };

    if (args?.callbacks?.post) ui.notifications.error("PF2e Animations | You are providing a callbacks.post function to the summoning macro. Please note it is going to be overriden in the module.");

    args.callbacks.post = async (location, spawnedTokenDoc, updates, iteration) => {
        const pack = game.packs.get("pf2e-jb2a-macros.Actions");
        if (!pack) ui.notifications.error(`PF2e Animations | ${pf2eAnimations.localize("pf2e-jb2a-macros.notifications.noPack")}`);

        let items = (args.options.controllingActor.items || []).filter(i => i.name.includes("Summoning Animation Template"));
        // items.push((await pack.getDocuments()).filter(i => i.name.includes("Summoning Animation Template")));

        items = items.flat();

        let token = (await fromUuid(args.origins.tokenUuid)).object;
        // 1. Actor Name (usually Dummy NPC or the name of the Eidolon)
        // 2. Copied Actor Name (what Dummy NPC takes the form OF, like Beaver)
        // 3. Item Name (usually a summoning spell, such as Summon Animal)
        // 4. Default (the default summoning animation)
        let item = items.find(i => i.name.includes(`Summoning Animation Template (${args.actorName})`))
            ?? items.find(i => i.name.includes(`Summoning Animation Template (${args?.updates?.token?.name})`))
            ?? items.find(i => i.name.includes(`Summoning Animation Template (${args.origins.itemName})`))
            ?? items.find(i => i.name === `Summoning Animation Template`)

        pf2eAnimations.debug("Summoning Animation", [token, item, spawnedTokenDoc])
        await AutomatedAnimations.playAnimation(token, item ?? { name: `Summoning Animation Template (${args.origins.itemName})` }, { targets: [spawnedTokenDoc.object] });
        if (updates.token.flags["pf2e-jb2a-macros"]?.scrollingText) await game.settings.set("core", "scrollingStatusText", true);
        if (updates.token.flags["pf2e-jb2a-macros"]?.bloodsplatter) await game.settings.set("splatter", "enableBloodsplatter", true);
        if (game.modules.get("tokenmagic-automatic-wounds")?.active) {
            // This doesn't actually work and is instead in "Opacity 1" macro but for posterity's sake, it's also included here.
            // Not sure why it works in the macro but not in here. It just doesn't.
            await TokenMagicAutomaticWounds.removeWoundsOnToken(token)
        }
    };

    new Dialog({
        title: pf2eAnimations.localize("pf2e-jb2a-macros.macro.summoning.gm.title"),
        content: game.i18n.format("pf2e-jb2a-macros.macro.summoning.gm.content", { actorName: args?.updates?.token?.name ?? args.actorName, amount: args?.options?.duplicates ?? "1", user: args.userId ? game.users.find(x => x.id === args.userId).name : pf2eAnimations.localize("pf2e-jb2a-macros.macro.summoning.gm.unknownUser") }),
        buttons: {
            button1: {
                label: "Accept",
                callback: async () => {
                    if (args.options && args.updates && args.updates.token) args.updates.token.actorData = { ownership: { [args.userId]: 3 } };

                    if (args?.updates?.actor?.token) args.updates.actor.token = args.updates.token;
                    args.location = template;

                    pf2eAnimations.debug("Summoning...", args)
                    await warpgate.spawnAt(args.location, args.actorName, args.updates, args.callbacks, args.options);
                    await template.document.delete();
                },
                icon: `<i class="fas fa-check"></i>`
            },
            button2: {
                label: "Decline",
                callback: async () => {
                    ui.notifications.info(pf2eAnimations.localize("pf2e-jb2a-macros.macro.summoning.gm.declined"));
                    await template.document.delete();
                },
                icon: `<i class="fas fa-times"></i>`
            }
        },
    }).render(true);
}