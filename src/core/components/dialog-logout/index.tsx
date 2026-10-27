import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { DialogComponent } from "../../library/dialog";
import { listSavedSessions, logoutUser, switchToSavedAccount } from "../../auth";
import { useThemeClasses } from "../../hooks/use-theme-classes";
import { useAccount } from "../../providers/account";
import { DialogLogoutProps } from "./type";

export function DialogLogout({ isOpen, onOpenChange }: DialogLogoutProps) {
  const router = useRouter();
  const themeClasses = useThemeClasses();
  const { refreshAccount } = useAccount();

  async function logout() {
    logoutUser();

    const [nextAccount] = listSavedSessions();

    if (nextAccount && switchToSavedAccount(null, nextAccount.session.user.id)) {
      onOpenChange(false);
      await refreshAccount().catch(() => undefined);
      router.replace("/home");
      return;
    }

    router.replace("/login");
  }

  return (
    <DialogComponent
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className={themeClasses.bg}
      title="Sair do aplicativo"
      body={<p>Tem certeza que deseja sair? Você vai precisar entrar de novo para acessar sua conta.</p>}
      footer={
        <>
          <Button slot="close" variant="tertiary">
            Cancelar
          </Button>
          <Button variant="danger" onPress={logout}>
            Sair
          </Button>
        </>
      }
    />
  );
}
