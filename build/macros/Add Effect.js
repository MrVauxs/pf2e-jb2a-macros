/* {"name":"Add Effect","img":"icons/svg/daze.svg","_id":"x3ZaL34wkz4LljPo"} */
pf2eAnimations.debug("Add Effect Macro", args)

let effect;
let deleteTemplate = false;

if (args[2].on) effect = args[2].on;
if (args[2].on && args[2].deleteTemplate === "on") deleteTemplate = true;

if (args[2].off && args[0] === "off") effect = args[2].off;
if (args[2].off && args[2].deleteTemplate === "off") deleteTemplate = true;

if (!effect) return;
const ITEM_UUID = effect;

let source = await fromUuid(ITEM_UUID);

if (!source) {
	if (args[2]?.deleteTemplate?.includes("alt")) {
		deleteTemplate = true
	} else {
		deleteTemplate = false
	}
	if ((args[2].altOff && effect === args[2].off) || (args[2].altOn && effect === args[2].on)) {
		source = await fromUuid(effect === args[2].altOn ? args[2].altOn : args[2].altOff)
	} else {
		return pf2eAnimations.debug("Add Effect - No Effect Found", args)
	}
}

source = (await fromUuid(ITEM_UUID)).toObject();
source.flags = mergeObject(source.flags ?? {}, { core: { sourceId: ITEM_UUID } });

const existing = await args[1].sourceToken.actor.itemTypes.effect.find((e) => e.flags.core?.sourceId === ITEM_UUID);

await ask(source, deleteTemplate)

async function ask(source, deleteTemplate) {

	async function add() {
		if (existing?.system?.badge) {
			existing.update({ "system.badge.value": existing.system.badge.value += 1 })
		} else if (!existing) {
			await args[1].sourceToken.actor.createEmbeddedDocuments("Item", [source]);
		}
		if (deleteTemplate && args[0].documentName === "MeasuredTemplate") args[0].delete();
	}

	if (!args[2].ask || game.settings.get("pf2e-jb2a-macros", "autoAccept")) {
		add();
		return;
	} else {
		await Dialog.wait({
			title: "Add Effect?",
			content: `
			<p>Do you want to add <b>"${source.name}"</b> to your character, <b>${args[1].sourceToken.actor.name}</b>?</p>
			<p><i>You can automatically accept these in PF2e Animations settings.</i></p>
					`,
			buttons: {
				button1: {
					label: "Accept",
					callback: async () => {
						add();
					},
					icon: `<i class="fas fa-check"></i>`
				},
				button2: {
					label: "Decline",
					icon: `<i class="fas fa-times"></i>`
				}
			},
		}).render(true);
	}
}