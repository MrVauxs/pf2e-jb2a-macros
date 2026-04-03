import * as fs from "fs";

function convertName(name) {
  return name.toLowerCase().trim().replaceAll(" ", "-");
}

function separateAnimations(
  animationsDir = "./animations",
  baseFile = null,
  types,
) {
  const content = fs.readFileSync(baseFile, "utf8");
  const data = JSON.parse(content);
  console.log("==== Splitting Animations ====");
  let cnt = 0;
  for (const type of types) {
    const baseOutputDir = `${animationsDir}/${type}`;
    if (!fs.existsSync(baseOutputDir)) {
      fs.mkdirSync(baseOutputDir, { recursive: true });
    }

    const animations = data?.[type] || [];
    for (const anim of animations) {
      delete anim.id;
      const name = convertName(anim.label);
      fs.writeFileSync(
        `${baseOutputDir}/${name}.json`,
        JSON.stringify(anim, null, 4),
      );
      console.log(` - ${name}`);
      cnt++;
    }
  }
  console.log(`==== Finished Splitting all ${cnt} animations ====`);
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
