/* {"name":"Blacklist Animations","img":"icons/svg/cancel.svg","_id":"esYTq7TExwwQwodx"} */
const blacklist = await game.settings.get("pf2e-jb2a-macros", "blacklist")

const options = await warpgate.menu(
  {
    inputs: [
      {
        type: "header",
        label: "Menu Wide Blacklists",
      },
      {
        type: "info",
        label:
          "For blacklisting entire sections of the PF2e Animations module.",
      },
      {
        type: "checkbox",
        label: "Melee",
        options: blacklist.menu.includes("melee"),
      },
      {
        type: "checkbox",
        label: "Range",
        options: blacklist.menu.includes("range"),
      },
      {
        type: "checkbox",
        label: "On Token",
        options: blacklist.menu.includes("ontoken"),
      },
      {
        type: "checkbox",
        label: "Templates",
        options: blacklist.menu.includes("templatefx"),
      },
      {
        type: "checkbox",
        label: "Preset",
        options: blacklist.menu.includes("preset"),
      },
      {
        type: "checkbox",
        label: "Active Effects",
        options: blacklist.menu.includes("aefx"),
      },
      {
        type: "header",
        label: "Specific Animation Names",
      },
      {
        type: "info",
        label:
          "For blacklisting specific animations from the PF2e Animations module. You can put multiple entries using <code>,</code> to separate them.",
      },
      {
        type: "text",
        label: "Specific Animations",
        options: blacklist.entries.join(", "),
      },
    ],
    buttons: [
      {
        label: "Ok",
        value: 1,
      },
      {
        label: "Ok and Update Animations",
        value: 2,
      },
    ],
  },
  {
    title: "Change Blacklist Settings",
  }
)

console.log(options)

if (options.buttons != false) {
  const o = options.inputs
  const newSettings = {
    menu: [],
    entries: [],
  }

  newSettings.menu.push(o[2] ? "melee" : null)
  newSettings.menu.push(o[3] ? "range" : null)
  newSettings.menu.push(o[4] ? "ontoken" : null)
  newSettings.menu.push(o[5] ? "templatefx" : null)
  newSettings.menu.push(o[6] ? "preset" : null)
  newSettings.menu.push(o[7] ? "aefx" : null)

  newSettings.entries = o[10].split(",").map((x) => x.trim())

  await game.settings.set("pf2e-jb2a-macros", "blacklist", newSettings)

  if (options.buttons === 2) {
    new autorecUpdateFormApplication().render(true)
  }
}
