import { Image, StyleSheet, Text, View } from "react-native";
import { DriverTripOffer } from "../../../../domain/models/DriverTripOffer";
import DefaultRoundedButton from "../../../components/DefaultRoundedButton";
import { ClientSerchMapViewModel } from "./ClientSearchMapViewModel";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { ClientMapStackParamList } from "../../../navigator/ClientMapStackNavigator";
import { Ionicons } from "@expo/vector-icons";

interface Props {
    viewModel: ClientSerchMapViewModel,
    driverTripOffer: DriverTripOffer,
    navigation: StackNavigationProp<ClientMapStackParamList, 'ClientSearchMapScreen', undefined>
}

export function DriverOfferItem({viewModel, driverTripOffer, navigation}: Props) {

     const handleUpdateDriverAssigned = async () => {
        const response = await viewModel.updateDriverAssigned(
            driverTripOffer.id_client_request, 
            driverTripOffer.id_driver, 
            driverTripOffer.fare_offered
        );
        if(typeof response === 'boolean') {
            viewModel.emitNewDriverAssigned(driverTripOffer.id_client_request, driverTripOffer.id_driver);
            console.log('CONDUCTOR ASIGNADO CORRECTAMENTE');
            navigation.navigate('ClientTripMapScreen', {
                idClientRequest: driverTripOffer.id_client_request
            });
        }
    } 

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Image 
                    source={{uri: driverTripOffer.driver?.image}}
                    style={styles.imageDriver}
                />
                <View style={styles.infoDriver}>
                    <Text>Marca de vehiculos</Text>
                    <Text>{driverTripOffer.driver?.name}</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Ionicons 
                            name="star"
                            color={'#E0C729'}

                        />
                        <Text>5.0</Text>
                    </View>
                    
                </View>

                <View>
                    <Text style={styles.price}>{driverTripOffer.fare_offered.toFixed(1)}$</Text>
                    <Text style={styles.time}>{driverTripOffer.time.toFixed(1)} Min</Text>
                    <Text style={styles.distance}>{driverTripOffer.distance.toFixed(1)} Km</Text>
                </View>
            </View>
            <View style={styles.rowButtons}>
                <DefaultRoundedButton 
                    text="Rechazar"
                    onPress={() => {}}
                    backgroundColor="red"
                    width={'50%'}
                    height={45}
                />
                <View style={{marginRight: 5}}></View>
                <DefaultRoundedButton 
                    text="Aceptar"
                    onPress={() => {
                        handleUpdateDriverAssigned();
                    }}
                    backgroundColor="#29E042"
                    width={'50%'}
                    height={45}
                />
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 160,
        width: '95%',
        backgroundColor: 'white',
        borderRadius: 20,
        elevation: 2,
        marginTop: 10,
        alignSelf: 'center'
    },
    row: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginTop: 10
    },
    imageDriver: {
        height: 50,
        width: 50,
        borderRadius: 50
    },
    infoDriver: {
        marginLeft: 10,
        flex: 1
    },
    rowButtons: {
        flexDirection: 'row',
        marginHorizontal: 20,
    },
    price: {
        color: 'green',
        fontSize: 22,
        fontWeight: 'bold'
    },
    time: {
        fontWeight: 'bold'
    },
    distance: {
        fontWeight: 'bold'
    }
});