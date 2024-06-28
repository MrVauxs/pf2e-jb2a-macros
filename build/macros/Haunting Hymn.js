/* {"name":"Haunting Hymn","img":"systems/pf2e/icons/spells/haunting-hymn.webp","_id":"OOYnWts6o8nGdhC6"} */
const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)
const template =
  args[1]?.templateData ??
  canvas.templates.placeables[canvas.templates.placeables.length - 1]
const [templateX, templateY] = [template.data.x, template.data.y]
new Sequence({ moduleName: "PF2e Animations", softFail: true })
  .effect()
  .file("jb2a.template_circle.out_pulse.01.burst")
  .mask(template)
  .atLocation(tokenD)
  .randomRotation()
  .play()
