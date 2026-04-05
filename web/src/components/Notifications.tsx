import { notifications } from "@mantine/notifications";

export function notify(props) {
  notifications.show({ ...props });
}
