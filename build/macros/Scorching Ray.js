/* {"name":"Scorching Ray","img":"systems/pf2e/icons/spells/scorching-ray.webp","_id":"OOKf1Stu6m8HZNWA"} */
// Original Author: EskieMoh#2969
// Remastered by: MrVauxs#8622

const assets = game.modules.get("JB2A_DnD5e")?.active
  ? ["jb2a.particles.outward.greenyellow.02.05", { saturate: -1 }]
  : ["jb2a.particles.outward.orange.02.05", {}]

const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)
let targets = Array.from(game.user.targets)

if (!tokenD) {
  ui.notifications.error("No token found.")
  return
}

let targetDialogue = []
let rayCount = []

if (game.system.id === "pf2e") {
  for (let i of targets.keys()) {
    rayCount.push(1)
  }
} else {
  targetDialogue.push({
    type: "info",
    label: `Up to 10 each.`,
  })
  for (let i of targets.keys()) {
    targetDialogue.push({
      type: "number",
      label: `Rays to ${targets[i].name}`,
    })
  }
  rayCount = await warpgate.dialog(targetDialogue, "🔥Scorching Ray🔥", "Cast!")
}

rayCount = rayCount.filter(Number).map((x) => Math.min(x, 10))

rayCount.map((ray, index) => {
  let target = targets[index]

  new Sequence({ moduleName: "PF2e Animations", softFail: true })
    .effect()
    .file("jb2a.magic_signs.circle.02.evocation.loop.yellow", true)
    .attachTo(tokenD, { offset: { x: -0.5 }, gridUnits: true, local: true })
    .fadeIn(500)
    .fadeOut(500)
    .scaleToObject(2.25)
    .rotateTowards(target, { attachTo: true })
    .duration(5000)
    .scale({ x: 1, y: 2 })
    .rotateIn(360, 2000, { ease: "easeInOutBack" })
    .scaleOut(0.2, 2000, { ease: "easeOutQuint", delay: -4000 })
    .effect()
    .filter("ColorMatrix", assets[1])
    .file(assets[0], true)
    .attachTo(tokenD, { offset: { x: -0.5 }, gridUnits: true, local: true })
    .fadeIn(500)
    .fadeOut(500)
    .scaleToObject(2.25)
    .rotateTowards(target, { attachTo: true })
    .duration(5000)
    .scale({ x: 1, y: 2 })
    .rotateIn(360, 2000, { ease: "easeInOutBack" })
    .scaleOut(0.3, 2000, { ease: "easeOutQuint", delay: -4000 })
    .wait(3000)
    .effect()
    .from(tokenD)
    .filter("ColorMatrix", { contrast: 1, saturate: 1 })
    .attachTo(tokenD)
    .duration(1500 + Math.abs(ray) * 300)
    .fadeIn(500)
    .scaleToObject(tokenD.document.data.scale)
    .fadeOut(500)
    .opacity(0.3)
    .filter("Blur", { blurX: 10, blurY: 20 })
    .tint("#ffbd2e")
    .effect()
    .file("jb2a.scorching_ray.orange", true)
    .attachTo(tokenD, { offset: { x: 0.4 }, gridUnits: true, local: true })
    .stretchTo(target, { attachTo: true })
    .repeats(Math.abs(ray), 250, 250)
    .randomizeMirrorY()
    .wait(200)
    .effect()
    .from(target)
    .filter("ColorMatrix", { contrast: 1, saturate: 1 })
    .attachTo(target)
    .duration(1500)
    .fadeIn(500)
    .fadeOut(500)
    .scaleToObject(target.document.data.scale)
    .opacity(0.3)
    .filter("Blur", { blurX: 10, blurY: 20 })
    .tint("#ffbd2e")
    .play()
})
