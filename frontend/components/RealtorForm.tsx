import { Alert, Modal, View, Text, TouchableOpacity,StyleSheet, Button} from "react-native";
import Input from "./input";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/constants/Api";
import { Realtor } from "@/types/types";

interface RealtorFormProps {
    realtor?: Realtor; // Объект риэлтора для редактирования
    isVisible: boolean; // Состояние видимости модала
    onClose: () => void; // Функция для закрытия модала
    onUpdate: () => void; // Функция для обновления риэлторов в родительском компоненте
}
  
  function RealtorForm({ realtor, isVisible, onClose, onUpdate }: RealtorFormProps) {
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [patronymic, setPatronymic] = useState('');
    const [commissionShare, setCommissionShare] = useState<string | undefined>('');
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      if (realtor) {
        setLastName(realtor.last_name || '');
        setFirstName(realtor.first_name || '');
        setPatronymic(realtor.patronymic || '');
        setCommissionShare(realtor.commission_share?.toString() || '');
      }
    }, [realtor]);
  
    const handleSubmit = () => {
      if (!lastName || !firstName) {
        Alert.alert('Ошибка', 'Поля Фамилия и Имя обязательны для заполнения.');
        return;
      }
  
      if (commissionShare && (Number(commissionShare) < 0 || Number(commissionShare) > 100)) {
        Alert.alert('Ошибка', 'Доля от комиссии должна быть числом от 0 до 100.');
        return;
      }
  
      const realtorData = {
        last_name: lastName,
        first_name: firstName,
        patronymic,
        commission_share: commissionShare ? Number(commissionShare) : undefined,
      };
  
      const apiCall = realtor
        ? axios.put(`${API_BASE_URL}/realtors/${realtor.id}/`, realtorData) // Редактирование
        : axios.post(`${API_BASE_URL}/realtors/`, realtorData); // Создание нового риэлтора
  
      setLoading(true);
      apiCall
        .then(() => {
          Alert.alert('Успех', `Риэлтор ${realtor ? 'обновлен' : 'создан'} успешно.`);
          onUpdate(); // Обновление данных риэлторов в родительском компоненте
          onClose(); // Закрыть модальное окно после успешной отправки
        })
        .catch(() => {
          Alert.alert('Ошибка', `Не удалось ${realtor ? 'обновить' : 'создать'} риэлтора.`);
        })
        .finally(() => setLoading(false));
    };
  
    return (
        <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
            <View style={styles.container}>
                <Text style={styles.title}>{realtor ? 'Редактирование риэлтора' : 'Создание риэлтора'}</Text>
    
                <Input label="Фамилия" value={lastName} onChange={setLastName} isRequired />
                <Input label="Имя" value={firstName} onChange={setFirstName} isRequired />
                <Input label="Отчество" value={patronymic} onChange={setPatronymic} isRequired />
                <Input
                    label="Доля от комиссии (%)"
                    value={commissionShare || ''}
                    onChange={setCommissionShare}
                    keyboardType="numeric"
                    placeholder="Введите процент от комиссии"
                />
  
            <Button title={realtor ? 'Сохранить' : 'Создать'} onPress={handleSubmit} disabled={loading} />
  
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
  
  export default RealtorForm;