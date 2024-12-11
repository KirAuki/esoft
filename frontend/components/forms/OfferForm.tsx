import { API_BASE_URL } from "@/constants/Api";
import axios from "axios";
import { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    Button,
    Alert,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import { Offer, Client, Realtor, Property } from "@/types/types";
import Dropdown from "../Dropdown";
import Input from "../input";

type OfferFormProps = {
    offer?: Offer | null;
    isVisible: boolean;
    onClose: () => void;
    onUpdate: () => void;
};

function OfferForm({ offer, isVisible, onClose, onUpdate }: OfferFormProps) {
    const [clients, setClients] = useState<Client[]>([]);
    const [realtors, setRealtors] = useState<Realtor[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);

    const [clientId, setClientId] = useState<number | null>(null);
    const [realtorId, setRealtorId] = useState<number | null>(null);
    const [propertyId, setPropertyId] = useState<number | null>(null);
    const [price, setPrice] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const fetchData = async () => {
        try {
            const [clientsResponse, realtorsResponse, propertiesResponse] =
                await Promise.all([
                    axios.get(`${API_BASE_URL}/clients/`),
                    axios.get(`${API_BASE_URL}/realtors/`),
                    axios.get(`${API_BASE_URL}/properties/`),
                ]);

            setClients(clientsResponse.data);
            setRealtors(realtorsResponse.data);
            setProperties(propertiesResponse.data);
        } catch (error) {
            console.error("Ошибка загрузки данных:", error);
            Alert.alert("Ошибка", "Не удалось загрузить данные для формы.");
        }
    };

    useEffect(() => {
        if (isVisible) {
            fetchData();
        }
    }, [isVisible]);

    useEffect(() => {
        if (offer) {
            setClientId(offer.client.id);
            setRealtorId(offer.realtor.id);
            setPropertyId(offer.property.id);
            setPrice(offer.price.toString());
        }
    }, [offer]);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!clientId) newErrors.clientId = "Выберите клиента.";
        if (!realtorId) newErrors.realtorId = "Выберите риэлтора.";
        if (!propertyId) newErrors.propertyId = "Выберите объект недвижимости.";
        if (!price || isNaN(Number(price)) || Number(price) <= 0) {
            newErrors.price = "Укажите корректную цену.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            Alert.alert("Ошибка", "Пожалуйста, заполните форму корректно.");
            return;
        }

        const offerData = {
            client: clientId,
            realtor: realtorId,
            property: propertyId,
            price: Number(price),
        };

        setLoading(true);

        try {
            if (offer) {
                await axios.put(
                    `${API_BASE_URL}/offers/${offer.id}/`,
                    offerData,
                );
            } else {
                await axios.post(`${API_BASE_URL}/offers/`, offerData);
            }

            Alert.alert(
                "Успех",
                `Предложение ${offer ? "обновлено" : "создано"} успешно.`,
            );
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Ошибка отправки данных:", error);
            Alert.alert("Ошибка", "Не удалось сохранить данные.");
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
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>
                    {offer
                        ? "Редактирование предложения"
                        : "Создание предложения"}
                </Text>

                <Dropdown
                    label="Клиент"
                    selectedValue={clientId || ""}
                    onValueChange={(value) => setClientId(Number(value))}
                    options={clients.map((client) => ({
                        label:
                            client.full_name || client.email || client.phone as string ,
                        value: client.id,
                    }))}
                />
                {errors.clientId && (
                    <Text style={styles.errorText}>{errors.clientId}</Text>
                )}

                <Dropdown
                    label="Риэлтор"
                    selectedValue={realtorId || ""}
                    onValueChange={(value) => setRealtorId(Number(value))}
                    options={realtors.map((realtor) => ({
                        label:
                            realtor.full_name ||
                            `${realtor.last_name} ${realtor.first_name}`,
                        value: realtor.id,
                    }))}
                />
                {errors.realtorId && (
                    <Text style={styles.errorText}>{errors.realtorId}</Text>
                )}

                <Dropdown
                    label="Объект недвижимости"
                    selectedValue={propertyId || ""}
                    onValueChange={(value) => setPropertyId(Number(value))}
                    options={properties.map((property) => ({
                        label: property.address || `Объект №${property.id}`,
                        value: property.id,
                    }))}
                />
                {errors.propertyId && (
                    <Text style={styles.errorText}>{errors.propertyId}</Text>
                )}

                <Input
                    label="Цена"
                    value={price}
                    onChange={setPrice}
                    keyboardType="numeric"
                />
                {errors.price && (
                    <Text style={styles.errorText}>{errors.price}</Text>
                )}
                <View style={styles.actionButtons}>
                    <Button
                        title={offer ? "Сохранить" : "Создать"}
                        onPress={handleSubmit}
                        disabled={loading}
                    />
                    <Button title="Закрыть" onPress={onClose} color="red" />
                </View>
            </ScrollView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingInline: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        marginTop: 40,
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginBottom: 8,
    },
    actionButtons: {
        flexDirection: "row",
        gap: 10,
        paddingVertical: 16,
    },
    closeButton: {
        marginTop: 16,
        padding: 10,
        borderRadius: 4,
    },
    closeButtonText: {
        color: "#ff0000",
        fontSize: 16,
    },
});

export default OfferForm;
