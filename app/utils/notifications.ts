export type NotificationPermissionState =
  | "unsupported"
  | "default"
  | "granted"
  | "denied";

function isSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

export function getNotificationPermission(): NotificationPermissionState {
  if (!isSupported()) return "unsupported";
  return Notification.permission as NotificationPermissionState;
}

export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (!isSupported()) return "unsupported";
  if (Notification.permission !== "default") {
    return Notification.permission as NotificationPermissionState;
  }

  try {
    const result = await Notification.requestPermission();
    return result as NotificationPermissionState;
  } catch (error) {
    console.error("Could not request notification permission:", error);
    return getNotificationPermission();
  }
}

export function notifyUser(title: string, body?: string): void {
  if (!isSupported() || Notification.permission !== "granted") return;

  try {
    new Notification(title, {
      body,
      icon: "/favicon.ico",
      tag: "pomodoro-timer",
    });
  } catch (error) {
    console.error("Could not show the notification:", error);
  }
}
