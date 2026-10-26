import { Language } from '../language';

// Mesmos valores da API (server/src/player/constants.js).

export enum PreferredFoot {
  RIGHT = 'right',
  LEFT = 'left',
  BOTH = 'both',
}

export enum PlayerPosition {
  GOALKEEPER = 'goalkeeper',
  CENTER_BACK = 'center_back',
  LEFT_BACK = 'left_back',
  RIGHT_BACK = 'right_back',
  DEFENSIVE_MIDFIELDER = 'defensive_midfielder',
  MIDFIELDER = 'midfielder',
  RIGHT_MIDFIELDER = 'right_midfielder',
  LEFT_MIDFIELDER = 'left_midfielder',
  WINGER = 'winger',
  RIGHT_WINGER = 'right_winger',
  LEFT_WINGER = 'left_winger',
  STRIKER = 'striker',
  SECOND_STRIKER = 'second_striker',
}

export enum PlayerCategory {
  U7 = 'u7',
  U9 = 'u9',
  U11 = 'u11',
  U13 = 'u13',
  U15 = 'u15',
  U17 = 'u17',
  U20 = 'u20',
  U23 = 'u23',
}

// `short` aparece na pílula do perfil; `full` aparece no balão ao tocar e no select da edição.
interface AttributeValueText {
  short: string;
  full: string;
}

interface AttributeText<T extends string> {
  label: string;
  values: Record<T, AttributeValueText>;
}

export interface PlayerAttributesText {
  title: string;
  empty: string;
  edit: string;
  placeholder: string;
  save: string;
  saving: string;
  // Usados logo depois de escolher o tipo Player.
  onboardingTitle: string;
  onboardingHint: string;
  finish: string;
  skip: string;
  preferredFoot: AttributeText<PreferredFoot>;
  position: AttributeText<PlayerPosition>;
  category: AttributeText<PlayerCategory>;
}

export const PLAYER_ATTRIBUTES_TEXT: Record<Language, PlayerAttributesText> = {
  [Language.PT]: {
    title: 'Atributos',
    empty: 'Sem atributos',
    edit: 'Editar atributos',
    placeholder: 'Selecione',
    save: 'Salvar',
    saving: 'Salvando...',
    onboardingTitle: 'Seus atributos',
    onboardingHint: 'Conte um pouco do seu jogo. Se preferir, dá para preencher depois.',
    finish: 'Concluir',
    skip: 'Pular',
    preferredFoot: {
      label: 'Pé dominante',
      values: {
        [PreferredFoot.RIGHT]: { short: 'Destro', full: 'Destro' },
        [PreferredFoot.LEFT]: { short: 'Canhoto', full: 'Canhoto' },
        [PreferredFoot.BOTH]: { short: 'Ambidestro', full: 'Ambidestro' },
      },
    },
    position: {
      label: 'Posição',
      values: {
        [PlayerPosition.GOALKEEPER]: { short: 'GOL', full: 'Goleiro' },
        [PlayerPosition.CENTER_BACK]: { short: 'ZAG', full: 'Zagueiro' },
        [PlayerPosition.LEFT_BACK]: { short: 'LE', full: 'Lateral esquerdo' },
        [PlayerPosition.RIGHT_BACK]: { short: 'LD', full: 'Lateral direito' },
        [PlayerPosition.DEFENSIVE_MIDFIELDER]: { short: 'VOL', full: 'Volante' },
        [PlayerPosition.MIDFIELDER]: { short: 'MEI', full: 'Meia' },
        [PlayerPosition.RIGHT_MIDFIELDER]: { short: 'MD', full: 'Meia direita' },
        [PlayerPosition.LEFT_MIDFIELDER]: { short: 'ME', full: 'Meia esquerda' },
        [PlayerPosition.WINGER]: { short: 'PON', full: 'Ponta' },
        [PlayerPosition.RIGHT_WINGER]: { short: 'PD', full: 'Ponta direita' },
        [PlayerPosition.LEFT_WINGER]: { short: 'PE', full: 'Ponta esquerda' },
        [PlayerPosition.STRIKER]: { short: 'CA', full: 'Centroavante' },
        [PlayerPosition.SECOND_STRIKER]: { short: 'SA', full: 'Segundo atacante' },
      },
    },
    category: {
      label: 'Categoria',
      values: {
        [PlayerCategory.U7]: { short: 'Sub-7', full: 'Sub-7 (até 7 anos)' },
        [PlayerCategory.U9]: { short: 'Sub-9', full: 'Sub-9 (até 9 anos)' },
        [PlayerCategory.U11]: { short: 'Sub-11', full: 'Sub-11 (até 11 anos)' },
        [PlayerCategory.U13]: { short: 'Sub-13', full: 'Sub-13 (até 13 anos)' },
        [PlayerCategory.U15]: { short: 'Sub-15', full: 'Sub-15 (até 15 anos)' },
        [PlayerCategory.U17]: { short: 'Sub-17', full: 'Sub-17 (até 17 anos)' },
        [PlayerCategory.U20]: { short: 'Sub-20', full: 'Sub-20 (até 20 anos)' },
        [PlayerCategory.U23]: { short: 'Sub-23', full: 'Sub-23 (até 23 anos)' },
      },
    },
  },
  [Language.EN]: {
    title: 'Attributes',
    empty: 'No attributes',
    edit: 'Edit attributes',
    placeholder: 'Select',
    save: 'Save',
    saving: 'Saving...',
    onboardingTitle: 'Your attributes',
    onboardingHint: 'Tell us a bit about your game. You can also fill this in later.',
    finish: 'Finish',
    skip: 'Skip',
    preferredFoot: {
      label: 'Preferred foot',
      values: {
        [PreferredFoot.RIGHT]: { short: 'Right', full: 'Right-footed' },
        [PreferredFoot.LEFT]: { short: 'Left', full: 'Left-footed' },
        [PreferredFoot.BOTH]: { short: 'Both', full: 'Two-footed' },
      },
    },
    position: {
      label: 'Position',
      values: {
        [PlayerPosition.GOALKEEPER]: { short: 'GK', full: 'Goalkeeper' },
        [PlayerPosition.CENTER_BACK]: { short: 'CB', full: 'Centre-back' },
        [PlayerPosition.LEFT_BACK]: { short: 'LB', full: 'Left-back' },
        [PlayerPosition.RIGHT_BACK]: { short: 'RB', full: 'Right-back' },
        [PlayerPosition.DEFENSIVE_MIDFIELDER]: { short: 'DM', full: 'Defensive midfielder' },
        [PlayerPosition.MIDFIELDER]: { short: 'CM', full: 'Midfielder' },
        [PlayerPosition.RIGHT_MIDFIELDER]: { short: 'RM', full: 'Right midfielder' },
        [PlayerPosition.LEFT_MIDFIELDER]: { short: 'LM', full: 'Left midfielder' },
        [PlayerPosition.WINGER]: { short: 'W', full: 'Winger' },
        [PlayerPosition.RIGHT_WINGER]: { short: 'RW', full: 'Right winger' },
        [PlayerPosition.LEFT_WINGER]: { short: 'LW', full: 'Left winger' },
        [PlayerPosition.STRIKER]: { short: 'ST', full: 'Striker' },
        [PlayerPosition.SECOND_STRIKER]: { short: 'SS', full: 'Second striker' },
      },
    },
    category: {
      label: 'Category',
      values: {
        [PlayerCategory.U7]: { short: 'U-7', full: 'Under-7' },
        [PlayerCategory.U9]: { short: 'U-9', full: 'Under-9' },
        [PlayerCategory.U11]: { short: 'U-11', full: 'Under-11' },
        [PlayerCategory.U13]: { short: 'U-13', full: 'Under-13' },
        [PlayerCategory.U15]: { short: 'U-15', full: 'Under-15' },
        [PlayerCategory.U17]: { short: 'U-17', full: 'Under-17' },
        [PlayerCategory.U20]: { short: 'U-20', full: 'Under-20' },
        [PlayerCategory.U23]: { short: 'U-23', full: 'Under-23' },
      },
    },
  },
  [Language.ES]: {
    title: 'Atributos',
    empty: 'Sin atributos',
    edit: 'Editar atributos',
    placeholder: 'Selecciona',
    save: 'Guardar',
    saving: 'Guardando...',
    onboardingTitle: 'Tus atributos',
    onboardingHint: 'Cuéntanos un poco de tu juego. Si prefieres, puedes completarlo después.',
    finish: 'Finalizar',
    skip: 'Omitir',
    preferredFoot: {
      label: 'Pie dominante',
      values: {
        [PreferredFoot.RIGHT]: { short: 'Diestro', full: 'Diestro' },
        [PreferredFoot.LEFT]: { short: 'Zurdo', full: 'Zurdo' },
        [PreferredFoot.BOTH]: { short: 'Ambidiestro', full: 'Ambidiestro' },
      },
    },
    position: {
      label: 'Posición',
      values: {
        [PlayerPosition.GOALKEEPER]: { short: 'POR', full: 'Portero' },
        [PlayerPosition.CENTER_BACK]: { short: 'DFC', full: 'Defensa central' },
        [PlayerPosition.LEFT_BACK]: { short: 'LI', full: 'Lateral izquierdo' },
        [PlayerPosition.RIGHT_BACK]: { short: 'LD', full: 'Lateral derecho' },
        [PlayerPosition.DEFENSIVE_MIDFIELDER]: { short: 'MCD', full: 'Mediocentro defensivo' },
        [PlayerPosition.MIDFIELDER]: { short: 'MC', full: 'Mediocentro' },
        [PlayerPosition.RIGHT_MIDFIELDER]: { short: 'MD', full: 'Medio derecho' },
        [PlayerPosition.LEFT_MIDFIELDER]: { short: 'MI', full: 'Medio izquierdo' },
        [PlayerPosition.WINGER]: { short: 'EXT', full: 'Extremo' },
        [PlayerPosition.RIGHT_WINGER]: { short: 'ED', full: 'Extremo derecho' },
        [PlayerPosition.LEFT_WINGER]: { short: 'EI', full: 'Extremo izquierdo' },
        [PlayerPosition.STRIKER]: { short: 'DC', full: 'Delantero centro' },
        [PlayerPosition.SECOND_STRIKER]: { short: 'SD', full: 'Segundo delantero' },
      },
    },
    category: {
      label: 'Categoría',
      values: {
        [PlayerCategory.U7]: { short: 'Sub-7', full: 'Sub-7 (hasta 7 años)' },
        [PlayerCategory.U9]: { short: 'Sub-9', full: 'Sub-9 (hasta 9 años)' },
        [PlayerCategory.U11]: { short: 'Sub-11', full: 'Sub-11 (hasta 11 años)' },
        [PlayerCategory.U13]: { short: 'Sub-13', full: 'Sub-13 (hasta 13 años)' },
        [PlayerCategory.U15]: { short: 'Sub-15', full: 'Sub-15 (hasta 15 años)' },
        [PlayerCategory.U17]: { short: 'Sub-17', full: 'Sub-17 (hasta 17 años)' },
        [PlayerCategory.U20]: { short: 'Sub-20', full: 'Sub-20 (hasta 20 años)' },
        [PlayerCategory.U23]: { short: 'Sub-23', full: 'Sub-23 (hasta 23 años)' },
      },
    },
  },
};
