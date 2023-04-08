self.pf2eAnimations.modifiersMatter = Hooks.on("modifiersMatter", ({
    rollingActor,
    targetedToken, // can be undefined
    significantModifiers, // list of: {name: string, value: number, significance: string}
    chatMessage,
}) => {
    const rollingToken = chatMessage.token ?? canvas.tokens.placeables.find(tok => tok.actor === rollingActor)
    if (!rollingToken) return pf2eAnimations.debug("No token found for the Modifier Matter animation.", data);

    const combinedMenu = Object.keys(AutomatedAnimations.AutorecManager.getAutorecEntries()).map((key) => {
        const menus = AutomatedAnimations.AutorecManager.getAutorecEntries()
        if (Array.isArray(menus[key])) {
            return menus[key]
        }
    }).flat()

    significantModifiers.forEach(({ name, significance }) => {
        pf2eAnimations.debug(`Modifiers Matter:`, `${name} (${significance})`);

        let animationName = false
        if (combinedMenu.find((x) => x?.label === `Modifiers Matter: ${name} (${significance})`)) {
            animationName = `Modifiers Matter: ${name} (${significance})`
        } else if (combinedMenu.find((x) => x?.label === `Modifiers Matter: ${name}`)) {
            animationName = `Modifiers Matter: ${name}`
        }

        if (!name) {
            return pf2eAnimations.debug(`Modifiers Matter | No Animation Found for:`, `${name} (${significance})`);
        } else {
            AutomatedAnimations.playAnimation(
                rollingToken,
                {
                    name: animationName
                },
                {
                    targets: [targetedToken]
                }
            )
        }
    });
});
