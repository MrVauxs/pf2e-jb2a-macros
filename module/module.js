let version = "1.10.1";
const versionsWithAutorecUpdates = ["1.9.2", "1.10.0"];

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
	game.settings.register("pf2e-jb2a-macros", "version", {
		scope: "world",
		type: String,
		default: "?"
	});
	game.settings.register("pf2e-jb2a-macros", "version-previous", {
		scope: "world",
		type: String,
		default: "?"
	});
});

Hooks.on("ready", () => {
	if (!game.modules.get("JB2A_DnD5e")?.active && !game.modules.get("jb2a_patreon")?.active) {
		ui.notifications.error(`You need a <a href="https://jb2a.com/home/content-information/#free_library">JB2A module</a> enabled to use with PF2e x JB2A Macros module!`, { permanent: true });
		return;
	}
	if (isNewerVersion(game.settings.get("pf2e-jb2a-macros", "version"), version)) {
		game.settings.set("pf2e-jb2a-macros", "version-previous", game.settings.get("pf2e-jb2a-macros", "version"));
		game.settings.set("pf2e-jb2a-macros", "version", version);
		let previousVersion = game.settings.get("pf2e-jb2a-macros", "version-previous")
		let updateAutorec = versionsWithAutorecUpdates.includes(version) ? `<hr>This new version has also updated the autorec. A new version can be downloaded <a href="https://github.com/MrVauxs/pf2e-jb2a-macros/releases/latest/download/autorec.json">here</a>, and be seen <a href="https://github.com/MrVauxs/pf2e-jb2a-macros/releases/latest">here</a>.` : ""
		ui.notifications.info(`Updated from PF2e JB2A Macros v${previousVersion} to v${version} ${updateAutorec}`, { permanent: true });
	} else console.log("PF2e JB2A Macros v" + game.settings.get("pf2e-jb2a-macros", "version") + " loaded.");
});

Hooks.on("renderSettings", () => {
	if (!game.user.isGM) return
	if (!game.settings.get("pf2e-jb2a-macros", "imported")) {
		Dialog.confirm({
			title: "Macro Importer",
			content: "<p>Welcome to the <strong>PF2e x JB2A</strong> module. Would you like to import all required actors to your World?",
			yes: () => importAll()
		});
	}
});

async function importAll() {
	await game.packs.get("pf2e-jb2a-macros.Actors").importAll();
	game.settings.set("pf2e-jb2a-macros", "imported", true);
};

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

Hooks.on("createChatMessage", async (data) => {
	if (game.user.id !== data.data.user) return;
	// console.log("PF2e x JB2A Macros | Message Data |", data)
	let targets = data.target?.token ?? data?.data?.flags?.pf2e?.target?.token ?? Array.from(game.user.targets);
	targets = [targets].flat()
	let token = data.token ?? canvas.tokens.controlled[0];
	let flavor = data.data.flavor ?? null;
	let args = data ?? null;

	// Persistent Damage Matches
	if (/Received Fast Healing|Persistent \w+ damage/.test(flavor)) {
		if (game.modules.get("pf2e-persistent-damage")?.active)	{
			return runJB2Apf2eMacro('Persistent Conditions', args)
		} else if (!game.modules.get("pf2e-persistent-damage")?.active) {
			return ui.notifications.error("Please enable the PF2e Persistent Damage module to use the Persistent Conditions macro.")
		}
	}
	// Default Matches
	if (data.isDamageRoll && /Sneak Attack/.test(flavor)) {
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
				console.log("PF2e x JB2A Macros | Playing \"On Hit/Miss\" Critical Success animation")
				AutoAnimations.playAnimation(token, targets, item, {playOnMiss: true, hitTargets: targets}); break;
            case "criticalFailure":
				item = items.find(i => i.data.name.includes("(Critical Failure)"))
				console.log("PF2e x JB2A Macros | Playing \"On Hit/Miss\" Critical Failure animation")
				AutoAnimations.playAnimation(token, targets, item, {playOnMiss: true, hitTargets: !game.settings.get("pf2e-jb2a-macros", "randomHitAnims") ? targets : []}); break;
            case "failure":
				item = items.find(i => i.data.name.includes("(Failure)"))
				console.log("PF2e x JB2A Macros | Playing \"On Hit/Miss\" Failure animation")
				AutoAnimations.playAnimation(token, targets, item, {playOnMiss: true, hitTargets: !game.settings.get("pf2e-jb2a-macros", "randomHitAnims") ? targets : []}); break;
            case "success":
				item = items.find(i => i.data.name.includes("(Success)"))
				console.log("PF2e x JB2A Macros | Playing \"On Hit/Miss\" Success animation")
				AutoAnimations.playAnimation(token, targets, item, {playOnMiss: true, hitTargets: targets}); break;
        }
	}
});

Hooks.on("preUpdateItem", (data, changes) => {
	return runJB2Apf2eMacro('Equipment Changes', {data, changes})
});

Hooks.on("preCreateChatMessage", (data) => {
	if (data.flags.pf2e.casting) data.data.update({ "flags.pf2eJB2AMacros.spellLevel": data?.data?.content.match(/data-spell-lvl="(\d+)"/)[1] ?? null });
});
