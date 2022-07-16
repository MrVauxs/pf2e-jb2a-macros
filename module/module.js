let version = 176

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
		hint: "Certain animations such as Sneak Attack are not configurable in Automated Animations Autorecognition Settings.\nEnable this to use the local macros instead of the ones in the compendium for these specific animations.",
		type: Boolean,
		default: false
	});
	game.settings.register("pf2e-jb2a-macros", "version", {
		scope: "world",
		type: Number,
		default: 0
	});
})

Hooks.on("renderSettings", () => {
	if (!game.user.isGM) return
	if (!game.settings.get("pf2e-jb2a-macros", "imported")) {
		Dialog.confirm({
			title: "Macro Importer",
			content: "<p>Welcome to the <strong>PF2e x JB2A</strong> module. Would you like to import all actors to your World?",
			yes: () => importAll()
		});
	}
})

async function importAll() {
	await game.packs.get("pf2e-jb2a-macros.Actors").importAll();
	game.settings.set("pf2e-jb2a-macros", "imported", true);
	game.settings.set("pf2e-jb2a-macros", "version", version);
}

async function _executeMacroByName(
    macroName,
	args,
    compendiumName = "pf2e-jb2a-macros.Macros"
) {
    const pack = game.packs.get(compendiumName);
    if (pack) {
        const macro_data = game.settings.get("pf2e-jb2a-macros", "useLocalMacros") ? game.macros.getName(macroName).toObject() : (await pack.getDocuments()).find((i) => i.data.name === macroName)?.toObject();

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
}

Hooks.on("createChatMessage", (data) => {
		let targets = Array.from(game.user.targets);
		let token = data.token
        let flavor = data.data.flavor ?? null;
        let args = data ?? null;
		if (game.user.id !== data.data.user) return;
		// Default Matches
        if (/Sneak Attack \+(\d+|\d+d\d+)/.test(flavor)) {
			//let [item] = data.token._actor.items.filter(i => i.name === "Sneak Attack")
			//AutoAnimations.playAnimation(token, targets, item)
			_executeMacroByName('Sneak Attack', args)
		}
		// Persistent Damage Matches
		if (/Received Fast Healing|Persistent \w+ damage/.test(flavor) && game.modules.get("pf2e-persistent-damage")?.active) {
			_executeMacroByName('Persistent Conditions', args)
		} else if (!game.modules.get("pf2e-persistent-damage")?.active) {
			ui.notifications.error("Please enable the PF2e Persistent Damage module to use the the macro.")
		}
})