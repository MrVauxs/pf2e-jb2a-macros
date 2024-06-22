/* {"name":"Grim Tendrils","img":"icons/magic/unholy/energy-smoke-pink.webp","_id":"pC8bqYNdqGeeUoWO"} */
const template =
  args[1]?.templateData ??
  canvas.templates.placeables[canvas.templates.placeables.length - 1]
new Sequence({ moduleName: "PF2e Animations", softFail: true })
  .effect()
  .file("jb2a.energy_strands.range.multiple.purple.01")
  .fadeIn(500)
  .fadeOut(500)
  .atLocation(template)
  .rotateTowards(template)
  .stretchTo(template, { offset: { x: 0, y: -50 } })
  .scale({ x: 1.4 })
  .spriteOffset({ x: -50 })
  .play()
