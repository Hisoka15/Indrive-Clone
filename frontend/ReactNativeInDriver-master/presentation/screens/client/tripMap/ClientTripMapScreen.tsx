import { StackScreenProps } from "@react-navigation/stack";
import { Animated, Dimensions, FlatList, Image, Modal, Platform, Pressable, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import { ClientMapStackParamList } from "../../../navigator/ClientMapStackNavigator";
import { container } from "../../../../di/container";
import { ClientTripMapViewModel } from "./ClientTripMapViewModel";
import { useEffect, useRef, useState } from "react";
import MapView, { LatLng, Marker, Polyline, Region } from "react-native-maps";
import styles from './Styles';
import { ClientRequestResponse } from "../../../../domain/models/ClientRequestResponse";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../../hooks/useAuth";
import { decode } from "@googlemaps/polyline-codec";
import { Status } from "../../../../domain/repository/ClientRequestRepository";
import mapStyle from '../../../../mapStyle.json';
import calculateRotation from "../../../utils/CalculateRotation";
import getDistanceBetweenPoints from "../../../utils/GetDistanceBetweenPoints";


interface Props extends StackScreenProps<ClientMapStackParamList, 'ClientTripMapScreen'>{};
export function ClientTripMapScreen({navigation, route}: Props) {
    
    const {authResponse} = useAuth();
    const { idClientRequest } = route.params;
    const viewModel: ClientTripMapViewModel = container.resolve('clientTripMapViewModel');
    const animatedValue = useRef(new Animated.Value(0)).current;
    const mapRef = useRef<MapView>(null);
    const [isInteractingWithMap, setIsInteractingWithMap] = useState<boolean>(false);
    const [location, setLocation] = useState<Region | undefined>(undefined);
    const [clientRequest, setClientRequest] = useState<ClientRequestResponse>();
    const [directionsRoute, setDirectionsRoute] = useState<LatLng[]>([]);
    const [remainingRoute, setRemainingRoute] = useState<LatLng[]>([]); // Se actualizará conforme el conductor avance

    const [driverPosition, setDriverPosition] = useState<LatLng | null>(null);
    const [isDriverPositionSet, setIsDriverPositionSet] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(Status.ACCEPTED);
    const [driverMarker, setDriverMarker] = useState<{
        lat: number;
        lng: number;
        animatedPosition: Animated.ValueXY;
        animatedRotation: Animated.Value;
    } | null>(null);

    useEffect(() => {
        viewModel.initSocket();
        handleGetClientRequestById();
    }, [])

    useEffect(() => {
        if (driverPosition !== null && directionsRoute.length > 0) {
            updateRemainingRoute(driverPosition);
        }
    }, [driverPosition]);

    useEffect(() => {
        if (isDriverPositionSet === true) {
            console.log('SOLO SE EJECUTO UNA VEZ');
            
            handleGetDirections(
                {
                    latitude: driverPosition!.latitude,
                    longitude: driverPosition!.longitude,
                }, 
                {
                    latitude: clientRequest?.pickup_position.y!,
                    longitude: clientRequest?.pickup_position.x!,
                }
            );
        }
    }, [isDriverPositionSet]);

    useEffect(() => {
      if (currentStatus === Status.ARRIVED) {
            handleGetDirections(
                {
                    latitude: driverPosition!.latitude,
                    longitude: driverPosition!.longitude,
                }, 
                {
                    latitude: clientRequest?.destination_position.y!,
                    longitude: clientRequest?.destination_position.x!,
                }
            );
      }
      else if (currentStatus === Status.FINISHED) {
        navigation.replace('ClientTripRatingScreen', {clientRequest: clientRequest!});
      }
    }, [currentStatus]);
    
    useEffect(() => {
      if (driverPosition !== null) {
        setIsDriverPositionSet(true);
      }
    }, [driverPosition]);
    
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
        console.log('getClientRequestById', response);    
        if ('id' in response) {
            setClientRequest(response);
            setLocation({
                latitude: response.pickup_position.y,
                longitude: response.pickup_position.x,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421
            });
            viewModel.listenerDriversPositionSocket(authResponse?.user.id!, (data: any) => {
                console.log('Conductor Asignado', data);
                const lat = data.lat;
                const lng = data.lng;

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
                setDriverPosition({
                    latitude: data.lat,
                    longitude: data.lng
                });
            });

            viewModel.listenerUpdateStatusSocket(idClientRequest, (data: any) => {
                console.log('NUEVO ESTADO DEL VIAJE', data);
                if (data.status === Status.ARRIVED) {
                    setCurrentStatus(Status.ARRIVED);
                }
                else if (data.status === Status.FINISHED) {
                    setCurrentStatus(Status.FINISHED);
                }
            });
        }
    }

    const handleGetDirections = async (origin: LatLng, destination: LatLng) => {
        const response: GoogleDirections | null = await viewModel.getDirections(origin, destination);
        if (response !== null) {
            if (response.routes.length) {
                const points = response.routes[0].overview_polyline.points;
                const coordinates = decode(points).map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
                setDirectionsRoute(coordinates);
            }
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
        return  <View style={styles.container}></View>
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
                    {/* {
                        driverPosition !== null && (
                            <Marker 
                                coordinate={{
                                    latitude: driverPosition?.latitude!,
                                    longitude: driverPosition?.longitude!
                                }} 
                                title="Tu Conductor"
                            >
                                <View style={{width: 50, height: 50}}>
                                    <Image 
                                        source={require('../../../../assets/icon_taxi.png')}
                                        style={{width: 50, height: 50, resizeMode: 'contain'}}
                                    />
                                </View>
                            </Marker>
                        )
                    } */}

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
                                    latitude: clientRequest!.pickup_position.y,
                                    longitude: clientRequest!.pickup_position.x
                                }} 
                                title="Origen"
                            >
                                <View style={{width: 45, height: 45}}>
                                    <Image 
                                        source={require('../../../../assets/location_white.png')}
                                        style={{width: 45, height: 45, resizeMode: 'contain'}}
                                    />
                                </View>
                            </Marker>
                        )
                    }
                    {
                        (clientRequest !== null && currentStatus === Status.ARRIVED) && (
                            <Marker 
                                coordinate={{
                                    latitude: clientRequest!.destination_position.y,
                                    longitude: clientRequest!.destination_position.x
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

                    <Text style={styles.textTitle}>TU CONDUCTOR</Text>
                    <View style={styles.rowContainer}>
                        <View style={styles.dataContainer}>
                            <Text>{ clientRequest?.driver.name } { clientRequest?.driver.lastname }</Text>
                            <Text>Tel: { clientRequest?.driver.phone }</Text>
                        </View>
                        <Image 
                            style={styles.userImage}
                            source={{ uri:clientRequest?.driver.image }}
                        />
                    </View>
                    <View style={styles.rowContainer}>
                        <View style={styles.dataContainer}>
                            <Text>Marca del vehiculo</Text>
                            <Text>Placa del vehiculo</Text>
                            <Text>Llega en 8 Mins Aproximadamente</Text>
                        </View>
                        <Image 
                            style={styles.userImage}
                            source={require('../../../../assets/suv.png')}
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

                </View>

           </Animated.View>

        </View>
    );
}