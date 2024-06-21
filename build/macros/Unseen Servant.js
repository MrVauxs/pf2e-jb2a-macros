/* {"name":"Unseen Servant","img":"systems/pf2e/icons/spells/unseen-servant.webp","_id":"Qm37tEena7Pm60rS"} */
// Exit Early if Impossible to Summon
if (!game.modules.get('foundry-summons')?.active) {
    return console.warn("PF2e Animations | Foundry Summons is not activated, which is required for summoning mechanics!")
}

foundrySummons.openMenu({
    creatures: [new CONFIG.FoundrySummons.docWrapperClasses.DocWrapper(await fromUuid("Compendium.pf2e.pathfinder-bestiary.Actor.j7NNPfZwD19BwSEZ"))],
    options: {
        autoPick: true,
        defaultSorting: false,
        defaultFilters: false
    },
    flags: { item: scope.args?.[0].item },
})