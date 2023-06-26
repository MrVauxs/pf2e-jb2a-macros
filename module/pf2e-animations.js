const pf2eAnimations = {};

//#region Hooks
pf2eAnimations.hooks = {};

pf2eAnimations.hooks.ready = Hooks.once("ready", () => {
  console.log(
    "PF2e Animations v" +
      game.modules.get("pf2e-jb2a-macros").version +
      " loaded."
  );
  // Warn if no JB2A is found.
  if (
    !game.modules.get("JB2A_DnD5e")?.active &&
    !game.modules.get("jb2a_patreon")?.active
  ) {
    ui.notifications.error(
      pf2eAnimations.localize("pf2e-jb2a-macros.notifications.noJB2A"),
      { permanent: true }
    );
  }

  // Warn if one of the required modules is disabled.
  if (
    !game.modules
      .get("pf2e-jb2a-macros")
      .relationships.requires.toObject()
      .map((i) => i.id)
      .every((i) => game.modules.get(i)?.active)
  ) {
    ui.notifications.error(
      pf2eAnimations.localize("pf2e-jb2a-macros.notifications.noDependencies", {
        modules:
          game.modules
            .get("pf2e-jb2a-macros")
            .relationships.requires.toObject()
            .filter((i) => !game.modules.get(i.id)?.active)
            .map((i) => i.id)
            .join(", ") || "Unknown",
      }),
      { permanent: true }
    );
  } else {
    const wrongVersions = game.modules
      .get("pf2e-jb2a-macros")
      .relationships.requires.toObject()
      .map((i) => {
        return {
          id: i.id,
          title: game.modules.get(i.id).title,
          version: i.compatibility.minimum,
        };
      })
      .filter((i) =>
        isNewerVersion(
          i.version,
          game.modules.get(i.id).version?.replace(/v|!/g, "")
        )
      );

    if (wrongVersions.length > 0) {
      ui.notifications.error(
        pf2eAnimations.localize("pf2e-jb2a-macros.notifications.wrongVersion", {
          modules:
            wrongVersions.map((i) => `${i.title} v${i.version}`).join(", ") ||
            "Unknown",
        }),
        { permanent: true }
      );
    }
  }

  if (
    game.settings.get("pf2e-jb2a-macros", "version-previous") !==
    game.modules.get("pf2e-jb2a-macros").version
  ) {
    ui.notifications.info(
      pf2eAnimations.localize("pf2e-jb2a-macros.notifications.update", {
        version: game.modules.get("pf2e-jb2a-macros").version,
      })
    );
    game.settings.set(
      "pf2e-jb2a-macros",
      "version-previous",
      game.modules.get("pf2e-jb2a-macros").version
    );
    if (game.user.isGM && game.settings.get("pf2e-jb2a-macros", "autoUpdate"))
      new autorecUpdateFormApplication().render(true);
  }

  // Welcome message for new users.
  if (
    !(game.user.getFlag("pf2e-jb2a-macros", "displayedWelcomeMessage") ?? false)
  ) {
    game.user.setFlag("pf2e-jb2a-macros", "displayedWelcomeMessage", true);
    ChatMessage.implementation.create({
      whisper: [game.user.id],
      speaker: { alias: "PF2e Animations" },
      content: `	<div class="pf2e-animations-welcome">
							<h3>${game.i18n.localize("pf2e-jb2a-macros.welcomeMessage.header")}</h3>
							<p>${game.i18n.localize("pf2e-jb2a-macros.welcomeMessage.description")}</p>
							<button class="pf2e-animations-settings-button">
								<i class="fas fa-cogs"></i>
								${game.i18n.localize("pf2e-jb2a-macros.welcomeMessage.settingsButton")}
							</button>
							<p style="text-align: center; margin: 0; margin-top: 5px;"><i>${game.i18n.localize(
                "pf2e-jb2a-macros.welcomeMessage.footer"
              )}</i></p>
						</div>`,
    });
  }

  // GM-Only stuff.
  if (!game.user.isGM) return;
  if (game.settings.get("pf2e", "tokens.autoscale"))
    game.settings.set("pf2e-jb2a-macros", "smallTokenScale", 0.8);
  if (!game.modules.get("tokenmagic")?.active)
    game.settings.set("pf2e-jb2a-macros", "tmfx", false);
});

pf2eAnimations.hooks.renderChatMessage = Hooks.on(
  "renderChatMessage",
  async (message, [html]) => {
    for (const btn of html.querySelectorAll(
      "button.pf2e-animations-settings-button"
    )) {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        game.settings.sheet.render(true);
      });
    }
  }
);

pf2eAnimations.hooks.createChatMessage = Hooks.on(
  "createChatMessage",
  async (data) => {
    if (game.user.id !== data.user.id) return;
    let targets =
      data?.flags?.pf2e?.target?.token ?? Array.from(game.user.targets);
    targets = [targets].flat();
    let token = data.token ?? canvas.tokens.controlled[0];
    let flavor = data.flavor ?? null;
    let args = data ?? null;

    if (!token)
      return pf2eAnimations.debug("No token for the animation.", data);

    // Persistent Damage Matches
    if (
      (data.isDamageRoll && data.rolls[0].options.evaluatePersistent) ||
      flavor.match(/Received (regeneration|fast healing)/g)
    ) {
      pf2eAnimations.debug("Persistent Damage / Healing", data);
      return pf2eAnimations.runMacro("Persistent Conditions", args);
    }
    // Default Matches
    if (data.isDamageRoll && /Sneak Attack/.test(flavor)) {
      pf2eAnimations.debug("Sneak Attack", data);
      let [sneak] = data.actor.items.filter((i) => i.name === "Sneak Attack");
      // Modify sneak to not be a feat because AA no like feat
      // sneak.type = "strike"
      await AutomatedAnimations.playAnimation(token, sneak, {
        targets: targets,
      });
      // Go back to not break opening the sheet, apparently
      // sneak.type = "feat"
    }
    // Attack Matches
    if (
      data.flags.pf2e?.context?.type === "attack-roll" &&
      !game.settings.get("pf2e-jb2a-macros", "disableHitAnims")
    ) {
      const degreeOfSuccess =
        pf2eAnimations.degreeOfSuccessWithRerollHandling(data);
      const pack = game.packs.get("pf2e-jb2a-macros.Actions");
      if (!pack)
        ui.notifications.error(
          `PF2e Animations | ${pf2eAnimations.localize(
            "pf2e-jb2a-macros.notifications.noPack"
          )}`
        );

      console.log("degreeOfSuccess", data);

      let items = data.actor.items.filter((i) =>
        i.name.includes("Attack Animation Template")
      );
      if (Object.keys(items).length === 0) {
        items = (await pack.getDocuments()).filter((i) =>
          i.name.includes("Attack Animation Template")
        );
      } else if (Object.keys(items).length < 4) {
        items.push(
          (await pack.getDocuments()).filter((i) =>
            i.name.includes("Attack Animation Template")
          )
        );
      }
      items = items.flat();
      let item = "";
      switch (degreeOfSuccess) {
        case "criticalSuccess":
          item = items.find((i) => i.name.includes("(Critical Success)"));
          pf2eAnimations.debug('"On Hit/Miss" Critical Success animation', {
            token,
            targets,
            item,
          });
          AutomatedAnimations.playAnimation(token, item, {
            playOnMiss: true,
            targets: targets,
            hitTargets: targets,
          });
          break;
        case "criticalFailure":
          item = items.find((i) => i.name.includes("(Critical Failure)"));
          pf2eAnimations.debug('"On Hit/Miss" Critical Failure animation', {
            token,
            targets,
            item,
          });
          AutomatedAnimations.playAnimation(token, item, {
            playOnMiss: true,
            targets: targets,
            hitTargets: !game.settings.get("pf2e-jb2a-macros", "randomHitAnims")
              ? targets
              : [],
          });
          break;
        case "failure":
          item = items.find((i) => i.name.includes("(Failure)"));
          pf2eAnimations.debug('"On Hit/Miss" Failure animation', {
            token,
            targets,
            item,
          });
          AutomatedAnimations.playAnimation(token, item, {
            playOnMiss: true,
            targets: targets,
            hitTargets: !game.settings.get("pf2e-jb2a-macros", "randomHitAnims")
              ? targets
              : [],
          });
          break;
        case "success":
          item = items.find((i) => i.name.includes("(Success)"));
          pf2eAnimations.debug('"On Hit/Miss" Success animation', {
            token,
            targets,
            item,
          });
          AutomatedAnimations.playAnimation(token, item, {
            playOnMiss: true,
            targets: targets,
            hitTargets: targets,
          });
          break;
      }
    }
  }
);

// Create a hook for updating inventory.
pf2eAnimations.hooks.equipOrInvestItem = Hooks.on(
  "pf2eAnimations.equipOrInvestItem",
  (status, data) => {
    // If the item is an Aeon Stone, run the Aeon Stone macro.
    if (data.name.includes("Aeon Stone"))
      AutomatedAnimations.playAnimation(data.actor.getActiveTokens()[0], data, {
        workflow: status,
      });
  }
);

// Call the above hook with updateItem.
pf2eAnimations.hooks.updateItem = Hooks.on("updateItem", (data, changes) => {
  const status = data.isInvested
    ? "invested"
    : data.isEquipped
    ? "equipped"
    : false;
  Hooks.call("pf2eAnimations.equipOrInvestItem", status, data);
});

// Remove the PF2e Animations Dummy NPC folder, unless the debug mode is on AND the user is a GM.
pf2eAnimations.hooks.renderActorDirectory = Hooks.on(
  "renderActorDirectory",
  (app, html, data) => {
    if (!(game.user.isGM && game.settings.get("pf2e-jb2a-macros", "debug"))) {
      const folder = html.find(
        `.folder[data-folder-id="${
          game.folders.get(
            game.settings.get("pf2e-jb2a-macros", "dummyNPCId-folder")
          )?.id
        }"]`
      );
      folder.remove();
    }
  }
);

// Create a hook for metadata modification menu.
pf2eAnimations.hooks.AutomatedAnimations = {};
pf2eAnimations.hooks.AutomatedAnimations.metaData = Hooks.on(
  "AutomatedAnimations.metaData",
  async (data) => {
    let metaData = data.metaData;
    if (game.settings.get("pf2e-jb2a-macros", "debug")) {
      pf2eAnimations.debug("'AutomatedAnimations.metaData' hook", data);
      await warpgate.menu(
        {
          inputs: [
            {
              label: `name${metaData.name ? "" : " (auto)"}`,
              type: "text",
              options: metaData.name || "PF2e Animations",
            },
            {
              label: `moduleVersion${metaData.moduleVersion ? "" : " (auto)"}`,
              type: "text",
              options:
                metaData.moduleVersion ||
                game.modules.get("pf2e-jb2a-macros").version,
            },
            {
              label: `version${metaData.version ? "" : " (auto)"}`,
              type: "number",
              options:
                metaData.version ||
                Number(
                  game.modules
                    .get("pf2e-jb2a-macros")
                    .version.replaceAll(".", "")
                ),
            },
          ],
          buttons: [
            {
              label: "Apply",
              value: 1,
              callback: async (options) => {
                let settings = await game.settings.get(
                  "autoanimations",
                  `aaAutorec-${data.menu}`
                );
                let entry = settings.findIndex(
                  (obj) => obj.label === data.label
                );
                settings[entry].metaData.name =
                  options.inputs[0] ?? settings[entry].metaData.name;
                settings[entry].metaData.moduleVersion =
                  options.inputs[1] ?? settings[entry].metaData.moduleVersion;
                settings[entry].metaData.version =
                  options.inputs[2] ?? settings[entry].metaData.version;
                await AutomatedAnimations.AutorecManager.overwriteMenus(
                  JSON.stringify({
                    version: await game.settings.get(
                      "autoanimations",
                      "aaAutorec"
                    ).version,
                    [data.menu]: settings,
                  }),
                  { [data.menu]: true }
                );
              },
            },
            {
              label: "Update",
              value: 1,
              callback: async (options) => {
                let settings = await game.settings.get(
                  "autoanimations",
                  `aaAutorec-${data.menu}`
                );
                let entry = settings.findIndex(
                  (obj) => obj.label === data.label
                );
                settings[entry].metaData.name = "PF2e Animations";
                settings[entry].metaData.moduleVersion =
                  game.modules.get("pf2e-jb2a-macros").version;
                settings[entry].metaData.version =
                  (options.inputs[2] ?? settings[entry].metaData.version) + 1;
                await AutomatedAnimations.AutorecManager.overwriteMenus(
                  JSON.stringify({
                    version: await game.settings.get(
                      "autoanimations",
                      "aaAutorec"
                    ).version,
                    [data.menu]: settings,
                  }),
                  { [data.menu]: true }
                );
              },
            },
            {
              label: "Delete MetaData",
              value: 1,
              callback: async (options) => {
                let settings = await game.settings.get(
                  "autoanimations",
                  `aaAutorec-${data.menu}`
                );
                let entry = settings.findIndex(
                  (obj) => obj.label === data.label
                );
                settings[entry].metaData = {};
                await AutomatedAnimations.AutorecManager.overwriteMenus(
                  JSON.stringify({
                    version: await game.settings.get(
                      "autoanimations",
                      "aaAutorec"
                    ).version,
                    [data.menu]: settings,
                  }),
                  { [data.menu]: true }
                );
              },
            },
          ],
        },
        {
          title: `DEBUG | Add Metadata to ${data.label}.`,
        }
      );
    } else if (metaData.name === "PF2e Animations") {
      ui.notifications.notify(
        `${metaData.name} (v${metaData.moduleVersion}) | Animation Version: ${
          metaData.version
        }<hr>${pf2eAnimations.localize(
          "pf2e-jb2a-macros.notifications.metaData"
        )}`
      );
    }
  }
);

pf2eAnimations.hooks.updateCombatant = Hooks.on(
  "updateCombatant",
  (combatant, changes, options, userId) => {
    if (
      game.settings.get("pf2e-jb2a-macros", "killAnimationsOnKill") &&
      changes.defeated
    ) {
      if (
        Sequencer.EffectManager.getEffects({ object: combatant.token }).length
      )
        ui.notifications.info(
          `PF2e Animations | ${pf2eAnimations.localize(
            "pf2e-jb2a-macros.notifications.killAnimationsOnKill",
            { name: combatant.name }
          )}`
        );
      Sequencer.EffectManager.endEffects({ object: combatant.token });
    }
  }
);

pf2eAnimations.hooks.foundrySummons = Hooks.on(
  "fs-postSummon",
  ({ tokenDoc, sourceData }) => {
    sourceData.flags.doNotContinue = true;
    console.log(sourceData.summonerTokenDocument);
    let items = sourceData.summonerTokenDocument?.actor?.items?.filter(
      (item) => {
        item.name.includes("Summoning Animation Template");
      }
    );
    let item;

    if (items?.length > 0) {
      item =
        items.find((i) =>
          i.name.includes(`Summoning Animation Template (${tokenDoc.name})`)
        ) ??
        items.find((i) =>
          i.name.includes(
            `Summoning Animation Template (${sourceData?.flags?.item?.name})`
          )
        ) ??
        items.find((i) => i.name === `Summoning Animation Template`);
    }

    AutomatedAnimations.playAnimation(
      sourceData.summonerTokenDocument,
      item ?? {
        name: `Summoning Animation Template (${sourceData?.flags?.item?.name})`,
      },
      {
        targets: [tokenDoc.object],
        hitTargets: [tokenDoc.object],
      }
    );
  }
);

pf2eAnimations.hooks.foundrySummonsWrapper = Hooks.on(
  "fs-addWrapperClasses",
  (wrappers) => {
    class DancingLight extends CONFIG.FoundrySummons.docWrapperClasses
      .DocWrapper {
      constructor(indexItem, variant) {
        super(indexItem);
        this.variant = this.variant ?? variant;
        this.img = this.getLamp(this.variant, true);
        this.texture = this.getLamp(this.variant, false);
        this.id = variant;
        this.name = variant + " " + indexItem.name;
      }

      getLamp(color, isThumb) {
        return `modules/${
          game.modules.get("jb2a_patreon") ? "jb2a_patreon" : "JB2A_DnD5e"
        }/Library/Cantrip/Dancing_Lights/DancingLights_01_${color.replaceAll(
          "-",
          ""
        )}_${isThumb ? "Thumb.webp" : "200x200.webm"}`;
      }

      async loadDocument() {
        let document = await fromUuid(this.uuid);
        document = document.clone({
          img: this.img,
          prototypeToken: {
            texture: { src: this.texture },
          },
        });

        return document;
      }
    }

    wrappers.DancingLight = DancingLight;
  }
);

//#endregion

pf2eAnimations.debug = function debug(msg, args) {
  [msg, ...args] = arguments;
  if (game.settings.get("pf2e-jb2a-macros", "debug"))
    console.log(`DEBUG | PF2e Animations | ${msg}`, args);
};

// Thanks @ xdy for this function.
pf2eAnimations.runMacro = async function runJB2Apf2eMacro(
  macroName,
  args,
  compendiumName = "pf2e-jb2a-macros.Macros"
) {
  const pack = game.packs.get(compendiumName);
  if (pack) {
    const macro_data = (await pack.getDocuments()).find(
      (i) => i.name === macroName
    );

    if (macro_data) {
      if (isNewerVersion(game.version, "11")) {
        await macro.execute(args);
      } else {
        const temp_macro = new Macro(macro_data.toObject());
        temp_macro.ownership.default = CONST.DOCUMENT_PERMISSION_LEVELS.OWNER;
        pf2eAnimations.debug(`Running ${macroName} macro`, {
          macro_data,
          temp_macro,
          args,
        });
        // https://github.com/MrVauxs/FoundryVTT-Sequencer/blob/4d1c63102f4f40878a6c13224918d499a6390547/scripts/module/sequencer.js#L109
        const version = game.modules.get("advanced-macros")?.version;
        const bugAdvancedMacros =
          game.modules.get("advanced-macros")?.active &&
          isNewerVersion(
            version.startsWith("v") ? version.slice(1) : version,
            "1.18.2"
          ) &&
          !isNewerVersion(
            version.startsWith("v") ? version.slice(1) : version,
            "1.19.1"
          );
        if (bugAdvancedMacros) {
          await temp_macro.execute([...args]);
        } else {
          await temp_macro.execute(...args);
        }
      }
    } else {
      ui.notifications.error(
        "PF2e Animations | Macro " +
          macroName +
          " not found in " +
          compendiumName +
          "."
      );
    }
  } else {
    ui.notifications.error(
      "PF2e Animations | Compendium " + compendiumName + " not found"
    );
  }
};

// As above @ xdy.
pf2eAnimations.degreeOfSuccessWithRerollHandling =
  function degreeOfSuccessWithRerollHandling(message) {
    const flags = message.flags.pf2e;
    let degreeOfSuccess = flags.context?.outcome ?? "";
    if (flags?.context?.isReroll) {
      const match = message.flavor?.match('Result: <span .*? class="(.*?)"');
      if (match && match[1]) {
        degreeOfSuccess = match[1];
      }
    }
    return degreeOfSuccess;
  };

// Get token data and token scale.
/**
 * @param {Array} args Array of arguments.
 * @returns {Array} tokenD and tokenScale.
 */
pf2eAnimations.macroHelpers = function vauxsMacroHelpers(
  args = [],
  _callback = () => {}
) {
  pf2eAnimations.debug("Vaux's Macro Helpers | Args", args);
  let token = args[1]?.sourceToken ?? canvas.tokens.controlled[0];
  if (!token) {
    ui.notifications.error(
      pf2eAnimations.localize("pf2e-jb2a-macros.notifications.noToken")
    );
    return;
  }

  let tokenScale =
    token.actor.size === "sm"
      ? game.settings.get("pf2e-jb2a-macros", "smallTokenScale")
      : 1.0;
  let allTargets = args[1]?.allTargets ?? [...game.user.targets];
  let hitTargets = args[1]?.hitTargets ?? allTargets;
  let targets = hitTargets;
  let target = hitTargets[0];
  let origin = args[1]?.itemUuid ?? args[1]?.item?.uuid ?? token.actor.uuid;
  let actor = token.actor;

  pf2eAnimations.debug("Vauxs Macro Helpers | Results", {
    token,
    tokenScale,
    allTargets,
    hitTargets,
    targets,
    target,
    origin,
    actor,
  });
  // Don't delete it, even though it's just a legacy thing by this point.
  _callback();
  return [
    token,
    tokenScale,
    allTargets,
    hitTargets,
    targets,
    target,
    origin,
    actor,
  ];
};

pf2eAnimations.applyTokenMagic = function tokenMagicHelpers(args, params) {
  const [token] = pf2eAnimations.macroHelpers(args);
  pf2eAnimations.debug("Token Magic Helpers | Args | Params", args, params);

  const tokenMagic = game.settings.get("pf2e-jb2a-macros", "tmfx");
  if (!tokenMagic) return this.debug("Token Magic FX has been Disabled!");

  if (args[0] === "on") {
    TokenMagic.addFilters(token, params);
  } else if (args[0] == "off") {
    params.every((param) => {
      TokenMagic.deleteFilters(token, param.filterId);
    });
  }
};

/**
 * @param {string} alignment Alignment as a String ex. CG.
 * @param {boolean} reverse Reverse the alignment, ex. CG to LE.
 * @returns {Array} traits Array of traits.
 */
pf2eAnimations.alignmentStringToTraits = function alignmentStringToTraits(
  alignment,
  reverse = false
) {
  // returns an array of traits for the alignment string
  // e.g. "LG" -> ["lawful", "good"]

  // reverse = true will return the opposite traits (note that N becomes nothing)
  // e.g. "LG" -> ["chaotic", "evil"]
  if (reverse) {
    alignment = alignment
      .split("")
      .map((a) =>
        a === "L"
          ? "C"
          : a === "C"
          ? "L"
          : a === "G"
          ? "E"
          : a === "E"
          ? "G"
          : a === "N"
          ? ""
          : a
      )
      .join("");
  }
  let traits = [];
  if (alignment.includes("L")) traits.push("lawful");
  if (alignment.includes("N")) traits.push("neutral");
  if (alignment.includes("C")) traits.push("chaotic");
  if (alignment.includes("G")) traits.push("good");
  if (alignment.includes("E")) traits.push("evil");
  return traits;
};

pf2eAnimations.crosshairs = async function crosshairs(
  args = {
    tokenD,
    token,
    item,
  },
  opts = {
    range,
    crosshairConfig,
    openSheet,
    noCollision,
    noCollisionType,
  }
) {
  opts = mergeObject(
    {
      openSheet: true,
      noCollision: true,
      range: 999999,
      noCollisionType: "sight",
    },
    opts
  );

  if (!CONST.WALL_RESTRICTION_TYPES.includes(opts.noCollisionType)) {
    throw new Error(
      "A valid wall restriction type is required for testCollision. Passed " +
        opts.noCollisionType
    );
  }

  if (canvas.scene.grid.type === 0) {
    ui.notifications.warn(
      pf2eAnimations.localize("pf2e-jb2a-macros.notifications.gridless")
    );
  }

  if (canvas.scene.grid.size % 2) {
    ui.notifications.warn(
      pf2eAnimations.localize("pf2e-jb2a-macros.notifications.unevenGrid", {
        grid: canvas.scene.grid.size,
      })
    );
  }

  const tokenDoc = args?.token?.document ?? args?.tokenD?.document;
  const callbacks = {};

  const crosshairConfig = {
    label: "0 ft.",
    label: tokenDoc.name,
    interval: tokenDoc.height < 1 ? 4 : tokenDoc.height % 2 === 0 ? 1 : -1,
    lockSize: true,
    drawIcon: false,
    drawOutline: false,
    size: tokenDoc.height,
    icon: tokenDoc.texture.src,
    ogIcon: tokenDoc.texture.src,
    rememberControlled: true,
  };

  mergeObject(crosshairConfig, opts.crosshairConfig);

  crosshairConfig.ogIcon = crosshairConfig.icon;

  let cachedDistance = 0;
  callbacks.show = async (crosshairs) => {
    crosshairs.ogIcon = crosshairs.icon;
    if (!crosshairConfig.drawIcon) {
      await new Sequence("PF2e Animations")
        .effect()
        .file(crosshairConfig.icon)
        .attachTo(crosshairs)
        .persist()
        .name("Crosshairs")
        .scaleToObject(crosshairConfig.size * (tokenDoc?.texture?.scaleX ?? 1))
        .opacity(0.5)
        .play();
    }

    while (crosshairs.inFlight) {
      // make it wait or go into an unescapable infinite loop of pain
      await warpgate.wait(50);

      const ray = new Ray(args.token.center, crosshairs);

      const distance = canvas.grid.measureDistances([{ ray }], {
        gridSpaces: true,
      })[0];

      // Only update if the distance has changed
      if (cachedDistance !== distance) {
        cachedDistance = distance;
        crosshairs.label = `${distance} ft.`;
        if (
          distance > opts.range ||
          (opts.noCollision
            ? canvas.walls.checkCollision(ray, { type: opts.noCollisionType })
                .length
            : false)
        ) {
          crosshairs.icon = "icons/svg/hazard.svg";
          await crosshairs.document.updateSource({
            flags: {
              "pf2e-jb2a-macros": {
                outOfRange: true,
              },
            },
          });

          crosshairs.label += ` (${pf2eAnimations.localize(
            "pf2e-jb2a-macros.macro.outOfRange"
          )})`;

          await new Sequence("PF2e Animations")
            .effect()
            .file("icons/svg/cancel.svg")
            .attachTo(crosshairs)
            .persist()
            .zIndex(100)
            .tint("#ff0000")
            .scaleToObject(
              crosshairConfig.size * (tokenDoc?.texture?.scaleX ?? 1) + 0.5
            )
            .name("Out of Range!")
            .play();
        } else {
          crosshairs.icon = crosshairs.ogIcon;
          await crosshairs.document.updateSource({
            flags: {
              "pf2e-jb2a-macros": {
                outOfRange: false,
              },
            },
          });

          await Sequencer.EffectManager.endEffects({ name: "Out of Range!" });
        }
        crosshairs.draw();
      }
    }
  };

  tokenDoc.actor.sheet.minimize();
  const location = await warpgate.crosshairs.show(crosshairConfig, callbacks);
  if (opts.openSheet === true) {
    tokenDoc.actor.sheet.maximize();
  }

  // Calculate the rotation from the origin in degrees, up = 0
  location.rotationFromOrigin =
    (new Ray(tokenDoc.center, location).angle * 180) / Math.PI + 90;
  if (location.rotationFromOrigin < 0) location.rotationFromOrigin += 360;

  pf2eAnimations.debug("Crosshairs", args, opts, location);
  if (location.flags["pf2e-jb2a-macros"]?.outOfRange === "outOfRange") {
    ui.notifications.error(
      "PF2e Animations | " +
        pf2eAnimations.localize("pf2e-jb2a-macros.notifications.outOfRange")
    );
    location = { cancelled: true };
  }
  return location;
};

pf2eAnimations.localize = function localize(string = String, format = Object) {
  if (!string.includes("pf2e-jb2a-macros."))
    string = "pf2e-jb2a-macros." + string;
  if (Object.keys(format).length > 0) {
    return game.i18n.format(string, format);
  } else {
    return game.i18n.localize(string);
  }
};

pf2eAnimations.screenshake = function screenshake({
  intensity = 1,
  duration = 500,
  iterations = 1,
} = {}) {
  if (!(Number.isInteger(intensity) && Number.isInteger(duration))) {
    return ui.notifications.error(
      "PF2e Animations | Either Intensity or Duration is not an integer."
    );
  }
  const a = 1 * intensity;
  const b = 2 * intensity;
  const c = 3 * intensity;
  return document
    .getElementById("board")
    .animate(
      [
        { transform: `translate(${a}px, ${a}px) rotate(0deg)` },
        { transform: `translate(-${a}px, -${b}px) rotate(-${a}deg)` },
        { transform: `translate(-${c}px, 0px) rotate(${a}deg)` },
        { transform: `translate(${c}px, ${b}px) rotate(0deg)` },
        { transform: `translate(${a}px, -${a}px) rotate(${a}deg)` },
        { transform: `translate(-${a}px, ${b}px) rotate(-${a}deg)` },
        { transform: `translate(-${c}px, ${a}px) rotate(0deg)` },
        { transform: `translate(${c}px, ${a}px) rotate(-${a}deg)` },
        { transform: `translate(-${a}px, -${a}px) rotate(${a}deg)` },
        { transform: `translate(${a}px, ${b}px) rotate(0deg)` },
        { transform: `translate(${a}px, -${b}px) rotate(-${a}deg)` },
      ],
      {
        duration,
        iterations,
      }
    );
};

self.pf2eAnimations = pf2eAnimations;
