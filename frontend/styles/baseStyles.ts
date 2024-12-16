import { StyleSheet } from "react-native";
export const baseStyles = StyleSheet.create({
    container: {
        padding: 16,
        minWidth: "100%",
        maxHeight: "100%",
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    searchInput: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        marginBottom: 16,
        minWidth: "100%",
    },
    searchControls: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        minWidth: "100%",
    },
    filterButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 16,
        minWidth: "100%",
    },
    filterButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        marginHorizontal: 5,
    },
    selectedButton: {
        backgroundColor: "#007bff",
    },
    filterButtonText: {
        fontSize: 16,
        color: "#000",
    },
    selectedButtonText: {
        color: "#fff",
    },
    objectsContainer: {
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginTop: 8,
        marginBottom: 8,
        padding: 12,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
        minWidth: "100%",
        gap: 20,
    },
    objectActionButtons: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        width: "100%",
        gap: 10,
    },
    objectContiner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        alignItems:'center'
    },
    objectInfo: {
        flexDirection: "column",
        gap: 10,
    },
    objectLink: {
        flexDirection: "column",
        gap: 10,
    },
});
