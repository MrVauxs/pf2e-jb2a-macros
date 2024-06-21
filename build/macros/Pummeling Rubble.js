/* {"name":"Pummeling Rubble","img":"systems/pf2e/icons/spells/pummeling-rubble.webp","_id":"nlYSBFttAhdWpyla"} */
const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)
const template =
  args[1]?.templateData ??
  canvas.templates.placeables[canvas.templates.placeables.length - 1]
const [templateX, templateY] = [template.data.x, template.data.y]
new Sequence({ moduleName: "PF2e Animations", softFail: true })
  .effect()
  .file("jb2a.falling_rocks.side.1x1", true)
  .mask(template)
  .atLocation(tokenD)
  .stretchTo(template, { offset: { x: 100 } })
  .fadeOut(400)
  .scale({ x: 0.7, y: 1.0 })
  .play()
