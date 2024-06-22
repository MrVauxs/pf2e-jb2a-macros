/* {"name":"Persistent Conditions","img":"icons/skills/wounds/blood-drip-droplet-red.webp","_id":"Q0hKSbLmADnVbKQB"} */
let tokenD = args[0].token
let type = args[0].flavor.match(/Received (regeneration|fast healing)/g)
  ? "healing"
  : args[0].rolls[0].formula.replaceAll(/.+ /g, "").trim()
let color = "jb2a.liquid.splash.red"
let scale = 1.5
let below = false

switch (type.toLowerCase()) {
  case "piercing":
  case "slashing":
  case "bleed":
    color = "jb2a.liquid.splash.red"
    break
  case "acid":
    color = "jb2a.liquid.splash.green"
    break
  case "bludgeoning":
    below = true
    scale = 2.5
    color = "jb2a.impact.ground_crack.blue.03"
    break
  case "good":
    color = "jb2a.divine_smite.caster.yellowwhite"
    break
  case "evil":
    color = "jb2a.divine_smite.caster.dark_red"
    break
  case "lawful":
    color = "jb2a.divine_smite.caster.orange"
    break
  case "chaotic":
    color = "jb2a.divine_smite.caster.purplepink"
    break
  case "sonic":
    color = "jb2a.thunderwave.center.blue"
    break
  case "electricity":
    scale = 2
    color = "jb2a.token_border.circle.static.blue.003"
    break
  case "cold":
    scale = 2
    color = "jb2a.impact_themed.ice_shard.blue"
    break
  case "force":
    below = true
    scale = 3
    color = "jb2a.impact.ground_crack.blue.01"
    break
  case "mental":
    color = "jb2a.magic_signs.rune.enchantment.intro.purple"
    break
  case "poison":
    color = "jb2a.icon.poison.dark_green"
    break
  case "negative":
    color = "jb2a.healing_generic.200px.purple"
    break
  case "positive":
    color = "jb2a.healing_generic.400px.yellow"
    break
  case "healing":
    color = "jb2a.healing_generic.400px.green"
    break
  case "fire":
    color = "jb2a.shield_themed.below.fire.02.orange"
    break
  default:
    ui.notifications.error(`Can't find animation for ${type}`)
}

new Sequence({ moduleName: "PF2e Animations", softFail: true })
  .effect()
  .belowTokens(below)
  .fadeIn(500)
  .fadeOut(500)
  .attachTo(tokenD)
  .scaleToObject(scale)
  .file(color)
  .duration(1200)
  .play()
