import { Ionicons } from "@expo/vector-icons";
import React from 'react';
import { Switch } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import SettingItem from './SettingItem';

interface SettingSwitchProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
}

const SettingSwitch: React.FC<SettingSwitchProps> = ({ icon, title, value, onValueChange }) => {
    const { colors } = useTheme();

    return (
        <SettingItem
            icon={icon}
            title={title}
            rightElement={
                <Switch
                    trackColor={{ false: colors.surface, true: colors.accentAlpha }}
                    thumbColor={value ? colors.text : colors.surface}
                    onValueChange={onValueChange}
                    value={value}
                />
            }
        />
    );
};

export default SettingSwitch;
