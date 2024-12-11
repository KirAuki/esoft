import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Button,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import axios from "axios";
import { Realtor } from "@/types/types";
import { useLocalSearchParams } from "expo-router";
import RealtorForm from "@/components/forms/RealtorForm";
import { API_BASE_URL } from "@/constants/Api";
import { baseStyles } from "@/styles/baseStyle";
import { useForm } from "@/hooks/useForm";
import RelatedList from "@/components/RelatedList";

function RealtorDetails() {
    const { formVisible, setFormVisible, handleCloseForm, handleUpdate } =
        useForm<Realtor | null>(null, fetchRealtor);

    const { id } = useLocalSearchParams<{ id: string }>();
    const [realtor, setRealtor] = useState<Realtor>();
    const [loading, setLoading] = useState(false);

    async function fetchRealtor() {
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
        fetchRealtor();
    }, [id]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <ScrollView contentContainerStyle={baseStyles.container}>
            <Text>{`ФИО: ${realtor?.last_name || ""} ${realtor?.first_name || ""} ${realtor?.patronymic || ""}`}</Text>
            <Text>{`Коммисия: ${realtor?.commission_share || "-"}`}</Text>

            <Button
                title="Редактировать клиента"
                onPress={() => setFormVisible(true)}
            />
            
            <RelatedList realtorId={Number(id)} />

            <RealtorForm
                realtor={realtor}
                isVisible={formVisible}
                onClose={handleCloseForm}
                onUpdate={handleUpdate}
            />
        </ScrollView>
    );
}

export default RealtorDetails;
