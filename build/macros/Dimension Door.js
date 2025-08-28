/* {"name":"Dimension Door","img":"systems/pf2e/icons/spells/dimension-door.webp","_id":"kwbdUhAzZv8mv1cX"} */
if (!game.modules.get("jb2a_patreon")?.active) {
  return ui.notifications.error(pf2eAnimations.localize("notifications.noPrem"))
}

const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)

let spellLevel = args[0]?.item?.level ?? 11

if (spellLevel === 11 && args.length !== 0)
  pf2eAnimations.debug(
    "Dimension Door Macro",
    "I have args yet I don't have a proper spell level, defaulting to 11, help?"
  )

let range = spellLevel < 5 ? 120 : 1000

const location = await pf2eAnimations.crosshairs(
  { tokenD, item: args[1]?.item },
  { range, openSheet: false, noCollision: spellLevel < 5 }
)

if (!location || location.cancelled) {
  tokenD.actor.sheet.maximize()
  return
}

await Sequencer.Preloader.preloadForClients([
  "jb2a.magic_signs.rune.conjuration.intro.blue",
  "jb2a.portals.vertical.vortex.blue",
])
const portalScale = (tokenD.w / canvas.grid.size) * 0.6
new Sequence({ moduleName: "PF2e Animations", softFail: true })
  .effect()
  .file("jb2a.magic_signs.rune.conjuration.intro.blue")
  .atLocation(tokenD)
  .scale(portalScale * 0.7)
  .opacity(0.7)
  .waitUntilFinished(-200)
  .effect()
  .file("jb2a.portals.vertical.vortex.blue")
  .atLocation(tokenD, { cacheLocation: true })
  .name("Portal In")
  .center()
  .spriteOffset({ y: -0.5 }, { gridUnits: true })
  .rotateTowards(location, { rotationOffset: 90 })
  .scale(portalScale)
  .duration(1200)
  .fadeIn(200)
  .fadeOut(500)
  .belowTokens()
  .effect() //location.rotationFromOrigin
  .copySprite(tokenD)
  .atLocation(tokenD)
  .shape("circle", {
    radius: 0.8,
    gridUnits: true,
    fillColor: "#ffffff",
    isMask: true,
  })
  .rotate(-location.rotationFromOrigin)
  .spriteRotation(-location.rotationFromOrigin)
  .duration(1000)
  .animateProperty("sprite", "position.y", {
    from: 0,
    to: -1,
    duration: 750,
    gridUnits: true,
    fromEnd: true,
  })
  .scale(tokenD.document.toObject().scale)
  .waitUntilFinished(-750)
  .animation()
  .on(tokenD)
  .opacity(0)
  .effect()
  .file("jb2a.portals.vertical.vortex.blue")
  .atLocation(location)
  .name("Portal Out")
  .center()
  .spriteOffset({ y: -0.5 }, { gridUnits: true })
  .rotateTowards(tokenD, { rotationOffset: 90 })
  .scale(portalScale)
  .duration(1200)
  .fadeIn(200)
  .fadeOut(500)
  .belowTokens()
  .effect() //location.rotationFromOrigin
  .copySprite(tokenD)
  .scale(tokenD.document.toObject().scale)
  .atLocation(location)
  .shape("circle", {
    radius: 0.8,
    gridUnits: true,
    fillColor: "#ffffff",
    isMask: true,
  })
  .rotate(-location.rotationFromOrigin)
  .spriteRotation(-location.rotationFromOrigin)
  .animateProperty("sprite", "position.y", {
    from: 1,
    to: 0,
    duration: 750,
    gridUnits: true,
  })
  .duration(1000)
  .waitUntilFinished(-250)
  .animation()
  .teleportTo(location) // Teleport to location
  .snapToGrid()
  .on(tokenD)
  .opacity(1)
  .thenDo(() => {
    tokenD.actor.sheet.maximize()
  })
  .play()
