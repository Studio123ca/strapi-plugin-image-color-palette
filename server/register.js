'use strict';

const gm = require('gm');
const path = require('path');

module.exports = ({ strapi }) => {
    if (!strapi.plugin('upload'))
        return strapi.log.warn(
            'Upload plugin is not installed, skipping image color palette plugin.',
        );

    // Check if GraphicsMagick is installed (use ./server/assets/test.png)
    gm(path.join(__dirname, 'assets', 'test.png')).identify((err, data) => {
        if (err) {
            strapi.log.warn(
                'GraphicsMagick is not installed, skipping image color palette plugin.',
            );
        }
    });

    // Add the colors attribute to the file content type
    strapi.plugin('upload').contentTypes.file.attributes.colors = {
        type: 'json',
    };
};
