/* {"name":"Acid Flask","img":"systems/pf2e/icons/equipment/alchemical-items/alchemical-bombs/acid-flask.webp","_id":"SaXHztUmj7Fh9G58"} */
// Can be used standalone!

let tokenD = args[1]?.sourceToken ?? canvas.tokens.controlled[0]
let targets = args[1]?.allTargets ?? Array.from(game.user.targets)
let target = targets[0]

if (!tokenD || !target) {
  return ui.notifications.error(
    `Missing a ${!tokenD ? "selected token" : ""}${
      !tokenD && !target ? " and " : ""
    }${!target ? "target" : ""}.`
  )
}

let projectile = ""
let explosion = [""]
let explosionRemains = [""]
let seqe = new Sequence({ moduleName: "PF2e Animations", softFail: true })
let splashBonus = 3
let mods = [{ label: `No Modifications`, value: 0 }]
let options

// Special feats

if (tokenD.actor.data.items.filter((x) => x.name === "Bomber").length)
  mods.push({
    label: `<a class="entity-link content-link" data-pack="pf2e.classfeatures" data-id="7JbiaZ8bxODM5mzS"><i class="fas fa-suitcase"></i> Bomber</a>`,
    value: "Bomber",
  })
if (tokenD.actor.data.items.filter((x) => x.name === "Expanded Splash").length)
  mods.push({
    label: `<a class="entity-link content-link" data-pack="pf2e.feats-srd" data-id="gyVcJfZTmBytLsXq"><i class="fas fa-suitcase"></i> Expanded Splash</a>`,
    value: "Expanded",
  })
if (
  tokenD.actor.data.items.filter((x) => x.name === "Directional Bombs").length
)
  mods.push({
    label: `<a class="entity-link content-link" data-pack="pf2e.feats-srd" data-id="ozvYhY4hG1deXly8"><i class="fas fa-suitcase"></i> Directional Bombs</a>`,
    value: "Directional",
  })

if (mods.length > 1) {
  options = await warpgate.buttonDialog({ buttons: mods }, "column")
}
// check for Expanded Splash and Bomber's singular splash feature and add 3 to splashBonus

seqe
  .effect()
  .file("jb2a.throwable.throw.flask.03.green")
  .atLocation(tokenD)
  .stretchTo(target)
  .fadeIn(300)
  .waitUntilFinished(-200)
  .macro(
    options == "Directional"
      ? "Compendium.pf2e-jb2a-macros.Macros.Cone Template"
      : "",
    target,
    {},
    [
      "jb2a.liquid.splash_side.bright_green",
      "jb2a.explosion.side_fracture.flask.03",
    ]
  )
  .effect()
  .playIf(options !== "Directional")
  .file("jb2a.liquid.splash.bright_green")
  .atLocation(target)
  .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
  .effect()
  .playIf(options !== "Directional")
  .file("jb2a.explosion.side_fracture.flask.03")
  .offset({ x: 0.5, y: 0.5 }, { gridUnits: true })
  .atLocation(target)
  .rotate(180)
  .rotateTowards(token)
  .play()
