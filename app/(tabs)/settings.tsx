import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const STORAGE_KEYS = {
  MAX_INTAKE: "@water_max_intake",
  INTAKE_AMOUNT: "@water_intake_amount",
};

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const [maxIntake, setMaxIntake] = useState("2000");
  const [intakeAmount, setIntakeAmount] = useState("250");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [savedMaxIntake, savedIntakeAmount] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.MAX_INTAKE),
        AsyncStorage.getItem(STORAGE_KEYS.INTAKE_AMOUNT),
      ]);

      if (savedMaxIntake) setMaxIntake(savedMaxIntake);
      if (savedIntakeAmount) setIntakeAmount(savedIntakeAmount);
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const saveSettings = async () => {
    const maxIntakeNum = parseInt(maxIntake, 10);
    const intakeAmountNum = parseInt(intakeAmount, 10);

    if (isNaN(maxIntakeNum) || maxIntakeNum <= 0) {
      Alert.alert(
        "Invalid Input",
        "Please enter a valid maximum intake value (greater than 0)."
      );
      return;
    }

    if (isNaN(intakeAmountNum) || intakeAmountNum <= 0) {
      Alert.alert(
        "Invalid Input",
        "Please enter a valid intake amount per press (greater than 0)."
      );
      return;
    }

    if (intakeAmountNum > maxIntakeNum) {
      Alert.alert(
        "Invalid Input",
        "Intake amount per press cannot be greater than maximum daily intake."
      );
      return;
    }

    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.MAX_INTAKE, maxIntake),
        AsyncStorage.setItem(STORAGE_KEYS.INTAKE_AMOUNT, intakeAmount),
      ]);

      Alert.alert(
        "Settings Saved",
        "Your water intake settings have been updated successfully!"
      );
    } catch (error) {
      console.error("Error saving settings:", error);
      Alert.alert("Error", "Failed to save settings. Please try again.");
    }
  };

  const setPreset = async (max: number, amount: number) => {
    setMaxIntake(max.toString());
    setIntakeAmount(amount.toString());

    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.MAX_INTAKE, max.toString()),
        AsyncStorage.setItem(STORAGE_KEYS.INTAKE_AMOUNT, amount.toString()),
      ]);
      Alert.alert(
        "Preset Applied",
        `Set to ${max}ml daily goal with ${amount}ml per serving.`
      );
    } catch (error) {
      console.error("Error applying preset:", error);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ThemedView style={styles.content}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Settings
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Customize your water intake goals
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Daily Goal
          </ThemedText>
          <ThemedText style={styles.description}>
            Set your maximum daily water intake goal in milliliters (ml)
          </ThemedText>
          <View style={[styles.inputContainer, { borderColor: colors.icon }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={maxIntake}
              onChangeText={setMaxIntake}
              keyboardType="numeric"
              placeholder="2000"
              placeholderTextColor={colors.icon}
            />
            <ThemedText style={styles.unit}>ml</ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Intake Per Serving
          </ThemedText>
          <ThemedText style={styles.description}>
            Set how much water to add each time you press the + button
          </ThemedText>
          <View style={[styles.inputContainer, { borderColor: colors.icon }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={intakeAmount}
              onChangeText={setIntakeAmount}
              keyboardType="numeric"
              placeholder="250"
              placeholderTextColor={colors.icon}
            />
            <ThemedText style={styles.unit}>ml</ThemedText>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.tint }]}
          onPress={saveSettings}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.saveButtonText}>Save Settings</ThemedText>
        </TouchableOpacity>

        <View style={styles.presetsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Quick Presets
          </ThemedText>
          <ThemedText style={styles.description}>
            Choose a common water intake configuration
          </ThemedText>

          <View style={styles.presetsGrid}>
            <TouchableOpacity
              style={[
                styles.presetButton,
                {
                  backgroundColor: colors.tint + "20",
                  borderColor: colors.tint,
                },
              ]}
              onPress={() => setPreset(1500, 200)}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.presetTitle}>Light</ThemedText>
              <ThemedText style={styles.presetValue}>1.5L / 200ml</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.presetButton,
                {
                  backgroundColor: colors.tint + "20",
                  borderColor: colors.tint,
                },
              ]}
              onPress={() => setPreset(2000, 250)}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.presetTitle}>Standard</ThemedText>
              <ThemedText style={styles.presetValue}>2L / 250ml</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.presetButton,
                {
                  backgroundColor: colors.tint + "20",
                  borderColor: colors.tint,
                },
              ]}
              onPress={() => setPreset(3000, 300)}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.presetTitle}>Active</ThemedText>
              <ThemedText style={styles.presetValue}>3L / 300ml</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.presetButton,
                {
                  backgroundColor: colors.tint + "20",
                  borderColor: colors.tint,
                },
              ]}
              onPress={() => setPreset(4000, 400)}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.presetTitle}>Athletic</ThemedText>
              <ThemedText style={styles.presetValue}>4L / 400ml</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            💧 Hydration Tips
          </ThemedText>
          <View style={styles.tipItem}>
            <ThemedText style={styles.tipText}>
              • Drink water first thing in the morning
            </ThemedText>
          </View>
          <View style={styles.tipItem}>
            <ThemedText style={styles.tipText}>
              • Keep water with you throughout the day
            </ThemedText>
          </View>
          <View style={styles.tipItem}>
            <ThemedText style={styles.tipText}>
              • Drink before you feel thirsty
            </ThemedText>
          </View>
          <View style={styles.tipItem}>
            <ThemedText style={styles.tipText}>
              • Track your intake daily
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 16,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
  },
  unit: {
    fontSize: 16,
    opacity: 0.6,
    marginLeft: 8,
  },
  saveButton: {
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 30,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  presetsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  presetsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  presetButton: {
    flex: 1,
    minWidth: "45%",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
  },
  presetTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  presetValue: {
    fontSize: 14,
    opacity: 0.7,
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  tipItem: {
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
});
