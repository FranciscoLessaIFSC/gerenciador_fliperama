"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button, Container, Stack, Text } from "@mantine/core";
import { DashboardHeader } from "@/app/components/DashboardHeader";
import { CreditCard } from "@/app/components/CreditCard";
import { ScoresTable } from "@/app/components/ScoresTable";
import { mockPlayers, mockScores } from "@/app/lib/mockData";

export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardNumber = searchParams.get("card");

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

  const player = mockPlayers[cardNumber];
  const scores = mockScores[player.id] || [];

  const handleAddCredits = () => {
    // TODO: Implementar fluxo de adição de créditos
    console.log("Adicionar créditos para:", player.id);
  };

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen arcade-home">
      <DashboardHeader onLogout={handleLogout} />

      <Container size="lg" py="xl">
        <Stack gap="xl">
          <CreditCard
            credits={player.credits}
            points={player.points}
            playerName={player.name}
            onAddCredits={handleAddCredits}
          />

          <ScoresTable scores={scores} />
        </Stack>
      </Container>
    </div>
  );
}
