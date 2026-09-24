import {Avatar, Badge, Button, Drawer, Separator} from "@heroui/react";
import { ModalComponentProps } from "./type";
import { getInitials } from "../../utils/get-initials";

export function ModalComponent({ isOpen, onOpenChange }: ModalComponentProps) {
  const name = "Miguel Proveza dos Santos";

  return (
    <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Backdrop>
        <Drawer.Content placement="left">
          <Drawer.Dialog>
            <Drawer.Header className="flex flex-row items-center space-x-1">
              <Badge.Anchor>
                <Avatar>
                  <Avatar.Image alt={name}/>
                  <Avatar.Fallback>{getInitials(name)}</Avatar.Fallback>
                </Avatar>
              </Badge.Anchor>
              <div>
                <h2 className="text-lg font-semibold">{name}</h2>
              </div>
            </Drawer.Header>
            <Separator className="my-4" />
            <Drawer.Body>
              <p>
                This is a bottom drawer built with React Modal component. It slides up from
                the bottom of the screen with a smooth CSS transition.
              </p>
            </Drawer.Body>
            <Drawer.Footer>
              <Button slot="close" variant="secondary">
                Cancel
              </Button>
              <Button slot="close">Confirm</Button>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
