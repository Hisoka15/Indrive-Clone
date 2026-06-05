import { Animated, FlatList, Image, Modal, Platform, Pressable, Switch, Text, View } from "react-native";
import styles from './Styles';
import { useEffect, useRef, useState } from "react";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from 'expo-location';
import { DriverMyLocationMapViewModel } from "./DriverMyLocationMapViewModel";
import { container } from "../../../../di/container";
import ToggleSwitch from "toggle-switch-react-native";
import { useAuth } from "../../../hooks/useAuth";
import mapStyle from '../../../../mapStyle.json';
import { DriverClientRequestScreen } from "../clientRequest/DriverClientRequestScreen";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { DriverMapStackParamList } from "../../../navigator/DriverMapStackNavigator";
import { DriverPosition } from "../../../../domain/models/DriverPosition";
import { ClientRequestResponse } from "../../../../domain/models/ClientRequestResponse";
import { DriverClientRequestItem } from "../clientRequest/DriverClientRequestItem";
import { DriverClientRequestViewModel } from "../clientRequest/DriverClientRequestViewModel";
import calculateRotation from "../../../utils/CalculateRotation";

interface Props extends StackScreenProps<DriverMapStackParamList, 'DriverMyLocationMapScreen'>{};
export default function DriverMyLocationMapScreen({navigation, route}: Props) {

    const viewModel: DriverMyLocationMapViewModel = container.resolve('driverMyLocationMapViewModel');
    const driverClientRequestViewModel: DriverClientRequestViewModel = container.resolve('driverClientRequestViewModel');
    const [location, setLocation] = useState<Region | undefined>(undefined);
    const [tracking, setTracking] = useState<boolean>(true);
    const [isSocketListenersStarted, setIsSocketListenersStarted] = useState<boolean>(false);
    const { authResponse } = useAuth();
    let locationSubscription = useRef<Location.LocationSubscription | null>(null);
    const driverMapStackParamList = useNavigation<StackNavigationProp<DriverMapStackParamList>>();
    const [clientRequestResponse, setClientRequestResponse] = useState<ClientRequestResponse[]>([]);
    const [isClientRequestModalVisible, setIsClientRequestModalVisible] = useState(false);
    const [driverMarker, setDriverMarker] = useState<{
        lat: number;
        lng: number;
        animatedPosition: Animated.ValueXY;
        animatedRotation: Animated.Value;
    } | null>(null);


    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                console.log('Permiso de ubicacion denegado');
                return;
            }
            if (Platform.OS === 'android') {
                const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
                if (backgroundStatus !== 'granted') {
                    console.log('Permiso de ubicacion en segundo plano denegado');
                }
            }

            if (tracking) {
                startRealTimeLocation();
            }
            else {
                stopRealTimeLocation();
            }
            
            
        })();
    }, [tracking]);

    useEffect(() => {
      if (location !== undefined) {
        emitPosition();
        handleCreateDriverPosition();
        if (authResponse !== null && authResponse !== undefined && isSocketListenersStarted === false) {
            setIsSocketListenersStarted(true);
            handleListenerNewClientRequest({
                id_driver: authResponse?.user.id!,
                lat: location?.latitude!,
                lng: location?.longitude!,
            });
            handleListenerNewDriverAssigned();
        }
      }
    }, [location]);

   
    

    const handleListenerNewClientRequest = async (driverPosition: DriverPosition) => {
        console.log('-----LISTENER NEW CLIENT REQUEST-----');

        viewModel.listenerNewClientRequestSocket(async (data: any) => {
            console.log('NUEVA SOLICITUD DE CLIENTE');
            
            const response = await viewModel.getNearbyTripRequest({
                latitude: driverPosition.lat, 
                longitude: driverPosition.lng
            });
            setIsClientRequestModalVisible(true);
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
    
    const handleCreateDriverPosition = async () => {
        if (authResponse?.user !== null && authResponse?.user !== undefined && location !== null && location !== undefined) {
            const response = await viewModel.createDriverPosition({
                id_driver: authResponse.user.id!,
                lat: location?.latitude!,
                lng: location?.longitude!
            });
            console.log('Response DriverPosition', response);
        }
    }

    const startRealTimeLocation = async () => {
        if (!locationSubscription.current) {
            locationSubscription.current= await Location.watchPositionAsync(
                { 
                    accuracy: Location.Accuracy.BestForNavigation, 
                    timeInterval: 1000, 
                    distanceInterval: 1 
                },
                (newLocation) => {
                     
                    const lat = newLocation.coords.latitude;
                    const lng = newLocation.coords.longitude;

                    setDriverMarker((prevMarker) => {
                        if (prevMarker) {
                            const newRotation = calculateRotation(prevMarker.lat, prevMarker.lng, lat, lng);
        
                            Animated.timing(prevMarker.animatedPosition, {
                                toValue: { x: lat, y: lng },
                                duration: 1000,
                                useNativeDriver: false,
                            }).start();
        
                            Animated.timing(prevMarker.animatedRotation, {
                                toValue: newRotation,
                                duration: 500,
                                useNativeDriver: false,
                            }).start();
        
                            return { ...prevMarker, lat: lat, lng: lng };
                        } else {
                            return {
                                lat: lat,
                                lng: lng,
                                animatedPosition: new Animated.ValueXY({ x: lat, y: lng }),
                                animatedRotation: new Animated.Value(0),
                            };
                        }
                    });
                    setLocation({
                        latitude: newLocation.coords.latitude,
                        longitude: newLocation.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421
                    });
                    
                }
            );
            viewModel.initSocket();
        }
    }


    const emitPosition = () => {
        if (authResponse?.user != null && location !== undefined) {            
            viewModel.emitDriverPosition(authResponse?.user.id!, location!.latitude, location!.longitude);
        }
    }

    const stopRealTimeLocation = async () => {
        console.log('LOCALIZACION DETENIDA');        
        if (locationSubscription.current) {
            viewModel.disconnectSocket();
            locationSubscription.current.remove();
            locationSubscription.current = null;
        }
    }

    if (!location) {
        return <View style={styles.container}>
            <Text>No se puede obtener la ubicacion revisa los permisos</Text>
         </View>
    }

    return (
        <View style={styles.container}>
            <View style={styles.toogleContainer}>
                <ToggleSwitch             
                    isOn={tracking}
                    onColor="red"
                    offColor="gray"
                    label={tracking ? "Deshabilitar" : "Habilitar"}
                    onToggle={(isOn) => setTracking(isOn) }
                />
            </View>
            
            <MapView
                style={{
                    width: '100%',
                    height: '100%'
                }}
                customMapStyle={mapStyle}
                initialRegion={location}
                zoomControlEnabled={true}
            >
               
                {
                    driverMarker && (
                    <Marker 
                        coordinate={{
                            latitude: driverMarker.lat,
                            longitude: driverMarker.lng,
                        }}
                        anchor={{ x: 0.5, y: 0.5 }}
                        title={`TU POSICION`}
                    >
                        <Animated.View 
                            style={{ 
                                transform: [{ 
                                    rotate: driverMarker.animatedRotation.interpolate({
                                        inputRange: [0, 360],
                                        outputRange: ['0deg', '360deg'],
                                    })
                                }] 
                            }}
                        >
                            <Image 
                                source={require('../../../../assets/car_yellow.png')}
                                style={{ width: 50, height: 50, resizeMode: 'contain' }}
                            />
                        </Animated.View>
                    </Marker>
                    )
                }

            </MapView>
            
            <Modal 
                visible={isClientRequestModalVisible} 
                animationType="fade" 
                onRequestClose={() => setIsClientRequestModalVisible(false)}
                transparent={true}
            >
                <Pressable 
                    style={styles.modalOverlay} 
                    onPress={() => setIsClientRequestModalVisible(false)} // Cierra el modal al tocar fuera de él
                >
                    <Pressable style={styles.containerModal} onPress={() => {}}>
                        <FlatList 
                            data={clientRequestResponse}
                            keyExtractor={(item) => item.id.toString()}
                            keyboardShouldPersistTaps="handled" // Permite que los toques en los elementos pasen correctamente  
                            renderItem={({item}) =>     
                                <DriverClientRequestItem 
                                    clientRequestResponse={item} 
                                    viewModel={driverClientRequestViewModel} 
                                    authResponse={authResponse} 
                                />
                        }
                        />
                    </Pressable>
                </Pressable>
            </Modal>

           
        </View>
    );
}