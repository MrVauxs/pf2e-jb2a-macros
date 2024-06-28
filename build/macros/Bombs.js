/* {"name":"Bombs","img":"icons/magic/fire/explosion-fireball-small-blue.webp","_id":"Vug9mAtV6Zne3G6K"} */
// Cannot be used standalone.

if (!args.length) return

let tokenD = args[1].sourceToken
let targets = args[1].allTargets
let target = targets[0]
let rinsedName = args[1].rinsedName.replaceAll(/\(.+\)/g, "")

let projectile = ""
let explosion = [""]
let explosionRemains = [""]
let seq = new Sequence({ moduleName: "PF2e Animations", softFail: true })
let splashBonus = 3
let mods = [{ label: `No Modifications`, value: 0 }]
let ID = Sequencer.Helpers.random_int_between(100, 999)

// Special feats
/*
if (tokenD.actor.data.items.filter(x => x.name === "Bomber").length) mods.push({ "label": `<a class="entity-link content-link" data-pack="pf2e.classfeatures" data-id="7JbiaZ8bxODM5mzS"><i class="fas fa-suitcase"></i> Bomber</a>`, "value": "Bomber" })
if (tokenD.actor.data.items.filter(x => x.name === "Expanded Splash").length) mods.push({ "label": `<a class="entity-link content-link" data-pack="pf2e.feats-srd" data-id="gyVcJfZTmBytLsXq"><i class="fas fa-suitcase"></i> Expanded Splash</a>`, "value": "Expanded Splash" })
if (tokenD.actor.data.items.filter(x => x.name === "Directional Bombs").length) mods.push({ "label": `<a class="entity-link content-link" data-pack="pf2e.feats-srd" data-id="ozvYhY4hG1deXly8"><i class="fas fa-suitcase"></i> Directional Bombs</a>`, "value": "Directional Bombs" })

if (falsemods.length > 1) {
    let options = await warpgate.buttonDialog({buttons: mods}, 'column')
}
*/

switch (rinsedName) {
  case "vexingvapor": {
    seq
      .effect()
      .file("jb2a.throwable.throw.flask.03.green")
      .atLocation(tokenD)
      .stretchTo(target)
      .fadeIn(300)
      .filter("ColorMatrix", {
        hue: 120,
      })
      .waitUntilFinished(-200)
      .effect()
      .file("jb2a.explosion.side_fracture.flask.03")
      .atLocation(target)
      .rotate(180)
      .rotateTowards(tokenD)
      .effect()
      .file("jb2a.fog_cloud.2.green")
      .scaleIn(0.25, 1000, { ease: "easeInQuart" })
      .fadeIn(3000)
      .fadeOut(1500)
      .duration(8000)
      .opacity(0.5)
      .filter("ColorMatrix", {
        hue: 200,
      })
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
      .atLocation(target)
      .wait(1000)
      .effect()
      .file("jb2a.markers.stun.purple.01")
      .fadeIn(3000)
      .fadeOut(1500)
      .duration(6500)
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
      .atLocation(target)
    break
  }
  case "tanglefootbag":
  case "gluebomb": {
    seq
      .effect()
      .file("jb2a.throwable.throw.grenade.02.blackyellow")
      .atLocation(tokenD)
      .stretchTo(target)
      .fadeIn(300)
      .waitUntilFinished(-200)
      .effect()
      .file("jb2a.grease.dark_brown.loop")
      .scaleIn(0.25, 1000, { ease: "easeInQuart" })
      .fadeIn(1000)
      .fadeOut(1000)
      .duration(12000)
      .scaleToObject(0.8)
      .atLocation(target)
      .belowTokens()
      .effect()
      .file("jb2a.grease.dark_brown.loop")
      .scaleIn(0.25, 1000, { ease: "easeInQuart" })
      .fadeIn(1000)
      .fadeOut(1000)
      .duration(12000)
      .randomizeMirrorX()
      .randomizeMirrorY()
      .scale(0.1)
      .atLocation(target, { randomOffset: 1 })
      .attachTo(target)
      .mask(target)
      .effect()
      .file("jb2a.grease.dark_brown.loop")
      .scaleIn(0.25, 1000, { ease: "easeInQuart" })
      .fadeIn(1000)
      .fadeOut(1000)
      .randomizeMirrorX()
      .randomizeMirrorY()
      .duration(12000)
      .scale(0.1)
      .atLocation(target, { randomOffset: 1 })
      .attachTo(target)
      .mask(target)
      .effect()
      .file("jb2a.grease.dark_brown.loop")
      .scaleIn(0.25, 1000, { ease: "easeInQuart" })
      .fadeIn(1000)
      .fadeOut(1000)
      .randomizeMirrorX()
      .randomizeMirrorY()
      .duration(12000)
      .scale(0.1)
      .atLocation(target, { randomOffset: 1 })
      .attachTo(target)
      .mask(target)
      .effect()
      .file("jb2a.grease.dark_brown.loop")
      .scaleIn(0.25, 1000, { ease: "easeInQuart" })
      .fadeIn(1000)
      .randomizeMirrorX()
      .randomizeMirrorY()
      .fadeOut(1000)
      .duration(12000)
      .scale(0.1)
      .atLocation(target, { randomOffset: 1 })
      .attachTo(target)
      .mask(target)
    break
  }
  case "sulfurbomb": {
    seq
      .effect()
      .file("jb2a.throwable.throw.bomb.01.green")
      .atLocation(tokenD)
      .stretchTo(target)
      .fadeIn(300)
      .filter("ColorMatrix", {
        hue: -30,
      })
      .waitUntilFinished(-200)
      .effect()
      .file("jb2a.fog_cloud.2.green")
      .scaleIn(0.25, 1000, { ease: "easeInQuart" })
      .fadeIn(3000)
      .fadeOut(1500)
      .duration(8000)
      .opacity(0.5)
      .filter("ColorMatrix", {
        hue: -30,
      })
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
      .atLocation(target)
    break
  }
  case "pernicioussporebomb": {
    seq
      .effect()
      .file("jb2a.throwable.throw.bomb.01.green")
      .atLocation(tokenD)
      .stretchTo(target)
      .fadeIn(300)
      .waitUntilFinished(-200)
      .effect()
      .file("jb2a.explosion.08.green")
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
      .atLocation(target)
      .waitUntilFinished(-2500)
      .effect()
      .file("jb2a.spirit_guardians.green.particles")
      .fadeIn(500)
      .fadeOut(500)
      .duration(4000)
      .loopProperty("sprite", "rotation", { from: 0, to: 360, duration: 75000 })
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
      .atLocation(target)
    break
  }
  case "necroticbomb": {
    seq
      .effect()
      .file("jb2a.throwable.throw.bomb.01.black")
      .atLocation(tokenD)
      .stretchTo(target)
      .fadeIn(300)
      .waitUntilFinished(-150)
      .effect()
      .file("jb2a.explosion.03.bluewhite")
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
      .atLocation(target)
      .wait(50)
      .effect()
      .file("jb2a.explosion.08.dark_green")
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
      .atLocation(target)
    break
  }
  case "mudbomb": {
    seq
      .effect()
      .file("jb2a.throwable.throw.grenade.02.blackyellow")
      .atLocation(tokenD)
      .stretchTo(target)
      .fadeIn(300)
      .waitUntilFinished(-200)
      .effect()
      .file("jb2a.grease.dark_brown.loop")
      .size({ width: 3, height: 3 }, { gridUnits: true })
      .scaleIn(0, 1000)
      .fadeIn(1500)
      .belowTokens()
      .fadeOut(500)
      .duration(4500)
      .randomizeMirrorY()
      .randomizeMirrorX()
      .atLocation(target)
      .effect()
      .file("jb2a.explosion.shrapnel.grenade.02.black")
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
      .atLocation(target)
    break
  }
  case "junkbomb": {
    seq
      .effect()
      .file("jb2a.throwable.throw.grenade.02.blackyellow")
      .atLocation(tokenD)
      .stretchTo(target)
      .fadeIn(300)
      .waitUntilFinished(-200)
      .effect()
      .file("jb2a.explosion.03.blueyellow")
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
      .atLocation(target)
      .effect()
      .file("jb2a.explosion.shrapnel.grenade.02.black")
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
      .atLocation(target)
    break
  }
  case "ghostcharge": {
    seq
      .effect()
      .file("jb2a.throwable.throw.grenade.03.blackblue")
      .atLocation(tokenD)
      .stretchTo(target)
      .fadeIn(300)
      .waitUntilFinished(-200)
      .effect()
      .file("jb2a.explosion.07.tealyellow")
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
      .atLocation(target)
      .effect()
      .file("jb2a.explosion.shrapnel.grenade.03.black")
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
      .atLocation(target)
    break
  }
  case "frostvial": {
    seq
      .effect()
      .file("jb2a.throwable.throw.flask.02.blue")
      .atLocation(tokenD)
      .stretchTo(target)
      .fadeIn(300)
      .waitUntilFinished(-200)
      .effect()
      .file("jb2a.impact_themed.ice_shard.blue")
      .scale(0.5)
      .atLocation(target)
      .effect()
      .file("jb2a.explosion.05.bluewhite")
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
      .atLocation(target)
      .effect()
      .file("jb2a.explosion.side_fracture.flask.02")
      .atLocation(target)
      .rotate(180)
      .rotateTowards(tokenD)
    break
  }
  case "dreadampoule": {
    seq
      .effect()
      .file("jb2a.throwable.throw.flask.03.green")
      .atLocation(tokenD)
      .stretchTo(target)
      .fadeIn(300)
      .filter("ColorMatrix", {
        hue: 120,
      })
      .waitUntilFinished(-200)
      .effect()
      .origin("Dread Ampoule ID" + ID)
      .name("Dread Ampoule - Fog")
      .file("jb2a.fog_cloud.2.green")
      .scaleIn(0.25, 1000, { ease: "easeInQuart" })
      .fadeIn(3000)
      .fadeOut(1500)
      .duration(8000)
      .opacity(0.5)
      .filter("ColorMatrix", {
        hue: 200,
      })
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
      .atLocation(target)
      .effect()
      .file("jb2a.explosion.side_fracture.flask.03")
      .atLocation(target)
      .rotate(180)
      .rotateTowards(tokenD)
      .wait(1000)
      .thenDo(function () {
        for (let i = 0, iMax = 25; i <= iMax; i++) {
          seq
            .effect()
            .origin("Dread Ampoule ID" + ID)
            .name(`Dread Ampoule - Horror Effect ${i} / ${iMax}`)
            .fadeIn(1000)
            .fadeOut(1000)
            .scale(0.3)
            .animateProperty("sprite", "position.y", {
              from: 0,
              to: -200,
              duration: 9000,
            })
            .duration(3000)
            .file("jb2a.icon.horror.purple")
            .atLocation(target, { randomOffset: 1.3 })
            .wait(200)
        }
      })
    break
  }
  case "crystalshards": {
    seq
      .effect()
      .file("jb2a.throwable.throw.bomb.01.blue")
      .atLocation(tokenD)
      .stretchTo(target)
      .fadeIn(300)
      .waitUntilFinished(-200)
      .effect()
      .file("jb2a.explosion.04.blue")
      .zIndex(1)
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
      .atLocation(target)
      .wait(50)
      .effect()
      .file("jb2a.explosion.shrapnel.bomb.01.blue")
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
      .atLocation(target)
      .zIndex(2)
    break
  }
  case "bottledsunlight": {
    seq
      .effect()
      .file("jb2a.throwable.throw.flask.02.blue")
      .atLocation(tokenD)
      .stretchTo(target)
      .fadeIn(300)
      .filter("ColorMatrix", {
        hue: 100,
        brightness: 1,
      })
      .waitUntilFinished(-200)
      .effect()
      .file("jb2a.markers.light.outro.yellow")
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
      .fadeIn(1000)
      .fadeOut(1000)
      .scaleIn(0, 2000, { ease: "easeOutBack" })
      .atLocation(target)
      .effect()
      .file("jb2a.explosion.side_fracture.flask.02")
      .atLocation(target)
      .rotate(180)
      .filter("ColorMatrix", {
        hue: 100,
        brightness: 1,
      })
      .rotateTowards(tokenD)
    break
  }
  case "bottledlightning": {
    seq
      .effect()
      .file("jb2a.throwable.throw.flask.02.blue")
      .atLocation(tokenD)
      .stretchTo(target)
      .fadeIn(300)
      .waitUntilFinished(-200)
      .effect()
      .file("jb2a.explosion.side_fracture.flask.02")
      .atLocation(target)
      .rotate(180)
      .rotateTowards(tokenD)
      .effect()
      .file("jb2a.explosion.02.blue")
      .atLocation(target)
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
      .waitUntilFinished(-1000)
      .effect()
      .file("jb2a.static_electricity.02.blue")
      .attachTo(target)
      .duration(2500)
      .scaleToObject(1.3)
      .effect()
      .file("jb2a.static_electricity.03.blue")
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
      .duration(1500)
      .atLocation(target)
    break
  }
  case "waterbomb": {
    seq
      .effect()
      .file("jb2a.throwable.throw.bomb.01.blue")
      .atLocation(tokenD)
      .stretchTo(target)
      .fadeIn(300)
      .waitUntilFinished(-200)
      .effect()
      .file("jb2a.liquid.splash.blue")
      .atLocation(target)
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
      .effect()
      .playIf(false) // WIP
      .file("jb2a.liquid.splash_side.blue")
      .atLocation(target)
      .rotate(180)
      .rotateTowards(tokenD)
      .effect()
      .file("jb2a.explosion.side_fracture.flask.03")
      .atLocation(target)
      .rotate(180)
      .rotateTowards(tokenD)
    break
  }
  case "acidflask": {
    seq
      .effect()
      .file("jb2a.throwable.throw.flask.03.green")
      .atLocation(tokenD)
      .stretchTo(target)
      .fadeIn(300)
      .waitUntilFinished(-200)
      .effect()
      .file("jb2a.liquid.splash.bright_green")
      .atLocation(target)
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
      .effect()
      .playIf(false) // WIP
      .file("jb2a.liquid.splash_side.bright_green")
      .atLocation(target)
      .rotate(180)
      .rotateTowards(tokenD)
      .effect()
      .file("jb2a.explosion.side_fracture.flask.03")
      .atLocation(target)
      .rotate(180)
      .rotateTowards(tokenD)
    break
  }
  case "alchemist'sfire": {
    seq
      .effect()
      .file("jb2a.throwable.throw.flask.01.orange")
      .atLocation(tokenD)
      .stretchTo(target)
      .fadeIn(300)
      .waitUntilFinished(-200)
      .effect()
      .file("jb2a.explosion.01.orange")
      .atLocation(target)
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
      .effect()
      .file("jb2a.explosion.side_fracture.flask.01")
      .atLocation(target)
      .rotate(180)
      .rotateTowards(tokenD)
    break
  }
  case "alignmentampoule": {
    seq
      .effect()
      .file("jb2a.throwable.throw.flask.02.blue")
      .atLocation(tokenD)
      .stretchTo(target)
      .fadeIn(300)
      .filter("ColorMatrix", {
        hue: 100,
        brightness: 1,
      })
      .waitUntilFinished(-200)
      .effect()
      .file("jb2a.explosion.bluewhite.3")
      .atLocation(target)
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
      .effect()
      .file("jb2a.explosion.side_fracture.flask.02")
      .atLocation(target)
      .rotate(180)
      .filter("ColorMatrix", {
        hue: 100,
        brightness: 1,
      })
      .rotateTowards(tokenD)
    break
  }
  case "redpitchbomb":
  case "tallowbomb": {
    seq
      .effect()
      .file("jb2a.throwable.throw.bomb.01.black")
      .atLocation(tokenD)
      .stretchTo(target)
      .fadeIn(300)
      .waitUntilFinished(-200)
      .effect()
      .file("jb2a.explosion.01.orange")
      .atLocation(target)
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
      .wait(50)
      .effect()
      .file("jb2a.explosion.shrapnel.bomb.01.black")
      .atLocation(target)
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
    break
  }
  case "thunderstone": {
    seq
      .effect()
      .file("jb2a.slingshot")
      .atLocation(tokenD)
      .stretchTo(target)
      .fadeIn(300)
      .waitUntilFinished(-1000)
      .effect()
      .file("jb2a.thunderwave.center.blue")
      .atLocation(target)
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
    break
  }
  default: {
    seq
      .effect()
      .file("jb2a.throwable.throw.bomb.01.black")
      .atLocation(tokenD)
      .stretchTo(target)
      .fadeIn(300)
      .waitUntilFinished(-200)
      .effect()
      .file("jb2a.explosion.shrapnel.bomb.01.black")
      .atLocation(target)
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
      .effect()
      .file("jb2a.explosion.03.blueyellow")
      .atLocation(target)
      .size({ width: 3.5, height: 3.5 }, { gridUnits: true })
    break
  }
}

seq.play()
