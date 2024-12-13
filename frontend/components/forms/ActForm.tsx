import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Button,
    Alert,
    StyleSheet,
    Modal,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from "react-native";
import axios from "axios";
import Input from "../input";
import Dropdown from "../Dropdown"; // Используем ваш компонент Dropdown
import { API_BASE_URL } from "@/constants/Api";
import { Act } from "@/types/types"; // Тип действия
import { formStyles } from "@/styles/formStyles";
import DateTimePicker from '@react-native-community/datetimepicker';
interface ActFormProps {
    act?: Act | null;
    isVisible: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

const actTypes = [
    { label: "Встреча с клиентом", value: "Встреча с клиентом" },
    { label: "Показ", value: "Показ" },
    { label: "Запланированный звонок", value: "Запланированный звонок" },
];

function ActForm({ act, isVisible, onClose, onUpdate }: ActFormProps) {
    const [dateTime, setDateTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [duration, setDuration] = useState<number>(0);;
    const [actType, setActType] = useState<string | number>("");
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [pickerMode, setPickerMode] = useState<"date" | "time">("date");

    useEffect(() => {
        if (act) {
            setDateTime(new Date(act.date_time));
            setDuration(act.duration);
            setActType(act.act_type);
            setComment(act.comment || "");
        }
    }, [act, isVisible]);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!dateTime) {
            newErrors.dateTime = "Дата и время обязательны.";
        }

        if (!actType) {
            newErrors.actType = "Тип действия обязателен.";
        }

        if (isNaN(Number(duration)) || duration <= 0) {
            newErrors.duration = "Длительность должна быть положительным числом.";
        }

        setErrors(newErrors);
    };
    const showPicker = (currentMode: "date" | "time") => {
        setShowDatePicker(true);
        setPickerMode(currentMode);
    };
    
    const handlePickerChange = (event: any, selectedDate: Date | undefined) => {
        setShowDatePicker(false); // Закрываем пикер после выбора
        if (selectedDate) {
            setDateTime(selectedDate); // Устанавливаем выбранную дату
        }
    };

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || dateTime;
        setShowDatePicker(false);
        setDateTime(currentDate);
    };

    const handleSubmit = () => {
        validateForm();

        if (Object.keys(errors).length === 0) {
            const actData = {
                date_time: dateTime.toISOString(),
                duration,
                act_type: actType,
                comment,
            };

            const apiCall = act
                ? axios.put(`${API_BASE_URL}/acts/${act.id}/`, actData)
                : axios.post(`${API_BASE_URL}/acts/`, actData);

            setLoading(true);
            apiCall
                .then(() => {
                    Alert.alert(
                        "Успех",
                        `Действие ${act ? "обновлено" : "создано"} успешно.`,
                    );
                    onUpdate();
                    onClose();
                })
                .catch(() => {
                    Alert.alert(
                        "Ошибка",
                        `Не удалось ${act ? "обновить" : "создать"} действие.`,
                    );
                })
                .finally(() => {
                    setLoading(false);
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
                            {act ? "Редактирование действия" : "Создание действия"}
                        </Text>

                        <Text>Дата и время</Text>
                        {/* Кнопка для выбора даты */}
                        <TouchableOpacity
                            onPress={() => showPicker("date")}
                            style={styles.dateButton}
                        >
                            <Text style={styles.dateText}>
                                {dateTime.toLocaleDateString("ru-RU", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                })}
                            </Text>
                        </TouchableOpacity>

                        {/* Кнопка для выбора времени */}
                        <TouchableOpacity
                            onPress={() => showPicker("time")}
                            style={styles.dateButton}
                        >
                            <Text style={styles.dateText}>
                                {dateTime.toLocaleTimeString("ru-RU", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </Text>
                        </TouchableOpacity>

                        {/* Показ пикера */}
                        {showDatePicker && (
                            <DateTimePicker
                                value={dateTime}
                                mode={pickerMode} // "date" или "time"
                                display="default"
                                onChange={handlePickerChange}
                            />
                        )}
                        {errors.dateTime && (
                            <Text style={formStyles.errorText}>{errors.dateTime}</Text>
                        )}

                        <Input
                            label="Длительность (мин)"
                            value={String(duration)}
                            onChange={(value) => setDuration(Number(value))}
                            placeholder="Введите длительность"
                            keyboardType="numeric"
                        />
                        {errors.duration && (
                            <Text style={formStyles.errorText}>{errors.duration}</Text>
                        )}

                        <Dropdown
                            label="Тип действия"
                            selectedValue={actType}
                            onValueChange={setActType}
                            options={actTypes}
                            error={errors.actType}
                        />

                        <Input
                            label="Комментарий"
                            value={comment}
                            onChange={setComment}
                            placeholder="Введите комментарий"
                        />

                        <View style={formStyles.actionButtons}>
                            <Button
                                title={act ? "Сохранить" : "Создать"}
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


const styles = StyleSheet.create({
    dateButton: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    dateText: {
        fontSize: 16,
        color: '#333',
    },
});


export default ActForm;
