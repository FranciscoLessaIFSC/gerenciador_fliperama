import { Button, Group, Paper, Container, Title } from "@mantine/core";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

type DashboardHeaderProps = {
  onLogout: () => void;
};

export function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const cardNumber = searchParams.get("card");

  const handleNavigation = (path: string) => {
    if (cardNumber) {
      router.push(`${path}?card=${cardNumber}`);
    }
  };

  return (
    <Paper radius={0} p="md" className="border-b border-arcade-secondary/30">
      <Container size="lg" h="100%" className="flex items-center justify-between">
        <Title order={3} className="text-arcade-primary cursor-pointer" onClick={() => handleNavigation("/dashboard")}>
          FLIPERAMA
        </Title>

        <Group gap="md">
          <Button
            variant={pathname === "/dashboard" ? "filled" : "subtle"}
            size="sm"
            onClick={() => handleNavigation("/dashboard")}
            className={
              pathname === "/dashboard" ? "arcade-button" : "text-arcade-secondary"
            }
          >
            Dashboard
          </Button>
          <Button
            variant={pathname === "/rankings" ? "filled" : "subtle"}
            size="sm"
            onClick={() => handleNavigation("/rankings")}
            className={
              pathname === "/rankings" ? "arcade-button" : "text-arcade-secondary"
            }
          >
            Rankings
          </Button>
          <Button
            variant="subtle"
            size="sm"
            onClick={onLogout}
            className="text-arcade-error"
          >
            Sair
          </Button>
        </Group>
      </Container>
    </Paper>
  );
}
