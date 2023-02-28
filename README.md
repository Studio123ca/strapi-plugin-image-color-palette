# 🎨 Strapi Plugin: Image Color Palette

This plugin generates a color palette and dominant color for images uploaded to Strapi. It uses GraphicsMagick to extract the colors from the image after it's uploaded, and stores them in the database schema. When queried, it looks like this:

```javascript
...
colors: {
  dominant: "#30302f",
  palette: [ "#111110", "#535a55", "#898777", "#c0bdbf" ]
}
...
```

This can be useful for adding color accents, or for using the colors as a placeholder while the image is loading.

## Requirements

This plugin is for Strapi v4.

You'll also need to have GraphicsMagick installed on your system. You can install it with Homebrew on macOS with the following command:

```bash
brew install graphicsmagick
```

### Heroku

On Heroku, you'll need to add the [GraphicsMagick buildpack](https://github.com/mcollina/heroku-buildpack-graphicsmagick) to your app:

```bash
heroku buildpacks:add --index 1 https://github.com/mcollina/heroku-buildpack-graphicsmagick.git
```

## Installation

1. Install the plugin via Yarn:

    ```bash
    yarn add @studio123/strapi-plugin-image-color-palette
    ```

2. Append the following to your Strapi plugin config file (`config/plugins.js`) and adjust as needed:

    ```javascript
    "image-color-palette": {
        enabled: true,
        config: {
            format: 'rgb',
            paletteSize: 4,
        }
    }
    ```

3. Restart your Strapi server.

## Configuration
The plugin offers the following configuration options:

| Option        | Description                                                                                                       |
|---------------|-------------------------------------------------------------------------------------------------------------------|
| `format`      | The format to return the colors in.<br/>Available options are `hex`, `rgb`, `hsl`, and `raw`.<br/>Default: `raw` |
| `paletteSize` | The number of colors to generate in the color palette.<br/>Accepts an integer between 1-8.<br/>Default: `4`     |

## Migration
To add color palette data to existing images, you'll need to add the following script to the `./database/migrations` folder in your Strapi project. You can name it anything you want, but it's recommended to use a timestamp as the prefix. It will run automatically when you start your Strapi server, so be sure to backup your database before running it.

```javascript
'use strict';

const FILES_TABLE = 'files'; // Table name for your files
const BATCH_SIZE = 1000; // Number of files to process at a time

async function up(trx) {
    let lastId = 0;

    while (true) {
        const files = await trx
            .select(['id', 'url'])
            .from(FILES_TABLE)
            .whereNot('url', null)
            .andWhereLike('mime', 'image/%')
            .andWhere('colors', null)
            .andWhere('id', '>', lastId)
            .orderBy('id', 'asc')
            .limit(BATCH_SIZE);

        for (const file of files) {
            const colorPalette = await strapi
                .plugin('image-color-palette')
                .service('image-color-palette')
                .generate(file.url);

            if (colorPalette)
                await trx.update('colors', colorPalette).from(FILES_TABLE).where('id', file.id);
        }

        if (files.length < BATCH_SIZE) {
            break;
        }

        lastId = files[files.length - 1].id;
    }
}

async function down() {}

module.exports = { up, down };
```

## Contributing
To contribute to this plugin, please open an issue or submit a pull request.