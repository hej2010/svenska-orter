import { readFile, writeFile } from 'fs/promises';

const orterOld = JSON.parse(await readFile("./src/svenska-orter-2020.json", "utf8"));
const orterNew = JSON.parse(await readFile("./src/svenska-orter-2023.json", "utf8"));

const keysToCopy = ["x-sweref99tm", "y-sweref99tm", "lat", "lon"];

for (const ortNew of orterNew) {
  let found = false;
  for (const ortOld of orterOld) {
    ortNew.locality = ortNew.locality.replace(" (preliminär)", "");
    if (ortNew.county === ortOld.county && ortNew.locality === ortOld.locality) {
      // copy coordinates from old
      keysToCopy.forEach((k) => ortNew[k] = ortOld[k]);
      found = true;
      break;
    }
  }
  if (!found) {
    keysToCopy.forEach((k) => ortNew[k] = null);
  }
}

writeFile('./src/svenska-orter-merged.json', JSON.stringify(orterNew, null, 2), { encoding: "utf8" }, (err) => {
  if (err) {
    console.log(err);
  }
});