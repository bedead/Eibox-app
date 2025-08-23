import { GmailConnectButton } from "@/components/GmailAuthService";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

// Usage Example in your main component
const GmailOauthScreen = () => {
    const { user, gmailAccounts, addGmailAccount } = useAuth(); // Assuming you have a way to get the current user
    const handleConnectionResult = (result: Record<string, any>) => {
        if (result.success) {
            // Navigate to next screen or update your state
            console.log('Gmail connected:', result.email);
            // You can now call your existing addGmailAccount function if needed
            addGmailAccount({ email: result.email });
            if (gmailAccounts.length > 0) {
                console.log("New gmail accounts added with email: ", gmailAccounts[0].email);
            }
            router.replace('/chat');
        }
    };

    return (
        <View style={styles.screen}>
            <Text style={styles.title}>Connect Your Gmail Account</Text>
            <Text style={styles.description}>
                We'll open your browser to securely connect your Gmail account.
                All authentication is handled by Google on our secure servers.
            </Text>

            <GmailConnectButton
                username={user?.username}
                onConnectionResult={handleConnectionResult}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 20,
    },
    button: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 200,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    spinner: {
        marginRight: 8,
    },
    helpText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
        marginTop: 12,
        paddingHorizontal: 20,
    },
    screen: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
});

export default GmailOauthScreen;