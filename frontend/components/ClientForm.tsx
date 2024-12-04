import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Input from './input';
import { API_BASE_URL } from '@/constants/Api';
import { Client } from '@/types/types';


interface ClientFormProps {
    client?: Client;  // Объект клиента для редактирования
    isVisible: boolean; // Состояние видимости модала
    onClose: () => void; // Функция для закрытия модала
    onUpdate: () => void; // Функция для обновления клиента в родительском компоненте
}

function ClientForm({ client, isVisible, onClose, onUpdate }: ClientFormProps) {
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [patronymic, setPatronymic] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (client) {
        setLastName(client.last_name || '');
        setFirstName(client.first_name || '');
        setPatronymic(client.patronymic || '');
        setPhone(client.phone || '');
        setEmail(client.email || '');
        }
    }, [client]);

    const handleSubmit = () => {
        if (!phone && !email) {
            Alert.alert('Ошибка', 'Необходимо указать телефон или почту.');
            return;
        }

        const clientData = {
            last_name: lastName,
            first_name: firstName,
            patronymic,
            phone,
            email,
        };

        const apiCall = client
        ? axios.put(`${API_BASE_URL}/clients/${client.id}/`, clientData)  // Редактирование
        : axios.post(`${API_BASE_URL}/clients/`, clientData);   // Создание нового клиента

        setLoading(true);
        apiCall
        .then(response => {
            Alert.alert('Успех', `Клиент ${client ? 'обновлен' : 'создан'} успешно.`);
            onUpdate();  // Обновление данных клиента в родительском компоненте
            onClose();  // Закрыть модальное окно после успешной отправки
        })
        .catch(error => {
            Alert.alert('Ошибка', `Не удалось ${client ? 'обновить' : 'создать'} клиента.`);
        })
        .finally(() => setLoading(false));
    };

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
        <View style={styles.container}>
            <Text style={styles.title}>{client ? 'Редактирование клиента' : 'Создание клиента'}</Text>

            <Input label="Фамилия" value={lastName} onChange={setLastName} />
            <Input label="Имя" value={firstName} onChange={setFirstName} />
            <Input label="Отчество" value={patronymic} onChange={setPatronymic} />
            <Input label="Телефон" value={phone} onChange={setPhone} placeholder="Введите телефон" />
            <Input label="Электронная почта" value={email} onChange={setEmail} placeholder="Введите почту" />

            <Button title={client ? 'Сохранить' : 'Создать'} onPress={handleSubmit} disabled={loading} />

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
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  closeButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'red',
    fontSize: 16,
  },
});

export default ClientForm;
