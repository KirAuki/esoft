import { StyleSheet } from "react-native";

export const formStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        padding: 16,
        minWidth: "100%",
        maxHeight: "100%",
        marginTop: 40,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginBottom: 8,
    },
    actionButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
    },
    selectButton: {
        padding: 16,
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        marginBottom: 16,
    },
    listItem: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    
});
