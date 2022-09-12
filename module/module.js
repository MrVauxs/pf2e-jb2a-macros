const versionsWithAutorecUpdates = ["1.9.2", "1.10.0", "1.11.2"];

Hooks.on("init", () => {
	game.settings.register("pf2e-jb2a-macros", "imported", {
		scope: "world",
		config: true,
		name: "Imported Contents",
		hint: "Whether or not you have imported the contents of the module using the pop-up when you enabled the module.\nDisable to have them imported again automatically.",
		type: Boolean,
		default: false
	});
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
		config: !game.settings.get("pf2e","tokens.autoscale"),
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
		scope: "world",
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
});

Hooks.on("ready", () => {
	const version = game.modules.get("pf2e-jb2a-macros").data.version;
	if (!game.modules.get("JB2A_DnD5e")?.active && !game.modules.get("jb2a_patreon")?.active) {
		ui.notifications.error(`You need a <a href="https://jb2a.com/home/content-information/#free_library">JB2A module</a> enabled to use with PF2e x JB2A Macros module!`, { permanent: true });
		return;
	}
	if (game.user.isGM && game.settings.get("pf2e","tokens.autoscale")) game.settings.set("pf2e-jb2a-macros", "smallTokenScale", 0.8);
	if (isNewerVersion(version, game.settings.get("pf2e-jb2a-macros", "version-previous"))) {
		game.settings.set("pf2e-jb2a-macros", "version-previous", version);
		let previousVersion = game.settings.get("pf2e-jb2a-macros", "version-previous")
		let updateAutorec = versionsWithAutorecUpdates.includes(version) ? `<hr>This new version has also updated the autorec. A new version can be downloaded <a href="https://github.com/MrVauxs/pf2e-jb2a-macros/releases/latest/download/autorec.json">here</a>, and be seen <a href="https://github.com/MrVauxs/pf2e-jb2a-macros/releases/latest">here</a>.` : ""
		ui.notifications.info(`Updated from PF2e x JB2A Macros v${previousVersion} to v${version} ${updateAutorec}`, { permanent: true });
	} else console.log("PF2e x JB2A Macros v" + version + " loaded.");
});

function debug(msg, args = "") {
    if (game.settings.get("pf2e-jb2a-macros", "debug")) console.log(`DEBUG | PF2e x JB2A Macros | ${msg}`, args)
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
        const macro_data = useLocal ? game.macros.getName(macroName).toObject() : (await pack.getDocuments()).find((i) => i.data.name === macroName)?.toObject();

        if (macro_data) {
            const temp_macro = new Macro(macro_data);
            temp_macro.data.permission.default = CONST.DOCUMENT_PERMISSION_LEVELS.OWNER;
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
    const flags = message.data.flags.pf2e;
    let degreeOfSuccess = flags.context?.outcome ?? "";
    if (flags?.context?.isReroll) {
        const match = message.data.flavor?.match('Result: <span .*? class="(.*?)"');
        if (match && match[1]) {
            degreeOfSuccess = match[1];
        }
    }
    return degreeOfSuccess;
}

async function vauxsMacroHelpers(args = []) {
	const tokenD = args[1]?.sourceToken ?? canvas.tokens.controlled[0];
	if (!tokenD) {ui.notifications.error("No source token found."); return;}
	const tokenScale = tokenD.actor.size === "sm" ? game.settings.get("pf2e-jb2a-macros", "smallTokenScale") : 1.0;
    return [tokenD, tokenScale];
}

Hooks.on("createChatMessage", async (data) => {
	console.log(data)
	if (game.user.id !== data.user.id) return;
	let targets = data?.data?.flags?.pf2e?.target?.token ?? Array.from(game.user.targets);
	targets = [targets].flat()
	let token = data.token ?? canvas.tokens.controlled[0];
	let flavor = data.data.flavor ?? null;
	let args = data ?? null;

	// Persistent Damage Matches
	if (/Received Fast Healing|Persistent \w+ damage/.test(flavor)) {
		if (game.modules.get("pf2e-persistent-damage")?.active)	{
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
		sneak.data.type = "strike"
		await AutoAnimations.playAnimation(token, targets, sneak)
		// Go back to not break opening the sheet, apparently
		sneak.data.type = "feat"
	}
	// Attack Matches
	if (data.data.flags.pf2e?.context?.type === "attack-roll") {
		if (game.settings.get("pf2e-jb2a-macros", "disableHitAnims")) return;
        const degreeOfSuccess = degreeOfSuccessWithRerollHandling(data);
		const pack = game.packs.get("pf2e-jb2a-macros.Actions");
		if (!pack) ui.notifications.error("PF2e x JB2A Macros | Can't find 'pf2e-jb2a-macros.Actions' pack, somehow?");

		let items = data.token._actor.items.filter(i => i.data.name.includes("Attack Animation Template"));
		if (Object.keys(items).length === 0) {
			items = (await pack.getDocuments()).filter(i => i.data.name.includes("Attack Animation Template"))
		} else if (Object.keys(items).length < 4) {
			items.push((await pack.getDocuments()).filter(i => i.data.name.includes("Attack Animation Template")))
		}
		items = items.flat()
		let item = ""
		switch (degreeOfSuccess) {
            case "criticalSuccess":
				item = items.find(i => i.data.name.includes("(Critical Success)"))
				debug("\"On Hit/Miss\" Critical Success animation", {token, targets, item})
				AutoAnimations.playAnimation(token, targets, item, {playOnMiss: true, hitTargets: targets}); break;
            case "criticalFailure":
				item = items.find(i => i.data.name.includes("(Critical Failure)"))
				debug("\"On Hit/Miss\" Critical Failure animation", {token, targets, item})
				AutoAnimations.playAnimation(token, targets, item, {playOnMiss: true, hitTargets: !game.settings.get("pf2e-jb2a-macros", "randomHitAnims") ? targets : []}); break;
            case "failure":
				item = items.find(i => i.data.name.includes("(Failure)"))
				debug("\"On Hit/Miss\" Failure animation", {token, targets, item})
				AutoAnimations.playAnimation(token, targets, item, {playOnMiss: true, hitTargets: !game.settings.get("pf2e-jb2a-macros", "randomHitAnims") ? targets : []}); break;
            case "success":
				item = items.find(i => i.data.name.includes("(Success)"))
				debug("\"On Hit/Miss\" Success animation", {token, targets, item})
				AutoAnimations.playAnimation(token, targets, item, {playOnMiss: true, hitTargets: targets}); break;
        }
	}
});

Hooks.on("preUpdateItem", (data, changes) => {
	return runJB2Apf2eMacro('Equipment Changes', {data, changes})
});

Hooks.on("preCreateChatMessage", (data) => {
	if (data.flags.pf2e.casting) {
		data.data.update({ "flags.pf2eJB2AMacros.spellLevel": data?.data?.content.match(/data-spell-lvl="(\d+)"/)[1] ?? null })
		debug("Added spell level flags to Chat Message", {data: data, update: data.data.flags.pf2eJB2AMacros});
	};
});
