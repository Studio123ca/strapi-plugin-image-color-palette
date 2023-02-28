'use strict';

const axios = require('axios');
const gmPalette = require('gm-palette');
const { ColorTranslator } = require('colortranslator');
const { getService } = require('../utils');

const convert = (rgbObj, format) => {
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
    async generate(url) {
        try {
            const settings = getService(strapi, 'settings').get();
            const res = await axios.get(url, {
                responseType: 'arraybuffer',
            });

            if (!res.data) return null;

            const dominantColor = await gmPalette.dominantColor(res.data);
            const palette = await gmPalette.palette(res.data, settings.paletteSize || 4);

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
