"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Container,
  Flex,
  Group,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { mockMachineRevenue } from "@/app/lib/adminMockData";

export default function MachineRevenueReportPage() {
  const router = useRouter();
  const [startDate, setStartDate] = useState("2026-03-20");
  const [endDate, setEndDate] = useState("2026-04-07");

  const totalChipsRevenue = mockMachineRevenue.reduce(
    (acc, item) => acc + item.chipsRevenue,
    0
  );
  const totalDrinksRevenue = mockMachineRevenue.reduce(
    (acc, item) => acc + item.drinksRevenue,
    0
  );
  const totalRevenue = mockMachineRevenue.reduce(
    (acc, item) => acc + item.totalRevenue,
    0
  );

  const handleExport = () => {
    const csvContent = [
      [
        "Machine ID",
        "Game Name",
        "Location",
        "Chips Revenue",
        "Drinks Revenue",
        "Total Revenue",
        "Last Maintenance",
      ],
      ...mockMachineRevenue.map((item) => [
        item.machineId,
        item.gameName,
        item.location,
        item.chipsRevenue.toFixed(2),
        item.drinksRevenue.toFixed(2),
        item.totalRevenue.toFixed(2),
        item.lastMaintenance,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `machine-revenue-${startDate}-to-${endDate}.csv`;
    a.click();
  };

  return (
    <main className="arcade-home min-h-screen">
      <Container size="lg" py="xl">
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <Title order={2} className="arcade-title">
              Machine Revenue Report
            </Title>
            <Button variant="light" onClick={() => router.push("/admin")}>
              Back
            </Button>
          </Group>

          <Card withBorder radius="md" p="md">
            <Stack gap="sm">
              <Text fw={600}>Date Filter</Text>
              <Flex gap="md">
                <TextInput
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.currentTarget.value)}
                />
                <TextInput
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.currentTarget.value)}
                />
              </Flex>
            </Stack>
          </Card>

          <Flex gap="md">
            <Card withBorder radius="md" p="md" flex={1}>
              <Text size="sm" c="dimmed">
                Total Chips Revenue
              </Text>
              <Text size="xl" fw={700}>
                R$ {totalChipsRevenue.toFixed(2)}
              </Text>
            </Card>
            <Card withBorder radius="md" p="md" flex={1}>
              <Text size="sm" c="dimmed">
                Total Drinks Revenue
              </Text>
              <Text size="xl" fw={700}>
                R$ {totalDrinksRevenue.toFixed(2)}
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
                    <Table.Th>Machine ID</Table.Th>
                    <Table.Th>Game</Table.Th>
                    <Table.Th>Location</Table.Th>
                    <Table.Th>Chips Revenue</Table.Th>
                    <Table.Th>Drinks Revenue</Table.Th>
                    <Table.Th>Total Revenue</Table.Th>
                    <Table.Th>Last Maintenance</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {mockMachineRevenue.map((item) => (
                    <Table.Tr key={item.machineId}>
                      <Table.Td>{item.machineId}</Table.Td>
                      <Table.Td>{item.gameName}</Table.Td>
                      <Table.Td>{item.location}</Table.Td>
                      <Table.Td>R$ {item.chipsRevenue.toFixed(2)}</Table.Td>
                      <Table.Td>R$ {item.drinksRevenue.toFixed(2)}</Table.Td>
                      <Table.Td>R$ {item.totalRevenue.toFixed(2)}</Table.Td>
                      <Table.Td>{item.lastMaintenance}</Table.Td>
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
