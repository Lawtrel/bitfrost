function testDatabaseUrl(value) {
  const message = 'TEST_DATABASE_URL deve apontar para PostgreSQL local, banco e usuário bitfrost_test, schema public, sem outros parâmetros.';
  let url;
  try { url = new URL(value); } catch { throw new Error(message); }
  if (!['postgresql:', 'postgres:'].includes(url.protocol)
      || !['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)
      || url.pathname !== '/bitfrost_test'
      || decodeURIComponent(url.username) !== 'bitfrost_test'
      || url.hash
      || [...url.searchParams].some(([key, val]) => key !== 'schema' || val !== 'public')
      || url.searchParams.getAll('schema').length > 1) {
    throw new Error(message);
  }
  return url.toString();
}

function configureTestDatabase(env) {
  const url = testDatabaseUrl(env.TEST_DATABASE_URL);
  env.DATABASE_URL = url;
  env.NODE_ENV = 'test';
  return url;
}

// Jest executa setupFiles antes de importar os testes ou instanciar PrismaClient.
if (process.env.JEST_WORKER_ID !== undefined) configureTestDatabase(process.env);
module.exports = { testDatabaseUrl, configureTestDatabase };
