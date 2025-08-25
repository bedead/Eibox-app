import { GmailConnectButton } from "@/components/GmailAuthService";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { StyleSheet } from "react-native";

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
        <ThemedView style={styles.screen}>
            <ThemedText type="title" style={styles.title}>
                Connect Your Gmail Account
            </ThemedText>
            <ThemedText style={styles.description}>
                We'll open your browser to securely connect your Gmail account.
                All authentication is handled by Google on our secure servers.
            </ThemedText>

            <GmailConnectButton
                username={user?.username}
                onConnectionResult={handleConnectionResult}
            />
        </ThemedView>
    );
};


const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        marginBottom: 24,
        textAlign: 'center',
    },
    description: {
        textAlign: 'center',
        marginBottom: 40,
        maxWidth: '80%',
    },
    helpText: {
        textAlign: 'center',
        marginTop: 24,
        opacity: 0.7,
    },
});

export default GmailOauthScreen;