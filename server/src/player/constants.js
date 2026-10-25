// Valores gravados no banco. Os nomes e as siglas em cada idioma ficam no front.
// Mudou aqui? Ajuste também os CHECK da tabela player_attributes numa migration nova.

export const PreferredFoot = {
  RIGHT: 'right',
  LEFT: 'left',
  BOTH: 'both',
};

export const PlayerPosition = {
  GOALKEEPER: 'goalkeeper',
  CENTER_BACK: 'center_back',
  LEFT_BACK: 'left_back',
  RIGHT_BACK: 'right_back',
  DEFENSIVE_MIDFIELDER: 'defensive_midfielder',
  MIDFIELDER: 'midfielder',
  RIGHT_MIDFIELDER: 'right_midfielder',
  LEFT_MIDFIELDER: 'left_midfielder',
  WINGER: 'winger',
  RIGHT_WINGER: 'right_winger',
  LEFT_WINGER: 'left_winger',
  STRIKER: 'striker',
  SECOND_STRIKER: 'second_striker',
};

export const PlayerCategory = {
  U7: 'u7',
  U9: 'u9',
  U11: 'u11',
  U13: 'u13',
  U15: 'u15',
  U17: 'u17',
  U20: 'u20',
  U23: 'u23',
};
