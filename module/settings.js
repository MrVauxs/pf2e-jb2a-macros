Hooks.once("init", () => {
    // updateMenu.js
    game.settings.registerMenu("pf2e-jb2a-macros", "autorecUpdate", {
        name: game.i18n.localize("pf2e-jb2a-macros.settings.autorecUpdate.name"),
        label: game.i18n.localize("pf2e-jb2a-macros.settings.autorecUpdate.label"),
        icon: "fa-solid fa-wrench",
        type: autorecUpdateFormApplication,
        restricted: true
    });

    //#region Settings
    game.settings.register("pf2e-jb2a-macros", "autoUpdate", {
        scope: "world",
        config: true,
        name: game.i18n.localize("pf2e-jb2a-macros.settings.autoUpdate.name"),
        hint: game.i18n.localize("pf2e-jb2a-macros.settings.autoUpdate.hint"),
        type: Boolean,
        default: true
    });
    game.settings.register("pf2e-jb2a-macros", "killAnimationsOnKill", {
        scope: "world",
        config: true,
        name: game.i18n.localize("pf2e-jb2a-macros.settings.killAnimationsOnKill.name"),
        hint: game.i18n.localize("pf2e-jb2a-macros.settings.killAnimationsOnKill.hint"),
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
    game.settings.register("pf2e-jb2a-macros", "tmfx", {
        scope: "world",
        config: game.modules.get("tokenmagic")?.active ?? false, // Only show if TokenMagic is active
        name: game.i18n.localize("pf2e-jb2a-macros.settings.tmfx.name"),
        hint: game.i18n.localize("pf2e-jb2a-macros.settings.tmfx.hint"),
        type: Boolean,
        default: false
    });

    game.settings.register("pf2e-jb2a-macros", "debug", {
        scope: "client",
        config: true,
        name: game.i18n.localize("pf2e-jb2a-macros.settings.debug.name"),
        hint: game.i18n.localize("pf2e-jb2a-macros.settings.debug.hint"),
        type: Boolean,
        default: false
    });
    // #endregion

    //#region Data Storage
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
        default: {
            menu: [],
            entries: [],
        }
    });
    //#endregion
});

Hooks.once("ready", () => {
    if (!game.modules.get("tokenmagic")?.active) {
        game.settings.set("pf2e-jb2a-macros", "tmfx", false)
    }
})
