import { useState, useCallback } from "react";
import {
    FlatList,
    View,
    Text,
    TextInput,
    Button,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import axios from "axios";
import { API_BASE_URL } from "@/constants/Api";
import { Realtor } from "@/types/types";
import { Link, useFocusEffect } from "expo-router";
import RealtorForm from "@/components/forms/RealtorForm";
import { handleDelete } from "@/hooks/handleDelete";
import { baseStyles } from "@/styles/baseStyle";
import { useForm } from "@/hooks/useForm";

function RealtorsList() {
    const {
        formVisible,
        currentItem,
        handleCreate,
        handleEdit,
        handleCloseForm,
    } = useForm<Realtor | null>(null, fetchRealtors);

    const [realtors, setRealtors] = useState<Realtor[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");

    async function fetchRealtors(searchQuery: string = "") {
        setLoading(true);
        try {
            const endpoint = searchQuery
                ? `${API_BASE_URL}/realtors/search/`
                : `${API_BASE_URL}/realtors/`;
            const params = searchQuery ? { query: searchQuery } : {};

            const response = await axios.get(endpoint, { params });
            setRealtors(response.data);
        } catch (error) {
            console.log("Ошибка при загрузке риелторов:", error);
        } finally {
            setLoading(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchRealtors();
        }, []),
    );

    const handleSearchChange = (text: string) => {
        setSearchQuery(text);
    };

    const handleSearchSubmit = () => {
        fetchRealtors(searchQuery);
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
            <Button title="Создать риелтора" onPress={handleCreate} />
            {realtors.length > 0 ? (
                realtors.map((item) => (
                    <View key={item.id} style={baseStyles.objectsContainer}>
                        <Link
                            href={{
                                pathname: "/realtors/[id]",
                                params: { id: item.id },
                            }}
                            style={baseStyles.objectLink}
                        >
                            <View style={baseStyles.objectInfo}>
                                <Text>{`${item.full_name}`}</Text>
                                <Text>{`Коммисия: ${item.commission_share || "-"}`}</Text>
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
                                        "realtors",
                                        item.id,
                                        fetchRealtors,
                                    )
                                }
                                color="red"
                            />
                        </View>
                    </View>
                ))
            ) : (
                <Text>Список риелторов пуст.</Text>
            )}

            <RealtorForm
                realtor={currentItem}
                isVisible={formVisible}
                onClose={handleCloseForm}
                onUpdate={handleSearchSubmit}
            />
        </ScrollView>
    );
}

export default RealtorsList;
