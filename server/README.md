# ScoutMe PRO — API

Backend em Express 5 com Prisma 7 e PostgreSQL. Responsável por cadastro e
autenticação de usuários via JWT, contas, perfis públicos e seguidores.

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
| `JWT_EXPIRES_IN` | não         | `15m`  | Validade do token de acesso (o refresh token renova) |
| `PORT`           | não         | `3333` | Porta HTTP                               |
| `CORS_ORIGIN`    | não         | `*`    | Origens liberadas para o front, separadas por vírgula |

O servidor não sobe se `DATABASE_URL` ou `JWT_SECRET` estiverem ausentes.

## Rotas

| Método | Rota             | Auth | Descrição                             |
| ------ | ---------------- | ---- | ------------------------------------- |
| GET    | `/health`        | não  | Verificação de disponibilidade        |
| POST   | `/auth/register` | não  | Cria um usuário e devolve os tokens   |
| POST   | `/auth/login`    | não  | Autentica e devolve os tokens         |
| POST   | `/auth/refresh`  | não  | Troca o refresh token por tokens novos |
| POST   | `/auth/logout`   | não  | Encerra a sessão do refresh token     |
| GET    | `/user/me`       | sim  | Devolve o usuário dono do token       |
| PATCH  | `/user/me`       | sim  | Atualiza `name` e/ou `avatarUrl`      |
| PATCH  | `/user/me/password` | sim | Troca a senha (exige a senha atual; 5 tentativas a cada 15 min por usuário) e encerra as sessões dos outros aparelhos |
| GET    | `/account/me`    | sim  | Devolve a conta, a configuração e os contadores de seguidores |
| PATCH  | `/account/me`    | sim  | Liga ou desliga a conta privada (`isPrivate`) |
| PATCH  | `/account/me/profile` | sim | Atualiza `username`, `displayName`, `showDisplayName`, `bio` e/ou `avatarColor` |
| PATCH  | `/account/me/configuration` | sim | Atualiza `theme`, `language` e/ou `notifications` |
| PUT    | `/account/me/type` | sim | Escolhe o tipo da conta (uma vez só, logo depois do cadastro) |
| PUT    | `/account/me/player-attributes` | sim | Grava pé dominante, posição e categoria (só contas Player) |
| GET    | `/account/me/follow-requests` | sim | Lista os pedidos para seguir pendentes |
| POST   | `/account/me/follow-requests/:username` | sim | Aceita o pedido de `:username` |
| DELETE | `/account/me/follow-requests/:username` | sim | Recusa o pedido de `:username` |
| GET    | `/profiles?search=&filter=` | sim | Busca perfis por nome ou @usuário, com filtro por grupo de conta (300 buscas a cada 15 min por usuário) |
| GET    | `/profiles/:username` | sim | Perfil público visto por quem está logado |
| POST   | `/profiles/:username/follow` | sim | Segue o perfil, ou pede para seguir se ele for privado (60 ações a cada 15 min por usuário) |
| DELETE | `/profiles/:username/follow` | sim | Deixa de seguir ou cancela o pedido |

Rotas autenticadas esperam o cabeçalho `Authorization: Bearer <token>`.

### POST /auth/register

```json
{ "name": "Edson Souza", "email": "edson@scout.com", "password": "senha12345", "remember": true }
```

`201` devolve `{ user, accessToken, refreshToken }`. O e-mail é normalizado (sem espaços e em
minúsculas) antes de ser gravado. Junto com o usuário é criada uma conta pública e **sem
tipo**, com a configuração padrão (`dark`, `pt`, notificações ligadas) e um
`username` gerado a partir do nome (ver [Nome de usuário](#nome-de-usuário)); o
tipo é escolhido em seguida, em `PUT /account/me/type`.

### POST /auth/login

```json
{ "email": "edson@scout.com", "password": "senha12345", "remember": true }
```

`200` devolve `{ user, accessToken, refreshToken }`. `remember` é opcional e vale
`true` quando não vem.

### Sessão e refresh token

O login devolve dois tokens:

- **`accessToken`**: JWT curto (`JWT_EXPIRES_IN`, 15 min por padrão), mandado no
  `Authorization` das rotas autenticadas. Carrega o id da sessão em `sid`.
- **`refreshToken`**: texto aleatório e opaco. O banco guarda só o hash dele na
  tabela `session`, então dá para encerrar a sessão a qualquer momento.

Quando o access token vence, o front chama `POST /auth/refresh` com
`{ "refreshToken": "..." }` e recebe `{ accessToken, refreshToken }`. O refresh
token é trocado a cada uso (o antigo deixa de valer) e a validade da sessão
recomeça: 90 dias com `remember`, 1 dia sem. Quem usa o app não cai; quem fica
esse tempo sem abrir precisa entrar de novo.

Se um refresh token já trocado voltar a ser usado depois de 1 minuto, a API
entende que ele vazou e encerra a sessão inteira. Dentro desse minuto o pedido só
recebe `401`, porque duas abas renovando juntas mandam o mesmo token.

`POST /auth/logout` com `{ "refreshToken": "..." }` encerra a sessão e responde
`204`. Trocar a senha encerra todas as sessões do usuário menos a atual.

### PATCH /user/me

```json
{ "name": "Edson Souza", "avatarUrl": "https://exemplo.com/avatar.png" }
```

Os dois campos são opcionais — manda só o que quiser mudar. `avatarUrl` aceita
`null` para remover o avatar. `200` devolve `{ user }`.

### PUT /account/me/type

```json
{ "type": "scout" }
```

`200` devolve `{ account }`. Aceita `player`, `scout` e `team`; `organization` é
plano pago e responde `403`. Só funciona enquanto a conta ainda não tem tipo:
depois disso responde `409`. Enquanto o tipo não é escolhido, `GET /account/me`
devolve `type: null` e o front manda para a tela de escolha.

### PUT /account/me/player-attributes

```json
{ "preferredFoot": "left", "position": "left_winger", "category": "u15" }
```

`200` devolve `{ account }`, com os atributos em `account.playerAttributes`. Os três
campos são obrigatórios no corpo e aceitam `null` para limpar; campo a mais responde
`422`. Valores aceitos (em `src/player/constants.js`, e travados no banco por CHECK):

- `preferredFoot`: `right`, `left`, `both`
- `position`: `goalkeeper`, `center_back`, `left_back`, `right_back`,
  `defensive_midfielder`, `midfielder`, `right_midfielder`, `left_midfielder`,
  `winger`, `right_winger`, `left_winger`, `striker`, `second_striker`
- `category`: `u7`, `u9`, `u11`, `u13`, `u15`, `u17`, `u20`, `u23`

Só contas Player: os outros tipos recebem `403`, e no `GET /account/me` o campo
`playerAttributes` vem `null` para eles.

### Nome de usuário

Cada conta tem um `username` único, que é o endereço do perfil (`/perfil/<username>`
no app). Regra: de 3 a 30 caracteres, só letras minúsculas, números, `.` e `_`,
começando com letra. Alguns nomes são reservados (`editar`, `atributos`, `admin`,
`suporte`, `scoutme`, `scoutmepro`). A regra fica em `src/account/constants.js` e
também está travada no banco por CHECK.

No cadastro, o nome vira a base: sem acentos, só letras e números, até 20
caracteres (`André Lima` → `andrelima`). Se já existir, ganha um número no fim
(`andrelima2`, `andrelima3`...). As contas que existiam antes da migration
`add_username_and_follow` receberam o @ pela mesma base; quando a base repetia ou
era reservada, a conta ganhou `_` e o id no fim (`andrelima_42`).

### PATCH /account/me/profile

```json
{ "username": "andre.lima", "bio": "Meia ofensivo." }
```

Todos os campos são opcionais. O `username` é normalizado (sem espaços e em
minúsculas) antes de validar. Fora da regra ou reservado responde `422`; já usado
por outra conta responde `409` com `issues: [{ "field": "username", ... }]`. O @
antigo deixa de funcionar na hora. `200` devolve `{ account }`.

### PATCH /account/me

```json
{ "isPrivate": false }
```

Toda conta nasce pública. Quando uma conta privada volta a ser pública, os
pedidos pendentes são aceitos juntos. `200` devolve `{ account }`.

### Perfis públicos e seguidores

Todas as rotas exigem login. Um perfil só existe para quem já escolheu o tipo da
conta; `username` inexistente, fora do formato ou de conta sem tipo responde `404`.
Nenhuma rota de perfil devolve e-mail.

`GET /profiles/:username` devolve `{ profile }`:

```json
{
  "username": "andre.lima",
  "type": "player",
  "name": "André Lima",
  "displayName": null,
  "showDisplayName": true,
  "avatarUrl": null,
  "avatarColor": "indigo",
  "isPrivate": true,
  "bio": null,
  "playerAttributes": null,
  "followersCount": 1,
  "followingCount": 0,
  "isOwner": false,
  "followStatus": "pending",
  "canViewDetails": false
}
```

- `followStatus`: `none`, `pending` ou `accepted`; vem `null` quando o perfil é de
  quem está logado (`isOwner: true`).
- `canViewDetails`: `true` para o dono, para conta pública ou para seguidor
  aceito. Quando é `false`, `bio` e `playerAttributes` já vêm `null` da API.

`POST /profiles/:username/follow` segue na hora se a conta for pública e cria um
pedido `pending` se for privada. Repetir o pedido não duplica. Seguir o próprio
perfil responde `400`. `DELETE` deixa de seguir ou cancela o pedido. As duas
devolvem `{ profile }` já atualizado.

`GET /profiles?search=andre` devolve `{ profiles }` com até 20 cartões (`username`,
`type`, `name`, `displayName`, `showDisplayName`, `avatarUrl`, `avatarColor`). O
termo precisa de 2 a 50 caracteres (`@` no começo é ignorado) e procura no
`username`, no nome e no nome de exibição (só quando ele está visível). Quem busca
não aparece no resultado. A ordem é: @ exato, @ que começa com o termo, nome que
começa com o termo, o resto.

`filter` é opcional e restringe os tipos de conta: `all` (padrão, todos), `users`
(`player` e `scout`) ou `accounts` (`team` e `organization`). Outro valor responde
`422`. Os grupos ficam em `src/profile/constants.js`.

`GET /account/me/follow-requests` devolve `{ requests }`, os cartões de quem pediu
com `requestedAt`, mais recentes primeiro. Aceitar ou recusar devolve `{ account }`
com `pendingFollowRequestsCount` atualizado; pedido inexistente responde `404`.

## Respostas de erro

| Status | Quando                                             |
| ------ | -------------------------------------------------- |
| `400`  | Tentar seguir o próprio perfil                     |
| `401`  | Credenciais inválidas, token ausente ou expirado   |
| `403`  | Tipo de conta pago no cadastro, ou atributos numa conta que não é Player |
| `404`  | Rota, usuário, perfil (@) ou pedido para seguir inexistente |
| `409`  | E-mail ou nome de usuário já em uso, ou tipo de conta já escolhido |
| `422`  | Corpo ou busca inválidos (detalhado em `issues`)   |
| `429`  | Limite de tentativas por usuário estourado (troca de senha, foto, seguir, busca) |
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
│   ├── rate-limit.js       limite de pedidos por usuário, em memória
│   └── error-handler.js    traduz erros em resposta JSON
├── auth/
│   ├── routes.js
│   ├── controller.js       entrada HTTP
│   ├── service.js          regras de cadastro, autenticação e emissão dos tokens
│   └── schema.js           validação do corpo das requisições
├── session/
│   ├── constants.js        validade das sessões e folga de reuso do refresh token
│   └── service.js          cria, renova (com rotação) e encerra sessões
├── account/
│   ├── routes.js
│   ├── controller.js       entrada HTTP
│   ├── service.js          conta, perfil, @usuário e pedidos para seguir do dono
│   ├── schema.js           validação do corpo das requisições
│   ├── mappers.js          formato público da conta, do perfil e do cartão de perfil
│   ├── username.js         gera o @usuário a partir do nome
│   └── constants.js        tipos de conta e regra do @usuário
├── follow/
│   ├── constants.js        status do seguir (pending, accepted)
│   └── service.js          seguir, deixar de seguir, pedidos e contadores
├── profile/
│   ├── routes.js
│   ├── controller.js       entrada HTTP
│   ├── service.js          busca e perfil público visto por outra conta
│   ├── schema.js           validação da busca
│   └── constants.js        cores do avatar e tamanho da bio
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

A API roda na Vercel e o banco fica na Neon. O front é outro projeto da Vercel
(`scout-me`), no mesmo repositório.

O navegador não chama a API direto: o front chama `/api/...` no próprio domínio e
o `next.config.ts` repassa para o endereço em `API_URL` (variável do projeto do
front). Por isso o `CORS_ORIGIN` não entra no caminho do app; ele só importa para
quem chamar a API de outro site.

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
