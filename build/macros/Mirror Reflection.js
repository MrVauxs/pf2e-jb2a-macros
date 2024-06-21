/* {"name":"Mirror Reflection","img":"systems/pf2e/icons/features/classes/Mirror.webp","_id":"4RJ2Whuc6uwQXJx1"} */
// Exit Early if Impossible to Summon
if (!game.modules.get("foundry-summons")?.active) {
  return console.warn(
    "PF2e Animations | Foundry Summons is not activated, which is required for summoning mechanics!"
  )
}

const [tokenD, tokenScale] = await pf2eAnimations.macroHelpers(args)

foundrySummons.openMenu({
  creatures: [
    new CONFIG.FoundrySummons.docWrapperClasses.DocWrapper(tokenD.actor),
  ],
  options: {
    autoPick: true,
    defaultSorting: false,
    defaultFilters: false,
  },
  flags: { item: scope.args?.[0].item },
})
