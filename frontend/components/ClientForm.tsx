import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Button,
    Alert,
    StyleSheet,
    Modal,
    TouchableOpacity,
} from "react-native";
import axios from "axios";
import Input from "./input";
import { API_BASE_URL } from "@/constants/Api";
import { Client, Errors } from "@/types/types";

interface ClientFormProps {
    client?: Client; // Объект клиента для редактирования
    isVisible: boolean; // Состояние видимости модала
    onClose: () => void; // Функция для закрытия модала
    onUpdate: () => void; // Функция для обновления клиента в родительском компоненте
}

function ClientForm({ client, isVisible, onClose, onUpdate }: ClientFormProps) {
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [patronymic, setPatronymic] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Errors>({});

    const handleClientData = () => {
        setLastName(client?.last_name || "");
        setFirstName(client?.first_name || "");
        setPatronymic(client?.patronymic || "");
        setPhone(client?.phone || "");
        setEmail(client?.email || "");
    };

    useEffect(() => {
        handleClientData();
    }, [client, isVisible]);

    const validateForm = () => {
        const newErrors: Errors = {}; // Локальная переменная для новых ошибок

        if (!phone && !email) {
            newErrors.phone_email = "Нужно ввести номер телефона либо почту.";
        }

        if (email && !/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Неверный email.";
        }

        if (phone && !/^(\+7|8)\d{10}$/.test(phone)) {
            newErrors.phone =
                "Номер телефона должен быть формата +7 или 8 и содержать 10 цифр.";
        }

        setErrors(newErrors); // Установка новых ошибок
    };
    const handleSubmit = () => {
        validateForm();

        if (Object.keys(errors).length === 0) {
            const clientData = {
                last_name: lastName,
                first_name: firstName,
                patronymic,
                phone,
                email,
            };

            const apiCall = client
                ? axios.put(`${API_BASE_URL}/clients/${client.id}/`, clientData)
                : axios.post(`${API_BASE_URL}/clients/`, clientData);

            setLoading(true);
            apiCall
                .then(() => {
                    Alert.alert(
                        "Успех",
                        `Клиент ${client ? "обновлен" : "создан"} успешно.`,
                    );
                    onUpdate();
                    onClose();
                })
                .catch(() => {
                    Alert.alert(
                        "Ошибка",
                        `Не удалось ${client ? "обновить" : "создать"} клиента.`,
                    );
                })
                .finally(() => {
                    setLoading(false);
                    if (!client) {
                        handleClientData();
                    }
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
                    {client ? "Редактирование клиента" : "Создание клиента"}
                </Text>

                <Input
                    label="Фамилия"
                    value={lastName}
                    onChange={setLastName}
                />
                <Input label="Имя" value={firstName} onChange={setFirstName} />
                <Input
                    label="Отчество"
                    value={patronymic}
                    onChange={setPatronymic}
                />
                <Input
                    label="Телефон"
                    value={phone}
                    onChange={setPhone}
                    placeholder="Введите телефон"
                />
                {errors.phone && (
                    <Text style={styles.errorText}>{errors.phone}</Text>
                )}

                <Input
                    label="Электронная почта"
                    value={email}
                    onChange={setEmail}
                    placeholder="Введите почту"
                />
                {errors.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                )}
                {errors.phone_email && (
                    <Text style={styles.errorText}>{errors.phone_email}</Text>
                )}

                <Button
                    title={client ? "Сохранить" : "Создать"}
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
    },
});

export default ClientForm;
