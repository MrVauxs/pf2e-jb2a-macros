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
