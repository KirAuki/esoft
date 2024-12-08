import { API_BASE_URL } from "@/constants/Api";
import axios from "axios";
import { Alert } from "react-native";

export const handleDelete = async (
    objects: string,
    objectId: number,
    fetch: any,
) => {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/${objects}/${objectId}/`,
        );

        if (response.status === 204) {
            fetch();
            Alert.alert("Объект успешно удален");
            return;
        }
    } catch (err: any) {
        if (err.response && err.response.data) {
            // Если сервер вернул ошибку с описанием
            const { error } = err.response.data;
            Alert.alert(`Ошибка: ${error}`);
        } else {
            // Если ошибка соединения или другие непредсказуемые ошибки
            Alert.alert("Ошибка соединения с сервером.");
        }
    }
};
