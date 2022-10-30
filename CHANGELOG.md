# Version 2.5.0
- Removed default AA 5e animations and added code to remove them automatically
- Added / Fixed Heroism and Animate Dead
- Fixed Arcane Cascade not working with translations
- Added Manifest Eidolon macro
- Added French (thanks @ rectulo!) and Polish translations
- Fixed Dimension Door making you look like a matchstick and hopefully made the macro translation-compatible
- Added a setting to automatically open the Autorecognition Update Menu when the module is updated (lots of updates in this update huh?)

# Version 2.4.0
- Added weapon sound contributions by @ darkim.
- Added Brain Drain by @ Trueprophet. Thanks to both!
- Added the ability to preset settings for Humanoid Form and added Change Shape autorec entry with such settings ready to be filled out.

# Version 2.3.1
- Fixed various animations requiring custom assets.
- Updated module.json to require the latest versions of Automated Animations and Sequencer.
- Improved the styling of the Autorecognition Update Menu a little.
- Removed the doubled console logs when opening the above.

# Version 2.3.0
- Changed how the Autorecognition Update Menu overrides the settings, it now uses the built-in override function in Automated Animations. Thanks to @ Otigon for the PR (and AA in general!)
- Added new effects. See the update menu for what has been added. Thanks to @ darkim for the contribution!
- Added localization files and submitted them to Weblate.

# Version 2.2.3
- Fixed module.json.

# Version 2.2.2
- Improved the Autorecognition Update Menu and fixed a major bug.
  - It now sorts entries by label.
  - It now shows the type of entry (melee, ranged, ontoken, etc.).
  - Fixed a bug where the auto-deletion process would error on (and as such, practically delete) animations without metaData.
  - Added a (hopefully not needed) de-duplication process based on entry IDs.

# Version 2.2.1
- Added removal of outdated effects in the Autorecognition Update Menu.
- Added Black Tentacles attack animation.
- Moved most Bombs to Autorec Menu. Only Vexing Vapors and Dread Ampoule remain in macros due to their special cloud effect.
- Fixed Add Effects macro, which affected Guidance and Rage (the Action).

# Version 2.2.0
- Fixed active effect animations and Humanoid Form not working with the new A-A v4.0.11
- Added Brain Drain.

# Version 2.1.2
- Fixed a bug where completely custom animations that do not exist in PF2e Animation Macros were deleted upon using the Update Menu.

# Version 2.1.1
- Fixed bug in Autorecognition Update Menu where it "updated" entries that contained the same name (ex. Fang, Magic Fang, Fangs === Fang).

# Version 2.1.0
- Added the Autorecognition Update Menu, available in Settings. It is from now on your go-to way to update PF2e animations in Automated Animations.
- Fixed and perhaps added a bunch of effects. Unfortunately the list of them is lost to time spent on the above.

# Version 2.0.0
- Renamed from "PF2e x JB2A Macros Compendium" to "PF2e Animation Macros".
- Updated autorec for Automated Animations Version 4.
  - **THIS MEANS IT IS INCOMPATIBLE WITH EARLIER VERSIONS OF AUTOMATED ANIMATIONS, LET ALONE FOUNDRY.**
  - This also means no onlyNewStuff autorec file due to this massive change in how autorecs are generated. The file will also likely no longer exist in the future, in favour of an automated process in the module itself.
- Removed Token Borders macro in favour of AA animations.
- Added automatic Guidance Immunity on removal of Guidance effect.
- Added a pop-up to add the Rage effect when you use the Rage action. Can be set to automatically accept in the module settings.
- Removed Dragon / Kobold Breath entries in favour of customizing it yourself on per-Actor basis.
- Removed duplicate Fist and Unarmed Attacks.

# Version 1.13.0
- Added Web Spell Template.
- Improved Heal spell to account for Constructs and automatically pick the actions from the chat card (thank you @cdverrett94!).
- Improved scatter and combination weapon sounds and animations (thank you @Janonas!).
- Fixed a few issues with Chain Lightning / Electric Arc and made it less ear-deafening.

# Version 1.12.1
- Added `await` when getting a local macro for an animation.
- Added effects for Darkness spell, as well as integration with Perfect Vision to automatically restrict vision. This does not automate effects on tokens, nor does it abide by the rules that tokens with Darkvision see inside the Darkness template.
- Added Ki Rush spell.
- Fixed Abundant Spell.
- Removed Stances and Animal Instinct effects, and Unarmed Strikes macro. No longer necessary with updates to the system.
- Removed unnecessary (and no longer working) by this point script to add spell level flags to chat messages.

# Version 1.12.0 "Extemporaneous"
- Added `.tieToDocuments()` to Active Effect animations.
- Added the following effects (thanks Octavio#2519 for suggesting a bunch of these):
  - Shocking Grasp
  - Force Fang
  - Shooting Star
  - Sterling Dynamo
  - Sudden Charge
  - Polar Ray
  - Air Walk (Extempore Effect)
  - Alarm
  - Athletic Rush (Spell and Effect)
  - Dying
  - Drained
  - Antimagic Field
  - Entangle
  - Storm of Vengeance
  - Vomit Swarm
  - Beak
  - Longsword (seriously how long has it not been there?)
  - Unarmed
  - Talon
  - Dimensional Anchor (Spell and Extempore Effect)
  - Endure Elements (Spell and Extempore Effect)
  - Energy Aegis (Effect)
  - Feather Fall (Extempore Effect)
  - Fly (Extempore Effect)
  - Foresight (Spell and Extempore Effect)
  - Glyph of Warding
  - Heroism (Extempore Effect)
  - Needle of Vengeance (Extempore Effect)
  - Mask of Terror
  - Impaling Spike
  - Implosion
  - Prestidigitation
  - Needle of Vengeance (Extempore Effect)
  - Resilient Sphere (Extempore Effect)
  - Prestidigitation
  - Read Aura
  - Regenerate
  - Restoration
  - Sanctuary (Extempore Effect)
  - Shatter
  - Sleep
  - Unconscious (Changed it to Sleep symbol animation)
  - Soothe
  - Veil of Confidence (Extempore Effect)
  - Summon [...]
    - Animal
    - Construct
    - Fey
    - Plant or Fungus
    - Elemental
    - Anarch
    - Axiom
    - Celestial
    - Dragon
    - Entity
    - Fiend
    - Giant
  - Dancing Lights (Revamped to use the above Summon effect)
  - [...] Stance
    - Crane
    - Dragon
    - Gorilla
    - Mountain
    - Rain of Embers
    - Reflective Ripple
    - Stoked Flame
    - Stumbling
    - Tiger
    - Wolf
    - Cobra
    - Ironblood
    - Tangled Forest
- Removed Mountain Stance effect to make Falling Stone attacks work.
- Fixed Tanglefoot effect.
- Fixed a bunch of deprecation / compatibility warnings (thanks @surged20).

### Known Issues
- The player may not be able to Dismiss creatures they summoned. They can remedy that by turning "Dismiss button scope" Warp Gate setting to "All owned tokens". Note that this also makes them able to dismiss themselves!
- When summoning certain creatures, they have floating text deducting their HP.
- When summoning more than one creature, they spawn on top of each other. See this [issue](https://github.com/trioderegion/warpgate/issues/77).
- When summoning anything that isn't Medium, they scale from Medium to their size instead of spawning in proper size from the beginning.
 - This also causes larger creatures to have a "missing hitbox", only allowing their upper left corner to be selected. This can be fixed on a map refresh.
- Due to lack of PDF to Foundry module in V10, it has not been tested whether the summons include the token images it creates. There is a chance they don't.

# Version 1.11.4
- Fixed Dancing Lights Macro.

# Version 1.11.3
- Fixed Lightning Ray not working without a token selected.
- Fixed Cone effects always playing rainbows.

# Version 1.11.2
- Adjusted Animal Instinct macro to work with AA implementation.
- Improved Firearm effects (thanks @Janonas).
- Added / Changed the following effects:
  - Burning Hands (made it an actually 45 degree cone)
  - Chilling Spray
  - Color Spray
  - Dazzling Flash
  - Pummeling Rubble
  - Rejevunating Flames
  - Shockwave
  - Spray of Stars
  - Cone of Cold
  - Feral Shades
- Removed Invisibility effect.
- Moved certain setting changes from `renderSettings` hook to `ready` hook.
- Removed the Import pop-up in favour of an incoming Summoning Macros system.

# Version 1.11.1
- Fixed a typo in module.json making the module impossible to enable.

# Version 1.11.0
- Updated all macros with the following:
  - Compatible with Sequencer 2.2.0 and beyond
  - Compatible with Foundry V10
  - The default for macros is now playable standalone, only a few are still unusable without AA (mainly conglomerations of a lot of individual effects which will be later split down the line)
  - Made Aura animations compatible with Update Aura Macro from PF2e Workbench... [once the pull request is accepted](https://gitlab.com/symonsch/my-foundryvtt-macros/-/merge_requests/20)
- Added token scale setting to the module settings, which determines what size the effects should be for small tokens.
  Disabled when PF2e's "Scale tokens according to size" setting is enabled.
  Default is 0.8, goes from 0.2 to 3.0 (as usual token config allows).

# Version 1.10.6
- Fixed an issue regarding debug mode with spells 2: Electric Boogalo.

# Version 1.10.5
- Fixed an issue regarding debug mode with spells.
- Updated Illusory Disguise and Scorching Ray to be less ugly.

# Version 1.10.4
- Updated Humanoid Form to have smoother transitions into new form.
- Updated Illusory Disguise to have "Turn original token invisible" checkbox, on by default.
- Updated the Scorching Ray Macro to work under Sequencer 2.2.0. Requires Sequencer 2.2.0.

# Version 1.10.3 - "Don't code when your brain's melted" Edition
- Fixed the module breaking on startup.
- Fixed the module not telling you updated.

# Version 1.10.2
- Fixed how the module passes down targets to AA and Macros. (#17)
- Added "Debug Mode" setting.

# Version 1.10.1
- Fixed Sneak Attack. For real this time.

# Version 1.10.0
- Added the following effects
  - All Alchemical Bombs
  - (Waiting for AA Update / Consideration) All Animal Instinct Strikes
  - Shield Bash
  - Scorching Ray
  - Humanoid Form
  - Illusory Disguise
  - Lightning Bolt
  - Possibly more that I forgot about
- Fixed Sneak Attack.
- Categorized everything into Compendium Folders. Requires [Compendium Folders](https://github.com/earlSt1/vtt-compendium-folders).
- Renamed few settings for consistency's sake.
- Changed the version settings to use strings and built-in Foundry version checker, rather than Integers.
- Added "at will" compatibility for Dimension Jumps. (#14)

# Version 1.9.2
- Added the following effects
  - Unleash Psyche
  - Unarmed Attack
  - Effect Inspire Courage
  - Effect Inspire Defense
  - True Strike
  - Drain Bonded Item
- Added a warning for users who don't have any JB2A module enabled.
- Added a notification saying if you updated to a version with a new autorec file available for download.
- Hopefully made the module.json V10 compatible (?)

# Version 1.9.1
- Fixed Shield effect and lack of Mage Armor effect

# Version 1.9.0
- Added "On Hit/Miss" Animations from [PF2e Workbench](https://github.com/xdy/xdy-pf2e-workbench)
  - Configurable in the Autorecognition Menu.
  - You can also override it on per character basis by importing the Attack Animation Template of your choosing from the Actions compendium to your character sheet.
  - A setting to disable it is provided, regardless of it existing in the Autorecognition Menu or not.
  - A setting to have the "Miss" animations miss the target locations is also, provided. Don't know why you would want that though.
- Added the following effects (thanks @ Mother of God for most of these!):
  - Moonlight Ray
  - Searing Light
  - Tanglefoot (Attack and Effect)
  - Fire Ray
  - Sudden Bolt
  - Lay on Hands (Vs. Undead)
  - Agonizing Despair
  - See Invisibility
  - Attack Animation Templates for the feature above
  - Sound Burst
  - Lingering Composition
  - Effect Lay on Hands Vs. Undead
  - Effect Lay on Hands
  - Effect Incendiary Aura
  - Stance Arcane Cascade
  - Aura Protective Ward
  - Effect Protective Ward
  - Petrified
  - Stance Mountain Stance
  - Unconscious
  - Wounded
  - Quickened
  - Restrained
  - Prone
  - Incapacitated
  - Effect Mountain Stronghold
  - Effect Marshals Aura
  - Effect Panache
  - Effect Overcharge
- Revamped Bless and Bane to work with PF2e Workbench Auras.
  - Normal Casting and Effects are now temporary, rather than persistent.

# Version 1.8.1
- Adjusted Heal, Harm, Bane, and Bless to PF2e v3.13.X
- Added Marshal's Aura

# Version 1.8.0 - Equipment!
- Added CHANGELOG.md
- Switched Sneak Attack to active an Automated Animations entry than a macro.
- Added an "Equipment Changes" macro that triggers every time the itemUpdate hook is triggered. This allows to create "On Equip" and "On Invest" animations.
  - On that note, Aeon Stones animations have been added. Invest a stone to have it floating around your token.
- Finished "Bardic Cantripry" macro, at least with the most common composition cantrips out there.
- Fixed "Dimension Jumps" macro to actually use the level of the spell being cast than the player's maximum spell level.
  - This also marks the addition of the `pf2eJB2AMacros` flag, right now used to mark the level of the spell in a more accessible way.

# Version 1.7.8
- Fixed an error happening with the lack of a fire animation in Persistent Conditions macro. (thanks @ Michael_B)
  - (There is still no animation as the default is the token being on fire already, and there's no "fire bursts" animations outside of fireball; This fix is just so there are no errors popping up and exit gracefully.)

# Version 1.7.7
- Fixed a bug relating to "Use Local Macros" setting. (Thanks @ Micheal_B)

# Version 1.7.6 a.k.a. "Just Push so There's Something" Edition
- Added Sneak Attack and Persistent Damage macros which do not use AA but an in-house method to detect when to be played.
  - This peculiarity also means that in order to have users be able to modify those animations without the module deleting their efforts upon an update, a new setting has been added, causing the module to instead play macros from your **World** than the **Compendium**.

  ![image](https://user-images.githubusercontent.com/32039708/179329693-9b13e2b7-2aa2-4aed-9f2d-f0768aeb7408.png)

  __Note that this applies to ALL macros using this method, so you'll need both Persistent Conditions AND Sneak Attack macros imported to your world for them to properly work with this setting, even if only one of them is modified.__
  - Persistent Damage animations require the [PF2E Persistent Damage](https://foundryvtt.com/packages/pf2e-persistent-damage) module.
- Added plenty of condition animations.
- Added Various Teleportation animations to most if not all spells which teleport the player.
- Fixed #5 Rage Particle Animations are Patreon-only.
- Fixed an issue with Heal and Harm spells having invalid damaging animations.
- Added Guidance Immunity.

# Version 1.7.4
- Fixed Import Pop-Ups appearing on Player's Side

# Version 1.7.3
- Added sound effects to Produce Flame.
- Fixed zIndex'es on Rage's ground cracks.
- Changed Raise a Shield animation to use a macro from the PF2e Action Macros compendium rather one imported into a game.
- Added Bouncing Lightning animation, which is used for both Chain Lightning and Electric Arc.

# Version 1.7.2
- Added Rage Active Effect animation.

# Version 1.7.1
- Actually remove the Item and Macro importing

# Version 1.7.0 - No More Imports! (Mostly)
- Removed Importing of Macros and Items.
  - Macros are now being called through the compendium (REQUIRES Sequencer v2.1.0+)
  - Items can be added through usual Compendiums, but are no longer automatically added to the game by the importer.
  - Actors still get imported as they have to be for the Dancing Lights cantrip.
- Revamped Heal and Harm macros to post the amount they heal when using the 2-Action version.

# Version 1.6.1
- Fixed the Actions compendium not showing up.

# Version 1.6.0
- Added [PF2e Ranged Combat](https://github.com/JDCalvert/FVTT-PF2e-Ranged-Combat) reload actions to the module Compendiums.
- Added sounds to Bow, Crossbow, and Firearm animations.
- Added Eagle Eye Elixir + some other mutagens or bombs.
- Removed a lot of Firearm animations in favor of one generic Firearm animation. Some firearms animations remain as their functions were distinct enough to warrant a different animation.

# Version 1.5.0
- Added Bane and Bless Animations.

# Version 1.4.0
- Removed the modified copy of PF2e Workbench's Magic Missile macro, as the original now has animations.

# Version 1.3.0
- Added Alchemist's Fire, Acid Flask, Acid Splash, Peshpine Grenade, Frost Vial, and Drakeheart Mutagen animations.

# Version 1.2.0
- Fixed ability-made AE animations, such as Guidance, Dueling Parry, etc. activating when the ability itself was put into chat rather than added as an AE by renaming the Active Effects to contain the "Effect" prefix.
  - tl;dr This fixes double-animations when you post an ability to chat and add the AE by the same name to a token.

# Version 1.1.1
- Added a setting to automatically re-import assets.
- Added animations to spawning Dancing Lights.

# Version 1.1.0
- Fixed Release Workflow.

# Version 1.0.0 - Initialization
