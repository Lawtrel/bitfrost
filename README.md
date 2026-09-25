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

Requisitos: Node.js com npm, Git e um banco **PostgreSQL local e descartável**.

```bash
git clone https://github.com/Lawtrel/bitfrost.git
cd bitfrost/backend
```

Crie `backend/.env` com a URL do seu banco de desenvolvimento, substituindo os valores abaixo:

```dotenv
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/bitfrost_dev?schema=public"
```

**Atenção à configuração atual:** o schema Prisma usa PostgreSQL, mas o `docker-compose.yml` do backend ainda define MySQL. Esse Compose precisa ser alinhado antes de servir como ambiente reproduzível. Para os passos abaixo, use uma instância PostgreSQL configurada separadamente.

Em um banco vazio destinado exclusivamente ao desenvolvimento:

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

A API utiliza `http://localhost:3001/api`. `db push` sincroniza o schema para exploração local; não substitui uma estratégia de migrações em ambientes com dados reais.

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

No backend, `npm run build` compila TypeScript e `npm test` executa Jest. No frontend, `npm run build` gera a aplicação e `npm run lint` verifica o código.

**Os testes do backend apagam registros com `deleteMany`.** Antes de executá-los, configure `DATABASE_URL` para um banco de teste exclusivo e descartável, nunca para o banco de uso da aplicação. A existência dos testes não significa que a suíte esteja passando na configuração atual.

## Próximas entregas

- Unificar PostgreSQL, Compose e instruções de inicialização.
- Separar bancos de desenvolvimento/teste e automatizar a execução dos testes em CI.
- Revisar as dependências de execução: `@prisma/client` está em `devDependencies`.
- Validar autenticação e autorização das operações administrativas antes de disponibilizar dados reais.
- Registrar uma demonstração reproduzível do fluxo cadastro → emissão de vale → alteração de status.
