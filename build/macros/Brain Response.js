/* {"name":"Brain Response","img":"icons/skills/trades/academics-investigation-puzzles.webp","_id":"ZearnherXwnwr9cH"} */
if (args?.[1]?.systemData?.args) args[2] = args[1].systemData.args
/* 
	The above code is for macro presets
	You can create one by copying the following code into a macro
	AutomatedAnimations.playAnimation(token, {name: "Recall Knowledge"}, {args: { text: ["Example"] }})
	The available args are:
	{
		text: [An array of words] or a "String which will be multiplied into three copies"
		textFinal: "The final word above the token"
		color: "A string" or [an Array of colors], defaults to a random gradient of 2 colors
		prompt: A boolean to be able to pick all of the above in a separate menu when used
		textSize: A number
	}
*/

let [tokenD] = await pf2eAnimations.macroHelpers(args)

function genColor() {
  return Math.floor(Math.random() * (0xffffff + 1))
    .toString(16)
    .padStart(6, "0")
}

let finalArray = [
  "εὕρηκα!",
  "Got It!",
  "Found It!",
  "Perfect!",
  "This'll do.",
  "Hope I'm Right.",
]
let text = args?.[2]?.text ?? ["Think.", "Think..", "Think..."]
let textFinal =
  args?.[2]?.textFinal ??
  finalArray[Math.floor(Math.random() * finalArray.length)]
let colors = args?.[2]?.color ?? ["#" + genColor(), "#" + genColor()]

console.log(args[2])

if (args?.[2]?.prompt) {
  const menu = await warpgate.menu(
    {
      inputs: [
        {
          type: "text",
          label: "Hovering Text (Split by Comma)",
          options: text.join(" , "),
        },
        {
          type: "text",
          label: "Final Text",
          options: textFinal,
        },
        {
          type: "text",
          label: "Colors",
          options: colors.join(" , "),
        },
      ],
      buttons: [
        {
          label: "Start Animation",
          value: 1,
        },
        {
          label: "Cancel",
          value: 2,
        },
      ],
    },
    { title: "Type of Animation" }
  )

  if (!menu.buttons || menu.buttons === 2) return
  text = menu.inputs[0].split(",")
  textFinal = menu.inputs[1]
  colors = menu.inputs[2].split(",")
}

const textOpts = {
  fill: colors,
  linejoin: "round",
  strokeThickness: 3,
  fontFamily: "Times New Roman",
  fontSize: 30,
  fontVariant: "small-caps",
  align: "center",
  dropShadow: true,
  dropShadowAlpha: 0.4,
  dropShadowAngle: 1,
  dropShadowBlur: 10,
}

let width = game.canvas.screenDimensions[0]
let height = game.canvas.screenDimensions[1]

let screenPosition = () => {
  return {
    // Sequencer.Helpers.random_int_between
    x: Sequencer.Helpers.random_int_between(-350, 350),
    y: Sequencer.Helpers.random_int_between(-350, 350),
  }
}

text = [text].flat()
if (text.length < 3) text = [text, text, text].flat()

let time = text.length * 1000

const seq = new Sequence({ moduleName: "PF2e Animations", softFail: true })
  .effect()
  .file("jb2a.screen_overlay.01.bad_omen.dark_black")
  .screenSpace()
  .opacity(0.8)
  .screenSpaceScale({ fitX: true, fitY: true })
  .fadeIn(500, { ease: "easeInOutSine" })
  .duration(time)
  .fadeOut(500, { ease: "easeInOutSine" })
  .filter("ColorMatrix", {
    saturate: -1,
  })
  .canvasPan()
  .playIf(!window.zoomedInOnce)
  .atLocation(tokenD)
  .duration(1000)
  .scale(2)
  .lockView(time * (2 / 3))
  .thenDo(() => {
    window.zoomedInOnce = true
  })

// text, integer, array
text.forEach((t, i, a) => {
  seq
    .effect()
    .atLocation(tokenD, { randomOffset: 4 })
    .fadeIn(500)
    .fadeOut(500)
    .scaleIn(0.8, 500, { ease: "easeOutBack" })
    .text(t, textOpts)
    .duration(time - i * 1000)
    .wait(1000)
})

seq
  .effect()
  .atLocation(tokenD, { offset: { y: -1 }, gridUnits: true })
  .fadeIn(500)
  .fadeOut(500)
  .scaleIn(1.2, 250, { ease: "easeOutBack" })
  .text(textFinal, {
    ...textOpts,
    fontWeight: "bold",
    fontSize: textOpts.fontSize * 1.2,
  })
  .duration(3000)
  .play()
