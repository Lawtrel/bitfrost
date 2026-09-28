# Bitfrost

Aplicação para gestão de vales, clientes e transportadoras, com interface React e API REST em TypeScript. O domínio inclui quantidades, valores unitários, vencimento, status e anexos dos vales.

**TypeScript · Express · React · Vite · Prisma · PostgreSQL · Jest · Supertest**

Projeto desenvolvido em colaboração por [Lawtrel](https://github.com/Lawtrel) e [Gui-ASA](https://github.com/Gui-ASA). O histórico de commits registra as contribuições.

## Visão técnica

| Parte | Responsabilidade |
| --- | --- |
| `frontend/` | Interface React, serviços HTTP e componentes |
| `backend/src/` | API Express e operações do domínio |
| `backend/prisma/schema.prisma` | Modelos Admin, Cliente, Transportadora e Vale |
| Testes do backend | Cenários de API com Jest e Supertest |

Fluxo: **React → HTTP /api → Express → Prisma → PostgreSQL**.

## Preparar o ambiente

Requisitos: Node.js 22 com npm, Git e Docker Compose v2 com suporte a `--wait`.

```bash
git clone https://github.com/Lawtrel/bitfrost.git
cd bitfrost/backend
```

Copie `backend/.env.example` para `backend/.env`. O exemplo corresponde aos dois serviços PostgreSQL locais do Compose. As credenciais são exclusivas desse ambiente descartável.

```dotenv
DATABASE_URL="postgresql://bitfrost_dev:local_dev_only@127.0.0.1:5432/bitfrost_dev?schema=public"
TEST_DATABASE_URL="postgresql://bitfrost_test:local_test_only@127.0.0.1:5433/bitfrost_test?schema=public"
```

O Compose e as migrações Prisma usam PostgreSQL 16. O serviço `db` mantém dados no volume `postgres-dev-data`; `db_test` usa armazenamento temporário e só inicia quando solicitado. As portas são publicadas apenas em `127.0.0.1`. Para alterar as portas, defina `POSTGRES_PORT`/`POSTGRES_TEST_PORT` no `.env` e ajuste as URLs correspondentes.

Quem usava o Compose anterior terá um banco de desenvolvimento novo. Os volumes antigos `db-data` e `db-test-data` não são apagados nem migrados por esses comandos. Não execute `down -v` para tentar recuperar dados antigos.

Em um banco vazio destinado exclusivamente ao desenvolvimento:

```bash
npm ci
npm run generate
docker compose up -d --wait db
npx prisma migrate deploy
npm run dev
```

A API utiliza `http://localhost:3001/api`. `migrate deploy` aplica as migrações versionadas; este roteiro não migra instalações existentes com dados reais.

Em outro terminal, dentro de `frontend/`, crie `.env.local`:

```dotenv
VITE_API_URL=http://localhost:3001/api
```

Depois execute:

```bash
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite. O script `server` do frontend inicia um mock com json-server; ele não é necessário para usar a API Express e pode disputar a porta 3001.

## Recursos da API

- `/api/vales`: operações de vales.
- `/api/clientes`: operações de clientes.
- `/api/transportadoras`: operações de transportadoras.
- `/api/admins`: operações de usuários administrativos.

Consulte as rotas e os testes do backend para os métodos e corpos de requisição disponíveis.

## Validação

Dentro de `backend/`, com `.env` configurado:

```bash
npm run build
npm run test:guard
docker compose --profile test up -d --wait db_test
npm test
docker compose --profile test stop db_test
```

`build` gera o Prisma Client e compila TypeScript. `test:guard` verifica a proteção de configuração sem acessar banco. `npm test` exige `TEST_DATABASE_URL`, valida o destino, substitui `DATABASE_URL` apenas no processo de testes, aplica migrações e executa Jest/Supertest em série. A inicialização do Jest repete a validação antes de importar os testes.

**Os testes do backend apagam registros com `deleteMany`.** A proteção aceita somente endereço de loopback, banco e usuário `bitfrost_test` e schema `public`; parâmetros adicionais são rejeitados. Use exclusivamente dados descartáveis nesse banco. Essa validação evita erros comuns de configuração, mas não substitui o isolamento do servidor: o Compose executa desenvolvimento e testes em instâncias distintas.

O workflow [Backend PostgreSQL](https://github.com/Lawtrel/bitfrost/actions/workflows/backend.yml) executa instalação pelo lockfile, build, testes da proteção e testes da API com PostgreSQL 16, além de verificar a disponibilidade do Prisma Client após remover dependências de desenvolvimento. O backend deve ser compilado antes de `npm prune --omit=dev --ignore-scripts`; `npm start` usa os artefatos já gerados.

No frontend, `npm run typecheck` verifica os tipos da aplicação, dos testes e da configuração Vite; `npm run test:run` executa a suíte sem modo de observação. `npm run build` exige a checagem de tipos antes de gerar a aplicação. `npm run lint` verifica as regras de estilo. Esses comandos e a integração visual não fazem parte do workflow de backend.

## Próximas entregas

- Validar autenticação e autorização das operações administrativas antes de disponibilizar dados reais.
- Registrar uma demonstração reproduzível do fluxo cadastro → emissão de vale → alteração de status.
