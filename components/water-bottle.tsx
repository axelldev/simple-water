import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface WaterBottleProps {
  currentIntake: number;
  maxIntake: number;
}

export function WaterBottle({ currentIntake, maxIntake }: WaterBottleProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const fillPercentage = (currentIntake / maxIntake) * 100;
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
      <Text
        style={{
          ...styles.percentageText,
          color: colors.text,
        }}
      >
        {fillPercentage.toFixed(0)}%
      </Text>

      <View style={styles.bottle}>
        <Animated.View style={[animatedWaterStyle, styles.waterFill]} />
      </View>
      {/* Water percentage text

      <View style={[styles.bottle, { borderColor: colors.tint }]}>
        <View style={[styles.bottleNeck, { backgroundColor: colors.tint }]} />

        <View style={styles.bottleBody}>
          <Animated.View
            style={[
              styles.waterFill,
              animatedWaterStyle,
              { backgroundColor: "#4FC3F7" },
            ]}
          >
            <Animated.View style={[styles.wave, animatedWaveStyle]} />
          </Animated.View>

          {[25, 50, 75].map((line) => (
            <View
              key={line}
              style={[
                styles.measurementLine,
                {
                  bottom: `${line}%`,
                  borderColor: colors.icon + "40",
                },
              ]}
            />
          ))}
        </View>
      </View>

      <Text style={[styles.intakeText, { color: colors.text }]}>
        {currentIntake} ml / {maxIntake} ml
      </Text> */}
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
    marginBottom: 20,
  },
  bottle: {
    width: 200,
    height: 400,
    alignItems: "center",
    position: "relative",
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
});
