# 🎨 Strapi Plugin: Image Color Palette

## Description
This plugin generates a color palette and dominant color for images uploaded to Strapi. It uses GraphicsMagick to extract the colors from the image after it's uploaded, and stores them in the database schema. When queried, it looks like this:

```javascript
colors: {
  dominant: "#30302f",
  palette: [ "#111110", "#535a55", "#898777", "#c0bdbf" ]
}
```

## Requirements
You'll need to have GraphicsMagick installed on your system. You can install it with Homebrew on macOS with the following command:

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
    yarn add @Studio123ca/strapi-plugin-image-color-palette
    ```

2. Append the following to your Strapi plugin config file (`config/plugins.js`):

    ```javascript
    "image-color-palette": {
        enabled: true,
        config: {
            format: 'rgb',  // Color format ('hex' or 'rgb')
            paletteSize: 5, // Number of colors to return in the palette (Between 1 and 8)
        }
    }
    ```

3. Restart your Strapi server.
