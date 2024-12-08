import { useEffect, useState } from "react";
import {
    FlatList,
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
} from "react-native";
import axios from "axios";
import { API_BASE_URL } from "@/constants/Api";
import { Realtor } from "@/types/types";
import { Link } from "expo-router";
import RealtorForm from "@/components/RealtorForm";
import { handleDelete } from "@/hooks/handleDelete";

function RealtorsList() {
    const [realtors, setRealtors] = useState<Realtor[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isModalVisible, setModalVisible] = useState(false);

    async function fetchRealtors(searchQuery: string = "") {
        setLoading(true);
        try {
            const endpoint = searchQuery
                ? `${API_BASE_URL}/realtors/search/`
                : `${API_BASE_URL}/realtors/`;
            const params = searchQuery ? { query: searchQuery } : {};

            const response = await axios.get(endpoint, { params });
            setRealtors(response.data);
        } catch (error) {
            console.log("Ошибка при загрузке риелторов:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (searchQuery === "") {
            fetchRealtors();
        } else {
            fetchRealtors(searchQuery);
        }
    }, [searchQuery]);

    const handleSearchChange = (text: string) => {
        setSearchQuery(text);
        fetchRealtors(text);
    };

    const handleRealtorsUpdate = async () => {
        await fetchRealtors();
    };
    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Поиск по ФИО..."
                value={searchQuery}
                onChangeText={handleSearchChange}
                style={styles.searchInput}
            />
            <FlatList
                data={realtors}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.realtorContainer}>
                        <Link
                            href={{
                                pathname: "/realtors/[id]",
                                params: { id: item.id },
                            }}
                            style={styles.realtorLink}
                        >
                            <Text
                                style={styles.realtorName}
                            >{`${item.last_name || ""} ${item.first_name || ""} ${item.patronymic || ""}`}</Text>
                            <Text>{`Коммисия: ${item.commission_share || "-"}`}</Text>
                        </Link>
                        <Button
                            title="Удалить"
                            onPress={() =>
                                handleDelete("realtors", item.id, fetchRealtors)
                            }
                            color="red"
                        />
                    </View>
                )}
            />
            <Button
                title="Создать риелтора"
                onPress={() => setModalVisible(true)}
            />
            <RealtorForm
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onUpdate={handleRealtorsUpdate}
            />
        </View>
    );
}

export default RealtorsList;

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    searchInput: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    realtorContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        padding: 12,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    realtorLink: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
    },
    realtorName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 4,
    },
});
