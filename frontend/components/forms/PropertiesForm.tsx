import { API_BASE_URL } from "@/constants/Api";
import axios from "axios";
import { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    Button,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
} from "react-native";
import { Property } from "@/types/types";
import Input from "../input";
import Dropdown from "../Dropdown";
import { formStyles } from "@/styles/formStyles";
import * as ImagePicker from "expo-image-picker";

type PropertyFormProps = {
    property?: Property | null;
    isVisible: boolean;
    onClose: () => void;
    onUpdate: () => void;
};

function PropertyForm({
    property,
    isVisible,
    onClose,
    onUpdate,
}: PropertyFormProps) {
    const [propertyType, setPropertyType] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [street, setStreet] = useState<string>("");
    const [houseNumber, setHouseNumber] = useState<string>("");
    const [apartmentNumber, setApartmentNumber] = useState<string>("");
    const [latitude, setLatitude] = useState<string>("");
    const [longitude, setLongitude] = useState<string>("");
    const [area, setArea] = useState<string>("");
    const [floor, setFloor] = useState<string>("");
    const [rooms, setRooms] = useState<string>("");
    const [floors, setFloors] = useState<string>("");
    const [image, setImage] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handlePropertyData = () => {
        setPropertyType(property?.property_type || "");
        setCity(property?.city || "");
        setStreet(property?.street || "");
        setHouseNumber(property?.house_number || "");
        setApartmentNumber(property?.apartment_number || "");
        setLatitude(property?.latitude?.toString() || "");
        setLongitude(property?.longitude?.toString() || "");
        setArea(property?.area?.toString() || "");
        setFloor(property?.floor?.toString() || "");
        setRooms(property?.rooms?.toString() || "");
        setFloors(property?.floors?.toString() || "");
    };

    useEffect(() => {
        handlePropertyData();
    }, [property, isVisible]);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!propertyType.trim()) {
            newErrors.property_type = "Тип недвижимости обязателен.";
        }

        if (
            latitude &&
            (isNaN(Number(latitude)) ||
                Number(latitude) < -90 ||
                Number(latitude) > 90)
        ) {
            newErrors.latitude = "Широта должна быть числом от -90 до +90.";
        }

        if (
            longitude &&
            (isNaN(Number(longitude)) ||
                Number(longitude) < -180 ||
                Number(longitude) > 180)
        ) {
            newErrors.longitude = "Долгота должна быть числом от -180 до +180.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0]);
        }
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            const formData = new FormData();
            
            // Собираем другие данные
            formData.append("property_type", propertyType);
            formData.append("city", city);
            formData.append("street", street);
            formData.append("house_number", houseNumber);
            formData.append("apartment_number", apartmentNumber);
            formData.append("latitude", latitude);
            formData.append("longitude", longitude);
            formData.append("area", area);
            formData.append("floor", floor);
            formData.append("rooms", rooms);
            formData.append("floors", floors);
    
            // Если изображение выбрано, добавляем его в FormData
            if (image) {
                const fileUri = image.uri;
                const response = await fetch(fileUri);
                const blob = await response.blob();
                
                formData.append("image", blob, "property_image.jpg");
                console.log(image)
            }
    
            const apiCall = property
                ? axios.put(`${API_BASE_URL}/properties/${property.id}/`, formData)
                : axios.post(`${API_BASE_URL}/properties/`, formData);
    
            setLoading(true);
            apiCall
                .then(() => {
                    Alert.alert(
                        "Успех",
                        `Объект недвижимости ${property ? "обновлен" : "создан"} успешно.`,
                    );
                    onUpdate();
                    onClose();
                })
                .catch((error) => {
                    console.log(error);
                    Alert.alert(
                        "Ошибка",
                        `Не удалось ${property ? "обновить" : "создать"} объект недвижимости.`,
                    );
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            Alert.alert("Ошибка", "Заполните форму корректно.");
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
                            {property
                                ? "Редактирование недвижимости"
                                : "Создание недвижимости"}
                        </Text>

                        <Dropdown
                            label="Тип недвижимости"
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
                        {errors.property_type && (
                            <Text style={formStyles.errorText}>
                                {errors.property_type}
                            </Text>
                        )}

                        <Button title="Выбрать изображение" onPress={pickImage} />
                        {image && (
                            <View>
                                <Text>Выбранное изображение:</Text>
                                <Image
                                    source={{ uri: image.uri }}
                                    style={{ width: 200, height: 200, marginTop: 10 }}
                                />
                            </View>
                        )}

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
                        {errors.apartmentNumber && (
                            <Text style={formStyles.errorText}>
                                {errors.apartmentNumber}
                            </Text>
                        )}

                        <Input
                            label="Широта"
                            value={latitude}
                            onChange={setLatitude}
                            keyboardType="numeric"
                        />
                        {errors.latitude && (
                            <Text style={formStyles.errorText}>
                                {errors.latitude}
                            </Text>
                        )}

                        <Input
                            label="Долгота"
                            value={longitude}
                            onChange={setLongitude}
                            keyboardType="numeric"
                        />
                        {errors.longitude && (
                            <Text style={formStyles.errorText}>
                                {errors.longitude}
                            </Text>
                        )}

                        <Input
                            label="Площадь"
                            value={area}
                            onChange={setArea}
                            keyboardType="numeric"
                        />
                        {errors.area && (
                            <Text style={formStyles.errorText}>
                                {errors.area}
                            </Text>
                        )}

                        {propertyType === "Квартира" && (
                            <Input
                                label="Этаж"
                                value={floor}
                                onChange={setFloor}
                                keyboardType="numeric"
                            />
                        )}
                        {errors.floor && (
                            <Text style={formStyles.errorText}>
                                {errors.floor}
                            </Text>
                        )}

                        {(propertyType === "Квартира" ||
                            propertyType === "Дом") && (
                            <Input
                                label="Количество комнат"
                                value={rooms}
                                onChange={setRooms}
                                keyboardType="numeric"
                            />
                        )}
                        {errors.rooms && (
                            <Text style={formStyles.errorText}>
                                {errors.rooms}
                            </Text>
                        )}

                        {propertyType === "Дом" && (
                            <Input
                                label="Этажность дома"
                                value={floors}
                                onChange={setFloors}
                                keyboardType="numeric"
                            />
                        )}
                        {errors.floors && (
                            <Text style={formStyles.errorText}>
                                {errors.floors}
                            </Text>
                        )}

                        <View style={formStyles.actionButtons}>
                            <Button
                                title={property ? "Сохранить" : "Создать"}
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

export default PropertyForm;
