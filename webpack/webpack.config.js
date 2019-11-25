/* Configure HTMLWebpack plugin */
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
    template: __dirname + '/src/index.html',
    filename: 'index.html',
    inject: 'body'
})


const CopyWebpackPlugin = require('copy-webpack-plugin')
const CopyWebpackPluginConfig =  new CopyWebpackPlugin([
    { from: './src/textures', to: 'textures' }
  ])

/* Export configuration */
module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: [
        './src/index.ts'
    ],
    output: {
        path: __dirname + '/dist',
        filename: 'index.js'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'awesome-typescript-loader'
            }, {
                test: /\.css$/,
                exclude: /[\/\\]src[\/\\]/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {loader: 'css-loader'}
                ]
            }, {
                test: /\.css$/,
                exclude: /[\/\\](node_modules|bower_components|public)[\/\\]/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: false,
                            importLoaders: 1
                        }
                    }
                ]
            },
        ]
    },
    resolve: { extensions: [".web.ts", ".web.js", ".ts", ".js"] },
    plugins: [HTMLWebpackPluginConfig ,CopyWebpackPluginConfig]
}
