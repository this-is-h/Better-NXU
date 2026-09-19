export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // 标题即最终 Squash commit 标题，必须简短可审查。
    'header-max-length': [2, 'always', 72],
    // Conventional Commits 合法 type；revert 由工具生成，一并放行。
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'],
    ],
    // 中文 summary 无大写/句号问题，但保留规则拦截英文误用。
    'subject-case': [0],
    'subject-full-stop': [2, 'never', '.'],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    // 允许 feat! / fix! 这类明确的破坏性变更标记。
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [2, 'always'],
  },
};
