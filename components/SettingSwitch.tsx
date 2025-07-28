// Update file: components/SettingSwitch.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { useTheme } from '@/context/ThemeContext';

interface SettingSwitchProps {
    icon?: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
}

export default function SettingSwitch({
    icon,
    title,
    subtitle,
    value,
    onValueChange
}: SettingSwitchProps) {
    const { colors } = useTheme();

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: colors.surface }
            ]}
        >
            <View style={styles.content}>
                {icon && (
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name={icon}
                            size={22}
                            color={colors.text}
                        />
                    </View>
                )}
                <View style={styles.textContainer}>
                    <ThemedText style={styles.title}>{title}</ThemedText>
                    {subtitle && (
                        <ThemedText type="default" style={styles.subtitle}>
                            {subtitle}
                        </ThemedText>
                    )}
                </View>
                <Switch
                    value={value}
                    onValueChange={onValueChange}
                    trackColor={{ false: colors.border, true: colors.tabIconSelected }}
                    thumbColor={colors.background}
                />
            </View>
        </View>
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
    }
});