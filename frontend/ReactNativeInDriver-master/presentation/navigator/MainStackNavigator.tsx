import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginScreen from "../screens/auth/login/LoginScreen";
import RegisterScreen from "../screens/auth/register/RegisterScreen";
import { AuthProvider } from "../context/AuthContext";
import { container } from "../../di/container";
import RolesScreen from "../screens/roles/RolesScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { ProfileStackNavigator } from "./ProfileStackNavigator";
import { ClientMapStackNavigator } from "./ClientMapStackNavigator";
import { DriverMapStackNavigator } from "./DriverMapStackNavigator";
import { ClientTripHistoryScreen } from "../screens/client/tripHistory/ClientTripHistoryScreen";
import { DriverTripHistoryScreen } from "../screens/driver/tripHistory/DriverTripHistoryScreen";
import { DriverCarInfoScreen } from "../screens/driver/carInfo/DriverCarInfoScreen";
import { DriverMapTripStackNavigator } from "./DriverMapTripStackNavigator";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";
import { View, Text } from "react-native";
import { CommonActions } from "@react-navigation/native";

export type RootStackParamList = {
    LoginScreen: undefined,
    RegisterScreen: undefined,
    RolesScreen: undefined,
    ClientHomeScreen: undefined,
    DriverHomeScreen: undefined,
    DriverMyLocationMapScreen: undefined,
    ClientSearchMapScreen: undefined,
    ProfileStackNavigator: undefined,
    DriverClientRequestScreen: undefined,
    ClientMapStackNavigator: undefined,
    DriverMapStackNavigator: undefined,
    ClientTripHistoryScreen: undefined,
    DriverTripHistoryScreen: undefined,
    DriverCarInfoScreen: undefined,
    LogoutScreen: undefined,
}

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootStackParamList>();


export const MainStackNavigator = () => {

    const authUseCases = container.resolve('authUseCases');

    return (
        <AuthProvider authUseCases={authUseCases}>
            <Stack.Navigator>

                <Stack.Screen
                    options={{ headerShown: false }}
                    name="LoginScreen"
                    component={LoginScreen}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name="RegisterScreen"
                    component={RegisterScreen}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name="RolesScreen"
                    component={RolesScreen}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name="ClientHomeScreen"
                    component={ClientDrawerNavigator}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name="DriverHomeScreen"
                    component={DriverDrawerNavigator}
                />

            </Stack.Navigator>
        </AuthProvider>
    )
}

const ClientDrawerNavigator = () => {
    return (
        <Drawer.Navigator
            initialRouteName="ClientHomeScreen"
            screenOptions={{
                headerStyle: {
                    backgroundColor: 'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                },
                headerTransparent: true,
                headerTitle: '',
            }}
        >
            <Drawer.Screen name="ClientMapStackNavigator" options={{ title: 'Pedir viaje' }} component={ClientMapStackNavigator} />
            <Drawer.Screen name="ProfileStackNavigator" options={{ title: 'Perfil de usuario' }} component={ProfileStackNavigator} />
            <Drawer.Screen name="ClientTripHistoryScreen" options={{ title: 'Historial de viajes' }} component={ClientTripHistoryScreen} />
        </Drawer.Navigator>
    );
}

const DriverDrawerNavigator = () => {
    return (
        <Drawer.Navigator
            initialRouteName="DriverMyLocationMapScreen"
            screenOptions={{
                headerStyle: {
                    backgroundColor: 'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                },
                headerTransparent: true,
                headerTitle: '',
            }}
        >
            <Drawer.Screen name="DriverMyLocationMapScreen" options={{ title: 'Mi Localizacion' }} component={DriverMapTripStackNavigator} />
            <Drawer.Screen name="DriverMapStackNavigator" options={{ title: 'Solicitudes de viaje' }} component={DriverMapStackNavigator} />
            <Drawer.Screen name="DriverTripHistoryScreen" options={{ title: 'Historial de viajes' }} component={DriverTripHistoryScreen} />
            <Drawer.Screen name="DriverCarInfoScreen" options={{ title: 'Datos del vehiculo' }} component={DriverCarInfoScreen} />
            <Drawer.Screen name="LogoutScreen" options={{ title: ' Cerrar Sesión' }} component={LogoutComponent} />
        </Drawer.Navigator>
    );
}

const LogoutComponent = ({ navigation }: any) => {
    const { removeAuthSession } = useAuth();

    useEffect(() => {
        const logout = async () => {
            await removeAuthSession();
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'LoginScreen' }],
                })
            );
        };
        logout();
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white' }}>Cerrando sesión...</Text>
        </View>
    );
};