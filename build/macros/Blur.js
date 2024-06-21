/* {"name":"Blur","img":"systems/pf2e/icons/spells/blur.webp","_id":"FBgkeey7TaMLkegd"} */
const [tokenD] = pf2eAnimations.macroHelpers(args)
const tokenMagic = game.settings.get("pf2e-jb2a-macros", "tmfx")
if (!args.length) args[0] = tokenMagic ? TokenMagic.hasFilterId(tokenD, "Blur") ? "off" : "on" : null

const params =
[{
    filterType: "blur",
    filterId: "Blur",
    padding: 10,
    quality: 4.0,
    blur: 0,
    blurX: 0,
    blurY: 0,
    animated:
    {
        blurX: 
        { 
           animType: "syncCosOscillation", 
           loopDuration: 500,
           val1: 0.5, 
           val2: 6
        },
        blurY: 
        {
           animType: "syncCosOscillation", 
           loopDuration: 750, 
           val1: 0.5,
           val2: 6
        }
    }
}];

pf2eAnimations.applyTokenMagic(args, params);