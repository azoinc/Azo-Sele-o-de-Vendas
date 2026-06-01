import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';
import nextConfig from 'eslint-config-next';

export default [
  {
    ignores: ['dist/**/*', '.next/**/*', 'node_modules/**/*']
  },
  firebaseRulesPlugin.configs['flat/recommended'],
];
