/* {"name":"Web","img":"systems/pf2e/icons/spells/web.webp","_id":"X6PZ0lboOsQSY8KO"} */
const template =
  args[1]?.templateData ??
  canvas.templates.placeables[canvas.templates.placeables.length - 1]
new Sequence({ moduleName: "PF2e Animations", softFail: true })
  .effect()
  .file("jb2a.web.01", true)
  .mask(template)
  .attachTo(template)
  .persist()
  .scaleToObject()
  .belowTokens()
  .name("Web Spell")
  .effect()
  .file("jb2a.web.01", true)
  .mask(template)
  .attachTo(template)
  .persist()
  .opacity(0.3)
  .scaleToObject()
  .name("Web Spell")
  .play()
