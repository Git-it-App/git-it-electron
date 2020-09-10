module.exports = {
  /* Key separator used in your translation keys */
  // contextSeparator: '_',

  /* Save the \_old files */
  createOldCatalogs: false,

  /* Keep keys from the catalog that are no longer in code */
  keepRemoved: false,

  /* Default namespace used in your i18next config */
  defaultNamespace: 'common',

  /* Default value to give to empty keys */
  // defaultValue: '',

  /* Indentation of the catalog files */
  indentation: 2,

  /* Key and Namespace separator used in your translation keys
   * If you want to use plain english keys, separators such as `.` and `:` will conflict. You might want to set `keySeparator: false` and
   * `namespaceSeparator: false`. That way, `t('Status: Loading...')` will not think that there are a namespace and three separator dots for instance.
   */
  keySeparator: false,
  namespaceSeparator: '~',


  /* see below for more details */
  lexers: {
  //   hbs: ['HandlebarsLexer'],
  //   handlebars: ['HandlebarsLexer'],
    htm: [{
      lexer: 'HTMLLexer',
      attr: 'i18n-data', // Attribute for the keys
      optionAttr: 'i18n-options' // Attribute for the options
    }],
    html: [{
      lexer: 'HTMLLexer',
      attr: 'i18n-data', // Attribute for the keys
      optionAttr: 'i18n-options' // Attribute for the options
    }]
  //   mjs: ['JavascriptLexer'],
  //   js: ['JavascriptLexer'], // if you're writing jsx inside .js files, change this to JsxLexer
  //   ts: ['JavascriptLexer'],
  //   jsx: ['JsxLexer'],
  //   tsx: ['JsxLexer'],

  //   default: ['JavascriptLexer']
  },

  /* Control the line ending. See options at https://github.com/ryanve/eol */
  // lineEnding: 'auto',


  /* An array of the locales in your applications
   * Here just the parsed locale, all others are managed on transifex.
   */
  locales: ['en-US'],

  /* Supports $LOCALE and $NAMESPACE injection
   * Supports JSON (.json) and YAML (.yml) file formats
   * Where to write the locale files relative to process.cwd()
   */
  output: './i18n/$LOCALE/$NAMESPACE.json',

  /* An array of globs that describe where to look for source files
   * relative to the location of the configuration file
   */
  input: ['../main.js', '../lib/**/*.js', '../menus/*.js', '../resources/**/*.html'],

  /* For react file, extract the defaultNamespace - https://react.i18next.com/latest/withtranslation-hoc
   * Ignored when parsing a `.jsx` file and namespace is extracted from that file.
   */
  // reactNamespace: false,

  /* Whether or not to sort the catalog
   * Not sorting here, to keep order and context of challenges/pages!
   */
  sort: false,

  /* Whether to ignore default values. */
  // skipDefaultValues: false,

  /* Whether to use the keys as the default value; ex. "Hello": "Hello", "World": "World"
   * This option takes precedence over the `defaultValue` and `skipDefaultValues` options
   */
  useKeysAsDefaultValue: true,

  /* Display info about the parsing including some stats */
  verbose: true,

  /*
   * If you wish to customize the value output the value as an object, you can set your own format.
   * ${defaultValue} is the default value you set in your translation function.
   * Any other custom property will be automatically extracted.
   *
   * Example:
   * {
   *   message: "${defaultValue}",
   *   description: "${maxLength}", // t('my-key', {maxLength: 150})
   * }
   */
  // customValueTemplate: null
}
