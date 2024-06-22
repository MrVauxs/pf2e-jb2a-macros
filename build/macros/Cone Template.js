/* {"name":"Cone Template","img":"icons/svg/dice-target.svg","_id":"reYCOeWs6vFSD91T"} */
// Original by david (aka claudekennilol)#2244
// Modified by MrVauxs#8622
// requires warpgate, jb2a patreon, and sequencer

const tokenD = args[0] ?? token
const gridSize = canvas.grid.h
const sourceSquare = (center, widthSquares, heightSquares) => {
  const h = gridSize * heightSquares
  const w = gridSize * widthSquares

  const bottom = center.y + h / 2
  const left = center.x - w / 2
  const top = center.y - h / 2
  const right = center.x + w / 2

  const rightSpots = [...new Array(heightSquares)].map((_, i) => ({
    direction: 0,
    x: right,
    y: top + gridSize / 2 + gridSize * i,
  }))
  const bottomSpots = [...new Array(widthSquares)].map((_, i) => ({
    direction: 90,
    x: right - gridSize / 2 - gridSize * i,
    y: bottom,
  }))
  const leftSpots = [...new Array(heightSquares)].map((_, i) => ({
    direction: 180,
    x: left,
    y: bottom - gridSize / 2 - gridSize * i,
  }))
  const topSpots = [...new Array(widthSquares)].map((_, i) => ({
    direction: 270,
    x: left + gridSize / 2 + gridSize * i,
    y: top,
  }))
  const allSpots = [
    ...rightSpots.slice(Math.floor(rightSpots.length / 2)),
    { direction: 45, x: right, y: bottom },
    ...bottomSpots,
    { direction: 135, x: left, y: bottom },
    ...leftSpots,
    { direction: 225, x: left, y: top },
    ...topSpots,
    { direction: 315, x: right, y: top },
    ...rightSpots.slice(0, Math.floor(rightSpots.length / 2)),
  ]

  return {
    x: left,
    y: top,
    center,
    top,
    bottom,
    left,
    right,
    h,
    w,
    heightSquares,
    widthSquares,
    allSpots,
  }
}

// cast from source token, if no source token, then select a square to originate the cone from.
let square
if (typeof tokenD === "undefined") {
  const sourceConfig = {
    drawIcon: true,
    drawOutline: false,
    interval: -1,
    label: "Cone Start",
  }

  const source = await warpgate.crosshairs.show(sourceConfig)
  if (source.cancelled) {
    return
  }
  square = sourceSquare({ x: source.x, y: source.y }, 1, 1)
} else {
  const width = Math.max(Math.round(tokenD.data.width), 1)
  const height = Math.max(Math.round(tokenD.data.height), 1)
  square = sourceSquare(tokenD.center, width, height)
}

// Template Data
const templateData = {
  t: args[1]?.templateType ?? "cone",
  distance: args[1]?.distance ?? 15,
  fillColor: args[1]?.fillColor ?? "#000000",
  angle: args[1]?.angle ?? 90,
  ...square.allSpots[0],
  user: game.userId,
}

let template = (
  await canvas.scene.createEmbeddedDocuments("MeasuredTemplate", [templateData])
)[0]

const targetConfig = {
  drawIcon: false,
  drawOutline: false,
}

let currentSpotIndex = 0
const updateTemplateLocation = async (crosshairs) => {
  while (crosshairs.inFlight) {
    await warpgate.wait(100)

    const totalSpots = 4 + 2 * square.heightSquares + 2 * square.widthSquares
    const radToNormalizedAngle = (rad) => {
      let angle = ((rad * 180) / Math.PI) % 360

      // offset the angle for even-sided tokens, because it's centered in the grid it's just wonky without the offset
      if (square.heightSquares % 2 === 0 && square.widthSquares % 2 === 0) {
        angle -= 360 / totalSpots / 2
      }
      const normalizedAngle =
        Math.round(angle / (360 / totalSpots)) * (360 / totalSpots)
      return normalizedAngle < 0 ? normalizedAngle + 360 : normalizedAngle
    }

    const ray = new Ray(square.center, crosshairs)
    const angle = radToNormalizedAngle(ray.angle)
    const spotIndex = Math.ceil((angle / 360) * totalSpots)

    if (spotIndex === currentSpotIndex) {
      continue
    }

    currentSpotIndex = spotIndex
    const spot = square.allSpots[currentSpotIndex]

    template = await template.update({ ...spot })

    const getCenterOfSquares = (t) => {
      const x1 = t.x + gridSize / 2
      const y1 = t.y + gridSize / 2
      const tokenSquaresWidth = t.data.width
      const tokenSquaresHeight = t.data.height
      const centers = []
      for (let x = 0; x < tokenSquaresWidth; x++) {
        for (let y = 0; y < tokenSquaresHeight; y++) {
          centers.push({
            id: t.id,
            center: { x: x1 + x * gridSize, y: y1 + y * gridSize },
          })
        }
      }
      return centers
    }
    const centers = canvas.tokens.placeables
      .map((t) =>
        t.actor.data.data.size <= 4
          ? { id: t.id, center: t.center }
          : getCenterOfSquares(t)
      )
      .flatMap((x) => x)
    const tokenIdsToTarget = centers
      .filter((o) =>
        canvas.grid
          .getHighlightLayer("Template." + template.id)
          .geometry.containsPoint(o.center)
      )
      .map((x) => x.id)
    game.user.updateTokenTargets(tokenIdsToTarget)
  }
}

const rotateCrosshairs = await warpgate.crosshairs.show(targetConfig, {
  show: updateTemplateLocation,
})
if (rotateCrosshairs.cancelled) {
  await template.delete()
  game.user.updateTokenTargets()
  return
}

const seq = new Sequence({ moduleName: "PF2e Animations", softFail: true })

seq
  .effect()
  .playIf(!args[2]?.length)
  .file("jb2a.magic_signs.rune.evocation.intro.red")
  .atLocation(square)
  .offset({ x: -square.w / 2, y: -square.h / 2 })
  .scaleToObject(1.6)
  .opacity(0.5)
  .waitUntilFinished()
  .effect()
  .playIf(!args[2]?.length)
  .file("jb2a.burning_hands.02.orange")
  .fadeIn(300)
  .attachTo(template)
  .stretchTo(template, { onlyX: true })
  .rotateTowards(template)
  .mask()
  .waitUntilFinished()
  .thenDo(async () => {
    if (args && args[2]) {
      args[2].forEach((element) =>
        seq
          .effect()
          .file(element)
          .fadeIn(300)
          .attachTo(template)
          .stretchTo(template, { onlyX: true })
          .rotateTowards(template)
          .mask()
      )
    }
  })

seq.thenDo(async function () {
  await template.delete()
})

await seq.play()
