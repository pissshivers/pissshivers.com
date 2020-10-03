const path = require('path');
const distPath = path.resolve(__dirname, 'dist');
const srcPath = path.resolve(__dirname, 'src');

const WebpackModules = require('webpack-modules');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        main: ['./src/index.tsx']
    },
    module: {
    rules: [
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        },
        {
            test: /\.s[ac]ss$/i,
            use: [{
                loader: 'style-loader', // inject CSS to page
              }, {
                loader: 'css-loader', // translates CSS into CommonJS modules
              }, {
                loader: 'postcss-loader', // Run postcss actions
                options: {
                  plugins: function () { // postcss plugins, can be exported to postcss.config.js
                    return [
                      require('autoprefixer')
                    ];
                  }
                }
              }, {
                loader: 'sass-loader' // compiles Sass to CSS
              }]
          },
          {
            enforce: "pre",
            test: /\.js$/,
            loader: "source-map-loader"
        },
        {
            test: /\.(glsl|vs|fs|vert|frag)$/,
            exclude: /node_modules/,
            use: [
              'raw-loader',
              'glslify-loader'
            ]
          }
    ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
      },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    plugins: [
        new WebpackModules(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            title: 'Development - Piss Shivers',
            inject: true
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: '**/*.!(ts)',
                    context: srcPath,
                    to: distPath + '/[folder]/[name].[ext]',
                    force: true,
                    flatten: true,
                    globOptions: {
                        ignore: ['logo.png']
                    },
                    toType: 'template'
                }
            ]
        }),
        new FaviconsWebpackPlugin({
            logo: './src/logo.png',
            prefix: 'images/logo/',
            favicons: {
                appName: 'Piss Shivers',
                appDescription: 'Surfy garage rock, weened from the bosom of Baby Haus in Tuscaloosa, AL',
                developerURL: null,
                icons: {
                    android: true,
                    appleIcon: true,
                    favicons: true,
                    firefox: true,
                    windows: true
                },
                logging: true
            }
        })
    ]
};