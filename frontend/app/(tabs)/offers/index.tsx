import OfferForm from "@/components/forms/OfferForm";
import { API_BASE_URL } from "@/constants/Api";
import { handleDelete } from "@/hooks/handleDelete";
import { Offer } from "@/types/types";
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

function OffersPage() {
    const {
        formVisible,
        currentItem,
        handleCreate,
        handleEdit,
        handleCloseForm,
        handleUpdate,
    } = useForm<Offer | null>(null, fetchOffers);

    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Загрузка предложений с фильтрацией
    async function fetchOffers() {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/offers/`);
            setOffers(response.data);
        } catch (error) {
            console.log("Ошибка при загрузке предложений:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOffers();
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
                <Button title="Создать предложение" onPress={handleCreate} />
                {offers.length > 0 ? (
                    offers.map((offer) => (
                        <View
                            key={offer.id}
                            style={baseStyles.objectsContainer}
                        >
                            <View style={baseStyles.objectInfo}>
                                <Text>{`Клиент: ${offer.client.full_name || "Не указано"}`}</Text>
                                <Text>{`Риэлтор: ${offer.realtor.full_name}`}</Text>
                                <Text>{`Объект недвижимости: ${offer.property.property_type}, ${offer.property.address}`}</Text>
                                <Text>{`Цена: ${offer.price}`}</Text>
                            </View>
                            <View style={baseStyles.objectActionButtons}>
                                <Button
                                    title="Редактировать"
                                    onPress={() => handleEdit(offer)}
                                />
                                <Button
                                    title="Удалить"
                                    onPress={() =>
                                        handleDelete(
                                            "offers",
                                            offer.id,
                                            fetchOffers,
                                        )
                                    }
                                    color="red"
                                />
                            </View>
                        </View>
                    ))
                ) : (
                    <Text>Список предложений пуст.</Text>
                )}
                <OfferForm
                    isVisible={formVisible}
                    onClose={handleCloseForm}
                    onUpdate={handleUpdate}
                    offer={currentItem}
                />
            </ScrollView>
        </View>
    );
}

export default OffersPage;
