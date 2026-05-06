const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

class BlacklistMenu extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "blacklistMenu",
    classes: ["pf2e-animations"],
    tag: "form",
    window: {
      title: "Change Blacklist Settings",
      contentClasses: ["standard-form"],
    },
    position: { width: 400, height: "auto" },
    actions: {
      save: BlacklistMenu._onSave,
      saveUpdate: BlacklistMenu._onSaveUpdate,
    },
  };

  static PARTS = {
    body: {
      template: "modules/pf2e-jb2a-macros/templates/blacklist.hbs",
    },
  };

  async _prepareContext() {
    const settings = await game.settings.get("pf2e-jb2a-macros", "blacklist");

    const disabledSections = settings.menu.reduce((acc, name) => {
      acc[name] = true;
      return acc;
    }, {});

    const entries = settings.entries.join(", ");

    return {
      disabledSections,
      entries,
    };
  }

  async _save(updateAnimations) {
    const root = this.element;
    const disabledSections = [];
    root.querySelectorAll('input[type="checkbox"]').forEach((element) => {
      if (element.checked) disabledSections.push(element.id.substr(8));
    });
    const entries = root
      .querySelector("textarea#anim-entries")
      .value.split(",")
      .map((s) => s.trim());

    await game.settings.set("pf2e-jb2a-macros", "blacklist", {
      menu: disabledSections,
      entries,
    });

    if (updateAnimations) {
      new autorecUpdateFormApplication().render(true);
    }

    return this.close();
  }

  static async _onSave(event, target) {
    return this._save(false);
  }

  static async _onSaveUpdate(event, target) {
    return this._save(true);
  }
}

pf2eAnimations.blacklistMenu = BlacklistMenu;
