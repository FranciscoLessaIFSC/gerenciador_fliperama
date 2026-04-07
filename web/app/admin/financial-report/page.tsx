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
import { mockFinancialReport } from "@/app/lib/adminMockData";

export default function FinancialReportPage() {
  const router = useRouter();
  const [startDate, setStartDate] = useState("2026-04-03");
  const [endDate, setEndDate] = useState("2026-04-07");

  const filteredData = mockFinancialReport.filter((item) => {
    return item.date >= startDate && item.date <= endDate;
  });

  const totalChips = filteredData.reduce((acc, item) => acc + item.chipsSold, 0);
  const totalDrinks = filteredData.reduce(
    (acc, item) => acc + item.drinksSold,
    0
  );
  const totalRevenue = filteredData.reduce(
    (acc, item) => acc + item.totalRevenue,
    0
  );

  const handleExport = () => {
    const csvContent = [
      ["Date", "Chips Sold", "Drinks Sold", "Total Revenue"],
      ...filteredData.map((item) => [
        item.date,
        item.chipsSold,
        item.drinksSold,
        item.totalRevenue.toFixed(2),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial-report-${startDate}-to-${endDate}.csv`;
    a.click();
  };

  return (
    <main className="arcade-home min-h-screen">
      <Container size="lg" py="xl">
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <Title order={2} className="arcade-title">
              Financial Report - Sales
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
                Total Chips Sold
              </Text>
              <Text size="xl" fw={700}>
                {totalChips}
              </Text>
            </Card>
            <Card withBorder radius="md" p="md" flex={1}>
              <Text size="sm" c="dimmed">
                Total Drinks Sold
              </Text>
              <Text size="xl" fw={700}>
                {totalDrinks}
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
                <Text fw={600}>Sales Details</Text>
                <Button size="sm" onClick={handleExport}>
                  Export CSV
                </Button>
              </Flex>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Chips Sold</Table.Th>
                    <Table.Th>Drinks Sold</Table.Th>
                    <Table.Th>Total Revenue</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {filteredData.map((item) => (
                    <Table.Tr key={item.date}>
                      <Table.Td>{item.date}</Table.Td>
                      <Table.Td>{item.chipsSold}</Table.Td>
                      <Table.Td>{item.drinksSold}</Table.Td>
                      <Table.Td>R$ {item.totalRevenue.toFixed(2)}</Table.Td>
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
