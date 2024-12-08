import { useEffect, useState } from "react";
import {
    FlatList,
    View,
    Text,
    TextInput,
    StyleSheet,
    Button,
    Alert,
} from "react-native";
import axios from "axios";
import { API_BASE_URL } from "@/constants/Api";
import { Client } from "@/types/types";
import { Link } from "expo-router";
import ClientForm from "@/components/ClientForm";
import { handleDelete } from "@/hooks/handleDelete";

function ClientsList() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isModalVisible, setModalVisible] = useState(false);

    async function fetchClients(searchQuery: string = "") {
        setLoading(true);
        try {
            const endpoint = searchQuery
                ? `${API_BASE_URL}/clients/search/`
                : `${API_BASE_URL}/clients/`;
            const params = searchQuery ? { query: searchQuery } : {};
            const response = await axios.get(endpoint, { params });
            setClients(response.data);
        } catch (error) {
            console.log("Ошибка при загрузке клиентов:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchClients(searchQuery);
    }, [searchQuery]);

    const handleSearchChange = (text: string) => {
        setSearchQuery(text);
        fetchClients(text);
    };

    const handleClientsUpdate = async () => {
        await fetchClients();
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Поиск по ФИО..."
                value={searchQuery}
                onChangeText={handleSearchChange}
                style={styles.searchInput}
            />
            <FlatList
                data={clients}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.clientContainer}>
                        <Link
                            href={{
                                pathname: "/clients/[id]",
                                params: { id: item.id },
                            }}
                        >
                            <View>
                                <Text
                                    style={styles.clientName}
                                >{`ФИО: ${item.last_name || ""} ${item.first_name || ""} ${item.patronymic || ""}`}</Text>
                                <Text>{`Телефон: ${item.phone || "не указан"}  Почта: ${item.email || "не указана"}`}</Text>
                            </View>
                        </Link>
                        <Button
                            title="Удалить"
                            onPress={() =>
                                handleDelete("clients", item.id, fetchClients)
                            }
                            color="red"
                        />
                    </View>
                )}
                ListEmptyComponent={<Text>Список клиентов пуст.</Text>}
                refreshing={loading}
                onRefresh={fetchClients}
            />
            <Button
                title="Создать клиента"
                onPress={() => setModalVisible(true)}
            />
            <ClientForm
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onUpdate={handleClientsUpdate}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    searchInput: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    clientContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        padding: 12,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    clientName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
});

export default ClientsList;
