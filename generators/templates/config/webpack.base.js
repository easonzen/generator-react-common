module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node-modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            cacheCompression: false
                        }
                    }
                ]
            },
            {
                test: /\.s[ac]ss$/i,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js'],
    },
}