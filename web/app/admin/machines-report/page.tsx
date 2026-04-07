"use client";

import {
  Badge,
  Button,
  Card,
  Container,
  Flex,
  Group,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { mockMachinesReport } from "@/app/lib/adminMockData";

export default function MachinesReportPage() {
  const router = useRouter();

  const handleExport = () => {
    const csvContent = [
      [
        "Machine ID",
        "Game",
        "Location",
        "Games Played",
        "Total Play Time (min)",
        "Total Revenue",
        "Uptime %",
        "Last Offline Start",
        "Last Offline End",
      ],
      ...mockMachinesReport.map((item) => [
        item.machineId,
        item.gameName,
        item.location,
        item.gamesPlayed,
        item.totalPlayTime,
        item.totalRevenue.toFixed(2),
        item.uptime.toFixed(2),
        item.lastOfflineStart || "N/A",
        item.lastOfflineEnd || "N/A",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "machines-report.csv";
    a.click();
  };

  const avgUptime =
    mockMachinesReport.reduce((acc, item) => acc + item.uptime, 0) /
    mockMachinesReport.length;
  const totalGamesPlayed = mockMachinesReport.reduce(
    (acc, item) => acc + item.gamesPlayed,
    0
  );
  const totalRevenue = mockMachinesReport.reduce(
    (acc, item) => acc + item.totalRevenue,
    0
  );

  return (
    <main className="arcade-home min-h-screen">
      <Container size="lg" py="xl">
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <Title order={2} className="arcade-title">
              Operational Machines Report
            </Title>
            <Button variant="light" onClick={() => router.push("/admin")}>
              Back
            </Button>
          </Group>

          <Flex gap="md">
            <Card withBorder radius="md" p="md" flex={1}>
              <Text size="sm" c="dimmed">
                Total Games Played
              </Text>
              <Text size="xl" fw={700}>
                {totalGamesPlayed}
              </Text>
            </Card>
            <Card withBorder radius="md" p="md" flex={1}>
              <Text size="sm" c="dimmed">
                Average Uptime
              </Text>
              <Text size="xl" fw={700}>
                {avgUptime.toFixed(2)}%
              </Text>
            </Card>
            <Card withBorder radius="md" p="md" flex={1}>
              <Text size="sm" c="dimmed">
                Total Revenue
              </Text>
              <Text size="xl" fw={700}>
                R$ {totalRevenue.toFixed(2)}
              </Text>
            </Card>
          </Flex>

          <Card withBorder radius="md" p="md">
            <Stack gap="md">
              <Flex justify="space-between" align="center">
                <Text fw={600}>Machine Details</Text>
                <Button size="sm" onClick={handleExport}>
                  Export CSV
                </Button>
              </Flex>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Machine</Table.Th>
                    <Table.Th>Game</Table.Th>
                    <Table.Th>Location</Table.Th>
                    <Table.Th>Games Played</Table.Th>
                    <Table.Th>Play Time (min)</Table.Th>
                    <Table.Th>Revenue</Table.Th>
                    <Table.Th>Uptime</Table.Th>
                    <Table.Th>Offline Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {mockMachinesReport.map((item) => (
                    <Table.Tr key={item.machineId}>
                      <Table.Td>{item.machineId}</Table.Td>
                      <Table.Td>{item.gameName}</Table.Td>
                      <Table.Td>{item.location}</Table.Td>
                      <Table.Td>{item.gamesPlayed}</Table.Td>
                      <Table.Td>{item.totalPlayTime}</Table.Td>
                      <Table.Td>R$ {item.totalRevenue.toFixed(2)}</Table.Td>
                      <Table.Td>
                        <Badge
                          color={item.uptime > 98 ? "green" : "yellow"}
                        >
                          {item.uptime.toFixed(2)}%
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        {item.lastOfflineStart ? (
                          <Text size="xs">
                            {item.lastOfflineStart} → {item.lastOfflineEnd}
                          </Text>
                        ) : (
                          <Badge color="green">Online</Badge>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </main>
  );
}
