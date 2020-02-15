module.exports = {
  '*.js': ['eslint --fix', 'prettier --write'],
  '*.{md,html,json}': ['prettier --write'],
  '*.{css,scss,less}': ['prettier --write']
};
