import { STORAGE_KEYS } from "@/config/storage";
import { getToday } from "@/utils/date";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function checkAndResetIntakeIfNewDay() {
  const lastDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_DATE);
  const today = getToday();

  if (lastDate !== today) {
    AsyncStorage.setItem(STORAGE_KEYS.CURRENT_INTAKE, "0");
    AsyncStorage.setItem(STORAGE_KEYS.LAST_DATE, today);
  }
}

export async function getWaterIntake(): Promise<number> {
  const intake = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_INTAKE);
  return intake ? parseInt(intake, 10) : 0;
}

export async function saveIntake(intake: number): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_INTAKE, intake.toString());
}
