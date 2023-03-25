self.pf2eAnimations.modifiersMatter = Hooks.on("modifiersMatter", ({
    rollingActor,
    targetedToken, // can be undefined
    significantModifiers, // list of: {name: string, value: number, significance: string}
    chatMessage,
}) => {
    const rollingToken = chatMessage.token ?? canvas.tokens.placeables.find(tok => tok.actor === rollingActor)
    if (!rollingToken) return pf2eAnimations.debug("No token found for the Modifier Matter animation.", data);

    significantModifiers.forEach(({ name, significance }) => {
        AutomatedAnimations.playAnimation(
            rollingToken,
            {
                name: `Modifiers Matter: ${name} (${significance})`
            },
            {
                targets: [targetedToken]
            }
        )
    });
});
