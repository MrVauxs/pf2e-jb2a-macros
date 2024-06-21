/* {"name":"Manifest Eidolon","img":"systems/pf2e/icons/features/classes/eidolon.webp","_id":"Qyoalm1R3chywfE0"} */
// Exit Early if Impossible to Summon
if (!game.modules.get("foundry-summons")?.active) {
  return console.warn(
    "PF2e Animations | Foundry Summons is not activated, which is required for summoning mechanics!"
  )
}

let eidolons = game.actors.filter(
  (v) =>
    (v.class?.slug === "eidolon" ||
      v.class?.flags?.core?.sourceId === "Item.4yrittMrVNhR2woZ" ||
      v.class?.flags?.core?.sourceId ===
        "Compendium.pf2e-animal-companions.AC-Features.xPn27nNxcLOByTXJ" ||
      v.class?.flags?.core?.sourceId ===
        "Compendium.pf2e-animal-companions.AC-Features.Item.xPn27nNxcLOByTXJ") &&
    v.isOwner
)

if (eidolons.length === 0) {
  return ui.notifications.error("No Eidolons Found!")
}

foundrySummons.openMenu({
  creatures: eidolons.map(
    (eido) => new CONFIG.FoundrySummons.docWrapperClasses.DocWrapper(eido)
  ),
  options: {
    autoPick: true,
    defaultSorting: false,
    defaultFilters: false,
  },
  flags: { item: scope.args?.[0].item },
})
