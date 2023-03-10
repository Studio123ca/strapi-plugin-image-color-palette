'use strict';

const pluginId = require('./plugin-id');
const mimeTypes = require('mime-types');

// Helper that checks if a file can be used to generate a color palette
const canGenerateColor = file => {
    if (!file.mime) file.mime = mimeTypes.lookup(file.name);
    return file.mime?.startsWith('image/') || file.mime === 'image/svg+xml';
};

// Helper that returns a service from the plugin
const getService = (strapi, service) => strapi.plugin(pluginId).service(service);

module.exports = {
    canGenerateColor,
    getService,
};
