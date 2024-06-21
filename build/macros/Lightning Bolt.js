/* {"name":"Lightning Bolt","img":"systems/pf2e/icons/spells/lightning-bolt.webp","_id":"j1cUixlhlZBbeM1r"} */
// Original Author: EskieMoh#2969
// Rebuilt by: MrVauxs#8622
// Requires a pre-placed template.

const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)

const template =
  args[1]?.templateData ??
  canvas.templates.placeables[canvas.templates.placeables.length - 1]
new Sequence({ moduleName: "PF2e Animations", softFail: true })
  .effect()
  .file("jb2a.divine_smite.caster.blueyellow", true)
  .filter("ColorMatrix", {
    hue: 100,
    contrast: 1,
    saturate: 0,
  })
  .tint("#7DF9FF")
  .attachTo(tokenD)
  .scaleToObject(2 * tokenScale)
  .zIndex(2)
  .waitUntilFinished(-500)
  .effect()
  .file("jb2a.static_electricity.03.blue", true)
  .attachTo(tokenD)
  .scaleToObject(1.5 * tokenScale)
  .fadeOut(500)
  .repeats(2, 4000, 4000)
  .effect()
  .file("jb2a.lightning_ball.blue", true)
  .atLocation(tokenD)
  .fadeOut(500)
  .duration(3000)
  .scale(0.3)
  .center()
  .animateProperty("spriteContainer", "position.x", {
    from: 0,
    to: 0.32,
    duration: 1000,
    delay: 500,
    gridUnits: true,
    ease: "easeOutBack",
  })
  .rotateTowards(template, { cacheLocation: true })
  .zIndex(1)
  .waitUntilFinished(-1000)
  .effect()
  .file("jb2a.lightning_ball.blue", true)
  .atLocation(tokenD)
  .fadeIn(500)
  .fadeOut(500)
  .anchor({ x: 0.24 })
  .duration(3000)
  .scale(0.3)
  .rotateTowards(template, { cacheLocation: true })
  .zIndex(4)
  .wait(2000)
  .effect()
  .file("jb2a.impact.011.blue", true)
  .atLocation(tokenD)
  .anchor({ x: 0.15 })
  .scale(0.3)
  .rotateTowards(template, { cacheLocation: true })
  .zIndex(3)
  .effect()
  .file("jb2a.lightning_bolt.wide.blue", true)
  .atLocation(template, { cacheLocation: true })
  .scale(0.45)
  .stretchTo(template, { onlyX: true, tiling: true, cacheLocation: true })
  .zIndex(3)
  .play()
