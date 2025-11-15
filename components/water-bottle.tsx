import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ThemedText } from "./themed-text";

interface WaterBottleProps {
  currentIntake: number;
  maxIntake: number;
}

export function WaterBottle({ currentIntake, maxIntake }: WaterBottleProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const fillPercentage = Math.min(
    100,
    Math.max(0, (currentIntake / maxIntake) * 100)
  );
  const animatedHeight = useSharedValue(0);

  useEffect(() => {
    animatedHeight.value = withSpring(fillPercentage, {
      damping: 15,
      stiffness: 200,
    });
  }, [animatedHeight, fillPercentage]);

  const animatedWaterStyle = useAnimatedStyle(() => {
    return {
      height: `${animatedHeight.value}%`,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.intakeTextContainer}>
        <Text
          style={{
            ...styles.percentageText,
            color: colors.text,
          }}
        >
          {fillPercentage.toFixed(0)}%
        </Text>
        <ThemedText style={styles.currentIntakeText}>
          {currentIntake} / {maxIntake} ml
        </ThemedText>
      </View>

      <View style={styles.bottle}>
        <Animated.View style={[animatedWaterStyle, styles.waterFill]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  percentageText: {
    fontSize: 48,
    fontWeight: "bold",
  },
  bottle: {
    width: 200,
    height: 400,
    alignItems: "center",
    position: "relative",
    backgroundColor: "#f0f0f0",
    borderRadius: 17,
  },
  waterFill: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 17,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    backgroundColor: "#4FC3F7",
  },
  wave: {
    position: "absolute",
    top: -10,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: "#81D4FA",
    borderRadius: 100,
  },
  measurementLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    borderTopWidth: 1,
    borderStyle: "dashed",
  },
  intakeText: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 30,
  },
  intakeTextContainer: {
    marginBottom: 20,
  },
  currentIntakeText: {
    fontSize: 20,
    fontWeight: "600",
  },
});
