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
| PATCH  | `/account/me`    | sim  | Liga ou desliga a conta privada (`isPrivate`) e o aprovar avaliações (`reviewRatings`, só Player) |
| PATCH  | `/account/me/profile` | sim | Atualiza `username`, `displayName`, `showDisplayName`, `bio` e/ou `avatarColor` |
| PATCH  | `/account/me/configuration` | sim | Atualiza `theme`, `language` e/ou `notifications` |
| PUT    | `/account/me/type` | sim | Escolhe o tipo da conta (uma vez só, logo depois do cadastro) |
| PUT    | `/account/me/player-attributes` | sim | Grava pé dominante, posição e categoria (só contas Player) |
| GET    | `/account/me/follow-requests` | sim | Lista os pedidos para seguir pendentes |
| POST   | `/account/me/follow-requests/:username` | sim | Aceita o pedido de `:username` |
| DELETE | `/account/me/follow-requests/:username` | sim | Recusa o pedido de `:username` |
| GET    | `/profiles?search=&filter=` | sim | Busca perfis por nome ou @usuário, com filtro por grupo de conta e filtros de player (300 buscas a cada 15 min por usuário) |
| GET    | `/profiles/:username` | sim | Perfil público visto por quem está logado |
| POST   | `/profiles/:username/follow` | sim | Segue o perfil, ou pede para seguir se ele for privado (60 ações a cada 15 min por usuário) |
| DELETE | `/profiles/:username/follow` | sim | Deixa de seguir ou cancela o pedido |
| POST   | `/profiles/:username/ratings` | sim | Avalia o player (uma vez só) e passa a seguir |
| POST   | `/profiles/:username/rating-requests` | sim | Player pede avaliação a um scout (uma vez só) e passa a seguir (20 pedidos a cada 15 min por usuário) |
| GET    | `/account/me/private-ratings` | sim | Avaliações privadas que o player recebeu |
| GET    | `/account/me/pending-ratings` | sim | Avaliações esperando o player compartilhar (só Player) |
| POST   | `/account/me/pending-ratings/:username` | sim | Compartilha no perfil a avaliação de `:username` |
| DELETE | `/account/me/pending-ratings/:username` | sim | Remove da lista a avaliação de `:username`, sem apagar |
| GET    | `/notifications` | sim | Lista as últimas 50 notificações de quem está logado |
| POST   | `/notifications/:id/read` | sim | Marca uma notificação como lida |
| DELETE | `/notifications` | sim | Apaga todas as notificações de quem está logado |
| GET    | `/profiles/:username/posts` | sim | Posts do perfil, na ordem das posições (conta privada só para seguidor aceito) |
| GET    | `/account/me/friends` | sim | Amigos (os dois se seguem), para mencionar em posts |
| POST   | `/posts/signatures` | sim | Assinaturas para enviar até 5 fotos ao Cloudinary |
| POST   | `/posts` | sim | Cria um post |
| PATCH  | `/posts/:id` | sim | Muda posição, descrição ou menções |
| DELETE | `/posts/:id` | sim | Apaga o post e as fotos |
| GET    | `/ratings/:id` | sim | Uma avaliação, para a tela de detalhe |
| GET    | `/profiles/:username/followers` | sim | Seguidores de um perfil (conta privada só para seguidor aceito) |
| GET    | `/profiles/:username/following` | sim | Quem um perfil segue (mesma regra) |
| GET    | `/profiles/:username/club-members` | sim | Atletas e scouts de um time |
| POST   | `/profiles/:username/club-invite` | sim | Time convida um player ou scout para o clube |
| DELETE | `/profiles/:username/club-member` | sim | Time cancela o convite ou remove a pessoa do clube |
| GET    | `/account/me/club` | sim | Clube atual e convites recebidos (player e scout) |
| POST   | `/account/me/club-invites/:username` | sim | Aceita o convite do time `:username` |
| DELETE | `/account/me/club-invites/:username` | sim | Recusa o convite do time `:username` |
| DELETE | `/account/me/club` | sim | Sai do clube atual |
| GET    | `/account/me/followers` | sim | Quem segue a conta (seguir aceito) |
| GET    | `/account/me/following` | sim | Quem a conta segue (seguir aceito) |
| GET    | `/account/me/ratings/received` | sim | Avaliações recebidas, menos pendentes e removidas |
| GET    | `/account/me/ratings/given` | sim | Avaliações feitas, com o status de cada uma |
| DELETE | `/account/me/ratings/given/:id` | sim | Cancela uma avaliação feita que ainda está pendente |
| GET    | `/feed?before=` | sim | Feed: posts e avaliações públicas de quem a pessoa segue, 20 por página |
| GET    | `/scouting/athletes` | sim | Players que o scout segue, com overall, critérios e evolução (só Scout) |
| GET    | `/recent-searches` | sim | Lista os últimos 10 perfis abertos pelo Descobrir |
| POST   | `/recent-searches/:username` | sim | Registra o perfil aberto nas pesquisas recentes |
| DELETE | `/recent-searches/:username` | sim | Remove o perfil das pesquisas recentes |

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
{ "isPrivate": false, "reviewRatings": true }
```

Os dois campos são opcionais, mas pelo menos um precisa vir. Toda conta nasce pública
e com `reviewRatings` desligado. Quando uma conta privada volta a ser pública, os
pedidos para seguir pendentes são aceitos juntos; quando `reviewRatings` é desligado,
as avaliações pendentes são compartilhadas juntas. `reviewRatings` em conta que não é
Player responde `403`. `200` devolve `{ account }`, com `reviewRatings` e
`pendingRatingsCount`.

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

Filtros de player (usados nos "Filtros avançados" do Descobrir), todos opcionais:
`position`, `preferredFoot`, `category` (mesmos valores dos atributos) e `level`
(`common`, `potential`, `promising`). Com qualquer um deles a busca traz só players, e o
`search` pode vir vazio. Os resultados vêm do maior overall para o menor.

`GET /account/me/follow-requests` devolve `{ requests }`, os cartões de quem pediu
com `requestedAt`, mais recentes primeiro. Aceitar ou recusar devolve `{ account }`
com `pendingFollowRequestsCount` atualizado; pedido inexistente responde `404`.

### Notificações

Para não repetir texto em cada notificação, o conteúdo fixo de cada evento fica na
tabela `notification_template` (`title`, `type`, `message` e `link`), preenchida pela
migration `create_notification`. Cada linha de `notification` guarda só quem fez a
ação, quem recebe, o modelo e as datas. O nome e a foto de quem fez a ação vêm da
conta dele na hora de listar, então trocar nome, foto ou @ atualiza as notificações
antigas também.

Toda notificação nasce pela função `createNotification(data, database)` de
`src/notification/service.js`, chamada no fim da ação que gera o aviso. `database`
é opcional e recebe a transação quando a ação grava mais de uma coisa.

```js
await createNotification({
  userGeneratorNotification: viewer.id,
  userReceivesNotification: account.id,
  title: NotificationTitle.REQUEST_FOLLOW,
});
```

- `userGeneratorNotification`: id da conta que fez a ação. É opcional: notificações do
  próprio app (como a de boas-vindas) vão sem ele, e o front mostra o ícone do app.
- `userReceivesNotification`: id da conta que recebe o aviso. Se for a mesma conta, a
  função não cria nada (e o banco também barra por CHECK).
- `title`: o modelo usado, um dos valores de `NotificationTitle`
  (`src/notification/constants.js`).

Modelos de hoje:

| `title` | `type` | `message` | Quando | Quem recebe | `link` |
| ------- | ------ | --------- | ------ | ----------- | ------ |
| `welcome` | `SYSTEM` | Descubra perfis de atletas, olheiros e times e explore o ambiente de scouting. | A conta escolhe o tipo | A própria conta | `/buscar` |
| `request-follow` | `FOLLOW` | pediu para seguir você. | Alguém pede para seguir uma conta privada | O dono da conta | `/configuracoes-e-privacidade/privacidade/pedidos` |
| `followed-you-back` | `FOLLOW` | começou a seguir você. | Alguém segue uma conta pública | O dono da conta | `/perfil/:username` |
| `accepted-request-follow` | `FOLLOW` | aceitou seu pedido para seguir. | O pedido é aceito | Quem pediu | `/perfil/:username` |

A migration `welcome_notification` também deu as boas-vindas às contas que já
tinham tipo, com a data do cadastro, para nenhuma tela de notificações ficar vazia.

`:username` no `link` vira o @ atual de quem fez a ação. Para criar um evento novo, é
uma migration com o `INSERT` do modelo e um valor novo em `NotificationTitle`.
Repetir um seguir que já existe não gera outra notificação.

`GET /account/me` traz `unreadNotificationsCount`, usado na bolinha do sino.

`GET /notifications` devolve `{ notifications }`, as 50 mais recentes, cada uma com
`id`, `title`, `type`, `message`, `link`, `createdAt`, `readAt` (`null` enquanto não
foi lida) e `generator` (`username`, `name`, `avatarUrl`, `avatarColor`, ou `null`
nas notificações do app). O front
monta o texto como "nome + message". Cada notificação só vira lida quando é tocada:
`POST /notifications/:id/read` responde `204` (ou `404` se não for de quem está logado).
`DELETE /notifications` apaga todas e responde `204`.

### Posts

Todo perfil pode ter até 5 posts, em posições fixas de 1 a 5 escolhidas pelo dono. Cada
post tem um carrossel de 1 a 5 fotos (retrato 4:5), descrição opcional de até 120
caracteres e menções a até 10 amigos (pessoas que a conta segue e que a seguem, com o
seguir aceito). Limites travados também no banco.

As fotos seguem o esquema da foto de perfil: o front recorta e comprime (1080×1350),
pede assinaturas em `POST /posts/signatures` (`{ "count": 3 }`) e envia direto para o
Cloudinary, na pasta `scoutme/posts/<id da conta>`. A API só aceita links dessa pasta
da própria conta.

`POST /posts`:

```json
{ "position": 1, "description": "Final do sub-17", "photos": ["https://res.cloudinary.com/..."], "mentions": ["andre.lima"] }
```

- Posição ocupada ou já com 5 posts responde `409`; mencionar quem não é amigo, `422`.
- `PATCH /posts/:id` aceita `position`, `description` e `mentions`; as fotos não mudam
  (para trocar, apaga e cria outro). Mover para uma posição ocupada troca os dois posts
  de lugar.
- `DELETE /posts/:id` apaga o post e as fotos no Cloudinary.
- Cada menção nova gera a notificação `mentioned-you` (`type: POST`) para a pessoa
  mencionada, com link para o perfil de quem postou.
- Em conta privada, `GET /profiles/:username/posts` responde `403` para quem não é
  seguidor aceito.
- Localização ainda não existe: quando houver a tabela de locais, o post ganha um campo
  opcional para ela.

### Clubes

Times funcionam como clubes: players e scouts ficam vinculados a um time por vez, na
tabela `club_member` (`status` `invited` ou `active`).

- O time convida pelo perfil da pessoa (`POST /profiles/:username/club-invite`); ela
  recebe a notificação `club-invite` e aceita ou recusa em Atividades → Clube.
- Aceitar um convite tira a pessoa do clube anterior. O time é avisado com
  `club-invite-accepted`.
- `GET /profiles/:username` traz `club` (o time de player e scout), `athletesCount` (só
  de time) e `clubAction` para quem é time vendo um player ou scout: `invite`, `invited`
  ou `member`.
- `GET /profiles/:username/club-members` devolve `{ athletes, scouts }`; time privado só
  mostra para quem segue.

É a base para avisar os membros quando o clube entrar num campeonato ou marcar um
treino, assim que essas partes existirem.

### Feed

`GET /feed` junta, das contas que a pessoa segue (seguir aceito), os posts e as
avaliações públicas já publicadas que os atletas seguidos receberam, do mais novo para
o mais antigo, 20 por página. Cada item tem `type` (`post` ou `rating`), `id` e
`createdAt`:

- `post`: `author` (cartão de perfil) e `post` (mesmo formato de `/profiles/:username/posts`).
- `rating`: `rating`, no mesmo formato de `GET /ratings/:id`.

A resposta é `{ items, nextCursor }`; para a próxima página, mande `before=<nextCursor>`.
`nextCursor` vem `null` quando acabou. Avaliações privadas, pendentes ou removidas não
entram. Quando houver treinos, jogos e campeonatos, eles entram aqui como novos tipos.

### Atletas do scout

`GET /scouting/athletes` (só Scout, os outros tipos recebem `403`) devolve
`{ athletes }`: os players que o scout segue, do maior overall para o menor, cada um com
o cartão de perfil, `playerAttributes`, `ratingScore`, `ratingsCount`,
`publicRatingsCount`, `ratingCriteria` e `evolution` (o overall depois de cada avaliação
pública, em ordem: `[{ date, score }]`). É o que alimenta Atletas e Comparador na home do
scout.

### Pesquisas recentes

Cada conta guarda os últimos 10 perfis que abriu pelo Descobrir, na tabela
`recent_search` (conta, perfil aberto e `searchedAt`).

- `POST /recent-searches/:username` registra ou atualiza a data, e o perfil volta para
  o topo. Passando de 10, os mais antigos saem. Responde `204`; o próprio perfil
  responde `400`.
- `GET /recent-searches` devolve `{ searches }`, os cartões de perfil com `searchedAt`,
  mais recentes primeiro.
- `DELETE /recent-searches/:username` remove o registro (o X do card) e responde `204`.

### Avaliações

Players são avaliados em cinco critérios, de 1 a 10: `technique`, `tactics`,
`physical`, `creativity` e `evolution` (os mesmos da home).

- Scout avalia player: uma avaliação pública e uma privada por player.
- Player avalia outro player: só a pública.
- Player pede avaliação (pública ou privada) a um scout: vira uma notificação para o
  scout, com o link do perfil do player.
- Avaliar e pedir avaliação pelo perfil são interações únicas: não dá para editar nem
  repetir (`409`). As próximas avaliações vão vir de jogos, treinos e competições.
- O pedido fica pendente até o scout avaliar; enquanto isso, pedir de novo responde
  `409`. Depois que o scout avalia, o pedido também não volta a ficar disponível.
- Quem avalia passa a seguir o player, e quem pede avaliação passa a seguir o scout
  (em conta privada vira pedido para seguir, com a notificação de sempre).

`POST /profiles/:username/ratings` (responde `201`):

```json
{ "isPrivate": false, "technique": 8, "tactics": 7, "physical": 9, "creativity": 8, "evolution": 9 }
```

**Overall.** A conta guarda `ratingScore`, de 0 a 10, recalculado pela API a cada
avaliação pública: média ponderada da média dos cinco critérios, com peso por tipo de
quem avaliou (player 1, scout 2, organization 3). As estrelas são o overall dividido
por 2: cada ponto vale meia estrela. Player e scout nascem com 1 (meia estrela); team e
organization com 0. O nível sai do overall: `common` (< 7), `potential` (7 a 8,49) e
`promising` (8,5+). Os pesos e níveis ficam em `src/rating/constants.js` e espelhados
no front.

**Nível do scout.** Scout não recebe avaliação: as estrelas dele medem experiência. Ele
nasce com 1 (meia estrela) e sobe 1 ponto (meia estrela) a cada 5 avaliações feitas que
contam (públicas publicadas ou privadas), até 10 (5 estrelas, com 45 avaliações). A
API recalcula a cada avaliação dele que passa a contar. A regra fica em
`src/rating/constants.js` (`SCOUT_RATINGS_PER_STEP`, `SCOUT_SCORE_STEP`).

**Privada.** Só o player avaliado e o scout que fez veem. Não entra no overall, mas
conta em `ratingsCount`.

**Aprovar avaliações.** Com `reviewRatings` ligado, cada avaliação pública nova chega
como `pending` (notificação `rated-you-pending`, que leva para a lista) e não entra no
overall nem em `ratingsCount` até o player compartilhar (`published`). Remover marca
como `hidden`: some da lista e do perfil, mas não é apagada, então quem avaliou continua
sem poder avaliar de novo. Avaliações privadas não passam por aprovação.

`GET /account/me` e `GET /profiles/:username` trazem `ratingScore`, `ratingsCount`
(públicas + privadas) e `ratingCriteria` (médias ponderadas por critério, só de player;
`null` sem avaliação pública ou em conta privada que a pessoa não segue).

`GET /profiles/:username` traz também `ratingActions`, o que quem está logado pode fazer
naquele perfil (`null` no próprio perfil):

```json
{ "rate": "done", "ratePrivately": "available", "requestRating": "unavailable", "requestPrivateRating": "unavailable" }
```

Cada valor é `available`, `pending` (pedido feito, esperando o scout), `done` (já
avaliou ou já foi avaliado) ou `unavailable` (o tipo de conta não permite).

**Detalhe e listas.** `GET /ratings/:id`, as listas de recebidas e feitas e os itens de
avaliação do feed usam o mesmo formato:

```json
{ "id": 12, "isPrivate": false, "status": "published", "createdAt": "...", "rater": { "username": "..." }, "rated": { "username": "..." }, "criteria": { "technique": 8 } }
```

Quem avaliou e quem foi avaliado sempre veem a avaliação. Os outros só veem a pública já
publicada, e, se o avaliado tiver conta privada, só se o seguem; fora isso a resposta é
`404`. `DELETE /account/me/ratings/given/:id` só apaga avaliação ainda pendente (senão
`404`); depois de cancelar, dá para avaliar de novo pelo perfil.

Cada avaliação nova gera notificação para o player (`rated-you` ou
`rated-you-privately`), e cada pedido gera para o scout (`request-rating` ou
`request-private-rating`), todos com `type: RATING`.

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
│   ├── controller.js       seguidores e seguindo (rotas em account/)
│   └── service.js          seguir, deixar de seguir, pedidos, contadores e listas
├── notification/
│   ├── routes.js
│   ├── controller.js       entrada HTTP
│   ├── service.js          createNotification, listagem, leitura, contagem e limpeza
│   ├── schema.js           validação do id na rota de leitura
│   └── constants.js        títulos dos modelos e limite da listagem
├── rating/
│   ├── controller.js       entrada HTTP (as rotas ficam em profile/ e account/)
│   ├── service.js          avaliar, pedir avaliação, estado das ações e privadas
│   ├── score.js            overall ponderado, médias, evolução, nível do scout e nota inicial
│   ├── mappers.js          formato comum de uma avaliação (detalhe, listas e feed)
│   ├── routes.js           GET /ratings/:id (as outras rotas ficam em profile/ e account/)
│   ├── schema.js           validação das notas
│   └── constants.js        critérios, pesos, quem avalia quem e níveis
├── recent-search/
│   ├── routes.js
│   ├── controller.js       entrada HTTP
│   ├── service.js          registra, lista e remove as pesquisas recentes
│   └── constants.js        limite de 10 por conta
├── post/
│   ├── routes.js
│   ├── controller.js       entrada HTTP (posts do perfil e amigos ficam em profile/ e account/)
│   ├── service.js          posts, fotos, menções, amigos e troca de posição
│   ├── schema.js           validação de post, posição e assinaturas
│   └── constants.js        limites de posts, fotos, descrição e menções
├── club/
│   ├── controller.js       entrada HTTP (rotas em profile/ e account/)
│   ├── service.js          convite, aceite, saída, remoção e membros do clube
│   ├── queries.js          clube atual e contagem de atletas (usado por conta e perfil)
│   └── constants.js        status do vínculo, ações e tipos que entram em clube
├── feed/
│   ├── routes.js
│   ├── controller.js       entrada HTTP
│   ├── service.js          monta o feed com posts e avaliações de quem a pessoa segue
│   ├── schema.js           validação do cursor
│   └── constants.js        tamanho da página e tipos de item
├── scouting/
│   ├── routes.js
│   ├── controller.js       entrada HTTP
│   └── service.js          atletas seguidos pelo scout, com critérios e evolução
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
