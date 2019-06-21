module.exports = {
  linters: {
    "src/**/*.js": [
      "eslint --fix",
      "git add"
    ]
  },
  ignore: [
    "**/node_modules/**/*.js",
    "**/dist/**/*.js"
  ]
};
