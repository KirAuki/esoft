import { API_BASE_URL } from "@/constants/Api";
import axios from "axios";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
    Button,
    TextInput,
    View,
    Text,
    Alert,
    Switch,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { Property } from "@/types/types";
import { handleDelete } from "@/hooks/handleDelete";
import PropertyForm from "@/components/forms/PropertiesForm";
import { baseStyles } from "@/styles/baseStyles";
import { useForm } from "@/hooks/useForm";

function PropertiesPage() {
    const {
        formVisible,
        currentItem,
        handleCreate,
        handleEdit,
        handleCloseForm,
        handleUpdate,
    } = useForm<Property | null>(null, fetchProperties);

    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchType, setSearchType] = useState<"address" | "polygon">(
        "address",
    );
    const [polygonCoordinates, setPolygonCoordinates] = useState<string[]>([]);
    const [propertyType, setPropertyType] = useState<string>("");

    async function fetchProperties() {
        setLoading(true);
        try {
            const params: Record<string, any> = {
                address: searchQuery,
                property_type: propertyType,
            };

            let endpoint = `${API_BASE_URL}/properties/`;
            if (searchQuery) {
                if (searchType === "address") {
                    endpoint = `${API_BASE_URL}/properties/search_by_address/`;
                    params.query = searchQuery;
                } else {
                    endpoint = `${API_BASE_URL}/properties/search_in_region/`;
                    params.coordinates = polygonCoordinates;
                }
            }

            const response = await axios.get(endpoint, { params });
            setProperties(response.data);
        } catch (error) {
            console.log("Ошибка при загрузке объектов недвижимости:", error);
            Alert.alert("Ошибка", "Не удалось загрузить данные.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProperties();
    }, []);

    useEffect(() => {
        fetchProperties();
    }, [propertyType]);

    const handleSearchChange = (text: string) => {
        setSearchQuery(text);
    };

    const handleSearchSubmit = () => {
        fetchProperties();
    };

    const toggleSearchType = () => {
        setSearchType((prevType) => {
            if (prevType === "address") {
                setPolygonCoordinates([]);
                return "polygon";
            } else {
                setSearchQuery("");
                return "address";
            }
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
                <View style={baseStyles.searchControls}>
                    <Text>Поиск по адресу</Text>
                    <Switch
                        value={searchType === "polygon"}
                        onValueChange={toggleSearchType}
                    />
                    <Text>Поиск по региону</Text>
                </View>

                {/* Поле для ввода адреса или координат */}
                {searchType === "address" ? (
                    <TextInput
                        placeholder="Введите адрес для поиска..."
                        value={searchQuery}
                        onChangeText={handleSearchChange}
                        onSubmitEditing={handleSearchSubmit}
                        returnKeyType="search"
                        style={baseStyles.searchInput}
                    />
                ) : (
                    <TextInput
                        placeholder="Введите координаты региона через запятую..."
                        value={polygonCoordinates.join(", ")}
                        onChangeText={(text) =>
                            setPolygonCoordinates(
                                text.split(",").map((s) => s.trim()),
                            )
                        }
                        style={baseStyles.searchInput}
                    />
                )}

                <View style={baseStyles.filterButtons}>
                    {["Квартира", "Дом", "Земля"].map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                baseStyles.filterButton,
                                propertyType === type &&
                                    baseStyles.selectedButton,
                            ]}
                            onPress={() => setPropertyType(type)}
                        >
                            <Text
                                style={[
                                    baseStyles.filterButtonText,
                                    propertyType === type &&
                                        baseStyles.selectedButtonText,
                                ]}
                            >
                                {type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <Button title="Создать недвижимость" onPress={handleCreate} />
                {properties.length > 0 ? (
                    properties.map((property) => (
                        <View
                            key={property.id}
                            style={baseStyles.objectsContainer}
                        >
                            <View style={baseStyles.objectInfo}>
                                <Text>{`Тип: ${property.property_type}`}</Text>
                                <Text>{`Адрес: ${property.address}`}</Text>
                                <Text>{`Площадь: ${property.area || "-"}, Комнаты: ${property.rooms || "-"}, Этаж: ${property.floor || "-"}, Этажность: ${property.floors || "-"}`}</Text>
                            </View>
                            <View style={baseStyles.objectActionButtons}>
                                <Button
                                    title="Редактировать"
                                    onPress={() => handleEdit(property)}
                                />
                                <Button
                                    title="Удалить"
                                    onPress={() =>
                                        handleDelete(
                                            "properties",
                                            property.id,
                                            fetchProperties,
                                        )
                                    }
                                    color="red"
                                />
                            </View>
                        </View>
                    ))
                ) : (
                    <Text>Список объектов недвижимости пуст.</Text>
                )}

                <PropertyForm
                    property={currentItem}
                    isVisible={formVisible}
                    onClose={handleCloseForm}
                    onUpdate={handleUpdate}
                />
            </ScrollView>
        </View>
    );
}

export default PropertiesPage;
