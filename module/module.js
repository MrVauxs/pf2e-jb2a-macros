const versionsWithAutorecUpdates = ["1.9.2", "1.10.0", "1.11.2", "1.12.0", "1.12.1"];

Hooks.on("init", () => {
	game.settings.register("pf2e-jb2a-macros", "useLocalMacros", {
		scope: "world",
		config: true,
		name: "Use Local Macros",
		hint: "Certain animations are not configurable in Automated Animations Autorecognition Settings.\nEnable this to use the local macros instead of the ones in the compendium for these specific animations.\nCurrent Animations that are under this setting include: Equipment Changes",
		type: Boolean,
		default: false
	});
	game.settings.register("pf2e-jb2a-macros", "disableHitAnims", {
		scope: "world",
		config: true,
		name: 'Disable "On Hit or Miss" Animations',
		hint: "While you can remove these animations from AA's Autorecognition Menu, it will likely come back when you update it. Enable this to disable these animations.",
		type: Boolean,
		default: false
	});
	game.settings.register("pf2e-jb2a-macros", "randomHitAnims", {
		scope: "world",
		config: true,
		name: `Make "On Hit or Miss" miss animations appear Off-Target`,
		hint: "Make miss and critical miss animations appear at a random spot near the missed target token.",
		type: Boolean,
		default: false
	});
	game.settings.register("pf2e-jb2a-macros", "smallTokenScale", {
		scope: "world",
		config: !game.settings.get("pf2e", "tokens.autoscale"),
		name: `Default Scale for Small Tokens`,
		hint: "Determines what scale the animations assume Small characters are. If you use the \"Scale tokens according to size\" Pathfinder 2e system setting, this setting is disabled and assumed to be 0.8.",
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
		name: `Debug Mode`,
		hint: "Enables console logs of what PF2e x JB2A Macros module is doing.",
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
});

Hooks.on("ready", () => {
	// Warn if no JB2A is found and disable the module.
	if (!game.modules.get("JB2A_DnD5e")?.active && !game.modules.get("jb2a_patreon")?.active) {
		ui.notifications.error(`You need a <a href="https://jb2a.com/home/content-information/#free_library">JB2A module</a> enabled to use with PF2e x JB2A Macros module!`, { permanent: true });
		return;
	}
	// Create an event for summoning macros.
	warpgate.event.watch("askGMforSummon", (eventData) => { askGMforSummon(eventData) })

	// GM-Only stuff.
	if (!game.user.isGM) return;

	// Update version number. Check if it has new autorecs. Notify if has relevant info to the user.
	const version = game.modules.get("pf2e-jb2a-macros").version;
	if (game.settings.get("pf2e", "tokens.autoscale")) game.settings.set("pf2e-jb2a-macros", "smallTokenScale", 0.8);
	if (isNewerVersion(version, game.settings.get("pf2e-jb2a-macros", "version-previous"))) {
		game.settings.set("pf2e-jb2a-macros", "version-previous", version);
		let previousVersion = game.settings.get("pf2e-jb2a-macros", "version-previous")
		let updateAutorec = versionsWithAutorecUpdates.includes(version) ? `<hr>This new version has also updated the autorec. A new version can be downloaded <a href="https://github.com/MrVauxs/pf2e-jb2a-macros/releases/latest/download/autorec.json">here</a>, and be seen <a href="https://github.com/MrVauxs/pf2e-jb2a-macros/releases/latest">here</a>.` : ""
		ui.notifications.info(`Updated from PF2e x JB2A Macros v${previousVersion} to v${version} ${updateAutorec}`, { permanent: true });
	} else console.log("PF2e x JB2A Macros v" + version + " loaded.");
});

function debug(msg = "", args = "") {
	if (game.settings.get("pf2e-jb2a-macros", "debug")) console.log(`DEBUG | PF2e x JB2A Macros | ${msg}`, args)
}

// https://stackoverflow.com/a/13627586/12227966
function ordinalSuffixOf(i) {
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
async function runJB2Apf2eMacro(
	macroName,
	args,
	compendiumName = "pf2e-jb2a-macros.Macros"
) {
	const useLocal = game.settings.get("pf2e-jb2a-macros", "useLocalMacros")
	const pack = game.packs.get(compendiumName);
	if (pack) {
		const macro_data = useLocal ? await game.macros.getName(macroName).toObject() : (await pack.getDocuments()).find((i) => i.name === macroName)?.toObject();

		if (macro_data) {
			const temp_macro = new Macro(macro_data);
			temp_macro.ownership.default = CONST.DOCUMENT_PERMISSION_LEVELS.OWNER;
			temp_macro.execute(args);
		} else {
			ui.notifications.error("Macro " + macroName + " not found");
		}
	} else {
		ui.notifications.error("Compendium " + compendiumName + " not found");
	}
};

// As above @ xdy.
function degreeOfSuccessWithRerollHandling(message) {
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
async function vauxsMacroHelpers(args = []) {
	const tokenD = args[1]?.sourceToken ?? canvas.tokens.controlled[0];
	if (!tokenD) { ui.notifications.error("No source token found."); return; }
	const tokenScale = tokenD.actor.size === "sm" ? game.settings.get("pf2e-jb2a-macros", "smallTokenScale") : 1.0;
	return [tokenD, tokenScale];
}

// Creates dummy NPC and PC actors for summoning purposes.
// Keeps the IDs of these actors in settings. If one of them is missing, it will create a new one and save the new ones ID.
async function createIfMissingDummy() {
	let message = "PF2e x JB2A Macros | Missing dummy actors for summoning macros.";
	npcActor = game.actors.get(game.settings.get("pf2e-jb2a-macros", "dummyNPCId"));
	// pcActor = game.actors.get(game.settings.get("pf2e-jb2a-macros", "dummyPCId"));
	if (!npcActor) {
		message += " Creating dummy NPC... ";
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
	if (message.includes("PC")) ui.notifications.info(message);
}

function alignmentStringToTraits (alignment) {
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
async function playerSummons({ args = [], importedActor = {}, spawnArgs = {} }) {
	const [tokenD, tokenScale] = await vauxsMacroHelpers(args)

	// If no actor is passed, prompt a player to select one.
	if (!Object.keys(importedActor).length) {
		// packs is an outdated term, it currently means the indexed actors
		let packs = await game.pf2e.compendiumBrowser.tabs.bestiary.indexData;

		if (!packs.length) {
			await game.pf2e.compendiumBrowser.tabs.bestiary.loadData();
			packs = await game.pf2e.compendiumBrowser.tabs.bestiary.indexData;
		}

		// adding size and alignment traits
		packs = packs.map(pack => { return { ...pack, traits: pack.traits.concat(pack.actorSize, alignmentStringToTraits(pack.alignment)) } });

		debug("Summon Creature Options", packs)

		let sortedHow = {
			type: "info",
			label: "Sorted with...?"
		}

		if (args[2]?.length && args[2][0] === "summon-spell") {
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
			sortedHow.label = `Sorted by level <b>(max. level ${multiplier} from ${ordinalSuffixOf(args[0].flags.pf2e.casting.level)} level spell)</b>.`;
		} else {
			packs = packs.sort((a, b) => a.name.localeCompare(b.name));
			sortedHow.label = "Sorted alphabetically.";
		}

		const options = await warpgate.menu(
			{
				inputs: [
					sortedHow,
					{
						type: "select",
						label: "Creature",
						options: packs.map(x => x.name)
					},
					{
						type: "number",
						label: "Amount",
						options: 1
					}
				]
			},
			{
				title: "Summon Anything"
			}
		)

		if (options.buttons === false) return;

		const actor = await packs.filter(x => x.name === options.inputs[1])[0];
		importedActor = await fromUuid(actor.uuid); // ?? await game.packs.get(actor.compendium ?? actor.uuid.split(".")[1] + "." + actor.uuid.split(".")[2]).getDocument(actor._id ?? actor.id ?? actor.uuid.split(".")[3]);
		(spawnArgs.options ??= {}).duplicates = options.inputs[2];
	}

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

	const crosshairs = await warpgate.crosshairs.show(crossHairConfig)

	if (crosshairs.cancelled) return;

	spawnArgs.location = (await canvas.scene.createEmbeddedDocuments('MeasuredTemplate', [crosshairs]))[0]

	debug("Requesting to GM", spawnArgs)
	await warpgate.event.notify("askGMforSummon", spawnArgs)
}

async function askGMforSummon(args) {
	if (!warpgate.util.isFirstGM()) return;

	// Checks if Dummy NPC/PC actors exist. If not, creates them.
	createIfMissingDummy();
	debug("Summoning Request", args);
	let template = await canvas.templates.get(args.location.id ?? args.location._id);
	new Dialog({
		title: "Player Summon Request",
		content: `
		<p>${args.userId ? game.users.find(x => x.id === args.userId).name : `An unknown user`} has requested to summon <b>${args.options.duplicates ?? "1"} ${args.updates.token.name}</b>.</p>
		<p>A template has been created showing the location of the summon. If you accept, the summon will be placed on the template. You can move the template before accepting.</p>
		<p>Declining the request or Closing this window will delete the template and nothing will be spawned.</p>
		`,
		buttons: {
			button1: {
				label: "Accept",
				callback: async () => {
					if (args.options) args.updates.token.actorData = { ownership: args.options.controllingActor.ownership };

					// Temporary fix as this seems to be warpgate's fault. Also cannot be an object because they are truthy.
					args.options.controllingActor = false
					args.location = template;
					debug("Summoning...", args)
					await warpgate.spawnAt(args.location, args.actorName, args.updates, args.callbacks, args.options);
					await template.document.delete();
				},
				icon: `<i class="fas fa-check"></i>`
			},
			button2: {
				label: "Decline",
				callback: async () => {
					ui.notifications.info("Declined!");
					await template.document.delete();
				},
				icon: `<i class="fas fa-times"></i>`
			}
		},
	}).render(true);
}

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
			debug("Persistent Damage / Healing", data);
			return runJB2Apf2eMacro('Persistent Conditions', args)
		} else if (!game.modules.get("pf2e-persistent-damage")?.active) {
			debug("No \"PF2e Persistent Damage\" module found!");
			return ui.notifications.error("Please enable the PF2e Persistent Damage module to use the Persistent Conditions macro.")
		}
	}
	// Default Matches
	if (data.isDamageRoll && /Sneak Attack/.test(flavor)) {
		debug("Sneak Attack", data);
		let [sneak] = data.token._actor.items.filter(i => i.name === "Sneak Attack")
		// Modify sneak to not be a feat because AA no like feat
		sneak.type = "strike"
		await AutoAnimations.playAnimation(token, targets, sneak)
		// Go back to not break opening the sheet, apparently
		sneak.type = "feat"
	}
	// Attack Matches
	if (data.flags.pf2e?.context?.type === "attack-roll") {
		if (game.settings.get("pf2e-jb2a-macros", "disableHitAnims")) return;
		const degreeOfSuccess = degreeOfSuccessWithRerollHandling(data);
		const pack = game.packs.get("pf2e-jb2a-macros.Actions");
		if (!pack) ui.notifications.error("PF2e x JB2A Macros | Can't find 'pf2e-jb2a-macros.Actions' pack, somehow?");

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
				debug("\"On Hit/Miss\" Critical Success animation", { token, targets, item })
				AutoAnimations.playAnimation(token, targets, item, { playOnMiss: true, hitTargets: targets }); break;
			case "criticalFailure":
				item = items.find(i => i.name.includes("(Critical Failure)"))
				debug("\"On Hit/Miss\" Critical Failure animation", { token, targets, item })
				AutoAnimations.playAnimation(token, targets, item, { playOnMiss: true, hitTargets: !game.settings.get("pf2e-jb2a-macros", "randomHitAnims") ? targets : [] }); break;
			case "failure":
				item = items.find(i => i.name.includes("(Failure)"))
				debug("\"On Hit/Miss\" Failure animation", { token, targets, item })
				AutoAnimations.playAnimation(token, targets, item, { playOnMiss: true, hitTargets: !game.settings.get("pf2e-jb2a-macros", "randomHitAnims") ? targets : [] }); break;
			case "success":
				item = items.find(i => i.name.includes("(Success)"))
				debug("\"On Hit/Miss\" Success animation", { token, targets, item })
				AutoAnimations.playAnimation(token, targets, item, { playOnMiss: true, hitTargets: targets }); break;
		}
	}
});

Hooks.on("preUpdateItem", (data, changes) => {
	return runJB2Apf2eMacro('Equipment Changes', { data, changes })
});
