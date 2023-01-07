const pf2eAnimations = {}

//#region Hooks
pf2eAnimations.hooks = {}

pf2eAnimations.hooks.ready = Hooks.once("ready", () => {
	console.log("PF2e Animations v" + game.modules.get("pf2e-jb2a-macros").version + " loaded.");
	// Warn if no JB2A is found and disable the module.
	if (!game.modules.get("JB2A_DnD5e")?.active && !game.modules.get("jb2a_patreon")?.active) {
		ui.notifications.error(pf2eAnimations.localize("pf2e-jb2a-macros.notifications.noJB2A"), { permanent: true });
		return;
	}

	if (game.settings.get("pf2e-jb2a-macros", "version-previous") !== game.modules.get("pf2e-jb2a-macros").version) {
		ui.notifications.info(pf2eAnimations.localize("pf2e-jb2a-macros.notifications.update", { version: game.modules.get("pf2e-jb2a-macros").version }))
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
			return ui.notifications.error(pf2eAnimations.localize("pf2e-jb2a-macros.notifications.noPersistentDamage"));
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
		if (!pack) ui.notifications.error(`PF2e Animations | ${pf2eAnimations.localize("pf2e-jb2a-macros.notifications.noPack")}`);

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

// Create a hook for updating inventory.
pf2eAnimations.hooks.equipOrInvestItem = Hooks.on("pf2eAnimations-equipOrInvestItem", (...args) => {
	// If the hooks are disabled, return.
	if (game.settings.get("pf2e-jb2a-macros", "disableHooks")) return pf2eAnimations.debug("Hooks have been disabled!");

	// If the item is an Aeon Stone, run the Aeon Stone macro.
	if (args[0].name.includes("Aeon Stone")) pf2eAnimations.runMacro("Aeon Stone", [ args[1] /*status*/, args[0] /*data*/ ]);
})

// Call the above hook with updateItem.
pf2eAnimations.hooks.updateItem = Hooks.on("updateItem", (data, changes) => {
	let status = data.isInvested ? "invested" : data.isEquipped ? "equipped" : false
	Hooks.call("pf2eAnimations-equipOrInvestItem", data, status)
});

// Remove the PF2e Animations Dummy NPC folder, unless the debug mode is on AND the user is a GM.
pf2eAnimations.hooks.renderActorDirectory = Hooks.on("renderActorDirectory", (app, html, data) => {
	if (!(game.user.isGM && game.settings.get("pf2e-jb2a-macros", "debug"))) {
		const folder = html.find(`.folder[data-folder-id="${game.folders.get(game.settings.get("pf2e-jb2a-macros", "dummyNPCId-folder"))?.id}"]`);
		folder.remove();
	}
});

// Create a hook for metadata modification menu.
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
							let settings = await game.settings.get("autoanimations", `aaAutorec-${data.menu}`);
							let entry = settings.findIndex(obj => obj.label === data.label);
							settings[entry].metaData.name = options.inputs[0] ?? settings[entry].metaData.name;
							settings[entry].metaData.moduleVersion = options.inputs[1] ?? settings[entry].metaData.moduleVersion;
							settings[entry].metaData.version = options.inputs[2] ?? settings[entry].metaData.version;
							await AutomatedAnimations.AutorecManager.overwriteMenus(JSON.stringify({ version: await game.settings.get('autoanimations', 'aaAutorec').version, [data.menu]: settings }), { [data.menu]: true });
						}
					},
					{
						label: 'Update',
						value: 1,
						callback: async (options) => {
							let settings = await game.settings.get("autoanimations", `aaAutorec-${data.menu}`);
							let entry = settings.findIndex(obj => obj.label === data.label);
							settings[entry].metaData.name = "PF2e Animations";
							settings[entry].metaData.moduleVersion = game.modules.get("pf2e-jb2a-macros").version;
							settings[entry].metaData.version = Number(game.modules.get("pf2e-jb2a-macros").version.replaceAll(".", ""));
							await AutomatedAnimations.AutorecManager.overwriteMenus(JSON.stringify({ version: await game.settings.get('autoanimations', 'aaAutorec').version, [data.menu]: settings }), { [data.menu]: true });
						}
					},
					{
						label: 'Delete MetaData',
						value: 1,
						callback: async (options) => {
							let settings = await game.settings.get("autoanimations", `aaAutorec-${data.menu}`);
							let entry = settings.findIndex(obj => obj.label === data.label);
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
		ui.notifications.notify(`${metaData.name} (v${metaData.moduleVersion}) | Animation Version: ${metaData.version}<hr>${pf2eAnimations.localize("pf2e-jb2a-macros.notifications.metaData")}`);
	};
});
//#endregion

pf2eAnimations.debug = function debug(msg, args) {
	[msg, ...args] = arguments
	if (game.settings.get("pf2e-jb2a-macros", "debug")) console.log(`DEBUG | PF2e Animations | ${msg}`, args);
}

// Thanks @ xdy for this function.
pf2eAnimations.runMacro = async function runJB2Apf2eMacro(
	macroName,
	args,
	compendiumName = "pf2e-jb2a-macros.Macros"
) {
	const pack = game.packs.get(compendiumName);
	if (pack) {
		const macro_data = (await pack.getDocuments()).find((i) => i.name === macroName);

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
			ui.notifications.error("PF2e Animations | Macro " + macroName + " not found in " + compendiumName + ".")
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
	let token = args[1]?.sourceToken ?? canvas.tokens.controlled[0];
	if (!token) { ui.notifications.error(pf2eAnimations.localize("pf2e-jb2a-macros.notifications.noToken")); return; }

	let tokenScale = token.actor.size === "sm" ? game.settings.get("pf2e-jb2a-macros", "smallTokenScale") : 1.0;
	let allTargets = args[1]?.allTargets ?? [...game.user.targets];
	let hitTargets = args[1]?.hitTargets ?? allTargets;
	let targets = hitTargets;
	let target = hitTargets[0];
	let origin = args[1]?.itemUuid ?? args[1]?.item?.uuid ?? token.actor.uuid;
	let actor = token.actor;

	pf2eAnimations.debug("Vauxs Macro Helpers | Results", { token, tokenScale, allTargets, hitTargets, targets, target, origin, actor});
	// Don't delete it, even though it's just a legacy thing by this point.
	_callback();
	return [token, tokenScale, allTargets, hitTargets, targets, target, origin, actor];
}

/**
 * @param {string} alignment Alignment as a String ex. CG.
 * @param {boolean} reverse Reverse the alignment, ex. CG to LE.
 * @returns {Array} traits Array of traits.
 */
pf2eAnimations.alignmentStringToTraits = function alignmentStringToTraits(alignment, reverse = false) {
	// returns an array of traits for the alignment string
	// e.g. "LG" -> ["lawful", "good"]

	// reverse = true will return the opposite traits
	// e.g. "LG" -> ["chaotic", "evil"]
	// thanks Co-Pilot for the code below
	if (reverse) {
		alignment = alignment.split("").map(a =>
			a === "L" ? "C" :
			a === "C" ? "L" :
			a === "G" ? "E" :
			a === "E" ? "G" :
			a).join("");
	}
	let traits = [];
	if (alignment.includes("L")) traits.push("lawful");
	if (alignment.includes("N")) traits.push("neutral");
	if (alignment.includes("C")) traits.push("chaotic");
	if (alignment.includes("G")) traits.push("good");
	if (alignment.includes("E")) traits.push("evil");
	return traits;
}

pf2eAnimations.crosshairs = async function crosshairs(args = { token: Object, item: Object }, opts = { range: Number, crosshairConfig: Object, openSheet: Boolean }) {
	opts = mergeObject({ openSheet: true }, opts)

	const tokenDoc = args.token.document
	const callbacks = {}
	if (opts.range > 0) {
		let cachedDistance = 0;
		callbacks.show = async (crosshairs) => {
			while (crosshairs.inFlight) {
				// make it wait or go into an unescapable infinite loop of pain
				await warpgate.wait(50);

				const ray = new Ray(args.token.center, crosshairs);

				const distance = canvas.grid.measureDistances([{ ray }], { gridSpaces: true })[0]

				// Only update if the distance has changed
				if (cachedDistance !== distance) {
					cachedDistance = distance;
					if (distance > opts.range) {
						crosshairs.icon = "icons/svg/hazard.svg"
						await crosshairs.document.updateSource({
							"flags": {
								"pf2e-jb2a-macros": {
									"outOfRange": true
								}
							}
						})
					} else {
						crosshairs.icon = args?.item?.img ?? args?.token.document.texture.src
						await crosshairs.document.updateSource({
							"flags": {
								"pf2e-jb2a-macros": {
									"outOfRange": false
								}
							}
						})
					}
					crosshairs.draw()
					crosshairs.label = `${distance} ft.`
				}
			}
		}
	}

	const crosshairConfig = {
		label: "0 ft.",
		label: tokenDoc.name,
		interval: tokenDoc.height < 1 ? 4 : tokenDoc.height % 2 === 0 ? 1 : -1,
		lockSize: true,
		drawIcon: true,
		size: tokenDoc.height,
		icon: tokenDoc.texture.src,
		rememberControlled: true,
	}

	mergeObject(crosshairConfig, opts.crosshairConfig)

	tokenDoc.actor.sheet.minimize();
	const location = await warpgate.crosshairs.show(crosshairConfig, callbacks)
	if (opts.openSheet === true) {
		tokenDoc.actor.sheet.maximize()
	};
	const result = location.cancelled ? false
	: location.flags["pf2e-jb2a-macros"].outOfRange ? "outOfRange"
	: location

	// Calculate the rotation from the origin in degrees, up = 0
	location.rotationFromOrigin = (new Ray(tokenDoc.center, location).angle * 180 / Math.PI) + 90
	if (location.rotationFromOrigin < 0) location.rotationFromOrigin += 360

	pf2eAnimations.debug("Crosshairs", args, opts, location, !!result);
	if (result === "outOfRange") { ui.notifications.error("PF2e Animations | " + pf2eAnimations.localize("pf2e-jb2a-macros.notifications.outOfRange")); return false; }
	return result
}

pf2eAnimations.localize = function localize(string = String, format = Object) {
	if (!string.includes("pf2e-jb2a-macros.")) string = "pf2e-jb2a-macros." + string;
	if (Object.keys(format).length > 0) {
		return game.i18n.format(string, format);
	} else {
		return game.i18n.localize(string);
	}
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

self.pf2eAnimations = pf2eAnimations