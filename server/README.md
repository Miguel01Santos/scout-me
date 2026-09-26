# ScoutMe PRO — API

Backend em Express 5 com Prisma 7 e PostgreSQL. Responsável por cadastro e
autenticação de usuários via JWT.

## Rodando localmente

Precisa de um PostgreSQL acessível.

```bash
cp .env.example .env
npm install
npm run migrate:dev
npm run dev
```

O servidor sobe em `http://localhost:3333`.

## Variáveis de ambiente

| Variável         | Obrigatória | Padrão | Descrição                                |
| ---------------- | ----------- | ------ | ---------------------------------------- |
| `DATABASE_URL`   | sim         | —      | String de conexão do PostgreSQL          |
| `DATABASE_URL_UNPOOLED` | não  | —      | Conexão direta, usada só pelas migrations |
| `JWT_SECRET`     | sim         | —      | Segredo usado para assinar os tokens     |
| `JWT_EXPIRES_IN` | não         | `7d`   | Validade do token de acesso              |
| `PORT`           | não         | `3333` | Porta HTTP                               |
| `CORS_ORIGIN`    | não         | `*`    | Origem liberada para o front             |

O servidor não sobe se `DATABASE_URL` ou `JWT_SECRET` estiverem ausentes.

## Rotas

| Método | Rota             | Auth | Descrição                             |
| ------ | ---------------- | ---- | ------------------------------------- |
| GET    | `/health`        | não  | Verificação de disponibilidade        |
| POST   | `/auth/register` | não  | Cria um usuário e devolve o token     |
| POST   | `/auth/login`    | não  | Autentica e devolve o token           |
| GET    | `/user/me`       | sim  | Devolve o usuário dono do token       |
| PATCH  | `/user/me`       | sim  | Atualiza `name` e/ou `avatarUrl`      |

Rotas autenticadas esperam o cabeçalho `Authorization: Bearer <token>`.

### POST /auth/register

```json
{ "name": "Edson Souza", "email": "edson@scout.com", "password": "senha12345" }
```

`201` devolve `{ user, accessToken }`. O e-mail é normalizado (sem espaços e em
minúsculas) antes de ser gravado. Junto com o usuário é criada uma conta do tipo
`person` com a configuração padrão (`light`, `pt`, notificações ligadas).

### POST /auth/login

```json
{ "email": "edson@scout.com", "password": "senha12345" }
```

`200` devolve `{ user, accessToken }`.

### PATCH /user/me

```json
{ "name": "Edson Souza", "avatarUrl": "https://exemplo.com/avatar.png" }
```

Os dois campos são opcionais — manda só o que quiser mudar. `avatarUrl` aceita
`null` para remover o avatar. `200` devolve `{ user }`.

## Respostas de erro

| Status | Quando                                             |
| ------ | -------------------------------------------------- |
| `401`  | Credenciais inválidas, token ausente ou expirado   |
| `404`  | Rota ou usuário inexistente                        |
| `409`  | E-mail já cadastrado                               |
| `422`  | Corpo da requisição inválido (detalhado em `issues`) |
| `500`  | Erro não tratado                                   |

## Estrutura

```
src/
├── server.js               sobe o HTTP
├── app.js                  middlewares e montagem das rotas
├── env.js                  leitura e validação das variáveis de ambiente
├── prisma.js               client do Prisma com adapter do PostgreSQL
├── http-error.js           erro com status HTTP
├── middlewares/
│   ├── authenticate.js     valida o Bearer token e injeta request.userId
│   └── error-handler.js    traduz erros em resposta JSON
├── auth/
│   ├── routes.js
│   ├── controller.js       entrada HTTP
│   ├── service.js          regras de cadastro e autenticação
│   └── schema.js           validação do corpo das requisições
├── account/
│   └── constants.js        tipos de conta (person, team, federation, scout)
├── configuration/
│   └── constants.js        valores de tema e idioma
└── user/
    ├── routes.js
    ├── controller.js       entrada HTTP
    ├── service.js          leitura e atualização do usuário
    └── schema.js           validação do corpo das requisições
```

## Migrations

```bash
npm run migrate:dev     # cria e aplica migration em desenvolvimento
npm run migrate:deploy  # aplica migrations pendentes em produção
npm run studio          # abre o Prisma Studio
```

## Deploy

A API roda na Vercel e o banco fica na Neon. O front é outro deploy, na Netlify.

### Vercel

A Vercel detecta Express sem configuração: ela procura um arquivo em `src/app.js`
(entre outros caminhos) que exporte o app como *default* — é o que `src/app.js`
faz. Não existe `vercel.json` nem pasta `api/` aqui, e não é esquecimento.

Ao importar o repositório em vercel.com/new:

| Campo             | Valor    |
| ----------------- | -------- |
| Root Directory    | `server` |
| Production Branch | `master` |

O `postinstall` roda `prisma generate` durante o build, e o `vercel-build` aplica
as migrations (ver abaixo).

Em produção o app vira uma única Vercel Function, então `src/server.js` (o
`app.listen`) só é usado no desenvolvimento local.

### Neon

A Neon expõe duas strings de conexão para o mesmo banco:

- a **pooled** (tem `-pooler` no host) vai em `DATABASE_URL`, porque cada
  instância serverless abre conexões curtas e o pooler é quem aguenta isso;
- a **direct** vai em `DATABASE_URL_UNPOOLED`, porque `prisma migrate` não
  funciona através do pooler.

Ambas precisam de `?sslmode=require`.

Se `DATABASE_URL_UNPOOLED` não existir, o `prisma.config.js` cai de volta em
`DATABASE_URL` — é o que faz o desenvolvimento local continuar com uma variável só.

### Aplicando as migrations em produção

Todo deploy de produção (push na `master`) roda o script `vercel-build`, que
executa `prisma migrate deploy` na Neon antes de publicar a função. Se a
migration falhar, o build falha e a versão anterior continua no ar. Deploys de
preview pulam esse passo para não migrar o banco de produção a partir de outra
branch.

Para isso, `DATABASE_URL_UNPOOLED` precisa estar cadastrada nas variáveis de
ambiente de produção da Vercel.

Para aplicar na mão, com a conexão direta da Neon em `.env`:

```bash
npm run migrate:deploy
```
