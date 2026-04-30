import { View, Text, FlatList } from "react-native";
import { container } from "../../../../di/container";
import { DriverClientRequestViewModel } from "./DriverClientRequestViewModel";
import { useEffect, useState } from "react";
import styles from './Styles';
import { ClientRequestResponse } from "../../../../domain/models/ClientRequestResponse";
import { DriverClientRequestItem } from "./DriverClientRequestItem";
import { useAuth } from "../../../hooks/useAuth";
import { DriverPosition } from "../../../../domain/models/DriverPosition";
import { StackScreenProps } from "@react-navigation/stack";
import { DriverMapStackParamList } from "../../../navigator/DriverMapStackNavigator";

interface Props extends StackScreenProps<DriverMapStackParamList, 'DriverClientRequestScreen'>{};
export function DriverClientRequestScreen ({navigation, route}: Props) {

    const viewModel: DriverClientRequestViewModel = container.resolve('driverClientRequestViewModel');
    const [clientRequestResponse, setClientRequestResponse] = useState<ClientRequestResponse[]>([]);
    const { authResponse } = useAuth();

    useEffect(() => {
      handleGetNearbyTripRequest();
      handleListenerNewDriverAssigned();
    }, [])

    const handleListenerNewClientRequest = async (driverPosition: DriverPosition) => {
        viewModel.listenerNewClientRequestSocket(async (data: any) => {
            const response = await viewModel.getNearbyTripRequest({
                latitude: driverPosition.lat, 
                longitude: driverPosition.lng
            });
            setClientRequestResponse(response as ClientRequestResponse[]);
        });
    }

    const handleListenerNewDriverAssigned = async () => {
        viewModel.listenerNewDriverAssignedSocket(authResponse?.user.id!, async (data: any) => {
            const idClientRequest = data.id_client_request;
            console.log('TE HAN ASIGNADO UN VIAJE #', idClientRequest);
            navigation.navigate('DriverTripMapScreen', {
                idClientRequest: idClientRequest
            });
        });
    }

    const handleGetNearbyTripRequest = async () => {
        if (authResponse?.user !== null) {
            const driverPosition = await viewModel.getDriverPosition(authResponse?.user.id!);
            if ('id_driver' in driverPosition) {
                console.log('driverPosition', driverPosition);  
                const response = await viewModel.getNearbyTripRequest({
                    latitude: driverPosition.lat, 
                    longitude: driverPosition.lng
                });
                setClientRequestResponse(response as ClientRequestResponse[]);
                handleListenerNewClientRequest(driverPosition);
            }
        }
        
    }

    return (
        <View style={styles.container}>
            <FlatList 
                data={clientRequestResponse}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => <DriverClientRequestItem clientRequestResponse={item} viewModel={viewModel} authResponse={authResponse} />}
            />
        </View>
    );
}