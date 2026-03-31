import { Paper, Stack, Table, Text, Title } from "@mantine/core";
import type { Score } from "@/app/lib/mockData";

type ScoresTableProps = {
  scores: Score[];
  title?: string;
};

export function ScoresTable({ scores, title }: ScoresTableProps) {
  return (
    <Paper p="lg" radius="lg" withBorder>
      <Stack gap="md">
        <div>
          <Title order={3}>{title || "Últimas Pontuações"}</Title>
          <Text size="sm" c="dimmed">
            {title ? "Ranking dos melhores jogadores" : "Histórico dos últimos jogos"}
          </Text>
        </div>

        {scores.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            Nenhuma pontuação registrada ainda
          </Text>
        ) : (
          <div className="overflow-x-auto">
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Jogo</Table.Th>
                  <Table.Th ta="right">Pontuação</Table.Th>
                  <Table.Th>Data/Hora</Table.Th>
                  <Table.Th>Máquina</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {scores.map((score) => (
                  <Table.Tr key={score.id}>
                    <Table.Td className="font-medium">{score.gameTitle}</Table.Td>
                    <Table.Td ta="right">
                      <Text c="arcade" fw={700}>
                        {score.score.toLocaleString()}
                      </Text>
                    </Table.Td>
                    <Table.Td>{score.date}</Table.Td>
                    <Table.Td className="text-sm">
                      <Text c="dimmed">{score.machineId}</Text>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        )}
      </Stack>
    </Paper>
  );
}
