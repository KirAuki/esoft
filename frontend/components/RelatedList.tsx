import { API_BASE_URL } from "@/constants/Api";
import { baseStyles } from "@/styles/baseStyle";
import { Need, Offer } from "@/types/types";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    TouchableOpacity,
    View,
    Text,
    Button,
} from "react-native";

interface Props {
    clientId?: number;
    realtorId?: number;
}

function RelatedList({ clientId, realtorId }: Props) {
    const [needs, setNeeds] = useState<Need[]>([]);
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [showAlt, setShowAlt] = useState<boolean>(true);

    useEffect(() => {
        const fetchNeedsAndOffers = async () => {
            setLoading(true);
            try {
                const params: { client?: number; realtor?: number } = {};
                if (clientId) params.client = clientId;
                if (realtorId) params.realtor = realtorId;

                const [needsResponse, offersResponse] = await Promise.all([
                    axios.get(`${API_BASE_URL}/needs/`, { params }),
                    axios.get(`${API_BASE_URL}/offers/`, { params }),
                ]);

                setNeeds(needsResponse.data);
                setOffers(offersResponse.data);
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNeedsAndOffers();
    }, [clientId, realtorId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <View style={baseStyles.container}>
            <View style={baseStyles.filterButtons}>
                <TouchableOpacity
                    style={[
                        baseStyles.filterButton,
                        showAlt && baseStyles.selectedButton,
                    ]}
                    onPress={() => setShowAlt(true)}
                >
                    <Text
                        style={[
                            baseStyles.filterButtonText,
                            showAlt && baseStyles.selectedButtonText,
                        ]}
                    >
                        Offers
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        baseStyles.filterButton,
                        !showAlt && baseStyles.selectedButton,
                    ]}
                    onPress={() => setShowAlt(false)}
                >
                    <Text
                        style={[
                            baseStyles.filterButtonText,
                            !showAlt && baseStyles.selectedButtonText,
                        ]}
                    >
                        Needs
                    </Text>
                </TouchableOpacity>
            </View>
            {showAlt ? (
                <View>
                    {offers.length > 0 ? (
                        offers.map((item) => (
                            <View
                                key={item.id}
                                style={baseStyles.objectsContainer}
                            >
                                <View style={baseStyles.objectInfo}>
                                    <Text>{`Клиент: ${item.client.full_name || "Не указано"}`}</Text>
                                    <Text>{`Риэлтор: ${item.realtor.full_name}`}</Text>
                                    <Text>{`Объект недвижимости: ${item.property.property_type}, ${item.property.address}`}</Text>
                                    <Text>{`Цена: ${item.price}`}</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text>Список связанных предложений пуст.</Text>
                    )}
                </View>
            ) : (
                <View>
                    {needs.length > 0 ? (
                        needs.map((item) => (
                            <View
                                key={item.id}
                                style={baseStyles.objectsContainer}
                            >
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
                            </View>
                        ))
                    ) : (
                        <Text>Список связанных потребностей пуст.</Text>
                    )}
                </View>
            )}
        </View>
    );
}

export default RelatedList;
