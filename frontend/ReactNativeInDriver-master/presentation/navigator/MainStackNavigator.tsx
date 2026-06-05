import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginScreen from "../screens/auth/login/LoginScreen";
import RegisterScreen from "../screens/auth/register/RegisterScreen";
import { AuthProvider } from "../context/AuthContext";
import { container } from "../../di/container";
import RolesScreen from "../screens/roles/RolesScreen";
import ClientHomeScreen from "../screens/client/home/ClientHomeScreen";
import DriverHomeScreen from "../screens/driver/home/DriverHomeScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ClientSearchMapScreen from "../screens/client/searchMap/ClientSearchMapScreen";
import DriverMyLocationMapScreen from "../screens/driver/myLocationMap/DriverMyLocationMapScreen";
import ProfileInfoScreen from "../screens/profile/info/ProfileInfoScreen";
import { ProfileStackNavigator } from "./ProfileStackNavigator";
import { DriverClientRequestScreen } from "../screens/driver/clientRequest/DriverClientRequestScreen";
import { ClientMapStackNavigator } from "./ClientMapStackNavigator";
import { DriverMapStackNavigator } from "./DriverMapStackNavigator";
import { ClientTripHistoryScreen } from "../screens/client/tripHistory/ClientTripHistoryScreen";
import { DriverTripHistoryScreen } from "../screens/driver/tripHistory/DriverTripHistoryScreen";
import { DriverCarInfoScreen } from "../screens/driver/carInfo/DriverCarInfoScreen";
import { DriverMapTripStackNavigator } from "./DriverMapTripStackNavigator";
import { MaterialIcons } from "@expo/vector-icons";

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
}

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootStackParamList>();


export const MainStackNavigator = () => {

    const authUseCases = container.resolve('authUseCases');

    return (
        <AuthProvider authUseCases={authUseCases}>
            <Stack.Navigator>

                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="LoginScreen"
                    component={LoginScreen}
                />

                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="RegisterScreen"
                    component={RegisterScreen}
                />

                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="RolesScreen"
                    component={RolesScreen}
                />


                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
                    name="ClientHomeScreen"
                    component={ClientDrawerNavigator}
                />


                <Stack.Screen
                    options={{
                        headerShown: false,
                    }}
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
                
                // drawerActiveTintColor: 'white',
                // drawerInactiveTintColor: 'white'

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
            initialRouteName="DriverHomeScreen"
            screenOptions={{
                headerStyle: {
                    backgroundColor: 'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                },
                headerTransparent: true,
                headerTitle: '',
                // headerLeft: () => (
                //     <MaterialIcons 
                //         name="menu" 
                //         size={30} 
                //         color="red" 
                //         onPress={() => navigation.toggleDrawer()} 
                //     />
                // ),
                // drawerIcon: ({ color, size }) => (
                //     <MaterialIcons name="menu" size={size} color="white" /> 
                // ),
            }}
        >
            <Drawer.Screen name="DriverMyLocationMapScreen" options={{ title: 'Mi Localizacion' }} component={DriverMapTripStackNavigator} />
            <Drawer.Screen name="DriverMapStackNavigator" options={{ title: 'Solicitudes de viaje' }} component={DriverMapStackNavigator} />
            <Drawer.Screen name="DriverTripHistoryScreen" options={{ title: 'Historial de viajes' }} component={DriverTripHistoryScreen} />
            <Drawer.Screen name="DriverCarInfoScreen" options={{ title: 'Datos del vehiculo' }} component={DriverCarInfoScreen} />
        </Drawer.Navigator>
    );
}