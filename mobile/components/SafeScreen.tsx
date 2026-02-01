import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ReactNode } from "react";

interface SafeScreenProps {
  children: ReactNode;
  backgroundColor?: string;
}

const SafeScreen = ({ children, backgroundColor = "#F3E6D4" }: SafeScreenProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        paddingTop: insets.top,
        backgroundColor,
      }}
    >
      {children}
    </View>
  );
};

export default SafeScreen;