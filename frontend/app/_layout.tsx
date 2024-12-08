import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="/clients" options={{ title: "Клиенты" }} />
            <Stack.Screen name="/realtors" options={{ title: "Риелторы" }} />
            <Stack.Screen
                name="/properties"
                options={{ title: "Недвижимость" }}
            />
        </Stack>
    );
}
