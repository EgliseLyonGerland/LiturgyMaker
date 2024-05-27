import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  react: true,
}, {
  files: ['functions/**/*'],
  rules: { 'no-console': 'off' },
}, {
  files: ['tools/**/*'],
  rules: { 'no-console': 'off' },
})
