/* {"name":"Petrified","img":"systems/pf2e/icons/conditions/petrified.webp","_id":"tItdi7rFVh3PEyKx"} */
const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)

const tokenMagic = game.settings.get("pf2e-jb2a-macros", "tmfx")

if (!args.length)
  args[0] = tokenMagic
    ? TokenMagic.hasFilterId(tokenD, "petrified")
      ? "off"
      : "on"
    : Sequencer.EffectManager.getEffects({
        origin: "petrified",
        source: tokenD,
      }).length
    ? "off"
    : "on"

if (args[0] == "on") {
  Sequencer.Preloader.preloadForClients(
    "jb2a.impact.ground_crack.still_frame.01"
  )
  if (tokenMagic) {
    let params = [
      {
        filterId: "petrified",
        filterType: "adjustment",
        saturation: 0,
      },
    ]
    TokenMagic.addFilters(token, params)
  }
  new Sequence({ moduleName: "PF2e Animations", softFail: true })
    .effect()
    .origin("petrified")
    .name(`${tokenD.name} - Petrified`)
    .attachTo(tokenD, { bindAlpha: false })
    .from(tokenD)
    .playIf(!tokenMagic)
    .filter("ColorMatrix", {
      hue: 0,
      brightness: 1,
      contrast: 0,
      saturate: -1,
    })
    .scaleToObject(1, { considerTokenScale: true })
    .persist()
    .fadeOut(500)
    .effect()
    .origin("petrified")
    .name(`${tokenD.name} - Petrified`)
    .attachTo(tokenD, { bindAlpha: false })
    .file("jb2a.impact.ground_crack.still_frame.01")
    .scaleToObject(2)
    .persist()
    .zIndex(9999)
    .opacity(0.5)
    .mask(tokenD)
    .fadeOut(500)
    .animation()
    .playIf(!tokenMagic)
    .delay(100)
    .on(tokenD)
    .fadeOut(100)
    .play()
} else if (args[0] == "off") {
  new Sequence({ moduleName: "PF2e Animations", softFail: true })
    .animation()
    .playIf(!tokenMagic)
    .fadeIn(200)
    .on(tokenD)
    .play()
  await Sequencer.EffectManager.endEffects({
    origin: `petrified`,
    object: tokenD,
  })
  if (tokenMagic) {
    await TokenMagic.deleteFilters(token, "petrified")
  }
}
