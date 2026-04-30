import { StackScreenProps } from "@react-navigation/stack";
import { Animated, Dimensions, Image, Platform, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import { DriverMapStackParamList } from "../../../navigator/DriverMapStackNavigator";
import { container } from "../../../../di/container";
import { DriverTripMapViewModel } from "./DriverTripMapViewModel";
import { useEffect, useRef, useState } from "react";
import MapView, { Camera, LatLng, Marker, Polyline, Region } from "react-native-maps";
import { ClientRequestResponse } from "../../../../domain/models/ClientRequestResponse";
import styles from './Styles';
import { Ionicons } from "@expo/vector-icons";
import * as Location from 'expo-location';
import { decode } from "@googlemaps/polyline-codec";
import { Status } from "../../../../domain/repository/ClientRequestRepository";
import mapStyle from '../../../../mapStyle.json';
import calculateRotation from "../../../utils/CalculateRotation";
import getDistanceBetweenPoints from "../../../utils/GetDistanceBetweenPoints";


interface Props extends StackScreenProps<DriverMapStackParamList, 'DriverTripMapScreen'>{};
export function DriverTripMapScreen({navigation, route}: Props) {

    const {idClientRequest} = route.params;
    const viewModel: DriverTripMapViewModel = container.resolve('driverTripMapViewModel');
    const animatedValue = useRef(new Animated.Value(0)).current;
    const mapRef = useRef<MapView>(null);
    const [isInteractingWithMap, setIsInteractingWithMap] = useState<boolean>(false);
    const [location, setLocation] = useState<Region | undefined>(undefined);
    const [clientRequest, setClientRequest] = useState<ClientRequestResponse | null>(null);
    const [tracking, setTracking] = useState<boolean>(true);
    let locationSubscription = useRef<Location.LocationSubscription | null>(null);
    const [directionsRoute, setDirectionsRoute] = useState<LatLng[]>([]);
    const [remainingRoute, setRemainingRoute] = useState<LatLng[]>([]); // Se actualizará conforme el conductor avance
    const [currentStatus, setCurrentStatus] = useState(Status.ACCEPTED);
    const [driverMarker, setDriverMarker] = useState<{
        lat: number;
        lng: number;
        animatedPosition: Animated.ValueXY;
        animatedRotation: Animated.Value;
    } | null>(null);

    

    useEffect(() => {
        handleGetClientRequestById();
    }, []);

    useEffect(() => {
        if (location !== undefined && directionsRoute.length > 0) {
            updateRemainingRoute({latitude: location?.latitude!, longitude: location?.longitude!});
        }
    }, [location]);

    useEffect(() => {
        if (clientRequest !== null && location !== undefined && directionsRoute.length === 0) {
            handleGetDirections(
                {
                    latitude: location!.latitude,
                    longitude: location!.longitude 
                }, 
                {
                    latitude: clientRequest!.pickup_position.y,
                    longitude: clientRequest!.pickup_position.x,
                }
            );
        }
    }, [clientRequest, location]);
    

    useEffect(() => {
        if (clientRequest !== null) {
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
                let location = await Location.getCurrentPositionAsync({});
                
                moveCameraToLocation(location.coords.latitude, location.coords.longitude)
                
                if (tracking) {
                    startRealTimeLocation();
                }
                else {
                    stopRealTimeLocation();
                }
            })();
        }
    }, [clientRequest, tracking]);
    
    const updateRemainingRoute = (currentPosition: LatLng) => {
        if (directionsRoute.length === 0) return;
    
        // Buscar el punto más cercano en la ruta
        let closestIndex = 0;
        let minDistance = Number.MAX_VALUE;
    
        directionsRoute.forEach((point, index) => {
            const distance = getDistanceBetweenPoints(currentPosition, point);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });
    
        // Si encontramos un punto cercano, recortamos la ruta desde ese punto en adelante
        const newRemainingRoute = directionsRoute.slice(closestIndex);
        setRemainingRoute(newRemainingRoute);
    };

    const handleGetClientRequestById = async () => {
        const response = await viewModel.getClientRequestById(idClientRequest);
        if ('id' in response) {
            setClientRequest(response);
        }
    }

    const handleUpdateStatusToArrived = async () => {
        const response = await viewModel.updateStatus(idClientRequest, Status.ARRIVED);
        if (typeof response === 'boolean') {
            ToastAndroid.show('Estado actualizado', ToastAndroid.LONG);
            setCurrentStatus(Status.ARRIVED);
            viewModel.emitUpdateStatus(idClientRequest, Status.ARRIVED);
            handleGetDirections(
                {
                    latitude: location!.latitude,
                    longitude: location!.longitude 
                }, 
                {
                    latitude: clientRequest!.destination_position.y,
                    longitude: clientRequest!.destination_position.x,
                }
            );
        }
    }

    const handleUpdateStatusToFinished = async () => {
        const response = await viewModel.updateStatus(idClientRequest, Status.FINISHED);
        if (typeof response === 'boolean') {
            setCurrentStatus(Status.FINISHED);
            viewModel.emitUpdateStatus(idClientRequest, Status.FINISHED);
            navigation.replace('DriverTripRatingScreen', {
                clientRequest: clientRequest!
            });
        }
    }

    const moveCameraToLocation = (lat: number, lng: number) => {
        const camera: Camera = {
            center: {
                latitude: lat,
                longitude: lng
            },
            pitch: 0,
            heading: 0,
            zoom: 15
        };
        mapRef.current?.animateCamera(camera, { duration: 1000 })
    }

    const handleGetDirections = async (origin: LatLng, destination: LatLng) => {
        console.log('SE TRAZO RUTA');
        
        const response: GoogleDirections | null = await viewModel.getDirections(origin,destination);
        if (response !== null) {
            if (response.routes.length) {
                const points = response.routes[0].overview_polyline.points;
                const coordinates = decode(points).map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
                setDirectionsRoute(coordinates);
            }
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
                    
                    viewModel.emitDriverPosition(
                        clientRequest?.id_client!, 
                        newLocation.coords.latitude,
                        newLocation.coords.longitude
                    );
                }
            );
            viewModel.initSocket();
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

    const toogleView = (isInteractingWithMap: boolean) => {
        setIsInteractingWithMap(isInteractingWithMap);
        Animated.timing(animatedValue, {
            toValue: isInteractingWithMap ? 1 : 0,
            duration: 200,
            useNativeDriver: true
        }).start();
    }

    if (!location) {
        return <View style={styles.container}></View>
    }

    return (
        <View style={styles.container}>
            <Animated.View
                style={{
                    transform: [
                        { scaleY: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [1, 1] }) },
                        { translateY: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, 0] }) },
                    ],
                    width: '100%',
                    position: 'absolute',
                    top: 0
                }}
            >
                <MapView 
                    ref={mapRef}
                    style={{ 
                        width: '100%',
                        height: isInteractingWithMap ? Dimensions.get('window').height * 0.87 : Dimensions.get('window').height * 0.59
                     }} 
                    initialRegion={location}
                    zoomControlEnabled={true}
                    customMapStyle={mapStyle}
                    onRegionChangeComplete={(region) => {
                        toogleView(false);
                    }}
                    onPanDrag={() => toogleView(true)}
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
                    {
                        (clientRequest !== null && currentStatus === Status.ACCEPTED) && (
                            <Marker 
                                coordinate={{
                                    latitude: clientRequest.pickup_position.y,
                                    longitude: clientRequest.pickup_position.x
                                }} 
                                title="Origen"
                            >
                                <View style={{width: 50, height: 50}}>
                                    <Image 
                                        source={require('../../../../assets/location_white.png')}
                                        style={{width: 50, height: 50, resizeMode: 'contain'}}
                                    />
                                </View>
                            </Marker>
                        )
                    }
                    {
                        (clientRequest !== null && currentStatus === Status.ARRIVED) && (
                            <Marker 
                                coordinate={{
                                    latitude: clientRequest.destination_position.y,
                                    longitude: clientRequest.destination_position.x
                                }} 
                                title="Destino"
                            >
                                <View style={{width: 50, height: 50}}>
                                    <Image 
                                        source={require('../../../../assets/flag_white.png')}
                                        style={{width: 50, height: 50, resizeMode: 'contain'}}
                                    />
                                </View>
                            </Marker>
                        )
                    }
                    {/* { 
                        directionsRoute.length > 0 && (<Polyline coordinates={directionsRoute} strokeWidth={6} strokeColor="red"/>)
                    } */}

                    { 
                        remainingRoute.length > 0 && (
                            <Polyline coordinates={remainingRoute} strokeWidth={6} strokeColor="red"/>
                        )
                    }
                </MapView>
            </Animated.View>
           
           
           <Animated.View 
                style={{
                    transform: [
                        { scaleY: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [1, 1] }) },
                        { translateY: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [0, 280] }) }
                    ],
                    width: '100%',
                    position: 'absolute',
                    height: '40%',
                    bottom: 0,
                    backgroundColor: 'white',
                    padding: 10,
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                }}
           >

                <View style={{ width: '100%', height: '100%' }}>

                    <Text style={styles.textTitle}>TU CLIENTE</Text>
                    <View style={styles.rowContainer}>
                        <View style={styles.dataContainer}>
                            <Text>{ clientRequest?.client.name } { clientRequest?.client.lastname }</Text>
                            <Text>Tel: { clientRequest?.client.phone }</Text>
                        </View>
                        <Image 
                            style={styles.userImage}
                            source={{ uri:clientRequest?.client.image }}
                        />
                    </View>
                    <Text style={styles.textTitle}>DATOS DEL VIAJE</Text>
                    <View style={styles.rowContainer}>
                        <Ionicons 
                            name="location" 
                            size={20} 
                            color="black" 
                        />
                        <View style={styles.tripContainer}>
                            <Text>Desde: {clientRequest?.pickup_description}</Text>
                            <Text>Hasta: {clientRequest?.destination_description}</Text>
                        </View>
                    </View>

                    <View style={styles.rowContainer}>
                        <Ionicons 
                            name="pricetag" 
                            size={20} 
                            color="black" 
                        />
                        <View style={styles.tripContainer}>
                            <Text>Valor del viaje</Text>
                            <Text style={styles.textPrice}>${clientRequest?.fare_offered}</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.iconContainer} onPress={() => {
                        if (currentStatus === Status.ACCEPTED) {
                            handleUpdateStatusToArrived();
                        }
                        else if (currentStatus === Status.ARRIVED) {
                            handleUpdateStatusToFinished();
                        }
                    }}>
                        <View style={styles.iconBox}>
                            <Ionicons name='checkmark' size={25} color={'white'}/>
                        </View>
                        <Text style={styles.textAction}>
                            { currentStatus === Status.ACCEPTED ? 'NOTIFICAR LLEGADA' : 'FINALIZAR VIAJE' }
                        </Text>
                    </TouchableOpacity>

                </View>

           </Animated.View>

        </View>
    );
}