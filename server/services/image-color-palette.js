'use strict';

const gmPalette = require('gm-palette');
const axios = require('axios');
const { getService } = require('../utils');

const rgbToHex = rgb => {
    const { r, g, b } = rgb;

    const hex = x => {
        const hex = (
            (x) >>> 0
        ).toString(16).substring(0, 2);

        return hex.length === 1 ? `0${hex}` : hex;
    };

    return `#${hex(r) + hex(g) + hex(b)}`;
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
            const palette = await gmPalette.palette(res.data, settings.paletteSize || 5);

            let colors = {
                dominant: dominantColor,
                palette: palette,
            };

            if (settings.format === 'hex') {
                colors.dominant = rgbToHex(dominantColor);

                colors.palette = palette.map(color => {
                    return rgbToHex(color);
                });
            }

            return colors;
        } catch (e) {
            strapi.log.error(e);
            return null;
        }
    },
});
