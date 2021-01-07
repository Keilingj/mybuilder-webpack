const path = require('path');
const glob = require('glob');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); /* 清除上次打包文件 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); /* 提取css文件，css文件指纹配置 */

const projectRoot = process.cwd();

const getPagesConfig = (externalsChunks = []) => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(projectRoot, 'src/*/index.js'));
  entryFiles.forEach((entryFile) => {
    const match = entryFile.match(/src\/(.*)\/index\.js$/);
    const pageName = match && match[1];

    entry[pageName] = entryFile;
    if (externalsChunks.includes(pageName)) {
      htmlWebpackPlugins.push(
        new HtmlWebpackExternalsPlugin({
          externals: [
            {
              module: 'react',
              entry: 'https://now8.gtimg.com/now/lib/16.8.6/react.min.js?_bid=4042',
              global: 'React',
            },
            {
              module: 'react-dom',
              entry: 'https://now8.gtimg.com/now/lib/16.8.6/react-dom.min.js?_bid=4042',
              global: 'ReactDOM',
            },
          ],
          files: [`${pageName}.html`],
        })
      );
    }
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.join(projectRoot, `src/${pageName}/index.html`),
        chunks: [pageName],
        filename: `${pageName}.html`,
        inject: true,
        minify: {
          html5: true,
          collapseWhitespace: true, // 是否保留缩进
          preserveLineBreaks: true, // 是否保留换行
          minifyCSS: true, // 是否对内联 css 压缩
          minifyJS: true, // 是否对内联 js 压缩
          removeComments: true, // 是否删除注释
        },
      })
    );
  });
  return {
    entry,
    htmlWebpackPlugins,
  };
};

const { entry, htmlWebpackPlugins } = getPagesConfig(); // (['search','index'])

module.exports = {
  entry,
  output: {
    filename: '[name]_[chunkhash:8].js',
    path: path.resolve(projectRoot, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75, // 1rem = 75px
              remPrecision: 8, // 转换后rem数值，保留几位小数
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader',
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75, // 1rem = 75px
              remPrecision: 8, // 转换后rem数值，保留几位小数
            },
          },
        ],
      },
      {
        test: /\.(png|gif|jpg|jpeg|bmp|svg|webp)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name_[hash:8].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    ...htmlWebpackPlugins,
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),
    new FriendlyErrorsWebpackPlugin(), function () {
      // wp 3 this.plugin('done', (stats)=>{})
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('-watch') === -1) {
          // console.log('build error');
          process.exit(1);
        }
      });
    },
  ],
  stats: 'errors-only',
};
