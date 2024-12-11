import {
    Alert,
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Button,
} from "react-native";
import Input from "../input";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/constants/Api";
import { Errors, Realtor } from "@/types/types";

interface RealtorFormProps {
    realtor?: Realtor | null;
    isVisible: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

function RealtorForm({
    realtor,
    isVisible,
    onClose,
    onUpdate,
}: RealtorFormProps) {
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [patronymic, setPatronymic] = useState("");
    const [commissionShare, setCommissionShare] = useState<string | undefined>(
        "",
    );
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Errors>({});

    const handleRealtorData = () => {
        setLastName(realtor?.last_name || "");
        setFirstName(realtor?.first_name || "");
        setPatronymic(realtor?.patronymic || "");
        setCommissionShare(realtor?.commission_share?.toString() || "");
    };

    useEffect(() => {
        handleRealtorData();
        setErrors({});
    }, [realtor, isVisible]);

    const validateForm = (): boolean => {
        const newErrors: Errors = {};

        if (!lastName.trim()) {
            newErrors.lastName = "Фамилия обязательна для заполнения.";
        }

        if (!firstName.trim()) {
            newErrors.firstName = "Имя обязательно для заполнения.";
        }

        if (!patronymic.trim()) {
            newErrors.patronymic = "Отчество обязательно для заполнения.";
        }

        if (
            commissionShare &&
            (Number(commissionShare) < 0 || Number(commissionShare) > 100)
        ) {
            newErrors.commissionShare =
                "Доля от комиссии должна быть числом от 0 до 100.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            const realtorData = {
                last_name: lastName,
                first_name: firstName,
                patronymic,
                commission_share: commissionShare
                    ? Number(commissionShare)
                    : undefined,
            };

            const apiCall = realtor
                ? axios.put(
                      `${API_BASE_URL}/realtors/${realtor.id}/`,
                      realtorData,
                  )
                : axios.post(`${API_BASE_URL}/realtors/`, realtorData);

            setLoading(true);
            apiCall
                .then(() => {
                    onUpdate();
                    onClose();
                })
                .catch(() => {
                    Alert.alert(
                        "Ошибка",
                        "Не удалось сохранить данные риэлтора.",
                    );
                })
                .finally(() => setLoading(false));
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
                    {realtor ? "Редактирование риэлтора" : "Создание риэлтора"}
                </Text>
                <Input
                    label="Фамилия"
                    value={lastName}
                    onChange={setLastName}
                    isRequired
                />
                {errors.lastName && (
                    <Text style={styles.errorText}>{errors.lastName}</Text>
                )}
                <Input
                    label="Имя"
                    value={firstName}
                    onChange={setFirstName}
                    isRequired
                />
                {errors.firstName && (
                    <Text style={styles.errorText}>{errors.firstName}</Text>
                )}
                <Input
                    label="Отчество"
                    value={patronymic}
                    onChange={setPatronymic}
                    isRequired
                />
                {errors.patronymic && (
                    <Text style={styles.errorText}>{errors.patronymic}</Text>
                )}
                <Input
                    label="Доля от комиссии (%)"
                    value={commissionShare || ""}
                    onChange={setCommissionShare}
                    keyboardType="numeric"
                    placeholder="Введите процент от комиссии"
                />
                {errors.commissionShare && (
                    <Text style={styles.errorText}>
                        {errors.commissionShare}
                    </Text>
                )}
                <Button
                    title={realtor ? "Сохранить" : "Создать"}
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
        alignSelf: "center",
        marginTop: 16,
        padding: 10,
        borderRadius: 4,
    },
    closeButtonText: {
        color: "#ff0000",
        fontSize: 16,
    },
});

export default RealtorForm;
