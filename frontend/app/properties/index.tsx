import { API_BASE_URL } from "@/constants/Api";
import axios from "axios";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
    Button,
    FlatList,
    TextInput,
    View,
    Text,
    StyleSheet,
    Alert,
    Switch,
    TouchableOpacity,
} from "react-native";
import { Property } from "@/types/types";
import { handleDelete } from "@/hooks/handleDelete";
import PropertyForm from "@/components/PropertiesForm";

function PropertiesList() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>(""); // Для поиска по адресу
    const [searchType, setSearchType] = useState<"address" | "polygon">(
        "address",
    );
    const [polygonCoordinates, setPolygonCoordinates] = useState<string[]>([]); // Для поиска по региону
    const [propertyType, setPropertyType] = useState<string>(""); // Для фильтрации по типу недвижимости
    const [isPropertyFormVisible, setIsPropertyFormVisible] = useState(false);
    const [editingProperty, setEditingProperty] = useState<Property | null>(
        null,
    );

    // Функция для загрузки объектов недвижимости
    async function fetchProperties() {
        setLoading(true);
        try {
            const params: Record<string, any> = {
                address: searchQuery, // Поиск по адресу
                property_type: propertyType, // Фильтрация по типу недвижимости
            };

            let endpoint = `${API_BASE_URL}/properties/`;

            // Определяем endpoint в зависимости от типа поиска
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
    }, [searchQuery, searchType, polygonCoordinates, propertyType]);

    const handleSearchChange = (text: string) => {
        setSearchQuery(text);
    };

    const toggleSearchType = () => {
        setSearchType((prevType) => {
            if (prevType === "address") {
                // Сбросить строку поиска для координат
                setPolygonCoordinates([]);
                return "polygon";
            } else {
                // Сбросить строку поиска для адреса
                setSearchQuery("");
                return "address";
            }
        });
    };

    const handleCreateProperty = () => {
        setEditingProperty(null); // Обнуляем объект при создании нового
        setIsPropertyFormVisible(true);
    };

    const handleEditProperty = (property: Property) => {
        setEditingProperty(property); // Передаем объект для редактирования
        setIsPropertyFormVisible(true);
    };

    const handleCloseForm = () => {
        setIsPropertyFormVisible(false);
    };

    const handleUpdateProperties = () => {
        fetchProperties();
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchControls}>
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
                    style={styles.searchInput}
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
                    style={styles.searchInput}
                />
            )}

            <View style={styles.propertyTypeButtons}>
                {["Квартира", "Дом", "Земля"].map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={[
                            styles.propertyTypeButton,
                            propertyType === type && styles.selectedButton,
                        ]}
                        onPress={() => setPropertyType(type)}
                    >
                        <Text
                            style={[
                                styles.propertyTypeButtonText,
                                propertyType === type &&
                                    styles.selectedButtonText,
                            ]}
                        >
                            {type}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={properties}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.propertiesContainer}>
                        <Link
                            href={{
                                pathname: "/properties/[id]",
                                params: { id: item.id },
                            }}
                            style={styles.propertyLink}
                        >
                            <View>
                                <Text
                                    style={styles.propertyName}
                                >{`Тип: ${item.property_type}`}</Text>
                                <Text>{`Адрес: ${item.address}`}</Text>
                                <Text>{`Площадь: ${item.area || "не указана"}, Комнаты: ${item.rooms || "не указано"}, Этаж: ${item.floor || "не указан"}, Этажность: ${item.floors || "не указана"}`}</Text>
                            </View>
                        </Link>
                        <View style={styles.propertyActionButtons}>
                            <Button
                                title="Редактировать"
                                onPress={() => handleEditProperty(item)}
                            />
                            <Button
                                title="Удалить"
                                onPress={() =>
                                    handleDelete(
                                        "properties",
                                        item.id,
                                        fetchProperties,
                                    )
                                }
                                color="red"
                            />
                        </View>  
                    </View>
                )}
                ListEmptyComponent={
                    <Text>Список объектов недвижимости пуст.</Text>
                }
                refreshing={loading}
                onRefresh={fetchProperties}
            />

            <Button
                title="Создать новое имущество"
                onPress={handleCreateProperty}
            />
            <PropertyForm
                property={editingProperty}
                isVisible={isPropertyFormVisible}
                onClose={handleCloseForm}
                onUpdate={handleUpdateProperties}
            />
        </View>
    );
}

export default PropertiesList;

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    searchControls: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginBottom: 16,
    },
    searchInput: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    propertiesContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 16,
        marginBottom: 16,
        padding: 12,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    propertyLink: {
        flexDirection: "column",
        gap: 10,
    },
    propertyName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
    propertyActionButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    propertyTypeButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 16,
    },
    propertyTypeButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 4,
        marginHorizontal: 5,
    },
    selectedButton: {
        backgroundColor: "#007bff",
    },
    propertyTypeButtonText: {
        fontSize: 16,
        color: "#000",
    },
    selectedButtonText: {
        color: "#fff",
    },
});
