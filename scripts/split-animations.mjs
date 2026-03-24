import * as fs from 'fs';

function convertName(name) {
  return name.toLowerCase().replaceAll(" ", "-");
}

function separateAnimations(
  animationsDir = "./triggers",
  baseFile = null,
  types,
) {
  const content = fs.readFileSync(baseFile, "utf8");
  const data = JSON.parse(content);
  for (const type of types) {
    const animations = data[type];
    for (const anim of animations) {
      delete anim.id;
      const name = convertName(anim.label);
      fs.writeFileSync(
        `${animationsDir}/${type}/${name}.json`,
        JSON.stringify(anim, null, 4),
      );
    }
  }
}

const animationsDir = process.argv[2] || "./animations";
const baseFile = process.argv[3] || "./module/autorec.json";
const types = [
  "melee",
  "range",
  "ontoken",
  "templatefx",
  "preset",
  "aura",
  "aefx",
];

separateAnimations(animationsDir, baseFile, types);
