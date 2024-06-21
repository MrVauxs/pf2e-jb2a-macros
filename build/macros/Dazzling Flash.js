/* {"name":"Dazzling Flash","img":"systems/pf2e/icons/spells/dazzling-flash.webp","_id":"PWAdvQ9qxwTcXCsu"} */
const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)
const template = args[1]?.templateData ?? canvas.templates.placeables[canvas.templates.placeables.length - 1];
const [templateX, templateY] = [template.data.x, template.data.y];

new Sequence({moduleName: "PF2e Animations", softFail: true})
    .effect()
        .file('jb2a.thunderwave.center.blue', true)
        .mask(template)
        .attachTo(tokenD)
        .scale(args[1].item.level > 2 ? 2 : 1)
    .play()