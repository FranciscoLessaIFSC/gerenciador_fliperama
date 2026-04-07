"use client";

import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Container,
  Grid,
  Group,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import {
  mockAdminActivities,
  mockAdminOverview,
  mockRevenueByGame,
} from "@/app/lib/adminMockData";

export default function AdminPage() {
  const router = useRouter();

  const adminRoutes = [
    {
      label: "Financial Report",
      path: "/admin/financial-report",
      description: "RF-06: Sales reports with chips, drinks, and revenue",
    },
    {
      label: "Machine Revenue",
      path: "/admin/machine-revenue",
      description: "RF-06: Revenue breakdown by machine",
    },
    {
      label: "Employees",
      path: "/admin/employees",
      description: "RF-07: Employee management and permissions",
    },
    {
      label: "Payroll",
      path: "/admin/payroll",
      description: "RF-08: Payroll data and banking info",
    },
    {
      label: "Promotions",
      path: "/admin/promotions",
      description: "RF-13: Create and manage promotions",
    },
    {
      label: "Machines Report",
      path: "/admin/machines-report",
      description: "RF-17: Machine operational metrics",
    },
  ];

  return (
    <main className="arcade-home min-h-screen overflow-y-scroll">
      <Container size="lg" py="xl">
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <Title order={2} className="arcade-title">
              Admin Dashboard
            </Title>
            <Button variant="light" onClick={() => router.push("/")}>
              Logout
            </Button>
          </Group>

          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
            {adminRoutes.map((route) => (
              <Card
                key={route.path}
                withBorder
                radius="md"
                p="md"
                style={{ cursor: "pointer" }}
                onClick={() => router.push(route.path)}
              >
                <Stack gap="sm">
                  <Title order={5}>{route.label}</Title>
                  <Text size="sm" c="dimmed">
                    {route.description}
                  </Text>
                  <Button
                    size="sm"
                    variant="light"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(route.path);
                    }}
                  >
                    Access
                  </Button>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder radius="md" p="md">
                <Text size="sm" c="dimmed">
                  Active Machines
                </Text>
                <Text size="xl" fw={700}>
                  {mockAdminOverview.activeMachines}
                </Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder radius="md" p="md">
                <Text size="sm" c="dimmed">
                  Inactive Machines
                </Text>
                <Text size="xl" fw={700}>
                  {mockAdminOverview.inactiveMachines}
                </Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder radius="md" p="md">
                <Text size="sm" c="dimmed">
                  Credits Today
                </Text>
                <Text size="xl" fw={700}>
                  {mockAdminOverview.totalCreditsToday}
                </Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <Card withBorder radius="md" p="md">
                <Text size="sm" c="dimmed">
                  Active Players
                </Text>
                <Text size="xl" fw={700}>
                  {mockAdminOverview.activePlayers}
                </Text>
              </Card>
            </Grid.Col>
          </Grid>

          <Card withBorder radius="md" p="md">
            <Stack gap="sm">
              <Text fw={600}>Revenue by Game</Text>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Game</Table.Th>
                    <Table.Th>Credits</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {mockRevenueByGame.map((item) => (
                    <Table.Tr key={item.gameTitle}>
                      <Table.Td>{item.gameTitle}</Table.Td>
                      <Table.Td>{item.credits}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Stack>
          </Card>

          <Card withBorder radius="md" p="md">
            <Stack gap="xs">
              <Text fw={600}>Recent Activity</Text>
              {mockAdminActivities.map((activity) => (
                <Text key={activity.id} size="sm">
                  {activity.timestamp} — {activity.description}
                </Text>
              ))}
            </Stack>
          </Card>
        </Stack>
      </Container>
    </main>
  );
}
