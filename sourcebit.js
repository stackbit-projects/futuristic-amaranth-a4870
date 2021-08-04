const _ = require('lodash');

const isDev = process.env.NODE_ENV === 'development';


module.exports = {
    plugins: [
        {
            module: require('sourcebit-source-contentful'),
            options: {
                accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
                // deliveryToken is optional, if not specified will be automatically created and reused 
                deliveryToken: process.env.CONTENTFUL_DELIVERY_TOKEN,
                // previewToken is optional, if not specified will be automatically created and reused
                previewToken: process.env.CONTENTFUL_PREVIEW_TOKEN,
                spaceId: process.env.CONTENTFUL_SPACE_ID || '8pxhrsz4qb9e',
                // Which content environment to use, when Stackbit sets a split tests on Netlify, it use the BRANCH variable to identify the bucket
                environment: process.env.BRANCH || process.env.CONTENTFUL_ENVIRONMENT || 'master',
                preview: isDev,
                watch: isDev
            }
        },
        {
            module: require('sourcebit-target-next'),
            options: {
                liveUpdate: isDev,
                flattenAssetUrls: true,
                pages: [
                    { path: '/{stackbit_url_path}', predicate: _.matchesProperty('__metadata.modelName', 'page') },
                    { path: '/{stackbit_url_path}', predicate: _.matchesProperty('__metadata.modelName', 'post') },
                    { path: '/{stackbit_url_path}', predicate: _.matchesProperty('__metadata.modelName', 'advanced') }
                ],
                commonProps: (items) => {
                    return {
                        pages: _.filter(items, item => ["page","post","advanced"].includes(_.get(item, '__metadata.modelName'))),
                        data: {
                            config: _.find(items, _.matchesProperty('__metadata.modelName', 'config'))
                        }
                    };
                }
            }
        }
    ]
};
