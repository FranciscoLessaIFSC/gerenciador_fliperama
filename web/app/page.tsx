"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Container,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

export default function Home() {
  const router = useRouter();
  const [cardNumber, setCardNumber] = useState("");
  const [loading, setLoading] = useState(false);

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

  return (
    <main className="arcade-home">
      <Container size="xs" className="h-screen flex items-center justify-center">
        <Stack gap="lg" className="w-full">
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
