"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Button,
  Container,
  Group,
  Modal,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { mockAdminCredentials } from "@/app/lib/adminMockData";

export default function Home() {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminModalOpened, setAdminModalOpened] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber.trim()) return;

    setLoading(true);
    // Simula validação do cartão
    setTimeout(() => {
      router.push(`/dashboard?card=${cardNumber}`);
      setLoading(false);
    }, 800);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUser.trim() || !adminPassword.trim()) return;

    setAdminLoading(true);
    setTimeout(() => {
      const status =
        adminUser === mockAdminCredentials.username &&
        adminPassword === mockAdminCredentials.password
          ? 200
          : 401;

      setAdminLoading(false);
      if (status === 200) {
        setAdminModalOpened(false);
        setAdminUser("");
        setAdminPassword("");
        setAdminError("");
        router.push("/admin");
        return;
      }

      setAdminError("Invalid password");
    }, 800);
  };

  return (
    <main className="arcade-home">
      <Container size="xs" className="h-screen flex items-center justify-center">
        <Stack gap="lg" className="w-full">
          <Modal
            opened={adminModalOpened}
            onClose={() => {
              setAdminModalOpened(false);
              setAdminError("");
            }}
            title="Administrator login"
            centered
          >
            <form onSubmit={handleAdminLogin}>
              <Stack gap="sm">
                {adminError ? <Alert color="red">{adminError}</Alert> : null}
                <TextInput
                  label="User"
                  placeholder="Type your user"
                  value={adminUser}
                  onChange={(e) => {
                    setAdminUser(e.currentTarget.value);
                    if (adminError) setAdminError("");
                  }}
                  required
                />
                <PasswordInput
                  label="Password"
                  placeholder="Type your password"
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.currentTarget.value);
                    if (adminError) setAdminError("");
                  }}
                  required
                />
                <Button type="submit" loading={adminLoading}>
                  Login
                </Button>
              </Stack>
            </form>
          </Modal>

          <Stack gap="xs" align="center">
            <Title
              order={1}
              className="text-center text-4xl font-bold arcade-title"
            >
              FLIPERAMA
            </Title>
            <Text size="sm" c="dimmed" className="text-center">
              Leitor de cartao eletrônico
            </Text>
          </Stack>

          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                placeholder="Insira o numero do cartao"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.currentTarget.value)}
                size="lg"
                radius="lg"
                className="arcade-input"
                autoFocus
                maxLength={16}
              />
              <Group grow>
                <Button
                  type="submit"
                  size="lg"
                  radius="lg"
                  loading={loading}
                  className="arcade-button"
                >
                  Entrar
                </Button>
              </Group>
              <Button
                type="button"
                variant="light"
                size="md"
                radius="lg"
                onClick={() => setAdminModalOpened(true)}
              >
                Administrator login
              </Button>
            </Stack>
          </form>

          <Text size="xs" c="dimmed" className="text-center">
            © 2026 Gerenciador de Fliperama
          </Text>
        </Stack>
      </Container>
    </main>
  );
}
