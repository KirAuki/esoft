import React, { useState, useEffect } from "react";
import {
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    Button,
    View,
} from "react-native";
import axios from "axios";
import { API_BASE_URL } from "@/constants/Api";
import { Need } from "@/types/types";
import { formStyles } from "@/styles/formStyles";
import { baseStyles } from "@/styles/baseStyles";

interface NeedSelectorProps {
    isVisible: boolean;
    onClose: () => void;
    onSelect: (need: Need) => void;
    offerId?: number; // Параметр, передаваемый для фильтрации
}

function NeedSelector({
    isVisible,
    onClose,
    onSelect,
    offerId,
}: NeedSelectorProps) {
    const [needs, setNeeds] = useState<Need[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isVisible) {
            fetchNeeds();
        }
    }, [isVisible]);

    const fetchNeeds = async () => {
        setLoading(true);
        try {
            // Если передан offerId, то загружаем только связанные потребности
            const endpoint = offerId
                ? `${API_BASE_URL}/offers/${offerId}/matching-needs/`
                : `${API_BASE_URL}/needs/`;

            const response = await axios.get(endpoint);
            setNeeds(response.data.needs || response.data); // Полагаемся на формат ответа от сервера
        } catch (error) {
            console.error("Ошибка загрузки потребностей:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={isVisible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={formStyles.container}>
                <ScrollView style={formStyles.scrollContainer}>
                    {loading ? (
                        <Text>Загрузка...</Text>
                    ) : (
                        needs.map((need) => (
                            <TouchableOpacity
                                style={formStyles.listItem}
                                key={need.id}
                                onPress={() => {
                                    onSelect(need);
                                    onClose();
                                }}
                            >
                                <View style={baseStyles.objectInfo}>
                                    <Text>Клиент: {need.client.full_name}</Text>
                                    <Text>
                                        Риелтор: {need.realtor.full_name}
                                    </Text>
                                    <Text>Адрес: {need.address}</Text>
                                    <Text>
                                        Цена от {need.min_price} до{" "}
                                        {need.max_price}{" "}
                                    </Text>
                                    <Text>
                                        Площадь от {need.min_area || "-"} до{" "}
                                        {need.max_area || "-"}{" "}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>
                <Button title="Закрыть" onPress={onClose} color="red" />
            </View>
        </Modal>
    );
}

export default NeedSelector;
