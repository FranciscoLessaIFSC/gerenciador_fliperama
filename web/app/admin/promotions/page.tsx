"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Container,
  Flex,
  Group,
  Modal,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { mockPromotions } from "@/app/lib/adminMockData";

export default function PromotionsPage() {
  const router = useRouter();
  const [promotions, setPromotions] = useState(mockPromotions);
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<string | null>(null);

  const handleViewDetails = (promoId: string) => {
    setSelectedPromo(promoId);
    setModalOpened(true);
  };

  const selectedPromoData = promotions.find((p) => p.id === selectedPromo);

  const handleToggleActive = (promoId: string) => {
    setPromotions(
      promotions.map((p) =>
        p.id === promoId ? { ...p, isActive: !p.isActive } : p
      )
    );
  };

  return (
    <main className="arcade-home min-h-screen">
      <Container size="lg" py="xl">
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <Title order={2} className="arcade-title">
              Promotions & Packages
            </Title>
            <Button variant="light" onClick={() => router.push("/admin")}>
              Back
            </Button>
          </Group>

          <Modal
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
            title="Promotion Details"
            centered
          >
            {selectedPromoData && (
              <Stack gap="sm">
                <div>
                  <Text fw={600}>Title</Text>
                  <Text>{selectedPromoData.title}</Text>
                </div>
                <div>
                  <Text fw={600}>Description</Text>
                  <Text>{selectedPromoData.description}</Text>
                </div>
                <div>
                  <Text fw={600}>Period</Text>
                  <Text>
                    {selectedPromoData.startDate} to{" "}
                    {selectedPromoData.endDate}
                  </Text>
                </div>
                <div>
                  <Text fw={600}>Discount</Text>
                  <Text>{selectedPromoData.discountPercent}%</Text>
                </div>
                <div>
                  <Text fw={600}>Status</Text>
                  <Badge
                    color={selectedPromoData.isActive ? "green" : "gray"}
                  >
                    {selectedPromoData.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                {selectedPromoData.applicableGames.length > 0 && (
                  <div>
                    <Text fw={600}>Applicable Games</Text>
                    <Flex gap="sm" mt="xs">
                      {selectedPromoData.applicableGames.map((game) => (
                        <Badge key={game} variant="light">
                          {game}
                        </Badge>
                      ))}
                    </Flex>
                  </div>
                )}
              </Stack>
            )}
          </Modal>

          <Card withBorder radius="md" p="md">
            <Stack gap="md">
              <Flex justify="space-between" align="center">
                <Text fw={600}>Active Promotions</Text>
                <Button size="sm">Create Promotion</Button>
              </Flex>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Title</Table.Th>
                    <Table.Th>Start Date</Table.Th>
                    <Table.Th>End Date</Table.Th>
                    <Table.Th>Discount</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {promotions.map((promo) => (
                    <Table.Tr key={promo.id}>
                      <Table.Td>{promo.title}</Table.Td>
                      <Table.Td>{promo.startDate}</Table.Td>
                      <Table.Td>{promo.endDate}</Table.Td>
                      <Table.Td>{promo.discountPercent}%</Table.Td>
                      <Table.Td>
                        <Badge color={promo.isActive ? "green" : "gray"}>
                          {promo.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Button
                            size="xs"
                            variant="light"
                            onClick={() => handleViewDetails(promo.id)}
                          >
                            View
                          </Button>
                          <Button
                            size="xs"
                            variant="light"
                            color={promo.isActive ? "red" : "green"}
                            onClick={() => handleToggleActive(promo.id)}
                          >
                            {promo.isActive ? "Disable" : "Enable"}
                          </Button>
                        </Group>
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
