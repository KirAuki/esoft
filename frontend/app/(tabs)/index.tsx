import ActForm from "@/components/forms/ActForm";
import { API_BASE_URL } from "@/constants/Api";
import { handleDelete } from "@/hooks/handleDelete";
import { useForm } from "@/hooks/useForm";
import { baseStyles } from "@/styles/baseStyles";
import { Act } from "@/types/types";
import axios from "axios";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    Text,
    View,
    ActivityIndicator,
    ScrollView,
    Button,
} from "react-native";

export default function Index() {
    const {
        formVisible,
        currentItem,
        handleCreate,
        handleEdit,
        handleUpdate,
        handleCloseForm,
    } = useForm<Act | null>(null, fetchActs);
    const [acts, setActs] = useState<Act[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Функция для получения списка событий
    async function fetchActs() {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/acts/`);
            setActs(response.data);
        } catch (error) {
            console.log("Ошибка при загрузке событий:", error);
        } finally {
            setLoading(false);
        }
    }

    // Используем useFocusEffect для обновления данных при каждом переходе на страницу
    useFocusEffect(
        useCallback(() => {
            fetchActs();
        }, []),
    );

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

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
                <Button
                    title="Создать событие"
                    onPress={handleCreate}
                />
                {acts.length > 0 ? (
                    acts.map((act) => (
                        <View key={act.id} style={baseStyles.objectsContainer}>
                            <View style={baseStyles.objectInfo}>
                                <Text>{`Дата и время: ${formatDate(act.date_time)}`}</Text>
                                <Text>{`Тип события: ${act.act_type}`}</Text>
                                <Text>{`Длительность: ${act.duration} мин`}</Text>
                                <Text>{`Комментарий: ${act.comment || "Нет комментария"}`}</Text>
                            </View>
                            <View style={baseStyles.objectActionButtons}>
                                <Button
                                    title="Редактировать"
                                    onPress={() => handleEdit(act)}
                                />
                                <Button
                                    title="Удалить"
                                    onPress={() =>
                                        handleDelete("acts", act.id, fetchActs)
                                    }
                                    color="red"
                                />
                            </View>
                        </View>
                    ))
                ) : (
                    <Text>Список событий пуст.</Text>
                )}
            </ScrollView>
            <ActForm
                isVisible={formVisible}
                onClose={handleCloseForm}
                onUpdate={handleUpdate}
                act={currentItem}
            />
        </View>
    );
}
