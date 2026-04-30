import { Image, Modal, Pressable, Text, TextInput, View } from "react-native";
import { ClientRequestResponse } from "../../../../domain/models/ClientRequestResponse";
import styles from './Styles';
import DefaultTextInput from "../../../components/DefaultTextInput";
import { useRef, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import DefaultRoundedButton from "../../../components/DefaultRoundedButton";
import { DriverClientRequestViewModel } from "./DriverClientRequestViewModel";
import { AuthResponse } from "../../../../domain/models/AuthResponse";

interface Props {
    clientRequestResponse: ClientRequestResponse,
    viewModel: DriverClientRequestViewModel,
    authResponse: AuthResponse | null
}

export function DriverClientRequestItem({clientRequestResponse, viewModel, authResponse} : Props) {

    const [isOfferModalVisible, setIsOfferModalVisible] = useState(false);
    const [offer, setOffer] = useState<string>('');

    const handleCreateDriverTripOffer = async () => {
        const response = await viewModel.createDriverTripOffer({
            id_driver: authResponse?.user.id!,
            id_client_request: clientRequestResponse.id,
            fare_offered: Number(offer),
            distance: clientRequestResponse.google_distance_matrix.distance.value / 1000,
            time: clientRequestResponse.google_distance_matrix.duration.value / 60,
        });
        if ('id_client_request' in response) {
            viewModel.emitNewDriverOffer(clientRequestResponse.id);
        }
        console.log('Response Driver Trip Offer', response);
    }

    return (
        <Pressable style={styles.itemContainer } onPress={() => setIsOfferModalVisible(true)}>
            <View style={ styles.mainInfoContainer }>
                <View style={ styles.mainTextContainer }>
                    <Text style={ styles.textMainInfo }>Tarifa Ofrecida: {parseFloat(clientRequestResponse.fare_offered).toFixed(1)}</Text>
                    <Text style={ styles.textMainInfo }>Tiempo de llegada: {clientRequestResponse.google_distance_matrix.duration.text}</Text>
                    <Text style={ styles.textMainInfo }>Recorrido: {clientRequestResponse.google_distance_matrix.distance.text}</Text>
                </View>
                <Image 
                    style={ styles.imageClient }
                    source={{uri: clientRequestResponse.client.image}}
                />
            </View>

            <Text style={ styles.textDataTrip }>Datos del viaje</Text>
            <Text>Recoger: {clientRequestResponse.pickup_description}</Text>
            <Text>Llevar: {clientRequestResponse.destination_description}</Text>
            <Text>Cliente: {clientRequestResponse.client.name} {clientRequestResponse.client.lastname}</Text>

            <Modal 
                visible={isOfferModalVisible} 
                animationType="fade" 
                onRequestClose={() => setIsOfferModalVisible(false)}
                transparent={true}
                onShow={() => {
                    // placeAutocompleteDestinationRef.current?.setAddressText('');
                    // setTimeout(() => {
                    //     placeAutocompleteDestinationRef.current?.focus();
                    // }, 200);
                }}  
            >
                <Pressable style={styles.modalOverlay} onPress={() => setIsOfferModalVisible(false)}>
                    <Pressable style={styles.modalContent} onPress={() => {}}>
                        <View style={ styles.viewDecoration }>
                            <Text style={ styles.textDecoration }>Agrega una oferta</Text>
                        </View>
                        <View style={{ marginLeft: 20 }}>
                            <DefaultTextInput
                                icon={require('../../../../assets/dolar.png')}
                                placeholder='Precio'
                                onChangeText={setOffer}
                                value={offer}
                                keyboardType="numeric"
                                textColor="black"
                                placeholderTextColor="black"
                            />
                        </View>
                        <View style={{ marginRight: 30, marginLeft: 30 }}>
                            <DefaultRoundedButton 
                                onPress={() => {
                                    console.log('Precio', offer);
                                    setIsOfferModalVisible(false);
                                    handleCreateDriverTripOffer();
                                }}
                                text="Enviar oferta"
                                backgroundColor="black"
                            />
                        </View>
                    </Pressable>
                </Pressable>
                
            </Modal>

        </Pressable>
    );
}