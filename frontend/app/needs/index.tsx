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

import { baseStyles } from "@/styles/baseStyle";
import { useForm } from "@/hooks/useForm";

function NeedsList() {
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
        <ScrollView contentContainerStyle={baseStyles.container}>
            <Button title="Создать потребность" onPress={handleCreate} />
            {needs.length > 0 ? (
                needs.map((item) => (
                    <View key={item.id} style={baseStyles.objectsContainer}>
                        <View style={baseStyles.objectInfo}>
                            <Text>{`Клиент: ${item.client.full_name || item.client.email || item.client.phone || "Не указано"}`}</Text>
                            <Text>{`Риэлтор: ${item.realtor.full_name}`}</Text>
                            <Text>{`Тип объекта: ${item.property_type}`}</Text>
                            <Text>{`Адрес: ${item.address}`}</Text>
                            <Text>{`Мин. цена: ${item.min_price}, Макс. цена: ${item.max_price}`}</Text>
                            {item.property_type === "Квартира" && (
                                <>
                                    <Text>{`Мин. площадь: ${item.min_area}, Макс. площадь: ${item.max_area}`}</Text>
                                    <Text>{`Комнаты: от ${item.min_rooms || "не указано"} до ${item.max_rooms || "не указано"}`}</Text>
                                    <Text>{`Этаж: от ${item.min_floor || "не указано"} до ${item.max_floor || "не указано"}`}</Text>
                                </>
                            )}
                            {item.property_type === "Дом" && (
                                <>
                                    <Text>{`Мин. площадь: ${item.min_area}, Макс. площадь: ${item.max_area}`}</Text>
                                    <Text>{`Этажность: от ${item.min_floors || "не указано"} до ${item.max_floors || "не указано"}`}</Text>
                                </>
                            )}
                            {item.property_type === "Земля" && (
                                <Text>{`Площадь земли: от ${item.min_land_area || "не указано"} до ${item.max_land_area || "не указано"}`}</Text>
                            )}
                        </View>
                        <View style={baseStyles.objectActionButtons}>
                            <Button
                                title="Редактировать"
                                onPress={() => handleEdit(item)}
                            />
                            <Button
                                title="Удалить"
                                onPress={() =>
                                    handleDelete("needs", item.id, fetchNeeds)
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
    );
}

export default NeedsList;
