'use strict';

module.exports = ({ strapi }) => {
    if (!strapi.plugin('upload'))
        return strapi.log.warn(
            'Upload plugin is not installed, skipping dominant color placeholder plugin.',
        );

    // Add the colors attribute to the file content type
    strapi.plugin('upload').contentTypes.file.attributes.colors = {
        type: 'json',
    };
};
