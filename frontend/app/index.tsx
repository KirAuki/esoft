import { Text, View, Button } from "react-native";
import { useRouter } from "expo-router";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import UserManager from "./users";


export default function Index() {
  const router = useRouter();
  const Tab = createMaterialTopTabNavigator();
  return (
    <NavigationContainer>
            <Tab.Navigator>
                <Tab.Screen name="Clients">
                    {() => <UserManager userType="client" />}
                </Tab.Screen>
                <Tab.Screen name="Realtors">
                    {() => <UserManager userType="realtor"/>}
                </Tab.Screen>
            </Tab.Navigator>
    </NavigationContainer>
  );
}
