import * as Notifications from "expo-notifications";
import { Linking, Platform } from "react-native";

// Reminder messages that rotate for variety
const REMINDER_MESSAGES = [
  { title: "Time to hydrate! 💧", body: "Take a moment to drink some water." },
  {
    title: "Water break! 🌊",
    body: "Your body needs hydration to stay energized.",
  },
  {
    title: "Stay refreshed! 💦",
    body: "A glass of water keeps you going strong.",
  },
  { title: "Hydration check ✨", body: "Have you had water recently?" },
  { title: "Drink up! 🥤", body: "Keep your hydration on track." },
];

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

/**
 * Schedule daily water reminders at specific hours.
 * Uses calendar triggers that repeat daily - the iOS recommended approach.
 *
 * @param startHour - First reminder hour (default: 8 AM)
 * @param endHour - Last reminder hour (default: 21 / 9 PM)
 * @param intervalHours - Hours between reminders (default: 1)
 */
export const scheduleDailyReminders = async (
  startHour: number = 8,
  endHour: number = 21,
  intervalHours: number = 1
) => {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const hours: number[] = [];
  for (let hour = startHour; hour <= endHour; hour += intervalHours) {
    hours.push(hour);
  }

  // Schedule a notification for each hour
  for (let i = 0; i < hours.length; i++) {
    const hour = hours[i];
    const message = REMINDER_MESSAGES[i % REMINDER_MESSAGES.length];

    await Notifications.scheduleNotificationAsync({
      content: {
        title: message.title,
        body: message.body,
        sound: "default",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour,
        minute: 0,
        repeats: true,
      },
    });
  }
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

export const getScheduledNotifications = async () => {
  return Notifications.getAllScheduledNotificationsAsync();
};
