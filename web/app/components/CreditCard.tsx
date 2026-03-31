import { Button, Group, Paper, Stack, Text, ThemeIcon, Title } from "@mantine/core";

type CreditCardProps = {
  credits: number;
  points: number;
  playerName: string;
  onAddCredits: () => void;
};

export function CreditCard({
  credits,
  points,
  playerName,
  onAddCredits,
}: CreditCardProps) {
  return (
    <Paper
      p="xl"
      radius="lg"
      withBorder
      className="bg-gradient-to-br from-arcade-primary/10 to-arcade-secondary/10 border-arcade-secondary/50"
    >
      <Stack gap="lg">
        <div>
          <Text size="sm" c="dimmed" mb={4}>
            Bem-vindo de volta
          </Text>
          <Title order={2} className="text-arcade-text">
            {playerName}
          </Title>
        </div>

        <Group grow>
          <div>
            <ThemeIcon
              size="lg"
              radius="lg"
              variant="light"
              color="arcade"
              mb={8}
            >
              💳
            </ThemeIcon>
            <Text size="sm" c="dimmed">
              Créditos
            </Text>
            <Title order={3} className="text-arcade-primary">
              {credits}
            </Title>
          </div>

          <div>
            <ThemeIcon
              size="lg"
              radius="lg"
              variant="light"
              color="arcade"
              mb={8}
            >
              ⭐
            </ThemeIcon>
            <Text size="sm" c="dimmed">
              Pontos totais
            </Text>
            <Title order={3} className="text-arcade-tertiary">
              {points}
            </Title>
          </div>
        </Group>

        <Button
          fullWidth
          size="md"
          radius="lg"
          className="arcade-button"
          onClick={onAddCredits}
        >
          + Adicionar Créditos
        </Button>
      </Stack>
    </Paper>
  );
}
