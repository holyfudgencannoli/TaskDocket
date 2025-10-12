// components/ui/Screen.tsx
import React, { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "../hooks/use-theme-color";

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;                  // make content scrollable
  style?: ViewStyle;                 // container style
  contentContainerStyle?: ViewStyle; // scroll content style
  edges?: Array<"top" | "bottom" | "left" | "right">; // SafeArea edges
  keyboardOffset?: number;           // additional keyboard offset
};

export const ScreenPrimative: React.FC<ScreenProps> = ({
  children,
  scroll = false,
  style,
  contentContainerStyle,
  edges,
  keyboardOffset = 0
}) => {
  const backgroundColor = useThemeColor({}, 'background');

//   const Container = scroll ? ScrollView : View;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: backgroundColor }]} edges={edges}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={keyboardOffset}
      >
       {scroll ? (
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.contentContainer, style]}>{children}</View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1, // critical for scroll to work
    padding: 16,
  },
});
