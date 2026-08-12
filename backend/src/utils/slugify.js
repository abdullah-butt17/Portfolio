const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * Generate a unique slug for a model, appending -2, -3, etc. on collision.
 * @param {import('mongoose').Model} Model
 * @param {string} title
 * @param {string} [excludeId] - document id to exclude (for updates)
 */
const generateUniqueSlug = async (Model, title, excludeId = null) => {
  const base = slugify(title);
  let slug = base;
  let counter = 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const query = { slug };
    if (excludeId) query._id = { $ne: excludeId };
    // eslint-disable-next-line no-await-in-loop
    const existing = await Model.findOne(query);
    if (!existing) return slug;
    slug = `${base}-${counter}`;
    counter += 1;
  }
};

module.exports = { slugify, generateUniqueSlug };
