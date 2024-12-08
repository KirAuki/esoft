import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import axios from "axios";
import { Realtor } from "@/types/types";
import { useLocalSearchParams } from "expo-router";
import RealtorForm from "@/components/RealtorForm";
import { API_BASE_URL } from "@/constants/Api";

function RealtorDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [realtor, setRealtor] = useState<Realtor>();
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);

    async function fetchRealor() {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/realtors/${id}/`);
            setRealtor(response.data);
        } catch (error) {
            console.log("Ошибка при загрузке клиента:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchRealor();
    }, [id]);

    const handleClientUpdate = async () => {
        await fetchRealor();
    };

    return (
        <View style={styles.container}>
            <Text>{`ФИО: ${realtor?.last_name || ""} ${realtor?.first_name || ""} ${realtor?.patronymic || ""}`}</Text>
            <Text>{`Коммисия: ${realtor?.commission_share || "-"}`}</Text>

            <Button
                title="Редактировать клиента"
                onPress={() => setModalVisible(true)}
            />

            <RealtorForm
                realtor={realtor}
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onUpdate={handleClientUpdate}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
});

export default RealtorDetails;
