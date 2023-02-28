# Image Color Palettes

Readme is a work in progress.

## Requirements
You'll need to have GraphicsMagick installed on your system. You can install it with Homebrew on Mac OS X with the following command:

```bash
brew install graphicsmagick
```

On Heroku, you'll need to add the [GraphicsMagick buildpack](https://github.com/mcollina/heroku-buildpack-graphicsmagick) to your app:

```bash
heroku buildpacks:add --index 1 https://github.com/mcollina/heroku-buildpack-graphicsmagick.git
```

## Config
Add the following to your Strapi plugin config:

```javascript
"image-color-palettes": {
    enabled: true,
    config: {
        format: 'rgb', // Color format ('hex' or 'rgb')
        paletteSize: 5, // Number of colors to return in the palette
    }
}
```