import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import IconButton from './IconButton';

interface AppHeaderProps {
    title: string;
    onBack?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, onBack }) => {
    const { colors } = useTheme();

    return (
        <View style={styles.header}>
            {onBack && (
                <IconButton 
                    name="arrow-back" 
                    onPress={onBack}
                />
            )}
            <Text style={[styles.headerTitle, { color: colors.text }]}>{title}</Text>
            <View style={{ width: 44 }} />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
        flex: 1,
    },
});

export default AppHeader;
