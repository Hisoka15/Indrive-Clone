import { createNativeStackNavigator } from "@react-navigation/native-stack"
import ClientSearchMapScreen from "../screens/client/searchMap/ClientSearchMapScreen";
import { ClientTripMapScreen } from "../screens/client/tripMap/ClientTripMapScreen";
import DriverMyLocationMapScreen from "../screens/driver/myLocationMap/DriverMyLocationMapScreen";
import { DriverTripMapScreen } from "../screens/driver/tripMap/DriverTripMapScreen";
import { DriverClientRequestScreen } from "../screens/driver/clientRequest/DriverClientRequestScreen";
import { ClientRequestResponse } from "../../domain/models/ClientRequestResponse";
import { DriverTripRatingScreen } from "../screens/driver/tripRating/DriverTripRating";

export type DriverMapStackParamList = {
    DriverClientRequestScreen: undefined,
    DriverMyLocationMapScreen: undefined,
    DriverTripMapScreen: {idClientRequest: number},
    DriverTripRatingScreen: {clientRequest: ClientRequestResponse},
}

const Stack = createNativeStackNavigator<DriverMapStackParamList>();

export const DriverMapStackNavigator = () => {

    return (
        <Stack.Navigator>

            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name="DriverClientRequestScreen"
                component={DriverClientRequestScreen}
            />


            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name="DriverTripMapScreen"
                component={DriverTripMapScreen}
            />

            <Stack.Screen
                options={{
                    headerShown: false,
                }}
                name="DriverTripRatingScreen"
                component={DriverTripRatingScreen}
            />

        </Stack.Navigator>
        
    )

}
