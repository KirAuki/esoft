import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'События',
          tabBarIcon: ({ color }) => <FontAwesome5 size={28} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="clients/index"
        options={{
          title: 'Клиенты',
          tabBarIcon: ({ color }) => <FontAwesome5 size={28} name="users" color={color} />,
        }}
      />
      <Tabs.Screen
        name="clients/[id]"
        options={{
          title: 'Клиент',
          href: null,
          tabBarIcon: ({ color }) => <FontAwesome5 size={28}  color={color} />,
        }}
      />
      <Tabs.Screen
        name="realtors/index"
        options={{
          title: 'Риелторы',
          tabBarIcon: ({ color }) => <FontAwesome5 name="user-tie" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="realtors/[id]"
        options={{
          title: 'Риелтор',
          href: null,
          tabBarIcon: ({ color }) => <FontAwesome5 size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="properties/index"
        options={{
          title: 'Недвижимость',
          tabBarIcon: ({ color }) => <FontAwesome5 size={28} name="building" color={color} />,
        }}
      />
      <Tabs.Screen
        name="offers/index"
        options={{
          title: 'Предложения',
          tabBarIcon: ({ color }) => <FontAwesome5 size={28} name="thumbs-up" color={color} />,
        }}
      />
      <Tabs.Screen
        name="needs/index"
        options={{
          title: 'Потребности',
          tabBarIcon: ({ color }) => <FontAwesome5 size={28} name="exclamation-circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="deals/index"
        options={{
          title: 'Сделки',
          tabBarIcon: ({ color }) => <FontAwesome5 size={28} name="exchange" color={color} />,
        }}
      />
    </Tabs>
    
  );
}