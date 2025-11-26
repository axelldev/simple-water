import * as Notifications from "expo-notifications";

export const requestNotificationsPermission =
  async (): Promise<Notifications.PermissionStatus> => {
    const { status: currentStatus } = await Notifications.getPermissionsAsync();
    if (currentStatus === Notifications.PermissionStatus.GRANTED)
      return currentStatus;
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
    },
  });
};

export const TIME_INTERVAL_SECONS = {
  EVERY_HOUR: 60 * 60,
};
