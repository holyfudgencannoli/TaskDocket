// components/ui/Screen.tsx
import React, { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "../hooks/use-theme-color";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
  keyboardOffset
}) => {
  const backgroundColor = useThemeColor({}, 'background');

//   const Container = scroll ? ScrollView : View;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: backgroundColor }]} edges={edges}>
     
    
        {scroll ? (
            <KeyboardAwareScrollView
                style={styles.flex}
                contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
                enableOnAndroid={true}
                extraHeight={100}            // space above bottom fields
                keyboardShouldPersistTaps="handled"
                keyboardOpeningTime={0}
            >
            {children}
          </KeyboardAwareScrollView>
        ) : (
          <View style={[styles.contentContainer, style]}>{children}</View>
        )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    // flex: 1,
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
