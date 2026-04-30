import { FlatList, Text, View } from "react-native";
import { container } from "../../../../di/container";
import { useAuth } from "../../../hooks/useAuth";
import { useEffect, useState } from "react";
import { ClientRequestResponse } from "../../../../domain/models/ClientRequestResponse";
import { DriverTripHistoryViewModel } from "./DriverTripHistoryViewModel";
import { DriverTripHistoryItem } from "./DriverTripHistoryItem";

export function DriverTripHistoryScreen() {

    const viewModel: DriverTripHistoryViewModel = container.resolve('driverTripHistoryViewModel');
    const {authResponse} = useAuth();
    const [clientRequests, setClientRequests] = useState<ClientRequestResponse[]>([]);

    useEffect(() => {
      
        handleGetByDriverAssigned();
      
    }, [])
    

    const handleGetByDriverAssigned = async () => {
        if (authResponse !== null) {
            const response = await viewModel.getByDriverAssigned(authResponse?.user.id!);
            setClientRequests(response as ClientRequestResponse[]);
            console.log('Historial de viajes', response);
        }
    }

    return (
        <View style={{flex: 1, marginTop: 50}}>
            <FlatList 
                data={clientRequests}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => <DriverTripHistoryItem clientRequest={item} />}
            />
        </View>
    );
}