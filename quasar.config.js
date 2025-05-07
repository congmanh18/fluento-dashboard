import { configure } from 'quasar/wrappers';
import path from 'path';
import { vueI18n } from '@intlify/vite-plugin-vue-i18n';


module.exports = configure(function (/* ctx */) {
  return {
    boot: [
      'i18n',
      'axios',
      'base-data',
      'topic-data',
    ],

    css: ['app.css'],

    extras: [
      'fontawesome-v6',
      'roboto-font',
      'material-icons',
    ],

    build: {
      target: {
        browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
        node: 'node16'
      },

      vueRouterMode: 'history',

      vitePlugins: [
        vueI18n({
          include: path.resolve(__dirname, './src/i18n/**')
        })
      ]
    },

    devServer: {
      open: true
    },

    framework: {
      config: {},
      plugins: [
        'AppFullscreen',
        'Dialog',
        'Notify',
      ]
    },

    animations: [],

    ssr: {
      pwa: false,
      prodPort: 3000,
      middlewares: ['render']
    },

    pwa: {
      workboxMode: 'generateSW',
      injectPwaMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false,
    },

    capacitor: {
      hideSplashscreen: true
    },

    electron: {
      inspectPort: 5858,
      bundler: 'packager',
      packager: {},
      builder: {
        appId: 'quasar-admin2'
      }
    },

    bex: {
      contentScripts: ['my-content-script'],
    }
  }
});
