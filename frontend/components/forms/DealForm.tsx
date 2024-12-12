import { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    Button,
    Alert,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import axios from "axios";
import { API_BASE_URL } from "@/constants/Api";
import { Deal, Need, Offer } from "@/types/types";
import { formStyles } from "@/styles/formStyles";
import NeedSelector from "../NeedSelector";
import OfferSelector from "../OfferSelector";

interface DealFormProps {
    deal?: Deal | null;
    isVisible: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

function DealForm({ isVisible, deal, onUpdate, onClose }: DealFormProps) {
    const [selectedNeed, setSelectedNeed] = useState<Need | null>(null);
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

    const [isNeedModalVisible, setNeedModalVisible] = useState(false);
    const [isOfferModalVisible, setOfferModalVisible] = useState(false);


    useEffect(() => {
        if (deal) {
            setSelectedNeed(deal.need);
            setSelectedOffer(deal.offer);
        }
    }, [deal])

    const validateForm = () => {
        if (!selectedNeed || !selectedOffer) {
            Alert.alert("Ошибка", "Выберите потребность и предложение.");
            return false;
        }
        return true;
    };
    const handleClose = () => {
        setSelectedNeed(null);
        setSelectedOffer(null);
        onClose(); 
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const dealData = {
            need: selectedNeed?.id,
            offer: selectedOffer?.id,
        };

        try {
            if (deal) {
                await axios.put(`${API_BASE_URL}/deals/${deal.id}/`, dealData);
            } else {
                await axios.post(`${API_BASE_URL}/deals/`, dealData);
            }

            Alert.alert(
                "Успех",
                `Сделка ${deal ? "обновлена" : "создана"} успешно.`,
            );
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Ошибка сохранения сделки:", error);
            Alert.alert("Ошибка", "Не удалось сохранить сделку.");
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
                            {deal ? "Редактирование сделки" : "Создание сделки"}
                        </Text>

                        <TouchableOpacity
                            style={formStyles.selectButton}
                            onPress={() => setNeedModalVisible(true)}
                        >
                            <Text>
                                {selectedNeed
                                    ? `Потребность: ${selectedNeed.address}`
                                    : "Выберите потребность"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={formStyles.selectButton}
                            onPress={() => setOfferModalVisible(true)}
                        >
                            <Text>
                                {selectedOffer
                                    ? `Предложение: ${selectedOffer.property.address}`
                                    : "Выберите предложение"}
                            </Text>
                        </TouchableOpacity>

                        <NeedSelector
                            isVisible={isNeedModalVisible}
                            onClose={() => setNeedModalVisible(false)}
                            onSelect={setSelectedNeed}
                            offerId={selectedOffer?.id}
                        />
                        <OfferSelector
                            isVisible={isOfferModalVisible}
                            onClose={() => setOfferModalVisible(false)}
                            onSelect={setSelectedOffer}
                            needId={selectedNeed?.id}
                        />

                        <View style={formStyles.actionButtons}>
                            <Button
                                title={deal ? "Сохранить" : "Создать"}
                                onPress={handleSubmit}
                            />
                            <Button
                                title="Закрыть"
                                onPress={handleClose}
                                color="red"
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    );
}


export default DealForm;
