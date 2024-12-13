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
import { Offer } from "@/types/types";
import { formStyles } from "@/styles/formStyles";
import { baseStyles } from "@/styles/baseStyles";

interface OfferSelectorProps {
    isVisible: boolean;
    onClose: () => void;
    onSelect: (offer: Offer) => void;
    needId?: number; // Параметр, передаваемый для фильтрации
}

function OfferSelector({
    isVisible,
    onClose,
    onSelect,
    needId,
}: OfferSelectorProps) {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isVisible) {
            fetchOffers();
        }
    }, [isVisible]);

    const fetchOffers = async () => {
        setLoading(true);
        try {
            const endpoint = needId
                ? `${API_BASE_URL}/needs/${needId}/matching-offers/`
                : `${API_BASE_URL}/offers/`;

            const response = await axios.get(endpoint);
            setOffers(response.data.offers || response.data);
        } catch (error) {
            console.error("Ошибка загрузки предложений:", error);
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
                        offers.map((offer) => (
                            <TouchableOpacity
                                style={formStyles.listItem}
                                key={offer.id}
                                onPress={() => {
                                    onSelect(offer);
                                    onClose();
                                }}
                            >
                                <View style={baseStyles.objectInfo}>
                                    <Text>
                                        Клиент: {offer.client.full_name}
                                    </Text>
                                    <Text>
                                        Риелтор: {offer.realtor.full_name}
                                    </Text>
                                    <Text>
                                        Недвижимость:{" "}
                                        {offer.property.property_type},
                                        {offer.property.address}
                                    </Text>
                                    <Text>
                                        Площадь: {offer.property.area || "-"} ,
                                        Комнаты: {offer.property.rooms || "-"}
                                    </Text>
                                    <Text>
                                        Этаж: {offer.property.floor || "-"} ,
                                        Этажность:{" "}
                                        {offer.property.floors || "-"}
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

export default OfferSelector;
