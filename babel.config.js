module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@controllers': './src/app/controllers',
          '@interfaces': './src/app/interfaces',
          '@middlewares': './src/app/middlewares',
          '@models': './src/app/models',
          '@repositories': './src/app/repositories',
          '@routes': './src/app/routes',
          '@utils': './src/app/utils',
          '@validators': './src/app/validators',
          '@config': './src/config',
          '@controllers_backoffice': './src/backoffice/controllers',
          '@interfaces_backoffice': './src/backoffice/interfaces',
          '@middlewares_backoffice': './src/backoffice/middlewares',
          '@repositories_backoffice': './src/backoffice/repositories',
          '@routes_backoffice': './src/backoffice/routes',
          '@utils_backoffice': './src/backoffice/utils',
          '@validators_backoffice': './src/backoffice/validators',
        },
      },
    ],
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ],
};
