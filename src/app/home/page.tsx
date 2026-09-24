'use client'

import { useState, useMemo } from 'react';
import { INITIAL_TALENTS, INITIAL_USER } from '@/src/core/mocks';
import { PlusIcon, SearchIcon, TargetIcon, } from '@/src/core/icons';
import { Header } from '@/src/core/components/header';
import { NaviBar } from '@/src/core/components/navibar';
import { useSession } from '@/src/core/auth/use-session';
import { AvatarComponent } from '@/src/core/library/avatar';

// ==========================================
// 3. MOTOR ANALÍTICO DO SCOUTME PRO
// ==========================================

export function calculateTacticalFit(players: any, blueprint: any) {
  return players
    .map((player: any) => {
      if (!player.atributos) return { ...player, aderenciaTatica: 0 };

      const scoreFit = player.atributos.reduce((acc: any, attr: any) => {
        let key = attr.subject.toLowerCase();
        if (key.includes('técnica') || key.includes('tecnica')) key = 'tecnica';
        if (key.includes('tática') || key.includes('tatica')) key = 'tatica';
        if (key.includes('físico') || key.includes('fisico')) key = 'fisico';
        if (key.includes('criatividade')) key = 'criatividade';
        if (key.includes('evolução') || key.includes('evolucao'))
          key = 'evolucao';

        const weight = blueprint[key] !== undefined ? blueprint[key] : 0.2;
        return acc + attr.A * weight;
      }, 0);

      return {
        ...player,
        aderenciaTatica: Number(scoreFit.toFixed(2)),
      };
    })
    .sort((a: any, b: any) => b.aderenciaTatica - a.aderenciaTatica);
}

function generateComparisonDelta(playerA: any, playerB: any) {
  if (!playerA || !playerB) return null;
  const attrsA = playerA.atributos || [];
  const attrsB = playerB.atributos || [];

  const attributeDelta = attrsA.map((attrA: any) => {
    const attrB = attrsB.find(
      (b: any) => b.subject.toLowerCase() === attrA.subject.toLowerCase()
    ) || { A: 0 };

    const diff = Number((attrA.A - attrB.A).toFixed(1));

    return {
      fundamento: attrA.subject,
      valorA: attrA.A,
      valorB: attrB.A,
      deltaAbsoluto: diff,
      vantagem: diff > 0 ? playerA.nome : diff < 0 ? playerB.nome : 'Empate',
    };
  });

  return {
    atletaA: playerA.nome,
    atletaB: playerB.nome,
    scoreGap: Number(
      ((playerA.scoreAtual || 0) - (playerB.scoreAtual || 0)).toFixed(2)
    ),
    detalhamentoAtributos: attributeDelta,
  };
}

function analyzeTagEfficiencyRatio(player: any) {
  const tags = player?.videoTags || [];
  if (tags.length === 0) {
    return {
      nome: player?.nome || '',
      totalLancesAnalisados: 0,
      taxaEficienciaPct: 0,
    };
  }

  let acertos = 0;
  let desenvolvimento = 0;

  tags.forEach((tag: any) => {
    const tagStr =
      typeof tag === 'string'
        ? tag.toLowerCase()
        : `${tag.type || ''} ${tag.description || ''}`.toLowerCase();

    if (
      tagStr.includes('aprimorar') ||
      tagStr.includes('falha') ||
      tagStr.includes('precipitação') ||
      tagStr.includes('erro')
    ) {
      desenvolvimento++;
    } else {
      acertos++;
    }
  });

  const total = acertos + desenvolvimento || 1;
  return {
    nome: player.nome,
    totalLancesAnalisados: tags.length,
    taxaEficienciaPct: Number(((acertos / total) * 100).toFixed(1)),
  };
}

function calculateGrowthVelocity(player: any) {
  const hist = player?.evolucao;
  if (!hist || hist.length < 2) {
    return { velocidadeEvolucao: 0, diagnosticoTendencia: 'Estável' };
  }

  const primeiroScore = hist[0].score;
  const ultimoScore = hist[hist.length - 1].score;
  const periodos = hist.length - 1;
  const velocity = Number(
    ((ultimoScore - primeiroScore) / periodos).toFixed(3)
  );

  let status = 'Constante';
  if (velocity > 0.3) status = 'Evolução Acelerada 🚀';
  else if (velocity < 0) status = 'Regressão / Alerta ⚠️';

  return { velocidadeEvolucao: velocity, diagnosticoTendencia: status };
}

function multiCriteriaScoutingRank(
  playersList: any,
  weights = { score: 0.4, solidez: 0.2, eficiencia: 0.2, potencial: 0.2 }
) {
  return playersList
    .map((player: any) => {
      const tagAnalysis = analyzeTagEfficiencyRatio(player);
      const normalizedScore = player.scoreAtual || 0;
      const normalizedSolidez = (player.solidezPct || 0) / 10;
      const normalizedEficiencia = tagAnalysis.taxaEficienciaPct / 10;
      const bonusIdade = (player.idade || 17) <= 16 ? 10 : 8;

      const indiceFinal =
        normalizedScore * weights.score +
        normalizedSolidez * weights.solidez +
        normalizedEficiencia * weights.eficiencia +
        bonusIdade * weights.potencial;

      return {
        id: player.id,
        nome: player.nome,
        posicao: player.posicao,
        indiceScoutingPro: Number(indiceFinal.toFixed(2)),
      };
    })
    .sort((a: any, b: any) => b.indiceScoutingPro - a.indiceScoutingPro);
}

// ==========================================
// 4. SUBCOMPONENTES DE INTERFACE
// ==========================================

function TacticalBlueprintTab({ talents, themeClasses, onSelectTalent }: any) {
  const [blueprint, setBlueprint] = useState<Record<string, number>>({
    tecnica: 0.3,
    tatica: 0.3,
    fisico: 0.2,
    criatividade: 0.1,
    evolucao: 0.1,
  });

  const rankedPlayers = useMemo(
    () => calculateTacticalFit(talents, blueprint),
    [talents, blueprint]
  );

  return (
    <div className="space-y-4">
      <div className={`p-4 border rounded-2xl ${themeClasses.card}`}>
        <h3 className="text-xs font-bold mb-1 flex items-center text-indigo-500">
          <TargetIcon /> <span className="ml-1.5">Blueprint de Perfil Ideal</span>
        </h3>
        <p className={`text-[11px] ${themeClasses.subText} mb-3`}>
          Ajuste os pesos dos atributos para ranquear a aderência dos atletas ao
          esquema do time.
        </p>

        <div className="space-y-2 text-xs">
          {Object.keys(blueprint).map((key) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between font-semibold capitalize">
                <span>{key}</span>
                <span className="text-amber-500 font-mono font-bold">
                  {(blueprint[key] * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={blueprint[key]}
                onChange={(e) =>
                  setBlueprint((prev) => ({
                    ...prev,
                    [key]: Number(e.target.value),
                  }))
                }
                className="w-full accent-indigo-500"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {rankedPlayers.map((player: any, index: number) => (
          <div
            key={player.id}
            onClick={() => onSelectTalent(player.id)}
            className={`border rounded-2xl p-3.5 cursor-pointer transition flex items-center justify-between ${themeClasses.card} ${themeClasses.cardHover}`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 font-black text-xs flex items-center justify-center border border-indigo-500/30">
                #{index + 1}
              </div>
              <div>
                <h4 className="font-bold text-xs">{player.nome}</h4>
                <p className={`text-[11px] ${themeClasses.subText}`}>
                  {player.posicao} • {player.categoria}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-emerald-500 font-mono block leading-tight">
                {player.aderenciaTatica} pts
              </span>
              <span className="text-[9px] font-bold text-slate-400 block">
                Score: {Number(player.scoreAtual || 0).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeadToHeadTab({ talents, themeClasses }: any) {
  const [playerAId, setPlayerAId] = useState(talents[0]?.id || '');
  const [playerBId, setPlayerBId] = useState(
    talents[1]?.id || talents[0]?.id || ''
  );

  const playerA = talents.find((t: any) => t.id === playerAId);
  const playerB = talents.find((t: any) => t.id === playerBId);
  const delta = useMemo(
    () => generateComparisonDelta(playerA, playerB),
    [playerA, playerB]
  );

  return (
    <div className="space-y-4 text-xs">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label
            className={`block text-[10px] uppercase font-bold mb-1 ${themeClasses.subText}`}
          >
            Atleta A
          </label>
          <select
            value={playerAId}
            onChange={(e) => setPlayerAId(e.target.value)}
            className={`w-full p-2 border rounded-xl font-bold ${themeClasses.card}`}
          >
            {talents.map((t: any) => (
              <option key={t.id} value={t.id}>
                {t.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            className={`block text-[10px] uppercase font-bold mb-1 ${themeClasses.subText}`}
          >
            Atleta B
          </label>
          <select
            value={playerBId}
            onChange={(e) => setPlayerBId(e.target.value)}
            className={`w-full p-2 border rounded-xl font-bold ${themeClasses.card}`}
          >
            {talents.map((t: any) => (
              <option key={t.id} value={t.id}>
                {t.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      {delta && (
        <div
          className={`p-4 border rounded-2xl space-y-3 ${themeClasses.card}`}
        >
          <div className="flex justify-between items-center pb-2 border-b border-slate-700/30">
            <span className="font-bold">{delta.atletaA}</span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold">
              Gap: {delta.scoreGap > 0 ? `+${delta.scoreGap}` : delta.scoreGap}{' '}
              pts
            </span>
            <span className="font-bold">{delta.atletaB}</span>
          </div>

          <div className="space-y-2">
            {delta.detalhamentoAtributos.map((item: any, idx: number) => (
              <div
                key={idx}
                className="flex justify-between items-center text-[11px]"
              >
                <span className="w-1/3 font-semibold">{item.fundamento}</span>
                <span className="w-1/6 text-center font-mono font-bold text-indigo-400">
                  {item.valorA}
                </span>
                <span
                  className={`w-1/3 text-center text-[10px] font-bold px-1 py-0.5 rounded ${
                    item.deltaAbsoluto > 0
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : item.deltaAbsoluto < 0
                      ? 'bg-rose-500/10 text-rose-500'
                      : 'bg-slate-500/10 text-slate-400'
                  }`}
                >
                  {item.vantagem} (
                  {item.deltaAbsoluto > 0
                    ? `+${item.deltaAbsoluto}`
                    : item.deltaAbsoluto}
                  )
                </span>
                <span className="w-1/6 text-center font-mono font-bold text-purple-400">
                  {item.valorB}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function McdmRankTab({ talents, themeClasses }: any) {
  const mcdmRank = useMemo(() => multiCriteriaScoutingRank(talents), [talents]);

  return (
    <div className="space-y-2">
      <p className={`text-[11px] ${themeClasses.subText} mb-2`}>
        Ranking Multicritério (Score, Solidez, Eficiência de Tags e Bônus de
        Idade).
      </p>
      {mcdmRank.map((player: any, idx: number) => {
        const fullPlayer = talents.find((t: any) => t.id === player.id);
        const growth = calculateGrowthVelocity(fullPlayer);
        const tagEff = analyzeTagEfficiencyRatio(fullPlayer);

        return (
          <div
            key={player.id}
            className={`p-3.5 border rounded-2xl flex justify-between items-center ${themeClasses.card}`}
          >
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-xs text-amber-500">
                  #{idx + 1}
                </span>
                <h4 className="font-bold text-xs">{player.nome}</h4>
              </div>
              <p className={`text-[10px] ${themeClasses.subText} mt-0.5`}>
                Tendência:{' '}
                <span className="font-semibold text-indigo-400">
                  {growth.diagnosticoTendencia}
                </span>
              </p>
              <p className={`text-[10px] ${themeClasses.subText}`}>
                Eficiência In-Video:{' '}
                <span className="font-semibold text-emerald-400">
                  {tagEff.taxaEficienciaPct}%
                </span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-base font-black text-indigo-400 font-mono block">
                {player.indiceScoutingPro}
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-400">
                Índice MCDM
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ==========================================
// 5. COMPONENTE PRINCIPAL (APP)
// ==========================================
export default function App() {
  const [talents, setTalents] = useState(INITIAL_TALENTS);
  const { user, logout } = useSession();
  const currentUser = { ...INITIAL_USER, nome: user?.name ?? '' };
  const [currentScreen, setCurrentScreen] = useState('ranking'); // 'ranking', 'comparar', 'detalhe'
  const [activeTab, setActiveTab] = useState('fit'); // 'fit', 'h2h', 'mcdm'
  const [selectedTalentId, setSelectedTalentId] = useState(
    INITIAL_TALENTS[0].id
  );
  const [darkMode, setDarkMode] = useState(true);

  // Filtros de Busca
  const [filterPosicao, setFilterPosicao] = useState('Todas');
  const [filterPe, setFilterPe] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedTalent =
    talents.find((t) => t.id === selectedTalentId) || talents[0];

  const themeClasses = {
    bg: darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900',
    card: darkMode
      ? 'bg-slate-900/90 border-slate-800'
      : 'bg-white border-slate-200 shadow-sm',
    cardHover: darkMode ? 'hover:border-slate-700' : 'hover:border-slate-300',
    subText: darkMode ? 'text-slate-400' : 'text-slate-500',
  };

  // Recálculo seguro com Média Ponderada
  const handleAddEvaluation = (talentId: any, ratingsMap: any, newTagsList: any) => {
    setTalents((prevTalents: any) => {
      return prevTalents.map((t: any) => {
        if (t.id !== talentId) return t;

        const ratingValues = Object.values(ratingsMap) as number[];
        const avgRating =
          ratingValues.reduce((a: number, b: number) => a + b, 0) / ratingValues.length;
        const currentWeight = currentUser.isVerified ? currentUser.peso : 1;

        const oldMedia = t.mediaAvaliacoes || t.scoreAtual;
        const oldCount = t.avaliacoesCount;

        // FÓRMULA PONDERADA
        const newMedia = Number(
          (
            (oldMedia * oldCount + avgRating * currentWeight) /
            (oldCount + currentWeight)
          ).toFixed(2)
        );

        let newClassificacao = 'Comum';
        if (newMedia >= 8.5) newClassificacao = 'Promissor';
        else if (newMedia >= 7.0) newClassificacao = 'Com Potencial';

        return {
          ...t,
          mediaAvaliacoes: newMedia,
          classificacao: newClassificacao,
          avaliacoesCount: t.avaliacoesCount + 1,
          evolucao: [
            ...t.evolucao,
            { video: `Aval. ${t.evolucao.length + 1}`, score: newMedia },
          ],
          videoTags: Array.from(new Set([...t.videoTags, ...newTagsList])),
        };
      });
    });

    alert('Avaliação registrada e score recalculado!');
    setCurrentScreen('detalhe');
  };

  // Filtragem dos Atletas
  const filteredTalents = useMemo(() => {
    return talents.filter((t) => {
      const matchPos = filterPosicao === 'Todas' || t.posicao === filterPosicao;
      const matchPe = filterPe === 'Todos' || t.peDominante === filterPe;
      const matchSearch =
        t.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.posicao.toLowerCase().includes(searchQuery.toLowerCase());
      return matchPos && matchPe && matchSearch;
    });
  }, [talents, filterPosicao, filterPe, searchQuery]);

  if (!user) return null;

  return (
    <div
    className={`min-h-screen ${themeClasses.bg} font-sans pb-12 transition-colors duration-200`}
    >
      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        <AvatarComponent name={"Miguel Proveza"} />
        <Header
          user={currentUser}
          theme={themeClasses}
          modeTheme={darkMode}
          onChange={setDarkMode}
          onLogout={logout}
        />

        <NaviBar screen={currentScreen} setCurrentScreen={setCurrentScreen} />

        {/* TELA 1: LISTA / RANKING DE ATLETAS */}
        {currentScreen === 'ranking' && (
          <div className="space-y-3">
            {/* BUSCA E FILTROS */}
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar atleta, posição..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full p-2.5 pl-8 text-xs border rounded-xl outline-none ${themeClasses.card}`}
                />
                <span className="absolute left-2.5 top-2.5 text-xs text-slate-400">
                  <SearchIcon />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <select
                  value={filterPosicao}
                  onChange={(e) => setFilterPosicao(e.target.value)}
                  className={`p-2 border rounded-xl font-semibold ${themeClasses.card}`}
                >
                  <option value="Todas">Posição: Todas</option>
                  <option value="Atacante">Atacante</option>
                  <option value="Meia">Meia</option>
                  <option value="Zagueiro">Zagueiro</option>
                </select>

                <select
                  value={filterPe}
                  onChange={(e) => setFilterPe(e.target.value)}
                  className={`p-2 border rounded-xl font-semibold ${themeClasses.card}`}
                >
                  <option value="Todos">Pé: Todos</option>
                  <option value="Canhoto">Canhoto 🦶</option>
                  <option value="Destro">Destro 🦶</option>
                  <option value="Ambidestro">Ambidestro 🦶</option>
                </select>
              </div>
            </div>

            {/* LISTAGEM DOS CARDS */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-[11px] px-1">
                <span className={`font-bold ${themeClasses.subText}`}>
                  Atletas Ranqueados ({filteredTalents.length})
                </span>
                <span className={themeClasses.subText}>
                  Média das Avaliações
                </span>
              </div>

              {filteredTalents.map((talento) => (
                <div
                  key={talento.id}
                  onClick={() => {
                    setSelectedTalentId(talento.id);
                    setCurrentScreen('detalhe');
                  }}
                  className={`border rounded-2xl p-3.5 cursor-pointer transition flex items-center justify-between ${themeClasses.card} ${themeClasses.cardHover}`}
                >
                  <div>
                    <h3 className="font-bold text-xs flex items-center space-x-1">
                      <span>{talento.nome}</span>
                      <span className="text-[10px] text-emerald-500 font-normal">
                        ✓ Verificado
                      </span>
                    </h3>
                    <p className={`text-[11px] ${themeClasses.subText} mt-0.5`}>
                      {talento.posicao} • {talento.categoria} •{' '}
                      {talento.peDominante}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-[9px] text-slate-400 uppercase font-bold">
                      Score: {Number(talento.scoreAtual || 0).toFixed(2)}
                    </div>
                    <span className="text-lg font-black text-amber-500 font-mono block leading-tight">
                      {Number(
                        talento.mediaAvaliacoes || talento.scoreAtual || 0
                      ).toFixed(2)}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full border bg-emerald-500/10 text-emerald-500 border-emerald-500/20 inline-block mt-0.5">
                      {talento.classificacao}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TELA 2: CENTRAL DE COMPARAÇÃO ANALÍTICA */}
        {currentScreen === 'comparar' && (
          <div className="space-y-4">
            {/* SUB-ABAS DE ANÁLISE */}
            <div className="flex border-b border-slate-700/40 text-xs">
              <button
                onClick={() => setActiveTab('fit')}
                className={`py-2 px-3 font-bold border-b-2 transition ${
                  activeTab === 'fit'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400'
                }`}
              >
                Blueprint Tático
              </button>
              <button
                onClick={() => setActiveTab('h2h')}
                className={`py-2 px-3 font-bold border-b-2 transition ${
                  activeTab === 'h2h'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400'
                }`}
              >
                Head-to-Head
              </button>
              <button
                onClick={() => setActiveTab('mcdm')}
                className={`py-2 px-3 font-bold border-b-2 transition ${
                  activeTab === 'mcdm'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400'
                }`}
              >
                Rank MCDM
              </button>
            </div>

            {activeTab === 'fit' && (
              <TacticalBlueprintTab
                talents={talents}
                themeClasses={themeClasses}
                onSelectTalent={(id: any) => {
                  setSelectedTalentId(id);
                  setCurrentScreen('detalhe');
                }}
              />
            )}

            {activeTab === 'h2h' && (
              <HeadToHeadTab talents={talents} themeClasses={themeClasses} />
            )}

            {activeTab === 'mcdm' && (
              <McdmRankTab talents={talents} themeClasses={themeClasses} />
            )}
          </div>
        )}

        {/* TELA 3: DETALHES DO ATLETA */}
        {currentScreen === 'detalhe' && selectedTalent && (
          <div className="space-y-4">
            <button
              onClick={() => setCurrentScreen('ranking')}
              className={`text-xs font-bold text-indigo-400 flex items-center space-x-1`}
            >
              ← Voltar para a lista
            </button>

            <div
              className={`p-4 border rounded-2xl space-y-3 ${themeClasses.card}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-base font-black">
                    {selectedTalent.nome}
                  </h2>
                  <p className={`text-xs ${themeClasses.subText}`}>
                    {selectedTalent.posicao} • {selectedTalent.categoria} •{' '}
                    {selectedTalent.clube}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-amber-500 font-mono">
                    {Number(
                      selectedTalent.mediaAvaliacoes ||
                        selectedTalent.scoreAtual ||
                        0
                    ).toFixed(2)}
                  </span>
                  <span className="text-[10px] block text-slate-400 font-bold uppercase">
                    Média das Avaliações
                  </span>
                </div>
              </div>

              {/* ATRIBUTOS TÉCNICOS */}
              <div className="space-y-1.5 pt-2 border-t border-slate-700/30">
                <h4 className="text-xs font-bold text-indigo-400">
                  Atributos Rápidos
                </h4>
                {selectedTalent.atributos?.map((attr, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center text-xs"
                  >
                    <span className={themeClasses.subText}>{attr.subject}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-slate-700/30 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full"
                          style={{ width: `${attr.A}%` }}
                        ></div>
                      </div>
                      <span className="font-mono font-bold w-6 text-right">
                        {attr.A}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* BOTÃO AVALIAR */}
              <button
                onClick={() => {
                  handleAddEvaluation(
                    selectedTalent.id,
                    {
                      tecnica: 8,
                      tatica: 9,
                      fisico: 8,
                      criatividade: 9,
                      evolucao: 8,
                    },
                    ['Drible Curto', 'Passe Curto']
                  );
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition mt-2 flex items-center justify-center space-x-1"
              >
                <PlusIcon />{' '}
                <span>
                  Registrar Avaliação (Peso Olheiro: {currentUser.peso})
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
