import { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View , Text, TextInput, Button, StyleSheet, Alert} from "react-native";
import axios from 'axios'; 
import { API_BASE_URL } from "@/constants/Api";
import { Realtor } from "@/types/types";
import { Link } from "expo-router";
import RealtorForm from "@/components/RealtorForm";


function RealtorsList() {
    const [realtors, setRealtors] = useState<Realtor[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isModalVisible, setModalVisible] = useState(false);

    async function fetchRealtors(searchQuery: string = '') {
        setLoading(true);
        try {
            const endpoint = searchQuery ? `${API_BASE_URL}/realtors/search/` : `${API_BASE_URL}/realtors/`;
            const params = searchQuery ? { query : searchQuery} : {};
            
            const response = await axios.get(endpoint, {params})
            setRealtors(response.data);
        } catch(error) {
            console.log('Ошибка при загрузке риелторов:', error);
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        if (searchQuery === '') {
            fetchRealtors();
        } else {
            fetchRealtors(searchQuery);
        }
    }, [searchQuery]);

    const handleSearchChange = (text:string) => {
        setSearchQuery(text);
        fetchRealtors(text)
    }

    
    const handleRealtorsUpdate = async () => {
        await fetchRealtors();
    };
    const handleDeleteRealtor = async (realtorId: number) => {
        try {
          const response = await axios.delete(`${API_BASE_URL}/realtors/${realtorId}/`);;
      
          if (response.status === 204) {
            fetchRealtors();
            Alert.alert("Клиент успешно удален");
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
    return ( 
        <View style={styles.container}>
            <TextInput 
                placeholder="Поиск по ФИО..."
                value={searchQuery}
                onChangeText={handleSearchChange}
                style={styles.searchInput}
            />
            <FlatList
                data={realtors}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.realtorContainer}>
                        <Link href={{ pathname: '/realtors/[id]', params: { id: item.id } }} style={styles.realtorLink}>
                            <Text style={styles.realtorName}>{`${item.last_name || ''} ${item.first_name || ''} ${item.patronymic || ''}`}</Text>
                            <Text>{`Коммисия: ${item.commission_share || '-'}`}</Text>
                        </Link>
                        <Button
                            title="Удалить"
                            onPress={() => handleDeleteRealtor(item.id)}
                            color="red"
                        />
                    </View> 
                )}
            />
            <Button title="Создать риелтора" onPress={() => setModalVisible(true)} />
            <RealtorForm
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onUpdate={handleRealtorsUpdate}
            /> 
        </View>
    );
}

export default RealtorsList;



const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        marginBottom: 16,
    },
    realtorContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    realtorLink: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
    },
    realtorName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
});