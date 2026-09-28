const { test } = require('node:test');
const assert = require('node:assert/strict');
const { testDatabaseUrl, configureTestDatabase } = require('./test-database.cjs');
const safe = 'postgresql://bitfrost_test:local_test_only@127.0.0.1:5433/bitfrost_test?schema=public';

test('sobrescreve DATABASE_URL de desenvolvimento antes de executar a suíte', () => {
  const env = { DATABASE_URL: 'postgresql://dev@localhost/bitfrost_dev', TEST_DATABASE_URL: safe };
  assert.equal(configureTestDatabase(env), safe);
  assert.equal(env.DATABASE_URL, safe);
  assert.equal(env.NODE_ENV, 'test');
});
for (const [label, value] of [
  ['ausente', undefined], ['malformada', 'invalid'],
  ['outro banco', safe.replace('/bitfrost_test?', '/bitfrost_dev?')],
  ['usuário de desenvolvimento', safe.replace('://bitfrost_test:', '://bitfrost_dev:')],
  ['host remoto', safe.replace('127.0.0.1', 'example.com')],
  ['MySQL', safe.replace('postgresql:', 'mysql:')],
  ['outro schema', safe.replace('schema=public', 'schema=production')],
  ['parâmetro de redirecionamento', safe + '&host=example.com'],
  ['schema duplicado', safe + '&schema=public'],
]) {
  test(`rejeita configuração ${label} sem alterar DATABASE_URL`, () => {
    const env = { DATABASE_URL: 'preservar', TEST_DATABASE_URL: value };
    assert.throws(() => configureTestDatabase(env), /TEST_DATABASE_URL/);
    assert.equal(env.DATABASE_URL, 'preservar');
  });
}
test('aceita localhost e IPv6 de loopback', () => {
  assert.ok(testDatabaseUrl(safe.replace('127.0.0.1', 'localhost')));
  assert.ok(testDatabaseUrl(safe.replace('127.0.0.1', '[::1]')));
});
