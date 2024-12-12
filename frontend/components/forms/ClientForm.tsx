import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Button,
    Alert,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import axios from "axios";
import Input from "../input";
import { API_BASE_URL } from "@/constants/Api";
import { Client, Errors } from "@/types/types";
import { formStyles } from "@/styles/formStyles";

interface ClientFormProps {
    client?: Client | null;
    isVisible: boolean;
    onClose: () => void;
    onUpdate: () => void;
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
        const newErrors: Errors = {};

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

        setErrors(newErrors);
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
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={formStyles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                >
                    <View style={formStyles.container}>
                        <Text style={formStyles.title}>
                            {client
                                ? "Редактирование клиента"
                                : "Создание клиента"}
                        </Text>

                        <Input
                            label="Фамилия"
                            value={lastName}
                            onChange={setLastName}
                        />
                        <Input
                            label="Имя"
                            value={firstName}
                            onChange={setFirstName}
                        />
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
                            <Text style={formStyles.errorText}>
                                {errors.phone}
                            </Text>
                        )}

                        <Input
                            label="Электронная почта"
                            value={email}
                            onChange={setEmail}
                            placeholder="Введите почту"
                        />
                        {errors.email && (
                            <Text style={formStyles.errorText}>
                                {errors.email}
                            </Text>
                        )}
                        {errors.phone_email && (
                            <Text style={formStyles.errorText}>
                                {errors.phone_email}
                            </Text>
                        )}
                        <View style={formStyles.actionButtons}>
                            <Button
                                title={client ? "Сохранить" : "Создать"}
                                onPress={handleSubmit}
                                disabled={loading}
                            />
                            <Button
                                title="Закрыть"
                                onPress={onClose}
                                color="red"
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
}

export default ClientForm;
