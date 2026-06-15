import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import reactPlugin from 'eslint-plugin-react'

export default [
  // 1. Глобально игнорируем папки сборки (должно идти первым объектом)
  { 
    ignores: ['**/dist/**', '**/build/**'] 
  },
  
  // 2. Базовые рекомендуемые правила от самого ESLint
  js.configs.recommended,

  // 3. Основная конфигурация для ваших React-файлов
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react': reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Включаем принудительное исправление отступов (2 пробела)
      'indent': ['error', 2, { "SwitchCase": 1 }],
      'react/jsx-indent': ['error', 2],
      'react/jsx-indent-props': ['error', 2],
    },
    settings: {
      react: { version: 'detect' },
    },
  },
]

