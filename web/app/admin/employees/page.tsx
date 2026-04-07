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
import { mockEmployees } from "@/app/lib/adminMockData";

export default function EmployeesPage() {
  const router = useRouter();
  const [employees] = useState(mockEmployees);
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  const handleViewDetails = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    setModalOpened(true);
  };

  const selectedEmp = employees.find((e) => e.id === selectedEmployee);

  return (
    <main className="arcade-home min-h-screen">
      <Container size="lg" py="xl">
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <Title order={2} className="arcade-title">
              Employees Management
            </Title>
            <Button variant="light" onClick={() => router.push("/admin")}>
              Back
            </Button>
          </Group>

          <Modal
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
            title="Employee Details"
            centered
          >
            {selectedEmp && (
              <Stack gap="sm">
                <div>
                  <Text fw={600}>Name</Text>
                  <Text>{selectedEmp.name}</Text>
                </div>
                <div>
                  <Text fw={600}>Role</Text>
                  <Text>{selectedEmp.role}</Text>
                </div>
                <div>
                  <Text fw={600}>Email</Text>
                  <Text>{selectedEmp.email}</Text>
                </div>
                <div>
                  <Text fw={600}>Phone</Text>
                  <Text>{selectedEmp.phone}</Text>
                </div>
                <div>
                  <Text fw={600}>Hire Date</Text>
                  <Text>{selectedEmp.hireDate}</Text>
                </div>
                <div>
                  <Text fw={600}>Status</Text>
                  <Badge
                    color={
                      selectedEmp.status === "active" ? "green" : "gray"
                    }
                  >
                    {selectedEmp.status}
                  </Badge>
                </div>
                <div>
                  <Text fw={600}>Permissions</Text>
                  <Flex gap="sm" mt="xs">
                    {selectedEmp.permissions.map((perm) => (
                      <Badge key={perm} variant="light">
                        {perm}
                      </Badge>
                    ))}
                  </Flex>
                </div>
              </Stack>
            )}
          </Modal>

          <Card withBorder radius="md" p="md">
            <Stack gap="md">
              <Flex justify="space-between" align="center">
                <Text fw={600}>Employee List</Text>
                <Button size="sm">Add Employee</Button>
              </Flex>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Role</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Hire Date</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {employees.map((employee) => (
                    <Table.Tr key={employee.id}>
                      <Table.Td>{employee.name}</Table.Td>
                      <Table.Td>{employee.role}</Table.Td>
                      <Table.Td>{employee.email}</Table.Td>
                      <Table.Td>
                        <Badge
                          color={
                            employee.status === "active" ? "green" : "gray"
                          }
                        >
                          {employee.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>{employee.hireDate}</Table.Td>
                      <Table.Td>
                        <Button
                          size="xs"
                          variant="light"
                          onClick={() => handleViewDetails(employee.id)}
                        >
                          View
                        </Button>
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
