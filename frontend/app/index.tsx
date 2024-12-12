import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                gap: 20,
            }}
        >
            <Link href={"/properties"}>
                <Text>properties</Text>
            </Link>
            <Link href={"/realtors"}>
                <Text>realtors</Text>
            </Link>
            <Link href={"/clients"}>
                <Text>clients</Text>
            </Link>
            <Link href={"/offers"}>
                <Text>offers</Text>
            </Link>
            <Link href={"/needs"}>
                <Text>needs</Text>
            </Link>
            <Link href={"/deals"}>
                <Text>deals</Text>
            </Link>
        </View>
    );
}
