const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


module.exports = [
  {
    output: {
      path: path.resolve(__dirname, "styles/css"),
    },
    entry: {
      index: [path.join(path.resolve(__dirname, 'styles'), "scss", "application.scss")]
    } ,
    mode: "production",
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)$/,
          type: 'asset/resource',
          generator: {
              filename: './fonts/[name][ext]',
          },
        },
      ]
    },
    plugins: [new MiniCssExtractPlugin({
      filename: "application.css"
    })]
  },
  {
    entry: './zebra_datepicker.js',
    output: {
      path: path.resolve(__dirname, './libs'),
      filename: 'zebra_datepicker.min.js'
    },
    mode: 'production',
  }
];
