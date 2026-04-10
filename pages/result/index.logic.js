const { dimensionOrder, dimensionMeta } = require('../../data/dimensions');
const { dimExplanations, typeImages } = require('../../data/types');

function normalizeLocalImagePath(imagePath) {
  if (!imagePath) {
    return '';
  }
  return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
}

function buildDimensionCards(result, deps = { dimensionOrder, dimensionMeta, dimExplanations }) {
  return deps.dimensionOrder.map((dimensionId) => ({
    id: dimensionId,
    name: deps.dimensionMeta[dimensionId].name,
    level: result.levels[dimensionId],
    score: result.rawScores[dimensionId],
    description: deps.dimExplanations[dimensionId][result.levels[dimensionId]]
  }));
}

function getTypeImage(code, imageMap = typeImages) {
  return normalizeLocalImagePath(imageMap[code] || '');
}

module.exports = {
  buildDimensionCards,
  getTypeImage
};
