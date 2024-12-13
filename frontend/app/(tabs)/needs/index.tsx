import NeedForm from "@/components/forms/NeedForm";
import { API_BASE_URL } from "@/constants/Api";
import { handleDelete } from "@/hooks/handleDelete";
import { Need } from "@/types/types";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Button,
    View,
    Text,
    ScrollView,
} from "react-native";

import { baseStyles } from "@/styles/baseStyles";
import { useForm } from "@/hooks/useForm";

function NeedsPage() {
    const {
        formVisible,
        currentItem,
        handleCreate,
        handleEdit,
        handleCloseForm,
        handleUpdate,
    } = useForm<Need | null>(null, fetchNeeds);

    const [needs, setNeeds] = useState<Need[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    async function fetchNeeds() {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/needs/`);
            setNeeds(response.data);
        } catch (error) {
            console.log("Ошибка при загрузке потребностей:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchNeeds();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={baseStyles.container}>
            <ScrollView
                contentContainerStyle={baseStyles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
            >
                <Button title="Создать потребность" onPress={handleCreate} />
                {needs.length > 0 ? (
                    needs.map((need) => (
                        <View key={need.id} style={baseStyles.objectsContainer}>
                            <View style={baseStyles.objectInfo}>
                                <Text>{`Клиент: ${need.client.full_name || need.client.email || need.client.phone || "Не указано"}`}</Text>
                                <Text>{`Риэлтор: ${need.realtor.full_name}`}</Text>
                                <Text>{`Тип объекта: ${need.property_type}`}</Text>
                                <Text>{`Адрес: ${need.address || "-"}`}</Text>
                                <Text>{`Мин. цена: ${need.min_price}, Макс. цена: ${need.max_price}`}</Text>
                                <Text>{`Мин. площадь: ${need.min_area || "-"}, Макс. площадь: ${need.max_area || "-"}`}</Text>
                                {need.property_type === "Квартира" && (
                                    <>
                                        <Text>{`Комнаты: от ${need.min_rooms || "-"} до ${need.max_rooms || "-"}`}</Text>
                                        <Text>{`Этаж: от ${need.min_floor || "-"} до ${need.max_floor || "-"}`}</Text>
                                    </>
                                )}
                                {need.property_type === "Дом" && (
                                    <>
                                        <Text>{`Этажность: от ${need.min_floors || "-"} до ${need.max_floors || "-"}`}</Text>
                                    </>
                                )}
                            </View>
                            <View style={baseStyles.objectActionButtons}>
                                <Button
                                    title="Редактировать"
                                    onPress={() => handleEdit(need)}
                                />
                                <Button
                                    title="Удалить"
                                    onPress={() =>
                                        handleDelete(
                                            "needs",
                                            need.id,
                                            fetchNeeds,
                                        )
                                    }
                                    color="red"
                                />
                            </View>
                        </View>
                    ))
                ) : (
                    <Text>Список потребностей пуст.</Text>
                )}
                <NeedForm
                    isVisible={formVisible}
                    onClose={handleCloseForm}
                    onUpdate={handleUpdate}
                    need={currentItem}
                />
            </ScrollView>
        </View>
    );
}

export default NeedsPage;
