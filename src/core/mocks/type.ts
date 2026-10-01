export interface TalentAttribute {
  subject: string;
  A: number;
}

export interface TalentEvolution {
  video: string;
  score: number;
}

// Tags vindas do mock são objetos; as adicionadas numa avaliação são texto.
export type VideoTag = string | { type: string; description: string };

export interface Talent {
  id: string;
  nome: string;
  posicao: string;
  categoria: string;
  idade: number;
  peDominante: string;
  clube: string;
  scoreAtual: number;
  mediaAvaliacoes: number;
  avaliacoesCount: number;
  solidezPct: number;
  classificacao: string;
  atributos: TalentAttribute[];
  evolucao: TalentEvolution[];
  videoTags: VideoTag[];
}

export interface ScoutUser {
  nome: string;
  role: string;
  peso: number;
  isVerified: boolean;
}
