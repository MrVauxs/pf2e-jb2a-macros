/* {"name":"Summon Anything","img":"icons/magic/earth/construct-stone.webp","_id":"emzJwDdpyYpuYkcm"} */
// Exit Early if Impossible to Summon
if (!game.modules.get('foundry-summons')?.active) {
    return console.warn("PF2e Animations | Foundry Summons is not activated, which is required for summoning mechanics!")
}

if (!Object.keys(scope).length) {
    return console.warn("PF2e Animations | This macro cannot be ran by the user, you have to use the spell or action itself to use it!")
}

const pf2eAnimArgs = scope.args[2]
const message = scope.args[0]
const item = message.item
const sourceToken = scope.args[1].sourceToken

const data = {
    flags: {item},
    sourceTokens: [sourceToken],
    filters: [],
    options: {
        autoPick: true,
        defaultSorting: true,
        defaultFilters: true
    }
}

if (pf2eAnimArgs.length) {
    if (pf2eAnimArgs.includes("summon-spell")) {
        let multiplier = -1;
        if (item.level >= 2) multiplier = 1;
        if (item.level >= 3) multiplier = 2;
        if (item.level >= 4) multiplier = 3;
        if (item.level >= 5) multiplier = 5;
        if (item.level >= 6) multiplier = 7;
        if (item.level >= 7) multiplier = 9;
        if (item.level >= 8) multiplier = 11;
        if (item.level >= 9) multiplier = 13;
        if (item.level >= 10) multiplier = 15;
        // level equal or less filter
        data.filters.push({
            name: game.i18n.format("pf2e-jb2a-macros.macro.summoning.player.summonArg", { multiplier: multiplier, spellLevel: item.level }),
            locked: true,
            function: (index) => index.filter((x) => x.system.details.level.value <= multiplier)
        })
    }

    if (pf2eAnimArgs.find((x) => x.includes("trait-or"))) {
        const traitsOr = pf2eAnimArgs
            .find((x) => x.includes("trait-or-"))
            ?.replace("trait-or-", "")
            .split("-");

        data.filters.push({
            name: game.i18n.format(
                "pf2e-jb2a-macros.macro.summoning.player.traitsArg",
                { traits: traitsOr.join(" / ") }
            ),
            locked: true,
            function: (index) => index.filter((x) => traitsOr.some(trait => x.system.traits.value.includes(trait)))
        })
    }

    if (pf2eAnimArgs.find((x) => x.includes("trait-and"))) {
        const traitsAnd = pf2eAnimArgs
            .find((x) => x.includes("trait-and"))
            ?.replace("trait-and-", "")
            .split("-");

        data.filters.push({
            name: game.i18n.format(
                "pf2e-jb2a-macros.macro.summoning.player.traitsArg",
                { traits: traitsAnd.join(" + ") }
            ),
            locked: true,
            function: (index) => index.filter((x) => traitsAnd.every(trait => x.system.traits.value.includes(trait)))
        })
    }

    if (pf2eAnimArgs.find((x) => x.includes("name"))) {
        const name = pf2eAnimArgs
            .find((x) => x.includes("name"))
            ?.replace("name-", "")
            .split("|")
            .map((x) => x.trim()); // separate by | for multiple names

        data.filters.push({
            name: game.i18n.format(
                "pf2e-jb2a-macros.macro.summoning.player.nameArg",
                { name: name.join(", ") }
            ),
            locked: true,
            function: (index) => index.filter((x) => name.some((n) => x.name === n))
        })
    }

    if (pf2eAnimArgs.find((x) => x.includes("level") && !x.includes("exact-level"))) {
        const level = pf2eAnimArgs
            .find((x) => x.includes("level") && !x.includes("exact-level"))
            ?.replace("level-", "")
            .replaceAll("-1", "~1")
            .split("-");

        data.filters.push({
            name: game.i18n.format(
                "pf2e-jb2a-macros.macro.summoning.player.levelArg",
                {
                    level1: level[0].replace("~", "-"),
                    level2:
                        level[1]?.replace("~", "-") ??
                        '<span style="font-size:18px">∞</span>',
                }
            ),
            locked: true,
            function: (index) => {
                index = index.filter(
                    (x) => x.system.details.level.value >= Number(level[0].replace("~", "-"))
                );

                if (level[1]) {
                    index = index.filter(
                        (x) => x.system.details.level.value <= Number(level[1].replace("~", "-"))
                    );
                }

                return index
            }
        })
    }

    if (pf2eAnimArgs.find((x) => x.includes("exact-level"))) {
        const exactLevel = pf2eAnimArgs
            .find((x) => x.includes("exact-level"))
            ?.replace("exact-level-", "");

        data.filters.push({
            name: game.i18n.format(
                "pf2e-jb2a-macros.macro.summoning.player.levelArg",
                {
                    level1: exactLevel,
                    level2:
                        exactLevel
                }
            ),
            locked: true,
            function: (index) => index.filter(x => x.system.details.level.value === exactLevel)
        })
    }

    if (pf2eAnimArgs.find((x) => x.includes("unique"))) {
        let unique = pf2eAnimArgs
            .find((x) => x.includes("unique-"))
            ?.replace("unique-", "");
        if (unique && pf2eAnimArgs.length > 1)
            return ui.notifications.error(
                "You can only select one unique summon type."
            );
        switch (unique) {
            case "lesser-servitor": {
                data.filters.push({
                    name: game.i18n.format(
                        "pf2e-jb2a-macros.macro.summoning.player.unique",
                        { unique: '<a class="content-link" draggable="true" data-pack="pf2e.spells-srd" data-uuid="Compendium.pf2e.spells-srd.B0FZLkoHsiRgw7gv" data-id="B0FZLkoHsiRgw7gv"><i class="fas fa-suitcase"></i>Summon Lesser Servitor</a>' }
                    ),
                    locked: true,
                    function: (packs) => {
                        // spell level
                        let multiplier = -1;
                        if (item.level >= 2) multiplier = 1;
                        if (item.level >= 3) multiplier = 2;
                        if (item.level >= 4) multiplier = 3;
                        packs = packs.filter((x) => x.system.details.level.value <= multiplier);
                        packs = packs.filter(
                            (x) =>
                                // celestial, monitor, or fiend
                                ["celestial", "monitor", "fiend"].some((traitOr) =>
                                    x.system.traits.value.includes(traitOr)
                                ) ||
                                // or any of the below animal names
                                [
                                    "Eagle",
                                    "Guard Dog",
                                    "Raven",
                                    "Black Bear",
                                    "Giant Bat",
                                    "Leopard",
                                    "Tiger",
                                    "Great White Shark",
                                ].some((v) => x.name === v)
                        );

                        return packs;
                    }
                })
                break;
            }
        }
    }
}

foundrySummons.openMenu(data)