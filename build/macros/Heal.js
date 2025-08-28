/* {"name":"Heal","img":"systems/pf2e/icons/spells/heal.webp","_id":"BTiU7cD7DOpDFIWQ"} */
if (!scope?.args)
  return ui.notifications.warn(
    "PF2e Animations | Heal macro has been triggered with no arguments. If this was a manual activation, please use the actual spell instead."
  )

function undeadOrNot(actor) {
  let modeOfBeing = actor?.modeOfBeing === "living" ? false : true

  // If it has negative healing, or dhampir trait, or undead trait, it's undead.
  if (
    actor?.system?.attributes?.hp?.negativeHealing ||
    actor?.traits?.find((trait) => trait === "dhampir" || trait === "undead")
  )
    modeOfBeing = true

  return modeOfBeing
}

console.log(args)

const sourceToken = args[1].sourceToken
const targets = args[1].hitTargets
const seq = new Sequence({ inModuleName: "PF2e Animations", softFail: true })
const spell = args[1].item
const traits = spell.system.traits.value
let tradition

if (traits.includes("primal")) tradition = "primal"
if (traits.includes("divine")) tradition = "divine"

seq
  .effect()
  .file(
    `jb2a.cast_shape.circle.01.${tradition === "divine" ? "yellow" : "green"}`
  )
  .copySprite(sourceToken)
  .scaleToObject(2.5)
  .aboveLighting()
  .zIndex(2)
  .effect()
  .file(
    `jb2a.divine_smite.caster.${
      tradition === "divine" ? "blueyellow" : "greenorange"
    }`
  )
  .copySprite(sourceToken)
  .scaleToObject(2)
  .aboveLighting()
  .zIndex(1)
  .waitUntilFinished()

if (args[0]?.collectionName === "templates") {
  const template = args[0]

  // Burst
  seq
    .effect()
    .file(
      `jb2a.template_circle.out_pulse.02.burst.${
        tradition === "divine" ? "yellowwhite" : "greenorange"
      }`
    )
    .scaleToObject()
    .atLocation(template, { bindVisibility: false })
    .thenDo(() => {
      if (args[2].deleteTemplate) template.delete()
    })

  // Every Target in Range
  canvas.tokens.placeables
    .filter((x) => x.actor.type === "npc" || x.actor.type === "character")
    .forEach((token) => {
      // Undead casters don't want to hurt themselves, do they?
      if (token.id === sourceToken.id && undeadOrNot(sourceToken.actor)) return

      const ray = new Ray(token.center, template)
      const distance = canvas.grid.measureDistances([{ ray }])

      // Exit early if out of range.
      if (distance > template.distance) return

      seq
        .effect()
        .file(
          `jb2a.magic_missile.${tradition === "divine" ? "yellow" : "green"}`
        )
        .stretchTo(token, { randomOffset: 0.5 })
        .copySprite(sourceToken)
        .randomizeMirrorY()
        .repeats(2)
        .effect()
        .delay(1000)
        .file(
          undeadOrNot(token.actor)
            ? `jb2a.divine_smite.target.${
                tradition === "divine" ? "blueyellow" : "greenyellow"
              }`
            : `jb2a.healing_generic.200px.${
                tradition === "divine" ? "yellow02" : "green"
              }`
        )
        .scaleToObject(1.5)
        .attachTo(token)
    })
} else {
  targets.forEach((token) => {
    seq
      .effect()
      .stretchTo(token, { randomOffset: 0.5 })
      .copySprite(sourceToken)
      .file(
        sourceToken.distanceTo(token) > sourceToken.actor.attributes.reach.base
          ? `jb2a.magic_missile.${tradition === "divine" ? "yellow" : "green"}`
          : undeadOrNot(token.actor)
          ? `jb2a.unarmed_strike.magical.01.${
              tradition === "divine" ? "yellow" : "green"
            }`
          : `jb2a.bullet.01.${tradition === "divine" ? "orange" : "green"}`
      )
      .waitUntilFinished(-1000)

    if (
      sourceToken.distanceTo(token) > sourceToken.actor.attributes.reach.base
    ) {
      seq.randomizeMirrorY().repeats(2)
    }

    seq
      .effect()
      .file(
        undeadOrNot(token.actor)
          ? `jb2a.divine_smite.target.${
              tradition === "divine" ? "blueyellow" : "greenyellow"
            }`
          : `jb2a.healing_generic.200px.${
              tradition === "divine" ? "yellow02" : "green"
            }`
      )
      .scaleToObject(1.5)
      .attachTo(token)
  })
}

seq.play()
