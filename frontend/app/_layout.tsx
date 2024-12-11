import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="/clients/index"
                options={{ title: "Клиенты" }}
            />
            <Stack.Screen
                name="/realtors/index"
                options={{ title: "Риелторы" }}
            />
            <Stack.Screen
                name="/properties/index"
                options={{ title: "Недвижимость" }}
            />
            <Stack.Screen
                name="/offers/index"
                options={{ headerTitle: "Предложения" }}
            />
            <Stack.Screen
                name="/needs/index"
                options={{ title: "Потребности" }}
            />
        </Stack>
    );
}
