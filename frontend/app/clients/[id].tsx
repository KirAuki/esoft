import React, { useState, useEffect } from "react";
import { Text, Button, ActivityIndicator, ScrollView,StyleSheet, View } from "react-native";
import axios from "axios";
import { Client } from "@/types/types";
import { useLocalSearchParams } from "expo-router";
import ClientForm from "@/components/forms/ClientForm";
import { API_BASE_URL } from "@/constants/Api";
import { baseStyles } from "@/styles/baseStyle";
import { useForm } from "@/hooks/useForm";
import RelatedList from "@/components/RelatedList";

function ClientDetails() {
    const {
        formVisible,
        setFormVisible,
        handleCloseForm,
        handleEdit,
        handleUpdate,
    } = useForm<Client | null>(null, fetchClient);

    const { id } = useLocalSearchParams<{ id: string }>();
    const [client, setClient] = useState<Client>();
    const [loading, setLoading] = useState(false);

    async function fetchClient() {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/clients/${id}/`);
            setClient(response.data);
        } catch (error) {
            console.log("Ошибка при загрузке клиента:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchClient();
    }, [id]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <ScrollView contentContainerStyle={baseStyles.container}>
            <View style={baseStyles.objectInfo}>
                <Text>{`ФИО: ${client?.last_name || ""} ${client?.first_name || ""} ${client?.patronymic || ""}`}</Text>
                <Text>{`Телефон: ${client?.phone || "не указан"}  Почта: ${client?.email || "не указана"}`}</Text>
            </View>
            <Button
                title="Редактировать клиента"
                onPress={() => setFormVisible(true)}
            />

            <RelatedList clientId={Number(id)} />
            <ClientForm
                client={client}
                isVisible={formVisible}
                onClose={handleCloseForm}
                onUpdate={handleUpdate}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    
});

export default ClientDetails;
