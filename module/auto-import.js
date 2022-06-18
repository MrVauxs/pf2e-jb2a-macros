let version = 174

Hooks.on("init", () => {
	game.settings.register("pf2e-jb2a-macros", "imported", {
		scope: "world",
		config: true,
		name: "Imported Contents",
		hint: "Whether or not you have imported the contents of the module using the pop-up when you enabled the module.\nDisable to have them imported again automatically.",
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