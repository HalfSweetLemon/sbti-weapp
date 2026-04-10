const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(process.cwd(), 'template/index.html'), 'utf8');

function extractLiteral(name) {
  const marker = `const ${name} = `;
  const start = source.indexOf(marker);
  if (start === -1) {
    throw new Error(`Unable to find ${name}`);
  }

  let index = start + marker.length;
  while (/\s/.test(source[index])) {
    index += 1;
  }

  const open = source[index];
  const close = open === '{' ? '}' : open === '[' ? ']' : null;
  if (!close) {
    throw new Error(`Unsupported literal opener for ${name}: ${open}`);
  }

  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  let inTemplate = false;
  let escaped = false;

  for (let cursor = index; cursor < source.length; cursor += 1) {
    const char = source[cursor];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (inSingle) {
      if (char === "'") inSingle = false;
      continue;
    }

    if (inDouble) {
      if (char === '"') inDouble = false;
      continue;
    }

    if (inTemplate) {
      if (char === '`') inTemplate = false;
      continue;
    }

    if (char === "'") {
      inSingle = true;
      continue;
    }

    if (char === '"') {
      inDouble = true;
      continue;
    }

    if (char === '`') {
      inTemplate = true;
      continue;
    }

    if (char === open) depth += 1;
    if (char === close) {
      depth -= 1;
      if (depth === 0) {
        return source.slice(index, cursor + 1);
      }
    }
  }

  throw new Error(`Unable to extract literal body for ${name}`);
}

function parseLiteral(name) {
  const literal = extractLiteral(name);
  return vm.runInNewContext(`(${literal})`);
}

function writeModule(filePath, body) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, body);
}

const dimensionMeta = parseLiteral('dimensionMeta');
const questions = parseLiteral('questions');
const specialQuestions = parseLiteral('specialQuestions');
const typeLibrary = parseLiteral('TYPE_LIBRARY');
const typeImages = parseLiteral('TYPE_IMAGES');
const normalTypes = parseLiteral('NORMAL_TYPES');
const dimExplanations = parseLiteral('DIM_EXPLANATIONS');

writeModule(
  path.join(process.cwd(), 'data/dimensions.js'),
  `const dimensionMeta = ${JSON.stringify(dimensionMeta, null, 2)};\nconst dimensionOrder = ${JSON.stringify(Object.keys(dimensionMeta), null, 2)};\n\nmodule.exports = {\n  dimensionMeta,\n  dimensionOrder\n};\n`
);

writeModule(
  path.join(process.cwd(), 'data/questions.js'),
  `const questions = ${JSON.stringify(questions, null, 2)};\nconst specialQuestions = ${JSON.stringify(specialQuestions, null, 2)};\n\nmodule.exports = {\n  questions,\n  specialQuestions\n};\n`
);

const normalizedTypeImages = Object.fromEntries(
  Object.entries(typeImages).map(([code, imagePath]) => [
    code,
    `assets/images/types/${path.basename(imagePath)}`
  ])
);

writeModule(
  path.join(process.cwd(), 'data/types.js'),
  `const typeLibrary = ${JSON.stringify(typeLibrary, null, 2)};\nconst typeImages = ${JSON.stringify(normalizedTypeImages, null, 2)};\nconst normalTypes = ${JSON.stringify(normalTypes, null, 2)};\nconst dimExplanations = ${JSON.stringify(dimExplanations, null, 2)};\n\nmodule.exports = {\n  typeLibrary,\n  typeImages,\n  normalTypes,\n  dimExplanations\n};\n`
);
