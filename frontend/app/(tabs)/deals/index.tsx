import { useCallback, useState } from "react";
import {
    View,
    Text,
    Button,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import axios from "axios";
import { API_BASE_URL } from "@/constants/Api";
import { Deal } from "@/types/types";
import { useFocusEffect } from "expo-router";

import { handleDelete } from "@/hooks/handleDelete";
import { baseStyles } from "@/styles/baseStyles";
import { useForm } from "@/hooks/useForm";
import DealForm from "@/components/forms/DealForm";
import DealDetailsModal from "@/components/dealDetailsModal";

function DealsPage() {
    const {
        formVisible,
        currentItem,
        setCurrentItem,
        handleCreate,
        handleEdit,
        handleCloseForm,
        handleUpdate,
    } = useForm<Deal | null>(null, fetchDeals);

    const [deals, setDeals] = useState<Deal[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [commissions, setCommissions] = useState<any | null>(null);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    async function fetchDeals(searchQuery: string = "") {
        setLoading(true);
        try {
            const endpoint = searchQuery
                ? `${API_BASE_URL}/deals/search/`
                : `${API_BASE_URL}/deals/`;
            const params = searchQuery ? { query: searchQuery } : {};
            const response = await axios.get(endpoint, { params });
            setDeals(response.data);
        } catch (error) {
            console.log("Ошибка при загрузке сделок:", error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchCommissions(dealId: number) {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/deals/${dealId}/commissions/`,
            );
            setCommissions(response.data);
        } catch (error) {
            console.error("Ошибка при загрузке комиссий:", error);
        }
    }

    const handleViewDetails = async (deal: Deal) => {
        setCurrentItem(deal);
        await fetchCommissions(deal.id);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setCurrentItem(null);
        setCommissions(null);
    };

    useFocusEffect(
        useCallback(() => {
            fetchDeals();
        }, []),
    );

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
                <Button title="Создать сделку" onPress={handleCreate} />
                {deals.length > 0 ? (
                    deals.map((deal) => (
                        <View key={deal.id} style={baseStyles.objectsContainer}>
                            <Text>{`Сделка #${deal.id}`}</Text>
                            <Text>{`Продавец: ${deal.offer.client.full_name || "Не указан"}`}</Text>
                            <Text>{`Риэлтор продавца: ${deal.offer.realtor.full_name || "Не указан"}`}</Text>
                            <Text>{`Покупатель: ${deal.need.client.full_name || "Не указан"}`}</Text>
                            <Text>{`Риэлтор покупателя: ${deal.need.realtor.full_name || "Не указан"}`}</Text>
                            <Text>{`Объект недвижимости: ${deal.offer.property.address || "Адрес не указан"}`}</Text>
                            <Text>{`Тип объекта: ${deal.offer.property.property_type}`}</Text>
                            <Text>{`Цена сделки: ${deal.offer.price} руб.`}</Text>
                            <Button
                                title="Подробнее"
                                onPress={() => handleViewDetails(deal)}
                            />
                            <View style={baseStyles.objectActionButtons}>
                                <Button
                                    title="Редактировать"
                                    onPress={() => handleEdit(deal)}
                                />
                                <Button
                                    title="Удалить"
                                    onPress={() =>
                                        handleDelete(
                                            "deals",
                                            deal.id,
                                            fetchDeals,
                                        )
                                    }
                                    color="red"
                                />
                            </View>
                        </View>
                    ))
                ) : (
                    <Text>Список сделок пуст.</Text>
                )}
                <DealForm
                    deal={currentItem}
                    isVisible={formVisible}
                    onClose={handleCloseForm}
                    onUpdate={fetchDeals}
                />
                <DealDetailsModal
                    visible={modalVisible}
                    deal={currentItem}
                    commissions={commissions}
                    onClose={handleCloseModal}
                />
            </ScrollView>
        </View>
    );
}

export default DealsPage;
