/* {"name":"Heat Haze","img":"icons/magic/fire/flame-burning-embers-yellow.webp","_id":"nAlCUpxQIThxgtl4"} */
const [tokenD] = pf2eAnimations.macroHelpers(args)
const tokenMagic = game.settings.get("pf2e-jb2a-macros", "tmfx")
if (!args.length)
  args[0] = tokenMagic
    ? TokenMagic.hasFilterId(tokenD, "Heat Haze")
      ? "off"
      : "on"
    : null

let params = [
  {
    filterType: "blur",
    filterId: "Heat Haze",
    padding: 10,
    quality: 4.0,
    blur: 3,
  },
  {
    filterType: "xfire",
    filterId: "Heat Haze",
    time: 0,
    color: 0xeb9144,
    blend: 1,
    amplitude: 1,
    dispersion: 0,
    chromatic: false,
    scaleX: 1,
    scaleY: 1,
    inlay: false,
    animated: {
      time: {
        active: true,
        speed: -0.0015,
        animType: "move",
      },
    },
  },
]

pf2eAnimations.applyTokenMagic(args, params)
