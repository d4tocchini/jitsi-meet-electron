const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const glob = require('glob');
//Generate object for webpack entry
//rename './app/modules/module1/script.js' -> 'module1/script'
var n = 0
var entryObject = glob.sync('./app/**/*.js').reduce(
    function (entries, entry) {
        console.log(entry)
        if (entry.endsWith('.js') && n < 4) {
            n++
            let e = entry.split('/')
            // e.length--
            e.splice(0, 2)
            e = ['.'].concat(e)
            e = e.join('/')
            e = e.substr(0,e.indexOf('.'))
            // if (!e) e= 'app'
            entries[e] = '.'+entry.substr(entry.indexOf('/app/'))
        }
        return entries;
    }, 
    {}
);
console.log(entryObject)

// const ELECTRON_VERSION = require('./package.json').devDependencies.electron;

module.exports = {
    target: 'electron-renderer',
    entry:entryObject, //{ app: './app/index.js' },
    // plugins: [
    //     new HtmlWebpackPlugin({
    //         template: './app/index.html'
    //     })
    // ],
    output: {
        path: path.resolve('./build'),
        filename: '[name].js'
    },
    node: {
        __dirname: true
    },
    module: {
        rules: [
            {
                // include: /ZZZZZZ/,
                exclude: /node_modules(?!(\/|\\)js-utils)/,
                loader: 'babel-loader',
                options: {
                    babelrc: false,
                    presets: [
                        [
                            require.resolve('babel-preset-env'),
                            {
                                modules: false,
                                targets: {
                                    // electron: ELECTRON_VERSION,
                                    "chrome": "66",
                                    node: process.versions.node
                                }
                            }
                        ],
                        require.resolve('babel-preset-react'),
                        require.resolve('babel-preset-stage-1')
                    ],
                    plugins: [
                        require.resolve('babel-plugin-inline-react-svg')
                    ]
                },
                test: /\.js$/
            },
            {
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' }
                ],
                test: /\.css$/
            },
            {
                use: 'file-loader',
                test: /\.png$/
            },
            {
                loader: 'svg-inline-loader',
                test: /\.svg$/
            }
        ]
    },
    externals: [ {
        'jitsi-meet-electron-utils': 'require(\'jitsi-meet-electron-utils\')'
    } ],
    resolve: {
        modules: [
            // D4
            // path.resolve('../../../../node_modules')
            path.resolve('../../../../node_modules')
        ]
    }
};

