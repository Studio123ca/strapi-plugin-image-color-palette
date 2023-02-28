'use strict';

const { getService, canGenerateColor } = require('./utils');

module.exports = ({ strapi }) => {
    const generateColorPalette = async event => {
        const { data } = event.params;

        if (!canGenerateColor(data)) return;

        data.colors = await getService(strapi, 'image-color-palette').generate(data.url);
    };

    strapi.db.lifecycles.subscribe({
        models: ['plugin::upload.file'],
        beforeCreate: generateColorPalette,
        beforeUpdate: generateColorPalette,
    });
};
