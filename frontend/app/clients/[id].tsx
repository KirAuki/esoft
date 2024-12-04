import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { Client } from '@/types/types';
import { useLocalSearchParams } from 'expo-router';
import ClientForm from '@/components/ClientForm';
import { API_BASE_URL } from '@/constants/Api';


function ClientDetails() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [client, setClient] = useState<Client>();
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);

    async function fetchClient() {
        setLoading(true);
        try {
        const response = await axios.get(`${API_BASE_URL}/clients/${id}/`);
        setClient(response.data);
        } catch (error) {
        console.log('Ошибка при загрузке клиента:', error);
        } finally {
        setLoading(false);
        }
    }
    useEffect(() => {
        

        fetchClient();
    }, [id]);

    const handleClientUpdate = async () => {
        await fetchClient();
    };

    return (
        <View style={styles.container}>
            <Text>{`ФИО: ${client?.last_name || ''} ${client?.first_name || ''} ${client?.patronymic || ''}`}</Text>
            <Text>{`Телефон: ${client?.phone || 'не указан'}  Почта: ${client?.email || 'не указана'}`}</Text>

            <Button title="Редактировать клиента" onPress={() => setModalVisible(true)} />

            <ClientForm
                client={client}
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

export default ClientDetails;
