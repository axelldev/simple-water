import { STORAGE_KEYS } from "@/config/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RemindersStatus = "allowed" | "denied" | "not-determined";

export const getRemindersStatus = async (): Promise<RemindersStatus> => {
  const allowed = await AsyncStorage.getItem(STORAGE_KEYS.ALLOW_REMINDERS);
  return (allowed ?? "not-determined") as RemindersStatus;
};

export const setRemindersStatus = async (status: RemindersStatus) => {
  await AsyncStorage.setItem(STORAGE_KEYS.ALLOW_REMINDERS, status);
};

export const removeRemindersStatus = async () => {
  await AsyncStorage.removeItem(STORAGE_KEYS.ALLOW_REMINDERS);
};
