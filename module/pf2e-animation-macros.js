Hooks.on("init", () => {
	game.settings.register("pf2e-jb2a-macros", "useLocalMacros", {
		scope: "world",
		config: true,
		name: game.i18n.localize("pf2e-jb2a-macros.settings.useLocalMacros.name"),
		hint: game.i18n.localize("pf2e-jb2a-macros.settings.useLocalMacros.hint"),
		type: Boolean,
		default: false
	});
	game.settings.register("pf2e-jb2a-macros", "autoUpdate", {
		scope: "world",
		config: true,
		name: game.i18n.localize("pf2e-jb2a-macros.settings.autoUpdate.name"),
		hint: game.i18n.localize("pf2e-jb2a-macros.settings.autoUpdate.hint"),
		type: Boolean,
		default: true
	});
	game.settings.register("pf2e-jb2a-macros", "disableHitAnims", {
		scope: "world",
		config: true,
		name: game.i18n.localize("pf2e-jb2a-macros.settings.disableHitAnims.name"),
		hint: game.i18n.localize("pf2e-jb2a-macros.settings.disableHitAnims.hint"),
		type: Boolean,
		default: false
	});
	game.settings.register("pf2e-jb2a-macros", "randomHitAnims", {
		scope: "world",
		config: true,
		name: game.i18n.localize("pf2e-jb2a-macros.settings.randomHitAnims.name"),
		hint: game.i18n.localize("pf2e-jb2a-macros.settings.randomHitAnims.hint"),
		type: Boolean,
		default: false
	});
	game.settings.register("pf2e-jb2a-macros", "autoAccept", {
		scope: "client",
		config: true,
		name: game.i18n.localize("pf2e-jb2a-macros.settings.autoAccept.name"),
		hint: game.i18n.localize("pf2e-jb2a-macros.settings.autoAccept.hint"),
		type: Boolean,
		default: false
	});
	game.settings.register("pf2e-jb2a-macros", "smallTokenScale", {
		scope: "world",
		config: !game.settings.get("pf2e", "tokens.autoscale"),
		name: game.i18n.localize("pf2e-jb2a-macros.settings.smallTokenScale.name"),
		hint: game.i18n.localize("pf2e-jb2a-macros.settings.smallTokenScale.hint"),
		type: Number,
		default: 0.8,
		range: {
			min: 0.2,
			max: 3,
			step: 0.1
		}
	});
	game.settings.register("pf2e-jb2a-macros", "debug", {
		scope: "client",
		config: true,
		name: game.i18n.localize("pf2e-jb2a-macros.settings.debug.name"),
		hint: game.i18n.localize("pf2e-jb2a-macros.settings.debug.hint"),
		type: Boolean,
		default: false
	});
	game.settings.register("pf2e-jb2a-macros", "version-previous", {
		scope: "world",
		type: String,
		default: "0"
	});
	game.settings.register("pf2e-jb2a-macros", "dummyPCId", {
		scope: "world",
		type: String,
		default: ""
	});
	game.settings.register("pf2e-jb2a-macros", "dummyNPCId", {
		scope: "world",
		type: String,
		default: ""
	});
	game.settings.registerMenu("pf2e-jb2a-macros", "autorecUpdate", {
		name: game.i18n.localize("pf2e-jb2a-macros.settings.autorecUpdate.name"),
		hint: game.i18n.localize("pf2e-jb2a-macros.settings.autorecUpdate.hint"),
		label: game.i18n.localize("pf2e-jb2a-macros.settings.autorecUpdate.label"),
		icon: "fa-solid fa-wrench",
		type: autorecUpdateFormApplication,
		restricted: true
	});
});

Hooks.on("ready", () => {
	console.log("PF2e Animations Macros v" + game.modules.get("pf2e-jb2a-macros").version + " loaded.");
	// Warn if no JB2A is found and disable the module.
	if (!game.modules.get("JB2A_DnD5e")?.active && !game.modules.get("jb2a_patreon")?.active) {
		ui.notifications.error(game.i18n.localize("pf2e-jb2a-macros.notifications.noJB2A"), { permanent: true });
		return;
	}

	if (game.settings.get("pf2e-jb2a-macros", "version-previous") !== game.modules.get("pf2e-jb2a-macros").version) {
		ui.notifications.info(game.i18n.format("pf2e-jb2a-macros.notifications.update", {version: game.modules.get("pf2e-jb2a-macros").version}))
		game.settings.set("pf2e-jb2a-macros", "version-previous", game.modules.get("pf2e-jb2a-macros").version)
		if (game.user.isGM && game.settings.get("pf2e-jb2a-macros", "autoUpdate")) new autorecUpdateFormApplication().render(true)
	}

	// Create an event for summoning macros.
	warpgate.event.watch("askGMforSummon", (eventData) => { pf2eAnimations.askGMforSummon(eventData) })

	// GM-Only stuff.
	if (!game.user.isGM) return;
	if (game.settings.get("pf2e", "tokens.autoscale")) game.settings.set("pf2e-jb2a-macros", "smallTokenScale", 0.8);
});

Hooks.on("createChatMessage", async (data) => {
	if (game.user.id !== data.user.id) return;
	let targets = data?.flags?.pf2e?.target?.token ?? Array.from(game.user.targets);
	targets = [targets].flat()
	let token = data.token ?? canvas.tokens.controlled[0];
	let flavor = data.flavor ?? null;
	let args = data ?? null;

	// Persistent Damage Matches
	if (/Received Fast Healing|Persistent \w+ damage/.test(flavor)) {
		if (game.modules.get("pf2e-persistent-damage")?.active) {
			pf2eAnimations.debug("Persistent Damage / Healing", data);
			return pf2eAnimations.runMacro('Persistent Conditions', args)
		} else if (!game.modules.get("pf2e-persistent-damage")?.active) {
			pf2eAnimations.debug("No \"PF2e Persistent Damage\" module found!");
			return ui.notifications.error(game.i18n.localize("pf2e-jb2a-macros.notifications.noPersistentDamage"));
		}
	}
	// Default Matches
	if (data.isDamageRoll && /Sneak Attack/.test(flavor)) {
		pf2eAnimations.debug("Sneak Attack", data);
		let [sneak] = data.token._actor.items.filter(i => i.name === "Sneak Attack")
		// Modify sneak to not be a feat because AA no like feat
		sneak.type = "strike"
		await AutomatedAnimations.playAnimation(token, sneak, { targets: targets })
		// Go back to not break opening the sheet, apparently
		sneak.type = "feat"
	}
	// Attack Matches
	if (data.flags.pf2e?.context?.type === "attack-roll") {
		if (game.settings.get("pf2e-jb2a-macros", "disableHitAnims")) return;
		const degreeOfSuccess = pf2eAnimations.degreeOfSuccessWithRerollHandling(data);
		const pack = game.packs.get("pf2e-jb2a-macros.Actions");
		if (!pack) ui.notifications.error(`PF2e Animations Macros | ${game.i18n.localize("pf2e-jb2a-macros.notifications.noPack")}`);

		let items = data.token._actor.items.filter(i => i.name.includes("Attack Animation Template"));
		if (Object.keys(items).length === 0) {
			items = (await pack.getDocuments()).filter(i => i.name.includes("Attack Animation Template"))
		} else if (Object.keys(items).length < 4) {
			items.push((await pack.getDocuments()).filter(i => i.name.includes("Attack Animation Template")))
		}
		items = items.flat()
		let item = ""
		switch (degreeOfSuccess) {
			case "criticalSuccess":
				item = items.find(i => i.name.includes("(Critical Success)"))
				pf2eAnimations.debug("\"On Hit/Miss\" Critical Success animation", { token, targets, item })
				AutomatedAnimations.playAnimation(token, item, { playOnMiss: true, targets: targets, hitTargets: targets }); break;
			case "criticalFailure":
				item = items.find(i => i.name.includes("(Critical Failure)"))
				pf2eAnimations.debug("\"On Hit/Miss\" Critical Failure animation", { token, targets, item })
				AutomatedAnimations.playAnimation(token, item, { playOnMiss: true, targets: targets, hitTargets: !game.settings.get("pf2e-jb2a-macros", "randomHitAnims") ? targets : [] }); break;
			case "failure":
				item = items.find(i => i.name.includes("(Failure)"))
				pf2eAnimations.debug("\"On Hit/Miss\" Failure animation", { token, targets, item })
				AutomatedAnimations.playAnimation(token, item, { playOnMiss: true, targets: targets, hitTargets: !game.settings.get("pf2e-jb2a-macros", "randomHitAnims") ? targets : [] }); break;
			case "success":
				item = items.find(i => i.name.includes("(Success)"))
				pf2eAnimations.debug("\"On Hit/Miss\" Success animation", { token, targets, item })
				AutomatedAnimations.playAnimation(token, item, { playOnMiss: true, targets: targets, hitTargets: targets }); break;
		}
	}
});

Hooks.on("preUpdateItem", (data, changes) => {
	pf2eAnimations.debug("Running Equipment Changes Macro.", { data, changes });
	pf2eAnimations.runMacro('Equipment Changes', { data, changes })
});

Hooks.on("AutomatedAnimations.metaData", (metaData) => {
	if (metaData.name === "PF2e Animation Macros") {
		ui.notifications.notify(`${metaData.name} (v${metaData.moduleVersion}) | Animation Version: ${metaData.version}<hr>${game.i18n.localize("pf2e-jb2a-macros.notifications.metaData")}`);
	};
});

let pf2eAnimations = {}

pf2eAnimations.debug = function debug(msg = "", args = "") {
	if (game.settings.get("pf2e-jb2a-macros", "debug")) console.log(`DEBUG | PF2e Animations Macros | ${msg}`, args);
}

// https://stackoverflow.com/a/13627586/12227966
pf2eAnimations.ordinalSuffixOf = function ordinalSuffixOf(i) {
	var j = i % 10,
		k = i % 100;
	if (j == 1 && k != 11) {
		return i + "st";
	}
	if (j == 2 && k != 12) {
		return i + "nd";
	}
	if (j == 3 && k != 13) {
		return i + "rd";
	}
	return i + "th";
}

// Thanks @ xdy for this function.
pf2eAnimations.runMacro = async function runJB2Apf2eMacro(
	macroName,
	args,
	compendiumName = "pf2e-jb2a-macros.Macros"
) {
	const useLocal = game.settings.get("pf2e-jb2a-macros", "useLocalMacros");
	const pack = game.packs.get(compendiumName);
	if (pack) {
		const macro_data = useLocal ? await game.macros.getName(macroName) : (await pack.getDocuments()).find((i) => i.name === macroName);

		if (macro_data) {
			const temp_macro = new Macro(macro_data.toObject());
			temp_macro.ownership.default = CONST.DOCUMENT_PERMISSION_LEVELS.OWNER;
			pf2eAnimations.debug(`Running ${macroName} macro`, { macro_data, temp_macro, args });
			// https://github.com/MrVauxs/FoundryVTT-Sequencer/blob/4d1c63102f4f40878a6c13224918d499a6390547/scripts/module/sequencer.js#L109
			const version = game.modules.get("advanced-macros")?.version;
			const bugAdvancedMacros = game.modules.get("advanced-macros")?.active
				&& isNewerVersion(version.startsWith('v') ? version.slice(1) : version, "1.18.2")
				&& !isNewerVersion(version.startsWith('v') ? version.slice(1) : version, "1.19.1");
			if (bugAdvancedMacros) {
				await temp_macro.execute([args]);
			} else {
				await temp_macro.execute(args);
			}
		} else {
			useLocal ?
				ui.notifications.error("Macro " + macroName + " not found in the world (if you have enabled \"Use Local Macros\" setting, disable it or import the macros in it's description).")
				: ui.notifications.error("Macro " + macroName + " not found in " + compendiumName + ".")
		}
	} else {
		ui.notifications.error("Compendium " + compendiumName + " not found");
	}
};

// As above @ xdy.
pf2eAnimations.degreeOfSuccessWithRerollHandling = function degreeOfSuccessWithRerollHandling(message) {
	const flags = message.flags.pf2e;
	let degreeOfSuccess = flags.context?.outcome ?? "";
	if (flags?.context?.isReroll) {
		const match = message.flavor?.match('Result: <span .*? class="(.*?)"');
		if (match && match[1]) {
			degreeOfSuccess = match[1];
		}
	}
	return degreeOfSuccess;
}

// Get token data and token scale.
/**
 * @param {Array} args Array of arguments.
 * @returns {Array} tokenD and tokenScale.
 */
pf2eAnimations.macroHelpers = function vauxsMacroHelpers(args) {
	args = args || [];
	// if (args.length === 1 && Array.isArray(args[0])) args = args.flat(); // Send help. I'm being flattened.
	pf2eAnimations.debug("Vaux's Macro Helpers", args);
	const tokenD = args[1]?.sourceToken ?? canvas.tokens.controlled[0];
	if (!tokenD) { ui.notifications.error(game.i18n.localize("pf2e-jb2a-macros.notifications.noToken")); return; }
	const tokenScale = tokenD.actor.size === "sm" ? game.settings.get("pf2e-jb2a-macros", "smallTokenScale") : 1.0;
	return [tokenD, tokenScale];
}

// Creates dummy NPC and PC actors for summoning purposes.
// Keeps the IDs of these actors in settings. If one of them is missing, it will create a new one and save the new ones ID.
pf2eAnimations.createIfMissingDummy = async function createIfMissingDummy() {
	let message = `PF2e Animations Macros | ${game.i18n.localize("pf2e-jb2a-macros.notifications.noDummy")}`;
	npcActor = game.actors.get(game.settings.get("pf2e-jb2a-macros", "dummyNPCId"));
	// pcActor = game.actors.get(game.settings.get("pf2e-jb2a-macros", "dummyPCId"));
	if (!npcActor) {
		message += ` ${game.i18n.localize("pf2e-jb2a-macros.notifications.creatingDummy")} `;
		npcActor = await Actor.create({
			name: "Dummy NPC",
			type: "npc",
			img: "icons/svg/cowled.svg",
			data: {
				attributes: {
					hp: {
						max: 999,
						value: 999,
						base: 999,
						slug: "hp"
					}
				}
			}
		})
		await game.settings.set("pf2e-jb2a-macros", "dummyNPCId", npcActor.id);
		ui.notifications.info(message);
	}
	/*
	if (!pcActor) {
		message += " Creating dummy PC... ";
		pcActor = await Actor.create({
			name: "Dummy PC",
			type: "character",
			img: "icons/svg/aura.svg",
			data: {
				attributes: {
					hp: {
						max: 999,
						value: 999,
						base: 999,
						slug: "hp"
					}
				}
			}
		})
		await game.settings.set("pf2e-jb2a-macros", "dummyPCId", pcActor.id);
	}
	*/
}

/**
 * @param {string} alignment Alignment as a String ex. CG.
 * @returns {Array} traits Array of traits.
 */
pf2eAnimations.alignmentStringToTraits = function alignmentStringToTraits(alignment) {
	// returns an array of traits for the alignment string
	// e.g. "LG" -> ["Lawful", "Good"]
	let traits = [];
	if (alignment.includes("L")) traits.push("lawful");
	if (alignment.includes("N")) traits.push("neutral");
	if (alignment.includes("C")) traits.push("chaotic");
	if (alignment.includes("G")) traits.push("good");
	if (alignment.includes("E")) traits.push("evil");
	return traits;
}

/**
 *
 * @param {Object} args Args passed down in the macro.
 * @param {Object} importedActor Actor to spawn.
 * @param {Object} spawnArgs Arguments to be passed down to Warpgate spawnAt function, order insensitive.
 */
pf2eAnimations.playerSummons = async function playerSummons({ args = [], importedActor = {}, spawnArgs = {} }) {
	const [tokenD, tokenScale] = pf2eAnimations.macroHelpers(args)

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
			label: game.i18n.localize("pf2e-jb2a-macros.macro.summoning.player.label")
		}

		if (args && args[2]?.length && args[2][0] === "summon-spell") {
			const traitsOr = args[2][1]?.replace('trait-', '').split('-')
			const traitsAnd = args[2][2]?.replace('trait-and-', '').split('-')

			let multiplier = -1;
			if (args[0].flags.pf2e.casting.level >= 2) multiplier = 1;
			if (args[0].flags.pf2e.casting.level >= 3) multiplier = 2;
			if (args[0].flags.pf2e.casting.level >= 4) multiplier = 3;
			if (args[0].flags.pf2e.casting.level >= 5) multiplier = 5;
			if (args[0].flags.pf2e.casting.level >= 6) multiplier = 7;
			if (args[0].flags.pf2e.casting.level >= 7) multiplier = 9;
			if (args[0].flags.pf2e.casting.level >= 8) multiplier = 11;
			if (args[0].flags.pf2e.casting.level >= 9) multiplier = 13;
			if (args[0].flags.pf2e.casting.level >= 10) multiplier = 15;
			packs = packs.filter(
				// level equal or less filter
				x => (x.level <= multiplier)
					// traits OR filter
					&& (traitsOr ? traitsOr.some(traitOr => x.traits.includes(traitOr)) : true)
					// traits AND filter
					&& (traitsAnd ? traitsAnd.some(traitAnd => x.traits.includes(traitAnd)) : true)
			)
			packs = packs.sort((a, b) => {
				return a.level < b.level ? 1 : -1;
			});
			sortedHow.label = game.i18n.format("pf2e-jb2a-macros.macro.summoning.player.sortedByLevel", {multiplier: multiplier, spellLevel: pf2eAnimations.ordinalSuffixOf(args[0].flags.pf2e.casting.level)});
		} else {
			packs = packs.sort((a, b) => a.name.localeCompare(b.name));
			sortedHow.label = game.i18n.localize("pf2e-jb2a-macros.macro.summoning.player.sortedAlphabetically");
		}

		const options = await warpgate.menu(
			{
				inputs: [
					sortedHow,
					{
						type: "select",
						label: game.i18n.localize("pf2e-jb2a-macros.macro.summoning.player.creature"),
						options: packs.map(x => x.name)
					},
					{
						type: "number",
						label: game.i18n.localize("pf2e-jb2a-macros.macro.summoning.player.amount"),
						options: 1
					}
				]
			},
			{
				title: game.i18n.localize("pf2e-jb2a-macros.macro.summoning.player.title")
			}
		)

		if (options.buttons === false) return;

		const actor = await packs.filter(x => x.name === options.inputs[1])[0];
		importedActor = await fromUuid(actor.uuid); // ?? await game.packs.get(actor.compendium ?? actor.uuid.split(".")[1] + "." + actor.uuid.split(".")[2]).getDocument(actor._id ?? actor.id ?? actor.uuid.split(".")[3]);
		(spawnArgs.options ??= {}).duplicates = options.inputs[2];
	}

	spawnArgs.origins = { tokenUuid: tokenD.data.uuid, itemUuid: args?.[1].itemUuid, itemName: args?.[1].itemName }

	spawnArgs.options = { ...spawnArgs.options, ...{ controllingActor: tokenD.actor } }

	let importedToken = importedActor.prototypeToken

	spawnArgs.updates = { token: importedToken, actor: importedActor.data.toObject() }

	//if (importedActor.type === "character") { spawnArgs.actorName = "Dummy PC" } else if (importedActor.type === "npc") { spawnArgs.actorName = "Dummy NPC" }
	spawnArgs.actorName = "Dummy NPC"

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

	if (args?.callbacks?.pre) ui.notifications.error("PF2e Animation Macros | You are providing a callbacks.pre function to the summoning macro. Please note it is going to be overriden in the module.");

	args.callbacks.pre = async (location, updates) => {
		mergeObject(updates, {
			token: {
				alpha: 0
			}
		})
	};

	if (args?.callbacks?.post) ui.notifications.error("PF2e Animation Macros | You are providing a callbacks.post function to the summoning macro. Please note it is going to be overriden in the module.");

	args.callbacks.post = async (location, spawnedTokenDoc, updates, iteration) => {
		const pack = game.packs.get("pf2e-jb2a-macros.Actions");
		if (!pack) ui.notifications.error(`PF2e Animations Macros | ${game.i18n.localize("pf2e-jb2a-macros.notifications.noPack")}`);

		let items = (args.options.controllingActor.items || []).filter(i => i.name.includes("Summoning Animation Template"));
		items.push((await pack.getDocuments()).filter(i => i.name.includes("Summoning Animation Template")));

		items = items.flat();

		let token = (await fromUuid(args.origins.tokenUuid)).object;
		// 1. Actor Name (usually Dummy NPC or the name of the Eidolon)
		// 2. Copied Actor Name (what Dummy NPC takes the form OF, like Beaver)
		// 3. Item Name (usually a summoning spell, such as Summon Animal)
		// 4. Default (the default summoning animation)
		let item = items.find(i => i.name.includes(`Summoning Animation Template (${args.actorName})`)) ?? items.find(i => i.name.includes(`Summoning Animation Template (${args?.updates?.token?.name})`)) ?? items.find(i => i.name.includes(`Summoning Animation Template (${args.origins.itemName})`)) ?? items.find(i => i.name === `Summoning Animation Template`)

		pf2eAnimations.debug("Summoning Animation", [token, item, spawnedTokenDoc])
		await AutomatedAnimations.playAnimation(token, item, { targets: [spawnedTokenDoc.object] });
	};

	new Dialog({
		title: game.i18n.localize("pf2e-jb2a-macros.macro.summoning.gm.title"),
		content: game.i18n.format("pf2e-jb2a-macros.macro.summoning.gm.content", {actorName: args?.updates?.token?.name ?? args.actorName, amount: args?.options?.duplicates ?? "1", user: args.userId ? game.users.find(x => x.id === args.userId).name : game.i18n.localize("pf2e-jb2a-macros.macro.summoning.gm.unknownUser")}),
		buttons: {
			button1: {
				label: "Accept",
				callback: async () => {
					if (args.options && args.updates && args.updates.token) args.updates.token.actorData = { ownership: { [args.userId]: 3 } };

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
					ui.notifications.info(game.i18n.localize("pf2e-jb2a-macros.macro.summoning.gm.declined"));
					await template.document.delete();
				},
				icon: `<i class="fas fa-times"></i>`
			}
		},
	}).render(true);
}

pf2eAnimations.getJSON = async function getJSON(url) {
	const response = await fetch(url)
	const json = await response.json();
	return json;
}

pf2eAnimations.generateAutorecUpdate = async function generateAutorecUpdate(quiet = true) {
	if (quiet) console.group("PF2e Animations Macros | Autorecognition Menu Check");
	const autorec = await pf2eAnimations.getJSON("modules/pf2e-jb2a-macros/module/autorecs/autorec.json");
	let settings = {}
	settings.melee = [...new Map(await game.settings.get('autoanimations', 'aaAutorec-melee').map(v => [v.id, v])).values()]
	settings.range = [...new Map(await game.settings.get('autoanimations', 'aaAutorec-range').map(v => [v.id, v])).values()]
	settings.ontoken = [...new Map(await game.settings.get('autoanimations', 'aaAutorec-ontoken').map(v => [v.id, v])).values()]
	settings.templatefx = [...new Map(await game.settings.get('autoanimations', 'aaAutorec-templatefx').map(v => [v.id, v])).values()]
	settings.preset = [...new Map(await game.settings.get('autoanimations', 'aaAutorec-preset').map(v => [v.id, v])).values()]
	settings.aura = [...new Map(await game.settings.get('autoanimations', 'aaAutorec-aura').map(v => [v.id, v])).values()]
	settings.aefx = [...new Map(await game.settings.get('autoanimations', 'aaAutorec-aefx').map(v => [v.id, v])).values()]

	let updatedEntries = { melee: [], range: [], ontoken: [], templatefx: [], aura: [], preset: [], aefx: [], }
	let missingEntries = { melee: [], range: [], ontoken: [], templatefx: [], aura: [], preset: [], aefx: [], }
	let custom = { melee: [], range: [], ontoken: [], templatefx: [], aura: [], preset: [], aefx: [], }
	let same = { melee: [], range: [], ontoken: [], templatefx: [], aura: [], preset: [], aefx: [], }
	let customNew = { melee: [], range: [], ontoken: [], templatefx: [], aura: [], preset: [], aefx: [], }
	let removed = { melee: [], range: [], ontoken: [], templatefx: [], aura: [], preset: [], aefx: [], }

	// Function to retrieve full version from label
	function getFullVersion(label, array) {
		return array.find(e => e.label === label)
	}

	for (const key of Object.keys(settings)) {
		autorec[key].map(x => x.label).forEach(async x => {
			// If an entry of the same name exists...
			if (settings[key].map(x => x.label).some(e => e === x)) {
				const xEntry = getFullVersion(x, settings[key])

				/* (Bang Bang, you're a Boolean) */
				if (!!xEntry.metaData && (xEntry.metaData.name === "PF2e Animation Macros" || xEntry.metaData?.default)) {
					// Entry is from PF2e Animation Macros, but the same or higher version. Skip.
					if (xEntry?.metaData?.version >= getFullVersion(x, autorec[key]).metaData.version) return same[key].push(xEntry);

					// Entry is from PF2e Animation Macros, but outdated. Update.
					return updatedEntries[key].push(getFullVersion(x, autorec[key]))
				} else {
					// Entry does exist but it's not from PF2e Animation Macros. Add it to custom.
					return custom[key].push(xEntry)
				}
			} else {
				// Entry does not exist, add it.
				return missingEntries[key].push(getFullVersion(x, autorec[key]))
			}
		});
		settings[key].map(x => { return { label: x.label, metaData: x.metaData } }).forEach(async y => {
			if (!autorec[key].map(x => { return { label: x.label, metaData: x.metaData } }).some(e => e.label === y.label)) {
				if (y.metaData?.default || (y?.metaData?.name === "PF2e Animation Macros" && y?.metaData?.version < autorec.melee[0].metaData.version)) {
					// Entry does not exist in autorec, but is from PF2e Animation Macros and of a lower version. Add them to removed.
					return removed[key].push(getFullVersion(y.label, settings[key]))
				} else {
					// Entry does not exist in autorec.json. Add it to customNew.
					return customNew[key].push(getFullVersion(y.label, settings[key]));
				}
			}
		})
	}
	if (quiet) console.info("The following effects did not exist before. They will be ADDED.", missingEntries)
	if (quiet) console.info("The following effects can be updated from a previous version of 'PF2e Animation Macros'. They will be UPDATED.", updatedEntries)
	if (quiet) console.info("The following effects no LONGER exist in PF2e Animation Macros. They will be DELETED.", removed)
	if (quiet) console.info("The following effects do not exist in PF2e Animation Macros. They will be IGNORED.", customNew)
	if (quiet) console.info("The following effects cannot be added or updated, due to them already existing from an unknown source. They will be IGNORED.", custom)
	if (quiet) console.info("The following effects have no updates.", same)
	if (quiet) console.groupEnd()

	// Create a list of all effects done.
	let missingEntriesList = []
	let updatedEntriesList = []
	let customEntriesList = []
	let customNewEntriesList = []
	let removedEntriesList = []
	for (const key of Object.keys(settings)) {
		missingEntriesList.push(missingEntries[key].map(x => `${x.label} <i class="pf2e-animations-muted">(${key})</i>`))
		updatedEntriesList.push(updatedEntries[key].map(x => `${x.label} <i class="pf2e-animations-muted">(${key})</i>`))
		removedEntriesList.push(removed[key].map(x => `${x.label} <i class="pf2e-animations-muted">(${key})</i>`))
		customEntriesList.push(custom[key].map(x => `${x.label} <i class="pf2e-animations-muted">(${key})</i>`))
		customNewEntriesList.push(customNew[key].map(x => `${x.label} <i class="pf2e-animations-muted">(${key})</i>`))
	}
	missingEntriesList = missingEntriesList.flat().sort()
	updatedEntriesList = updatedEntriesList.flat().sort()
	removedEntriesList = removedEntriesList.flat().sort()
	customEntriesList = customEntriesList.flat().sort()
	customNewEntriesList = customNewEntriesList.flat().sort()

	let newSettingsDirty = { melee: [], range: [], ontoken: [], templatefx: [], aura: [], preset: [], aefx: [], }
	let newSettings = { melee: [], range: [], ontoken: [], templatefx: [], aura: [], preset: [], aefx: [], }
	for (const key of Object.keys(settings)) {
		// Merge all the arrays into one.
		newSettingsDirty[key] = [...missingEntries[key], ...updatedEntries[key], ...custom[key], ...same[key], ...customNew[key]]
		newSettings[key] = [...new Map(newSettingsDirty[key].map(v => [v.id, v])).values()].sort((a, b) => a.label.localeCompare(b.label))
	}
	// Adds the current Autorec version into the menu to ensure it will not get wiped going through the Autorec Merge scripts
	newSettings.version = await game.settings.get('autoanimations', 'aaAutorec').version
	return { newSettings, missingEntriesList, updatedEntriesList, customEntriesList, removedEntriesList, customNewEntriesList }
}

pf2eAnimations.generateAutorecUpdateHTML = async function generateAutorecUpdateHTML() {
	const { newSettings, missingEntriesList, updatedEntriesList, customEntriesList, removedEntriesList, customNewEntriesList } = await pf2eAnimations.generateAutorecUpdate(false)
	let html = `<h1 style="text-align: center; font-weight: bold;">PF2e Animations Macros Update Menu</h1>`

	if (missingEntriesList.length || updatedEntriesList.length || customEntriesList.length || removedEntriesList.length || (game.settings.get("pf2e-jb2a-macros", "debug") && customNewEntriesList.length)) {
		if (removedEntriesList.length) {
			html += `
			<div class="pf2e-animations-autorec-update-child">
				<p class="pf2e-animations-autorec-update-text">${game.i18n.localize("pf2e-jb2a-macros.updateMenu.deleted")}</p>
				<ul class="pf2e-animations-autorec-update-ul">
					${removedEntriesList.map(x => `<li>${x}</li>`).join("")}
				</ul>
			</div>
			`
		}
		if (missingEntriesList.length) {
			html += `
			<div class="pf2e-animations-autorec-update-child">
				<p class="pf2e-animations-autorec-update-text">${game.i18n.localize("pf2e-jb2a-macros.updateMenu.added")}</p>
				<ul class="pf2e-animations-autorec-update-ul">
					${missingEntriesList.map(x => `<li>${x}</li>`).join("")}
				</ul>
			</div>
			`
		}
		if (customEntriesList.length) {
			html += `
			<div class="pf2e-animations-autorec-update-child">
				<p class="pf2e-animations-autorec-update-text">${game.i18n.localize("pf2e-jb2a-macros.updateMenu.custom")}</p>
				<p class="pf2e-animations-autorec-update-text">${game.i18n.localize("pf2e-jb2a-macros.updateMenu.customHint")}</p>
				<ul class="pf2e-animations-autorec-update-ul">
					${customEntriesList.map(x => `<li>${x}</li>`).join("")}
				</ul>
			</div>
			`
		}
		if (updatedEntriesList.length) {
			html += `
			<div class="pf2e-animations-autorec-update-child">
				<p class="pf2e-animations-autorec-update-text">${game.i18n.localize("pf2e-jb2a-macros.updateMenu.updated")}</p>
				<ul class="pf2e-animations-autorec-update-ul">
					${updatedEntriesList.map(x => `<li>${x}</li>`).join("")}
				</ul>
			</div>
			`
		}
		if (game.settings.get("pf2e-jb2a-macros", "debug") && customNewEntriesList.length) {
			html += `
			<div class="pf2e-animations-autorec-update-child">
				<p class="pf2e-animations-autorec-update-text"><strong>[DEBUG]</strong> ${game.i18n.localize("pf2e-jb2a-macros.updateMenu.debugCustom")}</p>
				<ul class="pf2e-animations-autorec-update-ul">
					${customNewEntriesList.map(x => `<li>${x}</li>`).join("")}
				</ul>
			</div>
			`
		}
		html += `<p style="text-align: center; font-size: 1.2em; font-weight: bold;">${game.i18n.localize("pf2e-jb2a-macros.updateMenu.warning")}</p>`
	} else {
		html = `<p class="pf2e-animations-autorec-update-text">${game.i18n.localize("pf2e-jb2a-macros.updateMenu.nothing")}</p>`
	}
	return html
}

class autorecUpdateFormApplication extends FormApplication {
	constructor() {
		super();
	}

	async html() {
		return await pf2eAnimations.generateAutorecUpdateHTML()
	}

	async settings() {
		return await pf2eAnimations.generateAutorecUpdate()
	}

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['form'],
			popOut: true,
			template: `modules/pf2e-jb2a-macros/module/autorecUpdateMenu.html`,
			id: 'autorecUpdateMenu',
			title: 'PF2e Animations Update',
			resizable: true,
		});
	}

	async getData() {
		// Send data to the template
		return { literallyEverything: await this.html() };
	}

	async activateListeners(html) {
		const { newSettings, missingEntriesList, updatedEntriesList, customEntriesList, removedEntriesList } = await this.settings()
		if (!(missingEntriesList.length || updatedEntriesList.length || customEntriesList.length || removedEntriesList.length)) $('[name="update"]').remove()
		super.activateListeners(html);
	}

	async _updateObject(event) {
		$(".pf2e-animations-autorec-update-buttons").attr("disabled", true)
		if (event.submitter.name === "update") {
			console.group("PF2e Animations Macros | Autorecognition Menu Update");
			const { newSettings, missingEntriesList, updatedEntriesList, customEntriesList, removedEntriesList } = await this.settings();
			if (!(missingEntriesList.length || updatedEntriesList.length || customEntriesList.length || removedEntriesList.length)) return console.log("Nothing to update!");
			/*
			for (const key of Object.keys(newSettings)) {
				await game.settings.set('autoanimations', `aaAutorec-${key}`, newSettings[key])
				console.log(`Updated aaAutorec-${key} with:`, newSettings[key])
			};
			*/
			// Passing submitAll: true to ensure menus are updated
			AutomatedAnimations.AutorecManager.overwriteMenus(JSON.stringify(newSettings), { submitAll: true });
		}
	}
}

window.autorecUpdateFormApplication = autorecUpdateFormApplication;