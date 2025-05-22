import { Ionicons } from "@expo/vector-icons";
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type IconName = keyof typeof Ionicons.glyphMap;

interface IconButtonProps {
    name: IconName;
    onPress: () => void;
    size?: number;
}

const IconButton: React.FC<IconButtonProps> = ({ name, onPress, size = 24 }) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: colors.surface }
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Ionicons name={name} size={size} color={colors.text} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default IconButton;
