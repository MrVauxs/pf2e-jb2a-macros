/* {"name":"Dancing Lights","img":"icons/magic/fire/projectile-fireball-orange-green.webp","_id":"Y5ZQ659Z4oV552Z9"} */
// Exit Early if Impossible to Summon
if (!game.modules.get('foundry-summons')?.active) {
    return console.warn("PF2e Animations | Foundry Summons is not activated, which is required for summoning mechanics!")
}

const dancingLight = await fromUuid("Compendium.pf2e-jb2a-macros.Actors.teCoIt8sjArsIl4D")
const dancingLightObj = {...dancingLight.toObject(), uuid: dancingLight.uuid}

const DancingLight = CONFIG.FoundrySummons.docWrapperClasses.DancingLight

foundrySummons.openMenu({
    creatures: [
        new DancingLight(dancingLightObj, "Blue-Teal"),
        new DancingLight(dancingLightObj, "Blue-Yellow"),
        new DancingLight(dancingLightObj, "Green"),
        new DancingLight(dancingLightObj, "Pink"),
        new DancingLight(dancingLightObj, "Purple-Green"),
        new DancingLight(dancingLightObj, "Red"),
        new DancingLight(dancingLightObj, "Yellow")
    ],
    amount: { value: 4, locked: true },
    options: {
        defaultFilters: false,
        defaultSorting: false
    },
    flags: scope?.args?.[0].toObject()
})