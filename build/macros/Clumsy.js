/* {"name":"Clumsy","img":"icons/skills/movement/feet-winged-boots-brown.webp","_id":"XSlxNRM032wVYBBw"} */
return // WIP
let token = args[1].sourceToken
let conditionOverhead = Sequencer.EffectManager.getEffects({
  name: `${token.name} - Conditions Overhead*`,
  object: token,
})

console.log(conditionOverhead)

if (args[0] == "on") {
  new Sequence({ moduleName: "PF2e Animations", softFail: true })
    .effect()
    .name(`${token.name} - Conditions Overhead - Clumsy`)
    .attachTo(token, { bindAlpha: false })
    .copySprite(token)
    .loopProperty("spriteContainer", "rotation", {
      values: [0, 5, 0, -5],
      duration: 2000,
      pingPong: true,
    })
    .persist()
    .fadeOut(500)
    .animation()
    .on(token)
    .fadeOut(100)
    .play()
} else if (args[0] == "off") {
  new Sequence({ moduleName: "PF2e Animations", softFail: true })
    .animation()
    .fadeIn(100)
    .on(token)
    .play()
  await Sequencer.EffectManager.endEffects({
    name: `${token.name} - Conditions Overhead - Clumsy`,
    object: token,
  })
}
