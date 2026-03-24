import * as fs from "fs";
import * as path from "path";

function getAllJsonFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory ${dir} not found, skipping trigger combination`);
    return [];
  }

  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllJsonFiles(fullPath));
    } else if (
      entry.isFile() &&
      entry.name.endsWith(".json") &&
      !entry.name.endsWith("triggers.json")
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

function combineAnimations(
  animationsDir = "./animations",
  baseFile = null,
  types,
) {
  const base = {};
  let cnt = 1;
  for (const type of types) {
    base[type] = [];
    const directory = `${animationsDir}/${type}`;
    const jsonFiles = getAllJsonFiles(directory);
    console.log(`${type} is adding ${jsonFiles.length} files`);

    for (const file of jsonFiles) {
      try {
        const content = fs.readFileSync(file, "utf8");
        const data = JSON.parse(content);
        data.id = String(cnt);
        base[type].push(data);
        console.log(`- ${file}`);
      } catch (error) {
        console.error(`Error processing ${file}:`, error.message);
      }
      cnt++;
    }
  }

  console.log(`\nCombined ${cnt} animations`);

  if (baseFile) {
    const baseOutputDir = path.dirname(baseFile);
    if (!fs.existsSync(baseOutputDir)) {
      fs.mkdirSync(baseOutputDir, { recursive: true });
    }

    fs.writeFileSync(baseFile, JSON.stringify(base, null, 4));
    console.log(`Written to ${baseFile}`);
  }

  return base;
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

combineAnimations(animationsDir, baseFile, types);
