const pf2eAnimations = {}
pf2eAnimations.hooks = {}
pf2eAnimations.blacklist = {
	menu: [],
	entries: [],
}

pf2eAnimations.hooks.init = Hooks.on("init", () => {
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
	game.settings.register("pf2e-jb2a-macros", "allowUncommonSummons", {
		scope: "world",
		config: true,
		name: game.i18n.localize("pf2e-jb2a-macros.settings.allowUncommonSummons.name"),
		hint: game.i18n.localize("pf2e-jb2a-macros.settings.allowUncommonSummons.hint"),
		type: Boolean,
		default: false
	});
	game.settings.register("pf2e-jb2a-macros", "onlyImageSummons", {
		scope: "world",
		config: true,
		name: game.i18n.localize("pf2e-jb2a-macros.settings.onlyImageSummons.name"),
		hint: game.i18n.localize("pf2e-jb2a-macros.settings.onlyImageSummons.hint"),
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
	game.settings.register("pf2e-jb2a-macros", "dummyNPCId-folder", {
		scope: "world",
		type: String,
		default: ""
	});
	game.settings.register("pf2e-jb2a-macros", "dummyNPCId-tiny", {
		scope: "world",
		type: String,
		default: ""
	});
	game.settings.register("pf2e-jb2a-macros", "dummyNPCId-medium", {
		scope: "world",
		type: String,
		default: ""
	});
	game.settings.register("pf2e-jb2a-macros", "dummyNPCId-large", {
		scope: "world",
		type: String,
		default: ""
	});
	game.settings.register("pf2e-jb2a-macros", "dummyNPCId-huge", {
		scope: "world",
		type: String,
		default: ""
	});
	game.settings.register("pf2e-jb2a-macros", "dummyNPCId-garg", {
		scope: "world",
		type: String,
		default: ""
	});
	game.settings.register("pf2e-jb2a-macros", "blacklist", {
		scope: "world",
		type: Object,
		default: pf2eAnimations.blacklist
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

pf2eAnimations.hooks.ready = Hooks.on("ready", () => {
	console.log("PF2e Animations v" + game.modules.get("pf2e-jb2a-macros").version + " loaded.");
	// Warn if no JB2A is found and disable the module.
	if (!game.modules.get("JB2A_DnD5e")?.active && !game.modules.get("jb2a_patreon")?.active) {
		ui.notifications.error(game.i18n.localize("pf2e-jb2a-macros.notifications.noJB2A"), { permanent: true });
		return;
	}

	if (game.settings.get("pf2e-jb2a-macros", "version-previous") !== game.modules.get("pf2e-jb2a-macros").version) {
		ui.notifications.info(game.i18n.format("pf2e-jb2a-macros.notifications.update", { version: game.modules.get("pf2e-jb2a-macros").version }))
		game.settings.set("pf2e-jb2a-macros", "version-previous", game.modules.get("pf2e-jb2a-macros").version)
		if (game.user.isGM && game.settings.get("pf2e-jb2a-macros", "autoUpdate")) new autorecUpdateFormApplication().render(true)
	}

	// Create an event for summoning macros.
	warpgate.event.watch("askGMforSummon", (eventData) => { pf2eAnimations.askGMforSummon(eventData) })

	// GM-Only stuff.
	if (!game.user.isGM) return;
	if (game.settings.get("pf2e", "tokens.autoscale")) game.settings.set("pf2e-jb2a-macros", "smallTokenScale", 0.8);
});

pf2eAnimations.hooks.createChatMessage = Hooks.on("createChatMessage", async (data) => {
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
		if (!pack) ui.notifications.error(`PF2e Animations | ${game.i18n.localize("pf2e-jb2a-macros.notifications.noPack")}`);

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

pf2eAnimations.hooks.preUpdateItem = Hooks.on("preUpdateItem", (data, changes) => {
	pf2eAnimations.debug("Running Equipment Changes Macro.", { data, changes });
	pf2eAnimations.runMacro('Equipment Changes', { data, changes })
});

pf2eAnimations.hooks.renderActorDirectory = Hooks.on("renderActorDirectory", (app, html, data) => {
	if (!(game.user.isGM && game.settings.get("pf2e-jb2a-macros", "debug"))) {
		let folder = html.find(`.folder[data-folder-id="${game.folders.get(game.settings.get("pf2e-jb2a-macros", "dummyNPCId-folder"))?.id}"]`);
		folder.remove();
	}
});

pf2eAnimations.hooks.AutomatedAnimations = {}
pf2eAnimations.hooks.AutomatedAnimations.metaData = Hooks.on("AutomatedAnimations.metaData", async (data) => {
	if (game.settings.get("pf2e-jb2a-macros", "debug")) {
		pf2eAnimations.debug("AutomatedAnimations.metaData hook", data);
		let metaData = data.metaData;
		await warpgate.menu(
			{
				inputs: [
					{
						label: `name${metaData.name ? "": " (auto)"}`,
						type: 'text',
						options: metaData.name || "PF2e Animations"
					},
					{
						label: `moduleVersion${metaData.moduleVersion ? "": " (auto)"}`,
						type: 'text',
						options: metaData.moduleVersion || game.modules.get("pf2e-jb2a-macros").version
					},
					{
						label: `version${metaData.version ? "": " (auto)"}`,
						type: 'number',
						options: metaData.version || Number(game.modules.get("pf2e-jb2a-macros").version.replaceAll(".", ""))
					}
				],
				buttons: [
					{
						label: 'Apply',
						value: 1,
						callback: async (options) => {
							settings = await game.settings.get("autoanimations", `aaAutorec-${data.menu}`);
							entry = settings.findIndex(obj => obj.label === data.label);
							settings[entry].metaData.name = options.inputs[0] ?? settings[entry].metaData.name;
							settings[entry].metaData.moduleVersion = options.inputs[1] ?? settings[entry].metaData.moduleVersion;
							settings[entry].metaData.version = options.inputs[2] ?? settings[entry].metaData.version;
							await AutomatedAnimations.AutorecManager.overwriteMenus(JSON.stringify({ version: await game.settings.get('autoanimations', 'aaAutorec').version, [data.menu]: settings }), { [data.menu]: true });
						}
					},
					{
						label: 'Delete MetaData',
						value: 1,
						callback: async (options) => {
							settings = await game.settings.get("autoanimations", `aaAutorec-${data.menu}`);
							entry = settings.findIndex(obj => obj.label === data.label);
							settings[entry].metaData = {};
							await AutomatedAnimations.AutorecManager.overwriteMenus(JSON.stringify({ version: await game.settings.get('autoanimations', 'aaAutorec').version, [data.menu]: settings }), { [data.menu]: true });
						}
					}
				]
			},
			{
				title: `DEBUG | Add Metadata to ${data.label}.`
			}
		)
	} else if (metaData.name === "PF2e Animations") {
		ui.notifications.notify(`${metaData.name} (v${metaData.moduleVersion}) | Animation Version: ${metaData.version}<hr>${game.i18n.localize("pf2e-jb2a-macros.notifications.metaData")}`);
	};
});

pf2eAnimations.debug = function debug(msg = "", args = "") {
	if (game.settings.get("pf2e-jb2a-macros", "debug")) console.log(`DEBUG | PF2e Animations | ${msg}`, args);
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
				ui.notifications.error("PF2e Animations | Macro " + macroName + " not found in the world (if you have enabled \"Use Local Macros\" setting, disable it or import the macros in it's description).")
				: ui.notifications.error("PF2e Animations | Macro " + macroName + " not found in " + compendiumName + ".")
		}
	} else {
		ui.notifications.error("PF2e Animations | Compendium " + compendiumName + " not found");
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
pf2eAnimations.macroHelpers = function vauxsMacroHelpers(args = [], _callback = () => {}) {
	pf2eAnimations.debug("Vaux's Macro Helpers | Args", args);
	token = args[1]?.sourceToken ?? canvas.tokens.controlled[0];

	if (!token) { ui.notifications.error(game.i18n.localize("pf2e-jb2a-macros.notifications.noToken")); return; }

	tokenScale = token.actor.size === "sm" ? game.settings.get("pf2e-jb2a-macros", "smallTokenScale") : 1.0;
	allTargets = args[1]?.allTargets ?? [...game.user.targets];
	hitTargets = args[1]?.hitTargets ?? allTargets;
	targets = hitTargets;
	target = hitTargets[0];
	origin = args[1]?.itemUuid ?? token.actor.uuid;
	actor = token.actor;

	pf2eAnimations.debug("Vauxs Macro Helpers | Results", { token, tokenScale, allTargets, hitTargets, targets, target, origin, actor});
	// Don't delete it, even though it's just a legacy thing by this point.
	_callback();
	return [token, tokenScale, allTargets, hitTargets, targets, target, origin, actor];
}

// Creates dummy NPC and PC actors for summoning purposes.
// Keeps the IDs of these actors in settings. If one of them is missing, it will create a new one and save the new ones ID.
pf2eAnimations.createIfMissingDummy = async function createIfMissingDummy() {
	let message = `PF2e Animations | ${game.i18n.localize("pf2e-jb2a-macros.notifications.noDummy")}`;
	npcFolder = game.folders.get(game.settings.get("pf2e-jb2a-macros", "dummyNPCId-folder"));

	if (!npcFolder) {
		npcFolder = await Folder.create({ name: "PF2e Animations Dummy NPCs", type: "Actor", parent: null });
		game.settings.set("pf2e-jb2a-macros", "dummyNPCId-folder", npcFolder.id);
	}

	npcActor1 = game.actors.get(game.settings.get("pf2e-jb2a-macros", "dummyNPCId-tiny"));
	npcActor2 = game.actors.get(game.settings.get("pf2e-jb2a-macros", "dummyNPCId-medium"));
	npcActor3 = game.actors.get(game.settings.get("pf2e-jb2a-macros", "dummyNPCId-large"));
	npcActor4 = game.actors.get(game.settings.get("pf2e-jb2a-macros", "dummyNPCId-huge"));
	npcActor5 = game.actors.get(game.settings.get("pf2e-jb2a-macros", "dummyNPCId-garg"));
	if (!(npcActor1 && npcActor2 && npcActor3 && npcActor4 && npcActor5)) {
		message += ` ${game.i18n.localize("pf2e-jb2a-macros.notifications.creatingDummy")} `;
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
 * @param {string} alignment Alignment as a String ex. CG.
 * @returns {Array} traits Array of traits.
 */
pf2eAnimations.alignmentStringToTraits = function alignmentStringToTraits(alignment, reverse = false) {
	// returns an array of traits for the alignment string
	// e.g. "LG" -> ["lawful", "good"]

	// reverse = true will return the opposite traits
	// e.g. "LG" -> ["chaotic", "evil"]
	// thanks Co-Pilot for the code below
	if (reverse) {
		alignment = alignment.split("").map(a => a === "L" ? "C" : a === "C" ? "L" : a === "G" ? "E" : a === "E" ? "G" : a).join("");
	}
	let traits = [];
	if (alignment.includes("L")) traits.push("lawful");
	if (alignment.includes("N")) traits.push("neutral");
	if (alignment.includes("C")) traits.push("chaotic");
	if (alignment.includes("G")) traits.push("good");
	if (alignment.includes("E")) traits.push("evil");
	return traits;
}

// Borrowed from PF2eTools Utils
// https://github.com/Pf2eToolsOrg/Pf2eTools/blob/1f241bbb353c20bbcc726843b4ae0992dad7f999/js/utils.js#L69
String.prototype.toTitleCase = String.prototype.toTitleCase || function () {
	let str = this.replace(/([^\W_]+[^\s-/]*) */g, m0 => m0.charAt(0).toUpperCase() + m0.substr(1).toLowerCase());

	StrUtil = {
		// Certain minor words should be left lowercase unless they are the first or last words in the string
		TITLE_LOWER_WORDS: ["a", "an", "the", "and", "but", "or", "for", "nor", "as", "at", "by", "for", "from", "in", "into", "near", "of", "on", "onto", "to", "with", "over"],
		// Certain words such as initialisms or acronyms should be left uppercase
		TITLE_UPPER_WORDS: ["Id", "Tv", "Dm", "Ok"],
	};

	// Require space surrounded, as title-case requires a full word on either side
	StrUtil._TITLE_LOWER_WORDS_RE = StrUtil._TITLE_LOWER_WORDS_RE = StrUtil.TITLE_LOWER_WORDS.map(it => new RegExp(`\\s${it}\\s`, "gi"));
	StrUtil._TITLE_UPPER_WORDS_RE = StrUtil._TITLE_UPPER_WORDS_RE = StrUtil.TITLE_UPPER_WORDS.map(it => new RegExp(`\\b${it}\\b`, "g"));

	const len = StrUtil.TITLE_LOWER_WORDS.length;
	for (let i = 0; i < len; i++) {
		str = str.replace(
			StrUtil._TITLE_LOWER_WORDS_RE[i],
			txt => txt.toLowerCase(),
		);
	}

	const len1 = StrUtil.TITLE_UPPER_WORDS.length;
	for (let i = 0; i < len1; i++) {
		str = str.replace(
			StrUtil._TITLE_UPPER_WORDS_RE[i],
			StrUtil.TITLE_UPPER_WORDS[i].toUpperCase(),
		);
	}

	return str;
};

/**
 *
 * @param {Object} args Args passed down in the macro.
 * @param {Object} importedActor Actor to spawn.
 * @param {Object} spawnArgs Arguments to be passed down to Warpgate spawnAt function, order insensitive.
 */
pf2eAnimations.playerSummons = async function playerSummons({ args = [], importedActor = {}, spawnArgs = {} }) {
	const [tokenD, tokenScale] = pf2eAnimations.macroHelpers(args);

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
							["celestial","monitor","fiend"].some(traitOr => x.traits.includes(traitOr))
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
				`<p>${game.i18n.localize("pf2e-jb2a-macros.macro.summoning.player.sorted")}</p>`,
				args[2].length ? [
					unique ? `<p>${game.i18n.format("pf2e-jb2a-macros.macro.summoning.player.unique", { unique: uniqueString})}</p>` : "",
					summon ? `<p>${game.i18n.format("pf2e-jb2a-macros.macro.summoning.player.summonArg", { multiplier: multiplier, spellLevel: args[0].flags.pf2e.casting.level })}</p>` : "",
					level ? `<p>${game.i18n.format("pf2e-jb2a-macros.macro.summoning.player.levelArg", { level1: level[0].replace("~", "-"), level2: level[1]?.replace("~", "-") ?? "<span style=\"font-size:18px\">∞</span>" })}</p>` : "",
					exactLevel ? `<p>${game.i18n.format("pf2e-jb2a-macros.macro.summoning.player.levelArg", { levels: `${exactLevel}` })}</p>` : "",
					traitsOr || traitsAnd ? `<p>${game.i18n.format("pf2e-jb2a-macros.macro.summoning.player.traitsArg", { traits: allTraits.join(", ") })}</p>` : "",
					uncommon ? `<p>${game.i18n.localize("pf2e-jb2a-macros.macro.summoning.player.uncommonArg")}</p>` : "",
					hasImage ? `<p>${game.i18n.localize("pf2e-jb2a-macros.macro.summoning.player.hasImageArg")}</p>` : "",
					source ? `<p>${game.i18n.format("pf2e-jb2a-macros.macro.summoning.player.sourceArg", { sources: source.join(", ") })}</p>` : "",
				].join("") : ""
			].join("")
		}

		let inputs = [
			sortedHow,
		]

		if (packs.length === 0) packs.push({ level: 420, name: game.i18n.localize("pf2e-jb2a-macros.macro.summoning.player.nothingFound") })

		if (!randomCreature) {
			inputs.push({
				type: "select",
				label: game.i18n.localize("pf2e-jb2a-macros.macro.summoning.player.creature"),
				options: packs.map(x => `${game.i18n.format("pf2e-jb2a-macros.macro.summoning.player.level", { level: x.level })} | ${x.name}`),
			})
		}

		if (!randomAmount) {
			inputs.push({
				type: "number",
				label: game.i18n.localize("pf2e-jb2a-macros.macro.summoning.player.amount"),
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
					title: game.i18n.localize("pf2e-jb2a-macros.macro.summoning.player.title")
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
	Object.assign(importedToken.flags, { "pf2e-jb2a-macros": { "scrollingText": game.settings.get("core", "scrollingStatusText"), "bloodsplatter": game.modules.get("splatter")?.active ? game.settings.get("splatter", "enableBloodsplatter") : null } })

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
			token: {
				alpha: 0
			}
		})
		await game.settings.set("core", "scrollingStatusText", false);
		if (game.modules.get("splatter")?.active) game.settings.set("splatter", "enableBloodsplatter", false);
	};

	if (args?.callbacks?.post) ui.notifications.error("PF2e Animations | You are providing a callbacks.post function to the summoning macro. Please note it is going to be overriden in the module.");

	args.callbacks.post = async (location, spawnedTokenDoc, updates, iteration) => {
		const pack = game.packs.get("pf2e-jb2a-macros.Actions");
		if (!pack) ui.notifications.error(`PF2e Animations | ${game.i18n.localize("pf2e-jb2a-macros.notifications.noPack")}`);

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
	};

	new Dialog({
		title: game.i18n.localize("pf2e-jb2a-macros.macro.summoning.gm.title"),
		content: game.i18n.format("pf2e-jb2a-macros.macro.summoning.gm.content", { actorName: args?.updates?.token?.name ?? args.actorName, amount: args?.options?.duplicates ?? "1", user: args.userId ? game.users.find(x => x.id === args.userId).name : game.i18n.localize("pf2e-jb2a-macros.macro.summoning.gm.unknownUser") }),
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
					ui.notifications.info(game.i18n.localize("pf2e-jb2a-macros.macro.summoning.gm.declined"));
					await template.document.delete();
				},
				icon: `<i class="fas fa-times"></i>`
			}
		},
	}).render(true);
}

pf2eAnimations.getJSON = async function getJSON(url) {
	const response = await fetch(url);
	const json = await response.json();
	return json;
}

pf2eAnimations.generateAutorecUpdate = async function generateAutorecUpdate(quiet = true) {
	if (quiet) console.group("PF2e Animations | Autorecognition Menu Check");
	const autorec = await pf2eAnimations.getJSON("modules/pf2e-jb2a-macros/module/autorec.json");
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
	let blacklist = { melee: [], range: [], ontoken: [], templatefx: [], aura: [], preset: [], aefx: [], }

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
				if (!!xEntry.metaData && (xEntry.metaData.name === "PF2e Animation Macros" || xEntry.metaData.name === "PF2e Animations" || xEntry.metaData?.default)) {
					// If menu it exists from is blacklisted, add it to blacklisted.
					if (game.settings.get("pf2e-jb2a-macros", "blacklist").menu.includes(key)) return blacklist[key].push(xEntry);
					// If it's blacklisted by name, add it to blacklisted.
					if (game.settings.get("pf2e-jb2a-macros", "blacklist").entries.includes(x)) return blacklist[key].push(xEntry);

					// Entry is from PF2e Animations, but the same or higher version. Skip.
					if (xEntry?.metaData?.version >= getFullVersion(x, autorec[key]).metaData.version) return same[key].push(xEntry);

					// Entry is from PF2e Animations, but outdated. Update.
					return updatedEntries[key].push(getFullVersion(x, autorec[key]))
				} else {
					// Entry does exist but it's not from PF2e Animations. Add it to custom.
					return custom[key].push(xEntry)
				}
			} else {
				// If menu it exists from is blacklisted, add it to blacklisted.
				if (game.settings.get("pf2e-jb2a-macros", "blacklist").menu.includes(key)) return;
				// If it's blacklisted by name, add it to blacklisted.
				if (game.settings.get("pf2e-jb2a-macros", "blacklist").entries.includes(x)) return;
				// Entry does not exist, add it.
				return missingEntries[key].push(getFullVersion(x, autorec[key]))
			}
		});
		settings[key].map(x => { return { label: x.label, metaData: x.metaData } }).forEach(async y => {
			if (!autorec[key].map(x => { return { label: x.label, metaData: x.metaData } }).some(e => e.label === y.label)) {
				if (y.metaData?.default || ((y?.metaData?.name === "PF2e Animation Macros" || y?.metaData?.name === "PF2e Animations") && y?.metaData?.version < autorec.melee[0].metaData.version)) {
					// Entry does not exist in autorec, but is from PF2e Animations and of a lower version. Add them to removed.
					return removed[key].push(getFullVersion(y.label, settings[key]))
				} else {
					// Entry does not exist in autorec.json. Add it to customNew.
					return customNew[key].push(getFullVersion(y.label, settings[key]));
				}
			}
		})
	}
	if (quiet) console.info("The following effects did not exist before. They will be ADDED.", missingEntries)
	if (quiet) console.info("The following effects can be updated from a previous version of 'PF2e Animations'. They will be UPDATED.", updatedEntries)
	if (quiet) console.info("The following effects no LONGER exist in PF2e Animations. They will be DELETED.", removed)
	if (quiet) console.info("The following effects do not exist in PF2e Animations. They will be IGNORED.", customNew)
	if (quiet) console.info("The following effects cannot be added or updated, due to them already existing from an unknown source. They will be IGNORED.", custom)
	if (quiet) console.info("The following effects have no updates.", same)
	if (quiet) console.info("The following effects have been blacklisted.", blacklist)
	if (quiet) console.groupEnd()

	// Create a list of all effects done.
	let missingEntriesList = []
	let updatedEntriesList = []
	let customEntriesList = []
	let customNewEntriesList = []
	let removedEntriesList = []
	let blacklistEntriesList = []
	for (const key of Object.keys(settings)) {
		missingEntriesList.push(missingEntries[key].map(x => `${x.label} <i class="pf2e-animations-muted">(${key})</i>`))
		updatedEntriesList.push(updatedEntries[key].map(x => `${x.label} <i class="pf2e-animations-muted">(${key})</i>`))
		removedEntriesList.push(removed[key].map(x => `${x.label} <i class="pf2e-animations-muted">(${key})</i>`))
		customEntriesList.push(custom[key].map(x => `${x.label} <i class="pf2e-animations-muted">(${key})</i>`))
		customNewEntriesList.push(customNew[key].map(x => `${x.label} <i class="pf2e-animations-muted">(${key})</i>`))
		blacklistEntriesList.push(blacklist[key].map(x => `${x.label} <i class="pf2e-animations-muted">(${key})</i>`))
	}
	missingEntriesList = missingEntriesList.flat().sort()
	updatedEntriesList = updatedEntriesList.flat().sort()
	removedEntriesList = removedEntriesList.flat().sort()
	customEntriesList = customEntriesList.flat().sort()
	customNewEntriesList = customNewEntriesList.flat().sort()
	blacklistEntriesList = blacklistEntriesList.flat().sort()

	let newSettingsDirty = { melee: [], range: [], ontoken: [], templatefx: [], aura: [], preset: [], aefx: [], }
	let newSettings = { melee: [], range: [], ontoken: [], templatefx: [], aura: [], preset: [], aefx: [], }
	for (const key of Object.keys(settings)) {
		// Merge all the arrays into one.
		newSettingsDirty[key] = [...missingEntries[key], ...updatedEntries[key], ...custom[key], ...same[key], ...customNew[key]]
		newSettings[key] = [...new Map(newSettingsDirty[key].map(v => [v.id, v])).values()].sort((a, b) => (a.label || "").localeCompare((b.label || "")))
		// add to every entry's metaData the name of the entry
		newSettings[key].map(x => { x.metaData = x.metaData ?? {}; x.metaData.label = x.label; x.metaData.menu = x.menu; return x })
	}
	// Adds the current Autorec version into the menu to ensure it will not get wiped going through the Autorec Merge scripts
	newSettings.version = await game.settings.get('autoanimations', 'aaAutorec').version
	return { newSettings, missingEntriesList, updatedEntriesList, customEntriesList, removedEntriesList, customNewEntriesList, blacklistEntriesList }
}

pf2eAnimations.generateAutorecUpdateHTML = async function generateAutorecUpdateHTML() {
	const { newSettings, missingEntriesList, updatedEntriesList, customEntriesList, removedEntriesList, customNewEntriesList, blacklistEntriesList } = await pf2eAnimations.generateAutorecUpdate(false)
	let html = `<h1 style="text-align: center; font-weight: bold;">PF2e Animations Update Menu</h1>`

	if (missingEntriesList.length || updatedEntriesList.length || customEntriesList.length || removedEntriesList.length || blacklistEntriesList.length || (game.settings.get("pf2e-jb2a-macros", "debug") && customNewEntriesList.length)) {
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
		if (blacklistEntriesList.length) {
			html += `
			<div class="pf2e-animations-autorec-update-child">
				<p class="pf2e-animations-autorec-update-text">${game.i18n.localize("pf2e-jb2a-macros.updateMenu.blacklisted")}</p>
				<ul class="pf2e-animations-autorec-update-ul">
					${blacklistEntriesList.map(x => `<li>${x}</li>`).join("")}
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
		const { newSettings, missingEntriesList, updatedEntriesList, customEntriesList, removedEntriesList, blacklistEntriesList } = await this.settings()
		if (!(missingEntriesList.length || updatedEntriesList.length || customEntriesList.length || removedEntriesList.length || blacklistEntriesList.length)) $('[name="update"]').remove()
		super.activateListeners(html);
	}

	async _updateObject(event) {
		$(".pf2e-animations-autorec-update-buttons").attr("disabled", true)
		if (event.submitter.name === "update") {
			console.group("PF2e Animations | Autorecognition Menu Update");
			const { newSettings, missingEntriesList, updatedEntriesList, customEntriesList, removedEntriesList, blacklistEntriesList } = await this.settings()
			if (!(missingEntriesList.length || updatedEntriesList.length || customEntriesList.length || removedEntriesList.length || blacklistEntriesList.length)) return console.log("Nothing to update!");
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
