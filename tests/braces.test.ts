import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let entry = require.resolve('eslint-config-next');
let resolver = createRequire(entry);
for (const dependency of ['@next/eslint-plugin-next', 'fast-glob', 'micromatch', 'braces']) {
  entry = resolver.resolve(dependency);
  resolver = createRequire(entry);
}
const braces = resolver(entry);

test('lint glob parser rejects deeply nested brace and parenthesis patterns', () => {
  for (const [open, close] of [['{', '}'], ['(', ')']]) {
    const attack = open.repeat(4000) + 'a,b' + close.repeat(4000);
    for (const method of ['parse', 'compile', 'expand', 'stringify']) {
      assert.throws(() => braces[method](attack), { name: 'SyntaxError', message: /nesting exceeds/ });
    }
  }
  assert.deepEqual(braces.expand('app/{one,two}/**/*.tsx'), ['app/one/**/*.tsx', 'app/two/**/*.tsx']);
});

test('recursive AST APIs are bounded and the patch can be reapplied', () => {
  let ast: any = { type: 'text', value: 'leaf' };
  for (let i = 0; i < 5000; i++) ast = { type: 'root', nodes: [ast] };
  for (const method of ['compile', 'stringify']) assert.throws(() => braces[method](ast), SyntaxError);
  require('../scripts/harden-braces.cjs');
});
