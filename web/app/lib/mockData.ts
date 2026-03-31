export type Player = {
  id: string;
  cardNumber: string;
  name: string;
  credits: number;
  points: number;
};

export type Score = {
  id: string;
  gameTitle: string;
  score: number;
  date: string;
  machineId: string;
};

export const mockPlayers: Record<string, Player> = {
  "1234567890123456": {
    id: "player_001",
    cardNumber: "1234567890123456",
    name: "João Silva",
    credits: 45,
    points: 2850,
  },
  "9876543210987654": {
    id: "player_002",
    cardNumber: "9876543210987654",
    name: "Maria Santos",
    credits: 72,
    points: 5120,
  },
};

export const mockScores: Record<string, Score[]> = {
  player_001: [
    {
      id: "score_001",
      gameTitle: "Pac-Man",
      score: 450,
      date: "2024-03-31 14:32:00",
      machineId: "machine_01",
    },
    {
      id: "score_002",
      gameTitle: "Space Invaders",
      score: 280,
      date: "2024-03-31 13:15:00",
      machineId: "machine_02",
    },
    {
      id: "score_003",
      gameTitle: "Galaga",
      score: 890,
      date: "2024-03-30 18:45:00",
      machineId: "machine_03",
    },
    {
      id: "score_004",
      gameTitle: "Donkey Kong",
      score: 312,
      date: "2024-03-30 16:22:00",
      machineId: "machine_01",
    },
    {
      id: "score_005",
      gameTitle: "Centipede",
      score: 555,
      date: "2024-03-29 20:10:00",
      machineId: "machine_04",
    },
  ],
  player_002: [
    {
      id: "score_006",
      gameTitle: "Street Fighter II",
      score: 750,
      date: "2024-03-31 15:45:00",
      machineId: "machine_05",
    },
    {
      id: "score_007",
      gameTitle: "Mortal Kombat",
      score: 620,
      date: "2024-03-31 14:20:00",
      machineId: "machine_06",
    },
    {
      id: "score_008",
      gameTitle: "Pac-Man",
      score: 1200,
      date: "2024-03-30 19:30:00",
      machineId: "machine_01",
    },
  ],
};

// Ranking global agregado por jogo (top scores de todos os players)
export const generateGlobalRankings = () => {
  const rankings: Record<string, Score[]> = {};

  // Agrupa todos os scores por jogo
  Object.values(mockScores).forEach((playerScores) => {
    playerScores.forEach((score) => {
      if (!rankings[score.gameTitle]) {
        rankings[score.gameTitle] = [];
      }
      rankings[score.gameTitle].push(score);
    });
  });

  // Adiciona scores adicionais para criar um ranking mais interessante
  const additionalScores: Score[] = [
    {
      id: "score_009",
      gameTitle: "Pac-Man",
      score: 2150,
      date: "2024-03-31 10:00:00",
      machineId: "machine_01",
    },
    {
      id: "score_010",
      gameTitle: "Pac-Man",
      score: 1850,
      date: "2024-03-31 12:30:00",
      machineId: "machine_01",
    },
    {
      id: "score_011",
      gameTitle: "Galaga",
      score: 1500,
      date: "2024-03-31 11:00:00",
      machineId: "machine_03",
    },
    {
      id: "score_012",
      gameTitle: "Space Invaders",
      score: 950,
      date: "2024-03-31 09:45:00",
      machineId: "machine_02",
    },
  ];

  additionalScores.forEach((score) => {
    if (!rankings[score.gameTitle]) {
      rankings[score.gameTitle] = [];
    }
    rankings[score.gameTitle].push(score);
  });

  // Ordena cada jogo por score (descending)
  Object.keys(rankings).forEach((game) => {
    rankings[game].sort((a, b) => b.score - a.score);
  });

  return rankings;
};

export const availableGames = [
  "Pac-Man",
  "Space Invaders",
  "Galaga",
  "Donkey Kong",
  "Centipede",
  "Street Fighter II",
  "Mortal Kombat",
];
