/* {"name":"Export Autorec JSON","img":"icons/svg/upgrade.svg","_id":"8TuSEFCqDT7IH35f"} */
// Use this to export a clean copy of the current Autorec.
// Do NOT use this while still having animation entries you don't want to share.

const settings = {};
settings.melee = await game.settings.get('autoanimations', 'aaAutorec-melee')
settings.range = await game.settings.get('autoanimations', 'aaAutorec-range')
settings.ontoken = await game.settings.get('autoanimations', 'aaAutorec-ontoken')
settings.templatefx = await game.settings.get('autoanimations', 'aaAutorec-templatefx')
settings.preset = await game.settings.get('autoanimations', 'aaAutorec-preset')
settings.aura = await game.settings.get('autoanimations', 'aaAutorec-aura')
settings.aefx = await game.settings.get('autoanimations', 'aaAutorec-aefx')

let id = 0;
for (const key of Object.keys(settings)) {
    const sorted = [...settings[key]].sort((a, b) => !!b.metaData?.name - !!a.metaData?.name)

    sorted.map(x => {
        id++
        x.id = !Number(x.id) ? String(id) : x.id;
        x.metaData = x.metaData ?? {};
        x.metaData.label = x.label;
        x.metaData.menu = x.menu;
        x.metaData.name = x.metaData.name ?? "PF2e Animations";
        x.metaData.moduleVersion = x.metaData.moduleVersion ?? game.modules.get("pf2e-jb2a-macros").version;
        x.metaData.version = x.metaData.version ?? 1;
        return x
    })

    sorted.sort((a, b) => a.id - b.id)
    settings[key] = sorted
}

settings.version = await game.settings.get('autoanimations', 'aaAutorec').version

// New File
const content = JSON.stringify(settings, null, '\t');
const file = new File([content], `autorec.json`, { type: 'application/json' });
var response = await FilePicker.upload("data", "", file);

// modules/pf2e-jb2a-macros/module