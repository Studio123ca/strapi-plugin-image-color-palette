'use strict';

const env = require('env-var');
const axios = require('axios');
const gmPalette = require('gm-palette');
const getSvgColors = require('get-svg-colors');
const { ColorTranslator } = require('colortranslator');
const { getService } = require('../utils');

const convert = (rgbObj, format) => {
    if (!rgbObj) return null;

    const color = new ColorTranslator(rgbObj);

    switch (format) {
        case 'hex':
            return color.HEX;
        case 'rgb':
            return color.RGB;
        case 'hsl':
            return color.HSL;
        case 'raw':
            return rgbObj;
        default:
            return rgbObj;
    }
};

module.exports = ({ strapi }) => ({
    async generate(url, mime) {
        try {
            const settings = getService(strapi, 'settings').get();

            let imageUrl = url;
            let dominantColor = null;
            let palette = [];

            // if url is relative, add host
            if (!url.startsWith('http')) {
                let host = env.get('HOST').asString();
                let port = env.get('PORT').asInt();

                imageUrl = `http://${host}:${port}${url}`;
            }

            if (mime === 'image/svg+xml') {
                // get svg as a string
                const res = await axios.get(imageUrl, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    },
                });
                const svg = res.data;
                const svgColors = await getSvgColors(svg);

                const { fills, strokes, stops } = svgColors;

                palette = [...fills, ...strokes, ...stops];

                if (palette.length > 0) {
                    // format colors to rgb object
                    palette = palette.map(color => {
                        let rgbObj = {
                            r: color._rgb[0],
                            g: color._rgb[1],
                            b: color._rgb[2],
                        };

                        return rgbObj;
                    });

                    // remove duplicates from palette
                    palette = palette.filter((color, index, self) => {
                        return (
                            index ===
                            self.findIndex(
                                c => c.r === color.r && c.g === color.g && c.b === color.b,
                            )
                        );
                    });

                    dominantColor = palette[0];
                }
            } else {
                const res = await axios.get(imageUrl, {
                    responseType: 'arraybuffer',
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    },
                });

                if (!res.data) return null;

                dominantColor = await gmPalette.dominantColor(res.data);
                palette = await gmPalette.palette(res.data, settings.paletteSize || 4);
            }

            let colors = {
                dominant: convert(dominantColor, settings.format),
                palette: palette.map(color => convert(color, settings.format)),
            };

            return colors;
        } catch (e) {
            strapi.log.error(e);
            return null;
        }
    },
});
