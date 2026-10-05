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

Defina também `JWT_SECRET` no `backend/.env`. Gere um segredo local com `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"` e copie o resultado para essa variável. Não versione o `.env` nem compartilhe esse valor. A API recusa iniciar sem um segredo de pelo menos 32 bytes.

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

## Autenticação e permissões

O login (`POST /api/admins/login`) retorna `{ user, token, expiresIn }`. Envie o token em `Authorization: Bearer <token>`; ele expira em 15 minutos. `GET /api/admins/me` retorna o usuário atual. A API consulta cargo e status no banco em cada requisição: desativar ou excluir uma conta bloqueia seu próximo acesso, mesmo com token ainda válido.

| Operação | Acesso |
| --- | --- |
| Cadastro e login | Público; cadastro aceita consultor/supervisor e força status pendente |
| Consultar vales, clientes e transportadoras | Qualquer conta ativa autenticada |
| Criar, atualizar, anexar arquivo ou excluir vale | Supervisor ou administrador |
| Criar/excluir clientes e transportadoras | Administrador |
| Listar usuários, aprovar, mudar cargo ou excluir conta | Administrador |

O cadastro mantém a regra existente de emails `heineken.com`/`heiway.net`. Isso é uma validação de formato e domínio, não uma confirmação de propriedade do email. A aprovação manual continua necessária.

Para criar o primeiro administrador em um banco de desenvolvimento preparado, execute `npm run build` dentro de `backend/`, defina `ADMIN_NAME`, `ADMIN_EMAIL` e `ADMIN_PASSWORD` no ambiente local e execute `npm run admin:create`. Use senha própria com pelo menos 12 caracteres e no máximo 72 bytes UTF-8. Também é possível definir essas três variáveis no `.env` local ignorado pelo Git; remova-as após a criação. O script recusa executar se já existir qualquer conta com cargo `adm` e não altera contas existentes. Nunca execute esse provisionamento contra um banco sem autorização. Administradores seguintes podem ser promovidos pela gestão de usuários autenticada.

A interface guarda o token em `sessionStorage` e confirma a sessão na API antes de abrir o painel. Os dados de apresentação em `localStorage` não concedem permissões. Ao receber HTTP 401, limpa a sessão e retorna ao login. Sair encerra a sessão no navegador; não revoga uma cópia do token antes dos 15 minutos. Não há renovação automática, verificação de email nem limitação de tentativas de login nesta entrega.

Se a confirmação da sessão falhar por indisponibilidade da API ou da rede, o painel permanece bloqueado, preservando o token para uma nova tentativa. Vencimentos representam datas de calendário: um vale acumulado permanece válido durante todo o dia escolhido e passa a vencido no dia seguinte, conforme a data local do navegador. A exportação PDF usa um gerador compartilhado, com identificação completa, quantidade, valor unitário, total e vencimento.

## Validação

Dentro de `backend/`, com `.env` configurado:

```bash
npm run build
npm run test:guard
npm run test:auth
docker compose --profile test up -d --wait db_test
npm test
docker compose --profile test stop db_test
```

`build` gera o Prisma Client e compila TypeScript. `test:guard` verifica a proteção de configuração sem acessar banco. `test:auth` testa rotas HTTP, JWT e permissões com o Prisma simulado, sem acessar PostgreSQL. `npm test` exige `TEST_DATABASE_URL`, valida o destino, substitui `DATABASE_URL` apenas no processo de testes, gera um segredo JWT temporário, aplica migrações e executa Jest/Supertest em série. Os testes de integração criam contas apenas no banco descartável e obtêm tokens pelo login real da API. A inicialização do Jest repete a validação antes de importar os testes.

**Os testes do backend apagam registros com `deleteMany`.** A proteção aceita somente endereço de loopback, banco e usuário `bitfrost_test` e schema `public`; parâmetros adicionais são rejeitados. Use exclusivamente dados descartáveis nesse banco. Essa validação evita erros comuns de configuração, mas não substitui o isolamento do servidor: o Compose executa desenvolvimento e testes em instâncias distintas.

O workflow [Backend PostgreSQL](https://github.com/Lawtrel/bitfrost/actions/workflows/backend.yml) executa instalação pelo lockfile, build, testes da proteção, testes de autenticação e testes da API com PostgreSQL 16, além de verificar a disponibilidade do Prisma Client após remover dependências de desenvolvimento. O backend deve ser compilado antes de `npm prune --omit=dev --ignore-scripts`; `npm start` usa os artefatos já gerados.

No frontend, `npm run typecheck` verifica os tipos da aplicação, dos testes e da configuração Vite; `npm run test:run` executa a suíte sem modo de observação. `npm run build` exige a checagem de tipos antes de gerar a aplicação. O workflow [Frontend](https://github.com/Lawtrel/bitfrost/actions/workflows/frontend.yml) executa a suíte e o build em Linux com Node.js 22. `npm run lint` verifica as regras de estilo e não integra esse workflow.

Em 05/10/2026, o build e o fluxo de emissão → listagem → processamento foram validados localmente no navegador com PostgreSQL separado e dados descartáveis. Também foram conferidos login dos três cargos, bloqueios de rotas incompatíveis e atualização automática dos contadores após as operações. O download PDF não foi comprovado nessa revisão; aprovação de cadastro, promoção de usuário e processamento de vale vencido ainda precisam de revisão visual. Essa demonstração local não comprova uma implantação nem autoriza o uso de dados reais.

## Próximas entregas

A revisão complementar de 05/10/2026 passou em 301 testes do frontend, distribuídos em 46 arquivos, e na verificação de tipos. Inclui aprovação, promoção, confirmação e atualização da lista ao remover parceiros, erro de consulta dos processados, processamento dos vencidos, recuperação de sessão e fronteiras de data. O PDF produzido pelo gerador da aplicação foi extraído e renderizado: uma página com identificação completa, 12 paletes, total R$ 222,00 e vencimento 30/11/2026. A execução final desses fluxos no navegador e a publicação da revisão complementar ainda estão pendentes.

- Validar visualmente exportação PDF, aprovação de cadastro, promoção de usuário e processamento de vale vencido.
- Implementar limitação de tentativas de login e verificar a propriedade do email antes de disponibilizar dados reais.
- Registrar uma demonstração reproduzível do fluxo cadastro → emissão de vale → alteração de status.
