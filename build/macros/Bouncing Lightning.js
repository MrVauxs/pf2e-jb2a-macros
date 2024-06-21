/* {"name":"Bouncing Lightning","img":"systems/pf2e/icons/spells/electric-arc.webp","_id":"1dUKN6KL7g3cdDdz"} */
// Affected by Interface Volume

const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)
let targetTokens = Array.from(game.user.targets)
if (targetTokens.length === 0) return

let sequence = new Sequence({ moduleName: "PF2e Animations", softFail: true })
  .effect()
  .file("jb2a.chain_lightning.primary.blue", true)
  .atLocation(tokenD)
  .stretchTo(targetTokens[0])
  .waitUntilFinished(-1100)
  .sound()
  .volume(0.3)
  .file(
    "modules/soundfxlibrary/Combat/Single/Spell%20Impact%20Lightning/spell-impact-lightning-3.mp3",
    true,
    true
  )
  .fadeInAudio(500)
  .fadeOutAudio(500)
  .effect()
  .file("jb2a.static_electricity.02.blue", true)
  .atLocation(targetTokens[0])
  .scaleToObject(1.2)
  .repeats(2)
  .wait(100)
for (let i = 1; i < targetTokens.length; i++) {
  sequence
    .effect()
    .file("jb2a.chain_lightning.secondary.blue", true)
    .repeats(2)
    .atLocation(targetTokens[i - 1])
    .stretchTo(targetTokens[i])
    .wait(200)
    .sound()
    .volume(0.3)
    .file(
      "modules/soundfxlibrary/Combat/Single/Spell%20Impact%20Lightning/spell-impact-lightning-4.mp3",
      true,
      true
    )
    .fadeInAudio(500)
    .fadeOutAudio(500)
    .effect()
    .file("jb2a.static_electricity.02.blue", true)
    .atLocation(targetTokens[i])
    .scaleToObject(1.2)
    .repeats(2)
    .wait(200)
}
sequence.play()
