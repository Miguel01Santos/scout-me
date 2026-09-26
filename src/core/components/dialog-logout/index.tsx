import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { DialogComponent } from "../../library/dialog";
import { clearSession } from "../../auth";
import { DialogLogoutProps } from "./type";

export function DialogLogout({ isOpen, onOpenChange }: DialogLogoutProps) {
  const router = useRouter();

  function logout() {
    clearSession();
    router.replace("/login");
  }

  return (
    <DialogComponent
      isOpen={isOpen}
      onOpenChange={onOpenChange}
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
