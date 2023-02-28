# 🎨 Strapi Plugin: Image Color Palette

This plugin generates a color palette and dominant color for images uploaded to Strapi. It uses GraphicsMagick to extract the colors from the image after it's uploaded, and stores them in the database schema. When queried, it looks like this:

```javascript
...
colors: {
  dominant: "#534f70",
  palette: [ "#042d65", "#43374b", "#f96597", "#77c6ff", "#e1e203" ]
}
...
```

This can be useful for adding color accents, or for using the colors as a placeholder while the image is loading.

<p align="center" style="text-align:center; margin: 30px 0 30px;">
    <img src="https://user-images.githubusercontent.com/22644154/221955944-747c3ecc-44ac-49d4-bb6c-489803135ad5.jpg" width="650" /><br/>
    <span style="font-size:10px;font-style:italic">Photo by <a href="https://unsplash.com/es/@thomasmcphersonphotography?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Thomas McPherson</a> on <a href="https://unsplash.com/photos/tVEqStC2uz8?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a></span>
</p>

## Requirements

This plugin is for Strapi v4.

You'll also need to have GraphicsMagick installed on your system. You can install it with Homebrew on macOS with the following command:

```bash
brew install graphicsmagick
```

### Heroku

On Heroku, you'll need to add the [GraphicsMagick buildpack](https://github.com/bogini/heroku-buildpack-graphicsmagick) to your app.

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
            format: "rgb",
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

### Format Examples
The plugin can return the colors in the following formats:
```javascript
    raw: { r: 255, g: 255, b: 255 },
    hex: '#ffffff',
    rgb: 'rgb(255, 255, 255)',
    hsl: 'hsl(0, 0%, 100%)',
```

## Migration
To add color palette data to existing images, you'll need to add the following script to the `./database/migrations` folder in your Strapi project. You can name it anything you want, but it's recommended to use a timestamp as the prefix. It will run automatically when you start your Strapi server, so be sure to backup your database before running it.

**Important:** Make sure you start Strapi after installation so that the database schema is updated with the new `colors` column. Then, you can add the migration script and start Strapi again.

```javascript
'use strict';

const FILES_TABLE = 'files';
const BATCH_SIZE = 1000;

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

            console.log(`Added color palette to file ${file.id} successfully.`);
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
