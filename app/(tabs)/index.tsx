import { FloatingButton } from "@/components/floating-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WaterBottle } from "@/components/water-bottle";
import { STORAGE_KEYS } from "@/config/storage";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  checkAndResetIntakeIfNewDay,
  getWaterIntake,
  saveIntake,
} from "@/utils/intake";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [currentIntake, setCurrentIntake] = useState(0);
  const [maxIntake, setMaxIntake] = useState(2000);
  const [intakeAmount, setIntakeAmount] = useState(250);

  const loadData = async () => {
    try {
      await checkAndResetIntakeIfNewDay();
      const savedIntake = await getWaterIntake();
      const [savedMaxIntake, savedIntakeAmount] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.MAX_INTAKE),
        AsyncStorage.getItem(STORAGE_KEYS.INTAKE_AMOUNT),
      ]);

      setCurrentIntake(savedIntake);
      if (savedMaxIntake) setMaxIntake(parseInt(savedMaxIntake, 10));
      if (savedIntakeAmount) setIntakeAmount(parseInt(savedIntakeAmount, 10));
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useFocusEffect(() => {
    loadData();
  });

  const handleAddWater = () => {
    const newIntake = currentIntake + intakeAmount;

    if (currentIntake < maxIntake && newIntake >= maxIntake) {
      Alert.alert(
        "Goal Reached! 🎉",
        `You've reached your daily water intake goal of ${maxIntake}ml!`
      );
    }

    saveIntake(newIntake);
    setCurrentIntake(newIntake);
  };

  const handleReset = async () => {
    Alert.alert(
      "Reset Water Intake",
      "Are you sure you want to reset your water intake for today?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            saveIntake(0);
            setCurrentIntake(0);
          },
        },
      ]
    );
  };

  return (
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Water Tracker
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Stay hydrated, stay healthy!
        </ThemedText>
      </View>

      <View style={styles.bottleContainer}>
        <WaterBottle currentIntake={currentIntake} maxIntake={maxIntake} />
      </View>

      <View style={styles.infoContainer}>
        <ThemedText
          style={[styles.resetText, { color: colors.tint }]}
          onPress={handleReset}
        >
          Reset Today&apos;s Intake
        </ThemedText>
      </View>

      <FloatingButton onPress={handleAddWater} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  bottleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    alignItems: "center",
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    opacity: 0.8,
  },
  resetText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
