/* {"name":"Sudden Charge","img":"icons/skills/movement/ball-spinning-blue.webp","_id":"OrBFtL6vBRyDHgfV"} */
const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)

ui.notifications.info(game.i18n.localize("pf2e-jb2a-macros.macro.suddenCharge.notif"))
await Sequencer.Preloader.preloadForClients("jb2a.gust_of_wind.veryfast")

tokenD.actor.sheet.minimize();

for (let i = 0; i < 2; i++) {
    const location = await pf2eAnimations.crosshairs({ tokenD }, {
        crosshairConfig: {
            label: `${game.i18n.localize("pf2e-jb2a-macros.macro.suddenCharge.suddenCharge")} ` + (i + 1)
        },
        noCollisionType: "move"
    })

    console.log(location)

    if (location === false || location.cancelled) return;

    await new Sequence({ moduleName: "PF2e Animations", softFail: true })
        .animation()
            .on(tokenD)
            .moveTowards(location)
            .moveSpeed(400)
            .snapToGrid()
            .offset({ x: -(canvas.scene.grid.size / 2), y: -(canvas.scene.grid.size / 2) })
        .effect()
            .file("jb2a.gust_of_wind.veryfast", true)
            .atLocation(tokenD, { cacheLocation: true })
            .stretchTo(location, { onlyX: true })
            .randomizeMirrorY()
            .belowTokens()
            .fadeOut(1000)
            .scale(0.5 * tokenD.document.height)
        .play()
}

tokenD.actor.sheet.maximize();