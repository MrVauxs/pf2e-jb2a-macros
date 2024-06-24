/* {"name":"Rebounding Toss","img":"icons/skills/ranged/shuriken-thrown-orange.webp","_id":"1SwXNmbriolNG2ap"} */
// WIP!
return // Comment me out to test

pf2eAnimations.requireModule("warpgate")

let targets = Array.from(game.user.targets)
let token = args[0].token
let items = args[0].token._actor.items.filter(
  (i) => i.type === "weapon" && i.isHeld === true
)
let weapons = []

token.actor.sheet.minimize()

let imageProperties = [
  "padding: 1em 1em",
  "border: none",
  "width: 10em",
  "height: auto",
]

items.forEach((x) =>
  weapons.push({
    label: `<img src="${x.img}" style="${imageProperties.join(";")}"><p>${
      x.name
    }</p>`,
    value: x,
  })
)

let weaponSelection = await warpgate.menu(
  {
    inputs: [
      {
        type: "info",
        label: "Which weapon are you attacking with?",
      },
      {
        type: "info",
        label:
          "Only Equipped Weapons are shown, draw your weapon first if you want to attack with it!",
      },
    ],
    buttons: weapons,
  },
  {
    title: "Rebounding Toss",
  }
)

// Second Throw BS
let distanceLimit = 10
const tokenCenter = targets[0]
let cachedDistance = 0

const checkDistance = async (crosshairs) => {
  while (crosshairs.inFlight) {
    //wait for initial render
    await warpgate.wait(100)

    const ray = new Ray(tokenCenter, crosshairs)

    const distance = canvas.grid.measureDistances([{ ray }], {
      gridSpaces: true,
    })[0]

    //only update if the distance has changed
    if (cachedDistance !== distance) {
      cachedDistance = distance
      if (distance > distanceLimit) {
        crosshairs.icon = "icons/svg/hazard.svg"
      } else {
        crosshairs.icon = weaponSelection.buttons.img
      }
      crosshairs.draw()
      crosshairs.label = `${distance} ft`
    }
  }
}

const callbacks = {
  show: checkDistance,
}

if (weaponSelection.buttons) {
  let weaponOfChoice = (actor.data.data.actions ?? [])
    .filter((action) => action.type === "strike")
    .find((strike) => strike.name === weaponSelection.buttons.data.name)

  if (targets.length === 1) {
    // Roll attack
    weaponOfChoice?.attack()

    // Check if attack hit
    const secondThrowLocation = warpgate.crosshairs.show(
      { size: token.data.width, icon: token.data.img, label: "0 ft." },
      callbacks
    )

    // Handle fuckups
    if (location.cancelled) {
      ui.notifications.error("Cancelled Rebounding Toss's second throw.")
      return
    }
    if (cachedDistance > distanceLimit) {
      ui.notifications.error(
        "Your Rebounding Toss can only attack a second target within 10 feet of the first one."
      )
      return
    }

    const boundsContains = (bounds, point) =>
      bounds.left <= point.x &&
      point.x <= bounds.right &&
      bounds.top <= point.y &&
      point.y <= bounds.bottom

    const found = !!canvas.tokens.placeables
      .map((x) => x.bounds)
      .find((b) => boundsContains(b, secondThrowLocation))
  } else if (targets.length > 1) ui.notifications.info("Too many targets!")
  else ui.notifications.info("No Targets!")
}

token.actor.sheet.maximize()
