import * as Notifications from "expo-notifications";
import { Linking, Platform } from "react-native";

export const requestNotificationsPermission =
  async (): Promise<Notifications.PermissionStatus> => {
    if (await allowsNotifications())
      return Notifications.PermissionStatus.GRANTED;
    const { status } = await Notifications.requestPermissionsAsync();
    return status;
  };

export const getCurrentNotificationsPermission =
  async (): Promise<Notifications.PermissionStatus> => {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  };

export const allowsNotifications = async (): Promise<boolean> => {
  const settings = await Notifications.getPermissionsAsync();
  return (
    settings.status === Notifications.PermissionStatus.GRANTED ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
};

export const scheduleNotificationInterval = async (
  title: string,
  body: string,
  seconds: number
) => {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      repeats: true,
    },
  });
};

export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

export const openNotificationSettings = async () => {
  if (Platform.OS === "ios") {
    await Linking.openURL("app-settings:");
  } else {
    await Linking.openSettings();
  }
};

export const TIME_INTERVAL_SECONDS = {
  EVERY_HOUR: 60 * 60,
  EVERY_2_HOURS: 60 * 60 * 2,
  EVERY_30_MINUTES: 60 * 30,
};

// Keep old name for backwards compatibility
export const TIME_INTERVAL_SECONS = TIME_INTERVAL_SECONDS;
