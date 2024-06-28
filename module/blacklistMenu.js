class BlacklistMenu extends FormApplication {
  async getData() {
    const settings = await game.settings.get("pf2e-jb2a-macros", "blacklist")

    const disabledSections = settings.menu.reduce((acc, name) => {
      acc[name] = true
      return acc
    }, {})

    const entries = settings.entries.join(", ")

    return {
      disabledSections,
      entries,
    }
  }

  activateListeners(html) {
    html.find("button#save").on("click", () => this.submit(html, false))
    html.find("button#save-update").on("click", () => this.submit(html, true))
  }

  async submit(html, updateAnimations) {
    const disabledSections = []
    html.find(`input[type="checkbox"]`).each((index, element) => {
      if (element.checked) disabledSections.push(element.id.substr(8))
    })
    const entries = html
      .find("textarea#anim-entries")
      .val()
      .split(",")
      .map((s) => s.trim())

    await game.settings.set("pf2e-jb2a-macros", "blacklist", {
      menu: disabledSections,
      entries,
    })

    if (updateAnimations) {
      new autorecUpdateFormApplication().render(true)
    }

    this.close()
  }

  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      title: "Change Blacklist Settings",
      id: "blacklistMenu",
      template: "modules/pf2e-jb2a-macros/templates/blacklist.hbs",
      width: 400,
    }
  }
}

pf2eAnimations.blacklistMenu = BlacklistMenu
