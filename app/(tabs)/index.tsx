import { FloatingButton } from "@/components/floating-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WaterBottle } from "@/components/water-bottle";
import { STORAGE_KEYS } from "@/config/storage";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [currentIntake, setCurrentIntake] = useState(0);
  const [maxIntake, setMaxIntake] = useState(2000);
  const [intakeAmount, setIntakeAmount] = useState(250);

  const loadData = async () => {
    try {
      const [savedIntake, savedMaxIntake, savedIntakeAmount, savedDate] =
        await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.CURRENT_INTAKE),
          AsyncStorage.getItem(STORAGE_KEYS.MAX_INTAKE),
          AsyncStorage.getItem(STORAGE_KEYS.INTAKE_AMOUNT),
          AsyncStorage.getItem(STORAGE_KEYS.LAST_DATE),
        ]);

      // Reset intake if it's a new day
      const today = new Date().toDateString();
      if (savedDate !== today) {
        setCurrentIntake(0);
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_DATE, today);
      } else if (savedIntake) {
        setCurrentIntake(parseInt(savedIntake, 10));
      }

      if (savedMaxIntake) setMaxIntake(parseInt(savedMaxIntake, 10));
      if (savedIntakeAmount) setIntakeAmount(parseInt(savedIntakeAmount, 10));
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useFocusEffect(() => {
    loadData();
  });

  const saveData = useCallback(async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem(
          STORAGE_KEYS.CURRENT_INTAKE,
          currentIntake.toString()
        ),
        AsyncStorage.setItem(STORAGE_KEYS.MAX_INTAKE, maxIntake.toString()),
        AsyncStorage.setItem(
          STORAGE_KEYS.INTAKE_AMOUNT,
          intakeAmount.toString()
        ),
      ]);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }, [currentIntake, intakeAmount, maxIntake]);

  useEffect(() => {
    saveData();
  }, [currentIntake, maxIntake, intakeAmount, saveData]);

  const handleAddWater = () => {
    const newIntake = currentIntake + intakeAmount;

    if (newIntake > maxIntake) {
      Alert.alert(
        "Goal Reached! 🎉",
        `You've reached your daily water intake goal of ${maxIntake}ml!`,
        [
          {
            text: "OK",
            onPress: () => setCurrentIntake(maxIntake),
          },
        ]
      );
    } else {
      setCurrentIntake(newIntake);

      // Show congratulations when goal is reached
      if (newIntake === maxIntake) {
        Alert.alert(
          "Congratulations! 🎉",
          `You've completed your daily water intake goal!`
        );
      }
    }
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
          onPress: () => setCurrentIntake(0),
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
