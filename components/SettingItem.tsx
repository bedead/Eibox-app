import { Ionicons } from "@expo/vector-icons";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface SettingItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    rightElement?: React.ReactNode;
    onPress?: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, title, rightElement, onPress }) => {
    const { colors } = useTheme();
    const Container = onPress ? TouchableOpacity : View;
    
    return (
        <Container style={[styles.settingItem, { borderBottomColor: colors.border }]} onPress={onPress}>
            <View style={styles.settingInfo}>
                <Ionicons name={icon} size={22} color={colors.text} style={styles.settingIcon} />
                <Text style={[styles.settingText, { color: colors.text }]}>{title}</Text>
            </View>
            {rightElement}
        </Container>
    );
};

const styles = StyleSheet.create({
    settingItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    settingInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    settingIcon: {
        marginRight: 12,
    },
    settingText: {
        fontSize: 16,
    },
});

export default SettingItem;
