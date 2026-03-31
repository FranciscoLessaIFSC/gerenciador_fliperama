"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Container,
  Select,
  Stack,
  Text,
} from "@mantine/core";
import { DashboardHeader } from "@/app/components/DashboardHeader";
import { ScoresTable } from "@/app/components/ScoresTable";
import { mockPlayers, availableGames, generateGlobalRankings } from "@/app/lib/mockData";

export default function Rankings() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardNumber = searchParams.get("card");
  const [selectedGame, setSelectedGame] = useState<string | null>(
    availableGames[0]
  );
  const rankings = useMemo(() => generateGlobalRankings(), []);

  if (!cardNumber || !mockPlayers[cardNumber]) {
    return (
      <Container size="md" py="xl">
        <Stack gap="lg" align="center" justify="center" className="min-h-screen">
          <Text c="error">Cartão não encontrado</Text>
          <Button onClick={() => router.push("/")} className="arcade-button">
            Voltar para Home
          </Button>
        </Stack>
      </Container>
    );
  }

  const handleLogout = () => {
    router.push("/");
  };

  const selectedScores = selectedGame ? (rankings[selectedGame] || []) : [];

  return (
    <div className="min-h-screen arcade-home">
      <DashboardHeader onLogout={handleLogout} />

      <Container size="lg" py="xl">
        <Stack gap="xl">
          <div>
            <Text size="sm" c="dimmed" mb="md">
              Seleção de Jogo
            </Text>
            <Select
              label="Escolha um jogo"
              placeholder="Selecione o jogo"
              data={availableGames}
              value={selectedGame}
              onChange={setSelectedGame}
              radius="lg"
              searchable
              classNames={{
                input: "arcade-input-select",
              }}
            />
          </div>

          {selectedGame && (
            <ScoresTable
              scores={selectedScores}
              title={`Top Scores - ${selectedGame}`}
            />
          )}
        </Stack>
      </Container>
    </div>
  );
}
