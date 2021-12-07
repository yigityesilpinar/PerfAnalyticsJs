import webpack, { Configuration, WebpackPluginInstance } from 'webpack'
import path from 'path'
import BrotliPlugin from 'brotli-webpack-plugin'
import CompressionPlugin from 'compression-webpack-plugin'

const isDevelopment = process.env.NODE_ENV === 'development'

const config: Configuration = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'PerfAnalytics.js',
    library: 'PerfAnalyticsJS',
    libraryExport: 'default',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  mode: isDevelopment ? 'development' : 'production',
  ...(isDevelopment
    ? {
        devtool: 'inline-source-map',
        watch: true
      }
    : {}),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.PERF_ANALYTICS_API': JSON.stringify(process.env.PERF_ANALYTICS_API)
    }),
    ...(isDevelopment ? [] : [new CompressionPlugin()]),
    ...(isDevelopment ? [] : [new BrotliPlugin() as WebpackPluginInstance])
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'defaultVendors',
          chunks: 'initial',
          minChunks: 2
        }
      }
    }
  }
}

export default config
