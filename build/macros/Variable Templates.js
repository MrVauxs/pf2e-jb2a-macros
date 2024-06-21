/* {"name":"Variable Templates","img":"icons/magic/lightning/bolt-beam-strike-blue.webp","_id":"LsHdd70Q1TpFTQf0"} */
// Not something you could even try using standalone.

if (!args.length) return;

console.log(args[1].templateData)

const animationName = args[1].animNameFinal + " (" + args[1].templateData + ")"

pf2eAnimations.debug("Variable Templates", [animationName, args])

// Doesn't work yet with Automated Animations not allowing template data.
AutoAnimations.playAnimation(
    args[1].sourceToken, 
    [],
    { name: animationName, templateData: args[1].templateData }
)