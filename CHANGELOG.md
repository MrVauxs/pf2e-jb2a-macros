# Version 2.13.0

- Added JB2A's Runelord Sins Rune animations.
- (Commissioned) Added a "Brain Response" animation. Runs when you Devise a Stratagem and Recall Knowledge.

# Version 2.12.5

- Fixed Manifest Eidolon macro.

# Version 2.12.4

- Fixed Manifest Eidolon macro breaking when there is only one eidolon in the game.

# Version 2.12.3

- Fixed TMFX setting not being disabled when the user first enables and then disables TMFX.
- Fixed Manifest Eidolon macro breaking on normal eidolons but with different sourceId. Also added a check for the "eidolon" slug, once PF2e Companion Compendium adds it.

# Version 2.12.2

- Fixed Manifest Eidolon macro breaking on translated eidolons.

# Version 2.12.1

- Fixed Add Effects breaking on effects with no system property (???).

# Version 2.12.0

- Updated the Modifiers Matter integration to be strict in it's matching effects.
- Updated Aura: Protective Ward to use the system aura effect, not Workbench.
- Added a function that allows the "Add Effect" macro to increase the badge value of an effect if it already exists.
- Added Fling Magic animation.

# Version 2.11.0

- Added Healer's Blessing animation.
- Added PF2e Modifiers Matter integration.
  - You can now have animations and macros trigger on specific bonuses from the PF2e Modifiers Matter module. An example is "Modifiers Matter: Bless".
  - The animation names also accept the degree of how the modifier helped, ranging from and to: ESSENTIAL, HELPFUL, HARMFUL, DETRIMENTAL. An example is "Modifiers Matter: Bless (ESSENTIAL)".

# Version 2.10.10

- Fixed Humanoid Form not working with autoscaling on.
- Added Dragon Form (Silver) and fixed a bunch of other dragons token scales.

# Version 2.10.9

- Added scroll and made the update menu not take up the entire height of the screen.

# Version 2.10.8

- Updated localization files.
- Updated minimal version of Sequencer to 2.412.
- Fixed an issue with Token Mold changing the names of the summons.
- Fixed Sneak Attack issues.
- Fixed broken images in the module.json.

# Version 2.10.7

- Updated localization files.
- Fixed Sudden Charge macro being offset on certain maps.
- Fixed missing modules notification coming up blank.

# Version 2.10.6

- Added a check for scenes with uneven grid sizes.
- Removed the automatic cancelling of crosshairs on problematic scenes. You will be and have been warned.

# Version 2.10.5

- Updated crosshairs to instead show the full icon or token image instead of a default Warpgate template.
  - Now you can see a detailed preview of how a summoned token will look like on the map.
- Added a check for gridless maps in crosshairs.

# Version 2.10.4

- Fixed some settings not appropriately getting updated when TMFX is not enabled.

# Version 2.10.3

- Fixed the warning for wrong versions of dependencies.

# Version 2.10.2

- Added an Advanced Macros minimum version dependency (1.19.3, newest).
- Fixed undefined titles, mainly appearing as a result of the above module.

# Version 2.10.1

- Added a warning for wrong versions of dependencies as well.

# Version 2.10.0

- Updated localization files.
- Updated dependecy on Sequencer to 2.411.
- Removed libwrapper and socket-lib dependencies of other modules.
- Added a check when the game is ready to see if the required modules are enabled. If not, a warning is displayed.
- Upgraded pf2eAnimations.crosshairs to account for wall collision, whether it be vision collision for spells, or move collision like Sudden Charge.
- Fixed the optional TMFX dependency erroring if TMFX is not installed at all.
- Added the following effects (and probably more that I forgot):
  - Blur (TMFX, Extempore)
  - Heat Haze (TMFX, Extempore Effect)
  - Concealed (TMFX)
  - Mirror's Reflection

# Version 2.9.10

- Updated dependency on Warpgate to 1.16.1.
- Fixed Action Counter and Mirror Image.
- Added an optional Token Magic FX dependency. Used for effects such as Encumbered, Petrified, and Stumbling Stance. If you don't have it, the effects will still work, but without the TMFX elements, either replaced by Sequencer or nothing.

# Version 2.9.9

- Fixed Heal triggering on wrong spells.
- Removed erroneous "Run as GM" Advanced Macros flags.

# Version 2.9.8

- Fixed Bless triggering on wrong spells.
- Apply Effect macro now automatically removes templates that triggered is, if any. This means that the moment you place down at Bless or Bane template, the effect gets applied, and template removed, as it is replaced by the Aura version instead. If you don't use PF2e Workbench, the template will not be removed.

# Version 2.9.7

- Updated various effects that were often errorenously triggered when playing something else (Inspire Courage and Rage for example).

# Version 2.9.6

- Fixed the compendium data being corrupted due to unescaped characters.
- Updated Sequences to soft fail on errors, not disturbing the gameplay in an event something is missing (such as an animation, sound, or macro).

# Version 2.9.5

- Added Taiwanese localization. (#92)
- Added a random delay to Inspire Courage and Defense to avoid them all playing at the same time and thus killing performance.
- Made Effect: Rage only play on Rage effects and not on anything containing the word "rage", including "Inspire CouRAGE".
- Fixed Summon Lesser Servitor for actors with Neutral Alignment (thanks to MercuryReign!)
- Fixed persistent bleed damage not animating (thanks to MercuryReign!)

# Version 2.9.4

- Fixed alignment for actors without a deity. (#91)

# Version 2.9.3

- Fixed Dancing Lights not working with the free version of JB2A.

# Version 2.9.2

- (Thanks to @MercuryReign for the below!)
- Fixed Spiritual Weapon not respecting input arguments.
- Fixed Summon Lesser Servitor giving Neutral creatures as valid summons.

# Version 2.9.1

- Fixed Spell Effect: Shield not proccing.
- Fixed Mirror Image and Stumbling Stance rotation.
- Adjust and add Dirge of Doom animations.

# Version 2.9.0

- Changed how equipment animations such as Aeon Stone work:
  - Created a new hook, "pf2eAnimations-equipOrInvestItem", which is called whenever an item is updated and returns whether an item is... equipped or invested. Or neither.
  - "Equipment Changes" macro has been removed.
  - "Use Local Macros" setting has been removed.
  - People using a custom animations for equipping items should use the new hook. PF2e Animations does not provide the means to automatically call their macros anymore though, meaning you need to use a module such as [Hook Macros](https://github.com/ardittristan/HookMacros).
  - Created a wiki page about [Hooks and how to use them for animations](https://github.com/MrVauxs/pf2e-jb2a-macros/wiki/Hooks). Deleted the page about Use Local Macros.
- Added proper reload sounds to Reload action.
- Added Aeon Stone to the Autorecognition menu. It's automatically called by the pf2eAnimations.equipOrInvestItem hook. You can blacklist it or modify it however you want.
- Updated some Active Effect animations to Force Exact name Matching.
- Removed Persistent Damage animation effects (i.e. those which stayed on your token).
- Fixed temporary Persistent Damage animations (i.e. those which played every time your token took damage).

# Version 2.8.6

- Fixed rotation bug in Action Counter macro.

# Version 2.8.5

- Fixed Alchemist's Fire blast happening before the end of the throwing animation.
- Modified Harm to being purely ran by Automated Animations.
- Added effects for the Botanical Bestiary.
- Fixed some alignment issues with Summoning.

# Version 2.8.4

- Fixed Localization, again.
- Fixed Summons being unable to be summoned.

# Version 2.8.3

- Fixed Localization.

# Version 2.8.2

- Made all macros fail quietly when a file cannot be found. This makes the module compatible with the free version, if not for the fact nothing will be seen.
- Included assets needed for Action Tracker macro, and then some.

# Version 2.8.1

- Fixed Shield having mismatched colours.
- Added Action Tracker macro and effect.
- Updated Dimension Door to be peacefully quit when on the wrong version of JB2A.

# Version 2.8.0

- Broke the module into pieces. And by that I mean it's now not just one compiled file that was slowly becoming a mess to trawl through.
- Dimension Door has been separated off of Dimension Jumps macro and has been improved from the last iteration. (#79)
- Updated Blacklist to include an "Ok and Update Animations" button.
- Updated localization files.

# Version 2.7.11

- Updated Mirror Image to be compatible with free version of JB2A. Also made scaled tokens work in it.
- Fixed a bug when trying to hide a folder that didn't yet exist. (#9)
- Fixed an issue regarding Tokenmagic Automatic Wounds and Summons being bloodied when freshly summoned.

# Version 2.7.10

- Fixed a bug in Spiritual Weapon.
- Updated localization files.

# Version 2.7.9

- Added simple Spiritual Weapon. May be enhanced in the future.
- Fixed Dazzling Flash being too small on larger templates.
- Expanded pf2eAnimation.macroHelpers.

# Version 2.7.7 - 2.7.8

- Fixed Manifest Eidolon.

# Version 2.7.6

- Fixed a bug regarding small summons breaking the summoning process.
- Fixed a bug where the player-requested summoning templates did not get removed.

# Version 2.7.5 a.k.a. "Conjuration Research" edition

- Dummy NPCs are no longer visible in the sidebar without Debug mode on or disabling the module.
- Added unique Animate Dead and Summon Animal summoning animations.
- Fixed a bug around creating custom summoning animations in Autorecognition Menu.
- Fixed a bug regarding summoned token scaling.
- Fixed the Splatter module causing splatters when summoning a creature. Note that due to how the module works, all previous splatters may get removed when summoning any new creature.

# Version 2.7.4

- Fixed a variety of macros.
- Increased the minimum version of Sequencer to 2.4.2.
- Added Stumbling Stance, thank you Vdub for the commission!
- Added blacklisting animations from being added by the module.
- Updated localization files.

# Version 2.7.3

- Actually add Summon Lesser Servitor...
- Fixed Dinosaur Form (Brontosaurus) scaling.
- Added automatic effects to Inspire Courage, Inspire Defense, Bless, and Protective Ward, along with PF2e Workbench'es variant effects if they exist.
- Fixed a bunch of bugs relating to summoning filter args.

# Version 2.7.2

- Removed soundfxlibrary dependency. Animations with sounds will not play the sound if it is missing.
- Updated localization files.

# Version 2.7.1

- Fixed bug regarding summoning -1 level creatures.

# Version 2.7.0

- Renamed PF2e Animation Macros to PF2e Animations.
- Added Mirror Image.
- Added / Fixed lack of Summon Lesser Servitor.
- Revamped Resist Energy and Mage Armor.
- Added Animal Shapes using the Pathfinder Token Pack: Bestiaries module.
- Fixed scrolling text on summons, revealing their HP by dealing damage to them (from 999 to their true health pool).
- Added a variety of Summoning Filter Options. These include:
  - `level-` and `exact-level`, ex. `level-1-5` for 1st to 5th level and `exact-level-4` for exactly 4th level creatures.
  - `uncommon` for uncommon or higher rarity creatures.
  - `random-creature` for randomly selecting a creature.
  - `random-amount-` ex. `random-amount-1-9` for randomly deciding how many creatures to summon between 1 to 9.
  - `has-image` for whether the creature has an image (helpful with the newly released token pack).
  - `source-` for the source of the creature, ex. `source-pathfinder-bestiary-3` to only grab the bestiary 3 creatures.
  - `unique-` for in-house automation. Currently only accepts `unique-lesser-servitor` for use with Summon Lesser Servitor spell.
- Updated localization files.

# Version 2.6.9

- Updated localization files.
- Fixed blank animation labels crashing the Update Menu.
- Fixed Summoning not filtering for Common creatures.

# Version 2.6.8

- Fixed Aeon Stone / Equipment Changes macro.

# Version 2.6.7

- Improved summoning spells sorting by making it sort by level and then alphabetically.
- Added levels to the names of creatures when browsing the summoning list.

# Version 2.6.6

- Updated localization files.
- Moved all functions into a pf2eAnimations object for easier access and less clutter.
- Fixed all active effect animations not respecting token visibility nor opacity.
- Added new functionality for A-A v4.0.22, which is now the required minimum version.
  - Added a hook to checking the metaData of an object displaying the version of the animation, along with a hint about it going to be updated and how to prevent that from happening.
  - Fixed Summoning Animation Template making the token visible before the animation finishes with new "Await Animation" option for macros.

# Version 2.6.5

- Updated localization files.
- Made the module work on all versions of Advanced Macros (specifically 1.18, 1.19, and 1.19.2).
  - As such, the min/max version requirement has been lifted, making it able for the module to be enabled without the need for updates.

# Version 2.6.4

- Fixed module for Advanced Macros 1.19.2.
- Fixed Shield active effect not using the complete animation.

# Version 2.6.3

- Literally nothing.

# Version 2.6.2

- With Sequencer 2.3.18, Advanced Macros v1.19.1 is now available. Both Sequencer's and Advanced Macros' minimum versions were raised to newest. Advanced Macros maximum version has been removed.
- Removed Compendium Folders entries in favour of PF2e's integrated compendium search function.
- Updated Equipment Changes and Aeon Stone macros to not use deprecated data paths.
- Updated localization files.

# Version 2.6.1 "Whackamole"

- Updated localization files.
- Reverted back to Advanced Macros 1.18.1 due to the breaking changes introduced in 1.19 and other modules not yet updating to that version.
  - Now the module warns you if you are on 1.19 to revert back.
  - The MAXIMUM version of Advanced Macros is now 1.18.1 in module.json.

# Version 2.6.0

- Fixed bug in Equipment Changes macro due to a recent Advanced Macros update. The minimum version for Advanced Macros is now 1.19.1.
- Added "debug" mode to the Autorecognition Update Menu, where it also shows the user-added effects that are not gonna be touched by the module.
- Summoning macros and Sudden Charge macro now minimize and maximize your character sheet in the workflow.
- Summoning, Illusory Disguise, and Humanoid Form macros are now translate-able.
- Summoning spells and Manifest Eidolon animations can now be customized down to the creature you are summoning.
  - You can see examples in "Summoning Animation Template" action in PF2e Animation Actions compendium.
  - Note that this update has been released before Automated Animations "Await Animation Completion" setting for macros has been released. As such, your creatures will appear instantly, and then the summoning animation will commence.

# Version 2.5.4

- Added `.tieToDocuments` function to Bardic Cantripry, hopefully making it more reliably shut itself down when the effects are removed.

# Version 2.5.3 a.k.a. "ZA WARUDO" edition

- Fixed "the world" error.
- Fixed more localization issues with macros.
- Added Simplified Chinese translation by @ AlphaStarguide, thank you!

# Version 2.5.2

- Fixed Dimension Jumps macro now working with localization.
- Fixed some Arcane Cascade animations.

# Version 2.5.1

- Fixed Dimension Jumps macro not working with spells including brackets.

# Version 2.5.0

- Removed default AA 5e animations and added code to remove them automatically in the update menu.
- Added / Fixed Heroism and Animate Dead.
- Fixed Arcane Cascade not working with translations.
- Added Manifest Eidolon macro.
- Added French (thanks @ rectulo!) and Polish translations.
- Fixed Dimension Door making you look like a matchstick and hopefully made the macro translation-compatible.
- Added a setting to automatically open the Autorecognition Update Menu when the module is updated (lots of updates in this update huh?)
- Added Arcane Cascade and Panache actions to grant their respective effects.

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

# Version 1.10.3 a.k.a. "Don't code when your brain's melted" Edition

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

  **Note that this applies to ALL macros using this method, so you'll need both Persistent Conditions AND Sneak Attack macros imported to your world for them to properly work with this setting, even if only one of them is modified.**

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
