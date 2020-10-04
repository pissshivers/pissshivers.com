const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
                terserOptions: {
                    compress: {
                        passes: 2,
                        keep_classnames: true
                    },
                    mangle: {
                        keep_classnames: true,
                        reserved: [
                            'name'
                        ]
                    }
                }
        })],
    },
})