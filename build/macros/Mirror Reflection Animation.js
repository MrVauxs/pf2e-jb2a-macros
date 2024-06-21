/* {"name":"Mirror Reflection Animation","img":"icons/magic/control/energy-stream-link-large-blue.webp","_id":"lnR41a9tdyiP4ipr"} */
const [tokenD, tokenScale, allTargets, hitTargets, targets, target] =
  await pf2eAnimations.macroHelpers(args)

let copies = game.canvas.tokens.placeables
  .filter((x) => x?.actor?.uuid === tokenD.actor.uuid)
  .filter((x) => x !== target)

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

shuffleArray(copies)

let sequ = new Sequence()
  .sound()
  .file("modules/pf2e-jb2a-macros/assets/sounds/mirror_*.wav")

copies.forEach((copyToken, index) => {
  sequ
    .effect()
    .from(copyToken)
    .moveTowards(target, { rotate: false, ease: "easeInOutBack" })
    .scale(tokenD.document.texture.scaleX)
    .moveSpeed(200)
    .loopProperty("alphaFilter", "alpha", {
      values: [1, 0.6],
      duration: 500,
      pingPong: true,
    })
    .duration(2000)
    .waitUntilFinished(index + 1 >= copies.length ? -200 : false)
})

sequ.animation().on(target).fadeIn(100).play()
