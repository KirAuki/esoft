import { API_BASE_URL } from "@/constants/Api";
import axios from "axios";
import { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    Button,
    Alert,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { Property } from "@/types/types";
import Input from "./input";
import Dropdown from "./Dropdown";

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
    const [city, setCity] = useState<string>("");
    const [street, setStreet] = useState<string>("");
    const [houseNumber, setHouseNumber] = useState<string>("");
    const [apartmentNumber, setApartmentNumber] = useState<string>("");
    const [latitude, setLatitude] = useState<string>("");
    const [longitude, setLongitude] = useState<string>("");
    const [propertyType, setPropertyType] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handlePropertyData = () => {
        setCity(property?.city || "");
        setStreet(property?.street || "");
        setHouseNumber(property?.house_number || "");
        setApartmentNumber(property?.apartment_number || "");
        setLatitude(property?.latitude?.toString() || "");
        setLongitude(property?.longitude?.toString() || "");
        setPropertyType(property?.property_type || "");
    };

    useEffect(() => {
        handlePropertyData();
    }, [property, isVisible]);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

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

        if (propertyType && !propertyType.trim()) {
            newErrors.property_type = "Тип недвижимости обязателен.";
        }

        setErrors(newErrors);
    };

    const handleSubmit = () => {
        validateForm();

        if (Object.keys(errors).length === 0) {
            const propertyData = {
                city,
                street,
                house_number: houseNumber,
                apartment_number: apartmentNumber,
                latitude: latitude ? Number(latitude) : undefined,
                longitude: longitude ? Number(longitude) : undefined,
                property_type: propertyType,
            };

            const apiCall = property
                ? axios.put(
                      `${API_BASE_URL}/properties/${property.id}/`,
                      propertyData,
                  )
                : axios.post(`${API_BASE_URL}/properties/`, propertyData);

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
                .catch(() => {
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
            <View style={styles.container}>
                <Text style={styles.title}>
                    {property
                        ? "Редактирование недвижимости"
                        : "Создание недвижимости"}
                </Text>

                <Input label="Город" value={city} onChange={setCity} />
                {errors.city && (
                    <Text style={styles.errorText}>{errors.city}</Text>
                )}

                <Input label="Улица" value={street} onChange={setStreet} />
                {errors.street && (
                    <Text style={styles.errorText}>{errors.street}</Text>
                )}

                <Input
                    label="Номер дома"
                    value={houseNumber}
                    onChange={setHouseNumber}
                />
                {errors.houseNumber && (
                    <Text style={styles.errorText}>{errors.houseNumber}</Text>
                )}

                <Input
                    label="Номер квартиры"
                    value={apartmentNumber}
                    onChange={setApartmentNumber}
                />
                {errors.apartmentNumber && (
                    <Text style={styles.errorText}>
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
                    <Text style={styles.errorText}>{errors.latitude}</Text>
                )}

                <Input
                    label="Долгота"
                    value={longitude}
                    onChange={setLongitude}
                    keyboardType="numeric"
                />
                {errors.longitude && (
                    <Text style={styles.errorText}>{errors.longitude}</Text>
                )}

                <Dropdown
                    label="Тип недвижимости"
                    selectedValue={propertyType}
                    onValueChange={(value) => setPropertyType(String(value))}
                    options={[
                        { label: "Квартира", value: "apartment" },
                        { label: "Дом", value: "house" },
                        { label: "Земля", value: "land" },
                    ]}
                />
                {errors.property_type && (
                    <Text style={styles.errorText}>{errors.property_type}</Text>
                )}

                <Button
                    title={property ? "Сохранить" : "Создать"}
                    onPress={handleSubmit}
                    disabled={loading}
                />

                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Закрыть</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginBottom: 8,
    },
    closeButton: {
        marginTop: 16,
        padding: 10,
        borderRadius: 4,
    },
    closeButtonText: {
        color:'#ff0000',
        fontSize: 16,
    },
});

export default PropertyForm;
