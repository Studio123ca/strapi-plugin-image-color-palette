"use strict";

const FILES_TABLE = "files";
const BATCH_SIZE = 1000;

async function up(trx) {
  let lastId = 0;

  while (true) {
    const files = await trx
      .select(["id", "url"])
      .from(FILES_TABLE)
      .whereNot("url", null)
      .andWhereLike("mime", "image/%")
      .andWhere("colors", null)
      .andWhere("id", ">", lastId)
      .orderBy("id", "asc")
      .limit(BATCH_SIZE);

    for (const file of files) {
      const colorPalette = await strapi
        .plugin("image-color-palette")
        .service("image-color-palette")
        .generate(file.url);

      if (colorPalette)
        await trx
          .update("colors", colorPalette)
          .from(FILES_TABLE)
          .where("id", file.id);
    }

    if (files.length < BATCH_SIZE) {
      break;
    }

    lastId = files[files.length - 1].id;
  }
}

async function down() {}

module.exports = { up, down };