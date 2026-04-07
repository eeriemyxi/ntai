import { type NotificationData, notifications } from "@mantine/notifications";

export function notify(props: NotificationData) {
  notifications.show({ ...props });
}
