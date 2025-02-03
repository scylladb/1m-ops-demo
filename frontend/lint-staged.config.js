export default {
  // Run eslint
  '**/*.ts?(x)':
    'eslint . --report-unused-disable-directives --ignore-pattern dist',
  // Format files with Prettier, ignore unknown extensions
  '*.{ts,tsx,js,jsx,json,html,css,md}': 'prettier --write --ignore-unknown',
};
