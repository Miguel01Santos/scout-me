import { PolicySection } from './type';

export const POLICY_UPDATED_AT = '3 de outubro de 2026';

export const POLICY_INTRO =
  'Esta política explica, de forma simples, quais dados o ScoutMe PRO guarda e como eles são usados. O ScoutMe PRO é um projeto pessoal.';

export const POLICY_SECTIONS: PolicySection[] = [
  {
    title: '1. Quais dados guardamos',
    items: [
      'Dados da conta: nome, e-mail e senha. A senha é guardada criptografada (hash), então nem nós conseguimos lê-la.',
      'Dados do perfil: a foto de perfil, se você informar o endereço de uma imagem, e o tipo da sua conta.',
      'Preferências: tema, idioma, notificações e se a sua conta é privada ou pública.',
    ],
  },
  {
    title: '2. O que não coletamos',
    items: [
      'Não usamos ferramentas de análise ou métricas de uso, anúncios nem rastreamento.',
      'Não usamos cookies.',
      'Não pedimos acesso à sua localização, câmera ou contatos.',
      'No momento, o app não envia notificações push.',
    ],
  },
  {
    title: '3. Para que usamos seus dados',
    paragraphs: [
      'Usamos seus dados apenas para criar sua conta, deixar você entrar no app e lembrar das suas preferências. Não usamos para nenhuma outra finalidade.',
    ],
  },
  {
    title: '4. Compartilhamento',
    items: [
      'Não vendemos, alugamos nem compartilhamos seus dados com terceiros.',
      'Seus dados ficam em serviços de hospedagem que usamos só para manter o app no ar (aplicativo, servidor e banco de dados). Eles guardam e processam os dados apenas para esse fim.',
      'Podemos informar dados a uma autoridade se uma ordem judicial exigir.',
    ],
  },
  {
    title: '5. O que fica no seu aparelho',
    paragraphs: [
      'O ScoutMe PRO pode ser instalado como aplicativo (PWA). Por isso, guardamos no seu aparelho: o código de acesso da sua sessão e o tema que você escolheu, no armazenamento local do navegador, e um cache com arquivos do app, ícones e uma página de aviso para quando você estiver sem internet.',
      'Ao sair da conta, a sessão e o tema salvos são removidos. Limpando os dados do navegador ou do aplicativo, você remove todo o resto.',
    ],
  },
  {
    title: '6. Seus direitos',
    paragraphs: [
      'Conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você pode pedir para confirmar se tratamos seus dados, acessar uma cópia deles, corrigi-los ou excluí-los.',
      'Você mesmo pode alterar seu nome em Configurações e privacidade > Conta e sua senha em Configurações e privacidade > Privacidade.',
    ],
  },
  {
    title: '7. Contato',
    paragraphs: [
      'Para dúvidas ou pedidos sobre seus dados, como excluir sua conta, fale com o ScoutMe PRO pelo e-mail [defina o e-mail de contato].',
    ],
  },
  {
    title: '8. Mudanças nesta política',
    paragraphs: [
      'Podemos atualizar esta política. A data no topo mostra a última atualização.',
    ],
  },
];
