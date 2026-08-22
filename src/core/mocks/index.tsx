// ==========================================
// DADOS INICIAIS DA APLICAÇÃO (Mocks)
// ==========================================
// Devemos consumir esses dados via API
export const INITIAL_TALENTS = [
  {
    id: 't1',
    nome: 'Gabriel Jesus Silva',
    posicao: 'Atacante',
    categoria: 'Sub-17',
    idade: 17,
    peDominante: 'Canhoto',
    clube: 'Nenhum (Livre)',
    scoreAtual: 9.0,
    mediaAvaliacoes: 8.75,
    avaliacoesCount: 12,
    solidezPct: 85,
    classificacao: 'Promissor',
    atributos: [
      { subject: 'Técnica', A: 85 },
      { subject: 'Tática', A: 78 },
      { subject: 'Físico', A: 82 },
      { subject: 'Criatividade', A: 90 },
      { subject: 'Evolução', A: 88 },
    ],
    evolucao: [
      { video: 'Jogo 1', score: 7.2 },
      { video: 'Jogo 2', score: 8.75 },
      { video: 'Jogo 3', score: 9.0 },
    ],
    videoTags: [
      { type: 'Sucesso', description: 'Drible Curto' },
      { type: 'Sucesso', description: 'Visão de Jogo' },
      { type: 'Aprimorar', description: 'Precipitação no passe' },
    ],
  },
  {
    id: 't2',
    nome: 'Lucas Paquetá Santos',
    posicao: 'Meia',
    categoria: 'Sub-15',
    idade: 15,
    peDominante: 'Ambidestro',
    clube: 'Escolinha Futuro',
    scoreAtual: 8.5,
    mediaAvaliacoes: 7.4,
    avaliacoesCount: 5,
    solidezPct: 70,
    classificacao: 'Com Potencial',
    atributos: [
      { subject: 'Técnica', A: 80 },
      { subject: 'Tática', A: 88 },
      { subject: 'Físico', A: 70 },
      { subject: 'Criatividade', A: 85 },
      { subject: 'Evolução', A: 75 },
    ],
    evolucao: [
      { video: 'Aval. 1', score: 6.8 },
      { video: 'Aval. 2', score: 7.4 },
    ],
    videoTags: [
      { type: 'Sucesso', description: 'Passe Longo' },
      { type: 'Sucesso', description: 'Controle de Bola' },
    ],
  },
];

export const INITIAL_USER = {
  nome: 'Edson Souza',
  role: 'Expert',
  peso: 3,
  isVerified: true,
};