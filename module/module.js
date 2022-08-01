let version = 181;

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
	game.settings.register("pf2e-jb2a-macros", "version", {
		scope: "world",
		type: Number,
		default: 0
	});
	game.settings.register("pf2e-jb2a-macros", "version-previous", {
		scope: "world",
		type: Number,
		default: 0
	});
});

Hooks.on("ready", () => {
	if (game.settings.get("pf2e-jb2a-macros", "version") < version) {
		game.settings.set("pf2e-jb2a-macros", "version-previous", game.settings.get("pf2e-jb2a-macros", "version"));
		game.settings.set("pf2e-jb2a-macros", "version", version);
		let previousVersion = game.settings.get("pf2e-jb2a-macros", "version-previous")
		console.log("Updated from PF2e JB2A Macros v" + previousVersion + " to v" + version + ".");
	} else console.log("PF2e JB2A Macros v" + game.settings.get("pf2e-jb2a-macros", "version") + " loaded");
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
// Thanks xdy for pretty much this entire function.
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

Hooks.on("createChatMessage", (data) => {
	let targets = Array.from(game.user.targets);
	let token = data.token
	let flavor = data.data.flavor ?? null;
	let args = data ?? null;
	if (game.user.id !== data.data.user) return;

	// Default Matches
	if (/Sneak Attack \+(\d+|\d+d\d+)/.test(flavor)) {
		let [sneak] = data.token._actor.items.filter(i => i.name === "Sneak Attack")
		return AutoAnimations.playAnimation(token, targets, sneak)
		// runJB2Apf2eMacro('Sneak Attack', args)
	}
	// Persistent Damage Matches
	if (/Received Fast Healing|Persistent \w+ damage/.test(flavor)) {
		if (game.modules.get("pf2e-persistent-damage")?.active)	{
			return runJB2Apf2eMacro('Persistent Conditions', args)
		} else if (!game.modules.get("pf2e-persistent-damage")?.active) {
			return ui.notifications.error("Please enable the PF2e Persistent Damage module to use the Persistent Conditions macro.")
		}
	}
});

Hooks.on("preUpdateItem", (data, changes) => {
	return runJB2Apf2eMacro('Equipment Changes', {data, changes})
});

Hooks.on("preCreateChatMessage", (data) => {
	if (data.flags.pf2e.casting) data.data.update({ "flags.pf2eJB2AMacros.spellLevel": data?.data?.content.match(/data-spell-lvl="(\d+)"/)[1] ?? null });
});