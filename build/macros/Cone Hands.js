/* {"name":"Cone Hands","img":"systems/pf2e/icons/spells/burning-hands.webp","_id":"0O8rNzIVLo8p3tXj"} */
const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)
const template = args[1]?.templateData ?? canvas.templates.placeables[canvas.templates.placeables.length - 1];
const [templateX, templateY] = [template.data.x, template.data.y];

let file = args[2]?.[0]

// file = "rainbow"

if (file === "rainbow") {
    new Sequence({moduleName: "PF2e Animations", softFail: true})
        .effect()
            .file("jb2a.cone_of_cold.green", true)
            .mask(template)
            .atLocation(template)
            .stretchTo(template)
            .scale({y: 2})
            .filter("ColorMatrix", { hue: 50 }, "light")
            .loopProperty(
                "effectFilters.light",
                "hue",
                {
                    from: 0,
                    to: 360,
                    duration: 1500
                }
            )
        .effect()
            .file("jb2a.cone_of_cold.green", true)
            .mask(template)
            .atLocation(template)
            .stretchTo(template)
            .scale({y: 2})
            .opacity(0.8)
        .effect()
            .file("jb2a.cone_of_cold.orange", true)
            .mask(template)
            .atLocation(template)
            .stretchTo(template)
            .rotate(20)
            .opacity(0.8)
        .effect()
            .file("jb2a.cone_of_cold.purple", true)
            .mask(template)
            .atLocation(template)
            .stretchTo(template)
            .rotate(-20)
            .opacity(0.8)
        .effect()
            .file("jb2a.cone_of_cold.purple", true)
            .mask(template)
            .atLocation(template)
            .stretchTo(template)
            .rotate(-10)
            .filter("ColorMatrix", { contrast: 2, hue: -60 })
            .opacity(0.8)
        .effect()
            .file("jb2a.cone_of_cold.orange", true)
            .mask(template)
            .atLocation(template)
            .stretchTo(template)
            .rotate(10)
            .filter("ColorMatrix", { contrast: 2, hue: 120 })
            .opacity(0.8)
        .play()
} else {
    new Sequence({moduleName: "PF2e Animations", softFail: true})
        .effect()
            .file(file, true)
            .mask(template)
            .atLocation(template)
            .stretchTo(template)
            .scale({y: 2})
        .effect()
            .file(file, true)
            .mask(template)
            .atLocation(template)
            .stretchTo(template)
            .rotate(20)
        .effect()
            .file(file, true)
            .mask(template)
            .atLocation(template)
            .stretchTo(template)
            .rotate(-20)
        .play()
}