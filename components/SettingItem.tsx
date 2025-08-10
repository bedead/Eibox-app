// Update file: components/SettingItem.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { useTheme } from '@/context/ThemeContext';

interface SettingItemProps {
    icon?: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    disabled?: boolean;
    onPress?: () => void;
    showArrow?: boolean;
    textColor?: string;
}

export default function SettingItem({
    icon,
    title,
    subtitle,
    disabled,
    onPress,
    showArrow = true,
    textColor
}: SettingItemProps) {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[
                styles.container,
                { backgroundColor: colors.surface }
            ]}
            onPress={onPress}
            disabled={disabled}
        >
            <View style={styles.content}>
                {icon && (
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name={icon}
                            size={22}
                            color={textColor || colors.text}
                        />
                    </View>
                )}
                <View style={styles.textContainer}>
                    <ThemedText style={[styles.title, textColor && { color: textColor }]}>
                        {title}
                    </ThemedText>
                    {subtitle && (
                        <ThemedText type="default" style={styles.subtitle}>
                            {subtitle}
                        </ThemedText>
                    )}
                </View>
                {showArrow && onPress && (
                    <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={colors.text}
                        style={styles.arrow}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 32,
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
    },
    subtitle: {
        marginTop: 2,
        opacity: 0.7,
    },
    arrow: {
        marginLeft: 8,
        opacity: 0.5,
    }
});