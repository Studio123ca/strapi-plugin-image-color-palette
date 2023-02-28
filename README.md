# 🎨 Strapi Plugin: Image Color Palette

## Description

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

## Contributing
To contribute to this plugin, please open an issue or submit a pull request.