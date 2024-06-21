/* {"name":"Dismiss Selected Token","img":"icons/magic/fire/beam-strike-whip-red.webp","_id":"Z4NYhV3lBTkOJTSD"} */
const selected = canvas.tokens.controlled
Dialog.confirm({
  title: "Confirmation Title",
  content:
    "Do you want to Dismiss the following tokens? " +
    `<p><b>${selected.map((x) => x.name).join(", ")}</b></p>`,
  yes: () => {
    return selected.forEach((x) => warpgate.dismiss(x.id))
  },
  no: () => {
    return
  },
})
