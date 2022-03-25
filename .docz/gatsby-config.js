const { mergeWith } = require('docz-utils')
const fs = require('fs-extra')

let custom = {}
const hasGatsbyConfig = fs.existsSync('./gatsby-config.custom.js')

if (hasGatsbyConfig) {
  try {
    custom = require('./gatsby-config.custom')
  } catch (err) {
    console.error(
      `Failed to load your gatsby-config.js file : `,
      JSON.stringify(err),
    )
  }
}

const config = {
  pathPrefix: '/',

  siteMetadata: {
    title: 'Tobeyou Facilitator',
    description: 'My awesome app using docz',
  },
  plugins: [
    {
      resolve: 'gatsby-theme-docz',
      options: {
        themeConfig: {},
        src: './',
        gatsbyRoot: null,
        themesDir: 'src',
        mdxExtensions: ['.md', '.mdx'],
        docgenConfig: {},
        menu: [],
        mdPlugins: [],
        hastPlugins: [],
        ignore: [],
        typescript: false,
        ts: false,
        propsParser: true,
        'props-parser': true,
        debug: false,
        native: false,
        openBrowser: null,
        o: null,
        open: null,
        'open-browser': null,
        root: 'C:\\Users\\user\\Documents\\GitHub\\tobeyou_facilitator\\.docz',
        base: '/',
        source: './',
        'gatsby-root': null,
        files: '**/*.{md,markdown,mdx}',
        public: '/public',
        dest: '.docz/dist',
        d: '.docz/dist',
        editBranch: 'master',
        eb: 'master',
        'edit-branch': 'master',
        config: '',
        title: 'Tobeyou Facilitator',
        description: 'My awesome app using docz',
        host: 'localhost',
        port: 3001,
        p: 3000,
        separator: '-',
        paths: {
          root: 'C:\\Users\\user\\Documents\\GitHub\\tobeyou_facilitator',
          templates:
            'C:\\Users\\user\\Documents\\GitHub\\tobeyou_facilitator\\node_modules\\docz-core\\dist\\templates',
          docz:
            'C:\\Users\\user\\Documents\\GitHub\\tobeyou_facilitator\\.docz',
          cache:
            'C:\\Users\\user\\Documents\\GitHub\\tobeyou_facilitator\\.docz\\.cache',
          app:
            'C:\\Users\\user\\Documents\\GitHub\\tobeyou_facilitator\\.docz\\app',
          appPackageJson:
            'C:\\Users\\user\\Documents\\GitHub\\tobeyou_facilitator\\package.json',
          appTsConfig:
            'C:\\Users\\user\\Documents\\GitHub\\tobeyou_facilitator\\tsconfig.json',
          gatsbyConfig:
            'C:\\Users\\user\\Documents\\GitHub\\tobeyou_facilitator\\gatsby-config.js',
          gatsbyBrowser:
            'C:\\Users\\user\\Documents\\GitHub\\tobeyou_facilitator\\gatsby-browser.js',
          gatsbyNode:
            'C:\\Users\\user\\Documents\\GitHub\\tobeyou_facilitator\\gatsby-node.js',
          gatsbySSR:
            'C:\\Users\\user\\Documents\\GitHub\\tobeyou_facilitator\\gatsby-ssr.js',
          importsJs:
            'C:\\Users\\user\\Documents\\GitHub\\tobeyou_facilitator\\.docz\\app\\imports.js',
          rootJs:
            'C:\\Users\\user\\Documents\\GitHub\\tobeyou_facilitator\\.docz\\app\\root.jsx',
          indexJs:
            'C:\\Users\\user\\Documents\\GitHub\\tobeyou_facilitator\\.docz\\app\\index.jsx',
          indexHtml:
            'C:\\Users\\user\\Documents\\GitHub\\tobeyou_facilitator\\.docz\\app\\index.html',
          db:
            'C:\\Users\\user\\Documents\\GitHub\\tobeyou_facilitator\\.docz\\app\\db.json',
        },
      },
    },
  ],
}

const merge = mergeWith((objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
})

module.exports = merge(config, custom)
