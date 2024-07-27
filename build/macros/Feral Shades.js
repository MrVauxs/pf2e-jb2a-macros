/* {"name":"Feral Shades","img":"systems/pf2e/icons/spells/feral-shades.webp","_id":"62nzP4aLTMC5DNF7"} */
const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)
const template =
  args[1]?.templateData ??
  canvas.templates.placeables[canvas.templates.placeables.length - 1]
const [templateX, templateY] = [template.x, template.y]
new Sequence({ moduleName: "PF2e Animations", softFail: true })
  .effect()
  .file("jb2a.darkness.black")
  .mask(template)
  .atLocation(tokenD)
  .opacity(0.8)
  .fadeIn(500)
  .fadeOut(500)
  .duration(10000)
  .scale(0.2)
  .animateProperty("sprite", "scale.x", {
    from: 0,
    to: 2,
    duration: 2500,
    ease: "easeOutCirc",
  })
  .animateProperty("sprite", "scale.y", {
    from: 0,
    to: 2,
    duration: 2500,
    ease: "easeOutCirc",
  })
  .effect()
  .file("jb2a.energy_strands.range.standard.dark_purple.01")
  .mask(template)
  .atLocation(template)
  .zIndex(1)
  .stretchTo(template, { randomOffset: true })
  .repeats(50, 0, 500)
  .play()
