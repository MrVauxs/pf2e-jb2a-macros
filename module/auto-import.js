let version = 111

Hooks.on("init", () => {
	game.settings.register("pf2e-jb2a-macros", "imported", {
		scope: "world",
		config: true,
		name: "Imported Contents",
		hint: "Whether or not you have imported the contents of the module using the pop-up when you enabled the module.\nDisable to have them imported again automatically.",
		type: Boolean,
		default: false
	});
})

Hooks.on("renderSettings", () => {
	if (!game.settings.get("pf2e-jb2a-macros", "imported")) {
		Dialog.confirm({
			title: "Macro Importer",
			content: "<p>Welcome to the <strong>PF2e x JB2A</strong> module. Would you like to import all content to your World?",
			yes: () => importAllMacros()
		});
	}
})

async function importAllMacros() {
	const module = game.modules.get("pf2e-jb2a-macros");
	let scenes = null;
	let actors = null;
	for (let p of module.packs) {
		const pack = game.packs.get("pf2e-jb2a-macros." + p.name);
		await pack.importAll();
		if (p.entity === "Macro") macros = game.folders.getName(p.label);
		if (p.entity === "Actor") actors = game.folders.getName(p.label);
	}
	return game.settings.set("pf2e-jb2a-macros", "imported", true);
}