import { useCallback, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import axios from "axios";
import { API_BASE_URL } from "@/constants/Api";
import { Client } from "@/types/types";
import { Link, useFocusEffect } from "expo-router";
import ClientForm from "@/components/forms/ClientForm";
import { handleDelete } from "@/hooks/handleDelete";
import { baseStyles } from "@/styles/baseStyle";
import { useForm } from "@/hooks/useForm";

function ClientsList() {
    const {
        formVisible,
        currentItem,
        handleCreate,
        handleEdit,
        handleCloseForm,
        handleUpdate,
    } = useForm<Client | null>(null, fetchClients);

    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
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

    useFocusEffect(
        useCallback(() => {
            fetchClients();
        }, []),
    );
    const handleSearchChange = (text: string) => {
        setSearchQuery(text);
    };

    const handleSearchSubmit = () => {
        fetchClients(searchQuery);
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <ScrollView contentContainerStyle={baseStyles.container}>
            <TextInput
                placeholder="Поиск по ФИО..."
                value={searchQuery}
                onChangeText={handleSearchChange}
                onSubmitEditing={handleSearchSubmit}
                returnKeyType="search"
                style={baseStyles.searchInput}
            />
            <Button title="Создать клиента" onPress={handleCreate} />
            {clients.length > 0 ? (
                clients.map((item) => (
                    <View key={item.id} style={baseStyles.objectsContainer}>
                        <Link
                            href={{
                                pathname: "/clients/[id]",
                                params: { id: item.id },
                            }}
                        >
                            <View style={baseStyles.objectInfo}>
                                <Text>
                                    {`ФИО: ${item.full_name || "Не указано"}`}
                                </Text>
                                <Text>{`Телефон: ${item.phone || "не указан"}  Почта: ${item.email || "не указана"}`}</Text>
                            </View>
                        </Link>
                        <View style={baseStyles.objectActionButtons}>
                            <Button
                                title="Редактировать"
                                onPress={() => handleEdit(item)}
                            />
                            <Button
                                title="Удалить"
                                onPress={() =>
                                    handleDelete(
                                        "clients",
                                        item.id,
                                        fetchClients,
                                    )
                                }
                                color="red"
                            />
                        </View>
                    </View>
                ))
            ) : (
                <Text>Список клиентов пуст.</Text>
            )}

            <ClientForm
                isVisible={formVisible}
                onClose={handleCloseForm}
                onUpdate={handleUpdate}
                client={currentItem}
            />
        </ScrollView>
    );
}

export default ClientsList;
