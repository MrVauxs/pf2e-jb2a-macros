/* {"name":"Darkness","img":"systems/pf2e/icons/spells/darkness.webp","_id":"ooHL5fVdUQbWIlIh"} */
// Just updates the template with perfect vision data.
// If used standalone, it updates the latest placed template.

const flag = {
  "perfect-vision": {
    visionLimitation: {
      enabled: true,
      sight: 0,
      sound: null,
      move: null,
      other: null,
      detection: {
        basicSight: 0,
        feelTremor: null,
        hearing: null,
        seeAll: 0,
        seeInvisibility: 0,
        senseAll: null,
        senseInvisibility: null,
      },
    },
  },
}

const template = args.length
  ? args[1].templateData
  : canvas.templates.placeables[canvas.templates.placeables.length - 1].document

await template.update({ flags: flag })
