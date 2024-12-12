import React from "react";
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";

interface DealDetailsModalProps {
    visible: boolean;
    deal: any | null;
    commissions: any | null;
    onClose: () => void;
}

function DealDetailsModal({
    visible,
    deal,
    commissions,
    onClose,
}: DealDetailsModalProps) {
    if (!deal) return null;

    return (
        <Modal visible={visible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text
                        style={styles.modalTitle}
                    >{`Сделка #${deal.id}`}</Text>
                    <Text>{`Продавец: ${deal.offer.client.full_name || "Не указан"}`}</Text>
                    <Text>{`Риэлтор продавца: ${deal.offer.realtor.full_name || "Не указан"}`}</Text>
                    <Text>{`Покупатель: ${deal.need.client.full_name || "Не указан"}`}</Text>
                    <Text>{`Риэлтор покупателя: ${deal.need.realtor.full_name || "Не указан"}`}</Text>
                    <Text>{`Объект недвижимости: ${deal.offer.property.address || "Адрес не указан"}`}</Text>
                    <Text>{`Тип объекта: ${deal.offer.property.property_type}`}</Text>
                    <Text>{`Цена сделки: ${deal.offer.price} руб.`}</Text>

                    {commissions ? (
                        <>
                            <Text style={styles.commissionTitle}>
                                Комиссии:
                            </Text>
                            <Text>{`Услуги для продавца: ${commissions.seller_commission} руб.`}</Text>
                            <Text>{`Услуги для покупателя: ${commissions.buyer_commission} руб.`}</Text>
                            <Text>{`Риэлтору продавца: ${commissions.seller_realtor_payment} руб.`}</Text>
                            <Text>{`Компании от продавца: ${commissions.company_payment_seller} руб.`}</Text>
                            <Text>{`Риэлтору покупателя: ${commissions.buyer_realtor_payment} руб.`}</Text>
                            <Text>{`Компании от покупателя: ${commissions.company_payment_buyer} руб.`}</Text>
                        </>
                    ) : (
                        <ActivityIndicator size="large" color="#0000ff" />
                    )}

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Text style={styles.closeButtonText}>Закрыть</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    commissionTitle: {
        marginTop: 15,
        fontSize: 16,
        fontWeight: "bold",
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: "#2196F3",
        borderRadius: 5,
        padding: 10,
        alignItems: "center",
    },
    closeButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default DealDetailsModal;
