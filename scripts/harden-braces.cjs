// ponytail: remove this backport once Next's lint dependency includes an upstream fix for GHSA-vfj7-8cjw-p6xm.
const { readFileSync, writeFileSync } = require('node:fs');
const { createHash } = require('node:crypto');
const { dirname, join } = require('node:path');
const { createRequire } = require('node:module');
let entry;
try { entry = require.resolve('eslint-config-next'); }
catch (error) { if (error.code === 'MODULE_NOT_FOUND') process.exit(0); throw error; }
let resolver = createRequire(entry);
for (const dependency of ['@next/eslint-plugin-next', 'fast-glob', 'micromatch', 'braces']) {
  entry = resolver.resolve(dependency);
  resolver = createRequire(entry);
}
const root = dirname(entry);
const guard = "    // entrance-braces-depth-guard\n    if (depth > 128) throw new SyntaxError('Brace nesting exceeds 128');\n";
const patches = {
  'parse.js': ['e572166565f15fa6ad9865ae49d678218e32aabfd1b3720f6d0d43d39800d310', [
    ['      stack.push(block);', "      // entrance-braces-depth-guard\n      if (stack.length >= 128) throw new SyntaxError('Brace nesting exceeds 128');\n      stack.push(block);"],
  ]],
  'compile.js': ['dc98f22eee3d511785d92a00758d5f0d48efed5f5813bdecc2de430c529b5c9f', [
    ['  const walk = (node, parent = {}) => {', '  const walk = (node, parent = {}, depth = 0) => {\n' + guard.trimEnd()],
    ['walk(child, node)', 'walk(child, node, depth + 1)'],
  ]],
  'expand.js': ['41ccc196ebfa7b7781a634e721eb744e4e7bcb54cba427a7e3d6806a1b9e58f7', [
    ['  const walk = (node, parent = {}) => {', '  const walk = (node, parent = {}, depth = 0) => {\n' + guard.trimEnd()],
    ['walk(child, node)', 'walk(child, node, depth + 1)'],
  ]],
  'stringify.js': ['379f22d77bfa1478341ccd49c5e4267464aabcbba03558bab332aac23fc6f23a', [
    ['  const stringify = (node, parent = {}) => {', '  const stringify = (node, parent = {}, depth = 0) => {\n' + guard.trimEnd()],
    ['stringify(child)', 'stringify(child, {}, depth + 1)'],
  ]],
};
for (const [file, [expected, replacements]] of Object.entries(patches)) {
  const path = join(root, 'lib', file);
  const installed = readFileSync(path, 'utf8');
  let original = installed;
  for (const [before, after] of [...replacements].reverse()) original = original.replaceAll(after, before);
  if (createHash('sha256').update(original).digest('hex') !== expected) {
    throw new Error(`Review braces ${file}: upstream source changed; refusing an unchecked patch`);
  }
  let patched = original;
  for (const [before, after] of replacements) patched = patched.replaceAll(before, after);
  if (patched !== installed) writeFileSync(path, patched);
}
