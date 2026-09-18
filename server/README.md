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
| GET    | `/auth/me`       | sim  | Devolve o usuário dono do token       |

Rotas autenticadas esperam o cabeçalho `Authorization: Bearer <token>`.

### POST /auth/register

```json
{ "name": "Edson Souza", "email": "edson@scout.com", "password": "senha12345" }
```

`201` devolve `{ user, accessToken }`. O e-mail é normalizado (sem espaços e em
minúsculas) antes de ser gravado.

### POST /auth/login

```json
{ "email": "edson@scout.com", "password": "senha12345" }
```

`200` devolve `{ user, accessToken }`.

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
└── auth/
    ├── routes.js
    ├── controller.js       entrada HTTP
    ├── service.js          regras de cadastro e autenticação
    └── schema.js           validação do corpo das requisições
```

## Migrations

```bash
npm run migrate:dev     # cria e aplica migration em desenvolvimento
npm run migrate:deploy  # aplica migrations pendentes em produção
npm run studio          # abre o Prisma Studio
```
