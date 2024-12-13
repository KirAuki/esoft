import { API_BASE_URL } from "@/constants/Api";
import axios from "axios";
import { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    Button,
    Alert,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import Dropdown from "../Dropdown";
import Input from "../input";
import { Need, Client, Realtor } from "@/types/types";
import { formStyles } from "@/styles/formStyles";

type NeedFormProps = {
    need?: Need | null;
    isVisible: boolean;
    onClose: () => void;
    onUpdate: () => void;
};

function NeedForm({ need, isVisible, onClose, onUpdate }: NeedFormProps) {
    const [clients, setClients] = useState<Client[]>([]);
    const [realtors, setRealtors] = useState<Realtor[]>([]);
    const [clientId, setClientId] = useState<number | null>(null);
    const [realtorId, setRealtorId] = useState<number | null>(null);
    const [propertyType, setPropertyType] = useState<string>("Квартира");
    const [city, setCity] = useState<string>("");
    const [street, setStreet] = useState<string>("");
    const [houseNumber, setHouseNumber] = useState<string>("");
    const [apartmentNumber, setApartmentNumber] = useState<string>("");
    const [minPrice, setMinPrice] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<string>("");
    const [minArea, setMinArea] = useState<string | null>(null);
    const [maxArea, setMaxArea] = useState<string | null>(null);
    const [minRooms, setMinRooms] = useState<string | null>(null);
    const [maxRooms, setMaxRooms] = useState<string | null>(null);
    const [minFloor, setMinFloor] = useState<string | null>(null);
    const [maxFloor, setMaxFloor] = useState<string | null>(null);
    const [minFloors, setMinFloors] = useState<string | null>(null);
    const [maxFloors, setMaxFloors] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const fetchData = async () => {
        try {
            const [clientsResponse, realtorsResponse] = await Promise.all([
                axios.get(`${API_BASE_URL}/clients/`),
                axios.get(`${API_BASE_URL}/realtors/`),
            ]);

            setClients(clientsResponse.data);
            setRealtors(realtorsResponse.data);
        } catch (error) {
            console.error("Ошибка загрузки данных:", error);
            Alert.alert("Ошибка", "Не удалось загрузить данные для формы.");
        }
    };

    useEffect(() => {
        if (isVisible) {
            fetchData();
            if (need) {
                setClientId(need.client.id);
                setRealtorId(need.realtor.id);
                setPropertyType(need.property_type);
                setCity(need?.city || "");
                setStreet(need?.street || "");
                setHouseNumber(need?.house_number || "");
                setApartmentNumber(need?.apartment_number || "");
                setMinPrice(need.min_price.toString());
                setMaxPrice(need.max_price.toString());
                setMinArea(need.min_area?.toString() || null);
                setMaxArea(need.max_area?.toString() || null);
                setMinRooms(need.min_rooms?.toString() || null);
                setMaxRooms(need.max_rooms?.toString() || null);
                setMinFloor(need.min_floor?.toString() || null);
                setMaxFloor(need.max_floor?.toString() || null);
                setMinFloors(need.min_floors?.toString() || null);
                setMaxFloors(need.max_floors?.toString() || null);
            }
        }
    }, [isVisible, need]);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!clientId) newErrors.clientId = "Выберите клиента.";
        if (!realtorId) newErrors.realtorId = "Выберите риэлтора.";
        if (!city) newErrors.city = "Укажите город.";
        if (!street) newErrors.street = "Укажите улицу.";
        if (!houseNumber) newErrors.houseNumber = "Укажите номер дома.";
        if (!minPrice || isNaN(Number(minPrice))) {
            newErrors.minPrice = "Укажите корректную минимальную цену.";
        }
        if (!maxPrice || isNaN(Number(maxPrice))) {
            newErrors.maxPrice = "Укажите корректную максимальную цену.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            Alert.alert("Ошибка", "Пожалуйста, заполните форму корректно.");
            return;
        }

        const needData = {
            client: Number(clientId),
            realtor: Number(realtorId),
            property_type: propertyType,
            city,
            street,
            house_number: Number(houseNumber),
            apartment_number: Number(apartmentNumber),
            min_price: Number(minPrice),
            max_price: Number(maxPrice),
            min_area: minArea ? Number(minArea) : null,
            max_area: maxArea ? Number(maxArea) : null,
            min_rooms: minRooms ? Number(minRooms) : null,
            max_rooms: maxRooms ? Number(maxRooms) : null,
            min_floor: minFloor ? Number(minFloor) : null,
            max_floor: maxFloor ? Number(maxFloor) : null,
            min_floors: minFloors ? Number(minFloors) : null,
            max_floors: maxFloors ? Number(maxFloors) : null,
        };

        setLoading(true);

        try {
            if (need) {
                await axios.put(`${API_BASE_URL}/needs/${need.id}/`, needData);
            } else {
                await axios.post(`${API_BASE_URL}/needs/`, needData);
            }

            Alert.alert(
                "Успех",
                `Потребность ${need ? "обновлена" : "создана"} успешно.`,
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
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={formStyles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                >
                    <View style={formStyles.container}>
                        <Text style={formStyles.title}>
                            {need
                                ? "Редактирование потребности"
                                : "Создание потребности"}
                        </Text>
                        <Dropdown
                            label="Клиент"
                            selectedValue={clientId || ""}
                            onValueChange={(value) =>
                                setClientId(Number(value))
                            }
                            options={clients.map((client) => ({
                                label:
                                    client.full_name ||
                                    client.email ||
                                    (client.phone as string),
                                value: client.id,
                            }))}
                        />
                        {errors.clientId && (
                            <Text style={formStyles.errorText}>
                                {errors.clientId}
                            </Text>
                        )}

                        <Dropdown
                            label="Риэлтор"
                            selectedValue={realtorId || ""}
                            onValueChange={(value) =>
                                setRealtorId(Number(value))
                            }
                            options={realtors.map((realtor) => ({
                                label: realtor.full_name,
                                value: realtor.id,
                            }))}
                        />
                        {errors.realtorId && (
                            <Text style={formStyles.errorText}>
                                {errors.realtorId}
                            </Text>
                        )}

                        <Dropdown
                            label="Тип объекта недвижимости"
                            selectedValue={propertyType}
                            onValueChange={(value) =>
                                setPropertyType(String(value))
                            }
                            options={[
                                { label: "Квартира", value: "Квартира" },
                                { label: "Дом", value: "Дом" },
                                { label: "Земля", value: "Земля" },
                            ]}
                        />
                        <Input label="Город" value={city} onChange={setCity} />
                        {errors.city && (
                            <Text style={formStyles.errorText}>
                                {errors.city}
                            </Text>
                        )}

                        <Input
                            label="Улица"
                            value={street}
                            onChange={setStreet}
                        />
                        {errors.street && (
                            <Text style={formStyles.errorText}>
                                {errors.street}
                            </Text>
                        )}

                        <Input
                            label="Номер дома"
                            value={houseNumber}
                            onChange={setHouseNumber}
                            keyboardType="numeric"
                        />
                        {errors.houseNumber && (
                            <Text style={formStyles.errorText}>
                                {errors.houseNumber}
                            </Text>
                        )}

                        <Input
                            label="Номер квартиры"
                            value={apartmentNumber}
                            onChange={setApartmentNumber}
                            keyboardType="numeric"
                        />

                        <Input
                            label="Минимальная цена"
                            value={minPrice}
                            onChange={setMinPrice}
                            keyboardType="numeric"
                        />
                        {errors.minPrice && (
                            <Text style={formStyles.errorText}>
                                {errors.minPrice}
                            </Text>
                        )}

                        <Input
                            label="Максимальная цена"
                            value={maxPrice}
                            onChange={setMaxPrice}
                            keyboardType="numeric"
                        />
                        {errors.maxPrice && (
                            <Text style={formStyles.errorText}>
                                {errors.maxPrice}
                            </Text>
                        )}
                        <Input
                            label="Минимальная площадь"
                            value={minArea || ""}
                            onChange={setMinArea}
                            keyboardType="numeric"
                        />
                        <Input
                            label="Максимальная площадь"
                            value={maxArea || ""}
                            onChange={setMaxArea}
                            keyboardType="numeric"
                        />

                        {propertyType === "Квартира" && (
                            <View>
                                <Input
                                    label="Минимум комнат"
                                    value={minRooms || ""}
                                    onChange={setMinRooms}
                                    keyboardType="numeric"
                                />
                                <Input
                                    label="Максимум комнат"
                                    value={maxRooms || ""}
                                    onChange={setMaxRooms}
                                    keyboardType="numeric"
                                />
                                <Input
                                    label="Минимальный этаж"
                                    value={minFloor || ""}
                                    onChange={setMinFloor}
                                    keyboardType="numeric"
                                />
                                <Input
                                    label="Максимальный этаж"
                                    value={maxFloor || ""}
                                    onChange={setMaxFloor}
                                    keyboardType="numeric"
                                />
                            </View>
                        )}

                        {propertyType === "Дом" && (
                            <View>
                                <Input
                                    label="Минимум комнат"
                                    value={minRooms || ""}
                                    onChange={setMinRooms}
                                    keyboardType="numeric"
                                />
                                <Input
                                    label="Максимум комнат"
                                    value={maxRooms || ""}
                                    onChange={setMaxRooms}
                                    keyboardType="numeric"
                                />
                                <Input
                                    label="Минимальная этажность"
                                    value={minFloors || ""}
                                    onChange={setMinFloors}
                                    keyboardType="numeric"
                                />
                                <Input
                                    label="Максимальная этажность"
                                    value={maxFloors || ""}
                                    onChange={setMaxFloors}
                                    keyboardType="numeric"
                                />
                            </View>
                        )}
                        <View style={formStyles.actionButtons}>
                            <Button
                                title={need ? "Сохранить" : "Создать"}
                                onPress={handleSubmit}
                                disabled={loading}
                            />
                            <Button
                                title="Закрыть"
                                onPress={onClose}
                                color="red"
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
}

export default NeedForm;
