"use client";

import {
  Button,
  Card,
  Container,
  Group,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { mockPayrollData } from "@/app/lib/adminMockData";

export default function PayrollPage() {
  const router = useRouter();

  const handleExport = () => {
    const csvContent = [
      [
        "Employee ID",
        "Name",
        "Role",
        "Hours Worked",
        "Absences",
        "Bank",
        "Account",
        "Gross Salary",
        "Deductions",
        "Net Salary",
      ],
      ...mockPayrollData.map((item) => [
        item.employeeId,
        item.employeeName,
        item.role,
        item.hoursWorked,
        item.absences,
        item.bankName,
        item.accountNumber,
        item.grossSalary.toFixed(2),
        item.deductions.toFixed(2),
        item.netSalary.toFixed(2),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payroll-report.csv";
    a.click();
  };

  const totalGrossSalary = mockPayrollData.reduce(
    (acc, item) => acc + item.grossSalary,
    0
  );
  const totalDeductions = mockPayrollData.reduce(
    (acc, item) => acc + item.deductions,
    0
  );
  const totalNetSalary = mockPayrollData.reduce(
    (acc, item) => acc + item.netSalary,
    0
  );

  return (
    <main className="arcade-home min-h-screen">
      <Container size="lg" py="xl">
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <Title order={2} className="arcade-title">
              Payroll Management
            </Title>
            <Button variant="light" onClick={() => router.push("/admin")}>
              Back
            </Button>
          </Group>

          <Group grow>
            <Card withBorder radius="md" p="md">
              <Text size="sm" c="dimmed">
                Total Gross Salary
              </Text>
              <Text size="xl" fw={700}>
                R$ {totalGrossSalary.toFixed(2)}
              </Text>
            </Card>
            <Card withBorder radius="md" p="md">
              <Text size="sm" c="dimmed">
                Total Deductions
              </Text>
              <Text size="xl" fw={700}>
                R$ {totalDeductions.toFixed(2)}
              </Text>
            </Card>
            <Card withBorder radius="md" p="md">
              <Text size="sm" c="dimmed">
                Total Net Salary
              </Text>
              <Text size="xl" fw={700}>
                R$ {totalNetSalary.toFixed(2)}
              </Text>
            </Card>
          </Group>

          <Card withBorder radius="md" p="md">
            <Stack gap="md">
              <Group justify="space-between">
                <Text fw={600}>Payroll Details</Text>
                <Button size="sm" onClick={handleExport}>
                  Export CSV
                </Button>
              </Group>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Employee</Table.Th>
                    <Table.Th>Role</Table.Th>
                    <Table.Th>Hours</Table.Th>
                    <Table.Th>Absences</Table.Th>
                    <Table.Th>Bank</Table.Th>
                    <Table.Th>Account</Table.Th>
                    <Table.Th>Gross</Table.Th>
                    <Table.Th>Deductions</Table.Th>
                    <Table.Th>Net</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {mockPayrollData.map((item) => (
                    <Table.Tr key={item.employeeId}>
                      <Table.Td>{item.employeeName}</Table.Td>
                      <Table.Td>{item.role}</Table.Td>
                      <Table.Td>{item.hoursWorked}h</Table.Td>
                      <Table.Td>{item.absences}</Table.Td>
                      <Table.Td>{item.bankName}</Table.Td>
                      <Table.Td>{item.accountNumber}</Table.Td>
                      <Table.Td>R$ {item.grossSalary.toFixed(2)}</Table.Td>
                      <Table.Td>R$ {item.deductions.toFixed(2)}</Table.Td>
                      <Table.Td>R$ {item.netSalary.toFixed(2)}</Table.Td>
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
