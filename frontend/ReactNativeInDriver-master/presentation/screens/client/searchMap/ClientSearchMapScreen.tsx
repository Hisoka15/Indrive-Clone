import { Animated, Dimensions, FlatList, Image, Modal, Platform, Pressable, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import styles from './Styles';
import { useEffect, useRef, useState } from "react";
import MapView, { Camera, LatLng, Marker, Polyline, Region } from "react-native-maps";
import * as Location from 'expo-location';
import { container } from "../../../../di/container";
import { OpenStreetPlaceDetail, OSMRouteResponse } from "../../../../data/sources/remote/services/OpenStreetMapService";
import { ClientSerchMapViewModel } from "./ClientSearchMapViewModel";
import { TimeAndDistanceValues } from '../../../../domain/models/TimeAndDistanceValues';
import { ErrorResponse } from "../../../../domain/models/ErrorResponse";
import DefaultTextInput from "../../../components/DefaultTextInput";
import DefaultRoundedButton from "../../../components/DefaultRoundedButton";
import { useAuth } from "../../../hooks/useAuth";
import { DriverTripOffer } from "../../../../domain/models/DriverTripOffer";
import { DriverOfferItem } from "./DriverOfferItem";
import { StackScreenProps } from "@react-navigation/stack";
import { ClientMapStackParamList } from "../../../navigator/ClientMapStackNavigator";
import calculateRotation from "../../../utils/CalculateRotation";


interface Props extends StackScreenProps<ClientMapStackParamList, 'ClientSearchMapScreen'> { };
export default function ClientSearchMapScreen({ navigation, route }: Props) {
    const viewModel: ClientSerchMapViewModel = container.resolve('clientSearchMapViewModel');
    const { authResponse } = useAuth();

    const [location, setLocation] = useState<Region | undefined>(undefined);
    let locationSubscription = useRef<Location.LocationSubscription | null>(null);
    const [driverMarkers, setDriverMarkers] = useState<
        {
            id: number;
            idSocket: string;
            lat: number;
            lng: number;
            animatedPosition: Animated.ValueXY;
            animatedRotation: Animated.Value;
        }[]>([]);

    const [directionsRoute, setDirectionsRoute] = useState<LatLng[]>([]);
    const [shouldDrawRoute, setShouldDrawRoute] = useState<boolean>(false);
    const [isInteractingWithMap, setIsInteractingWithMap] = useState<boolean>(false);
    const [timeAndDistance, setTimeAndDistance] = useState<TimeAndDistanceValues>();
    const [isOriginModalVisible, setIsOriginModalVisible] = useState(false);
    const [isDestinationModalVisible, setIsDestinationModalVisible] = useState(false);
    const [isOfferModalVisible, setIsOfferModalVisible] = useState(false);
    const [isDriverOfferModalVisible, setIsDriverOfferModalVisible] = useState(false);
    const [driverTripOffers, setDriverTripOffers] = useState<DriverTripOffer[]>([]);
    const [offer, setOffer] = useState<string>('');
    const [originSearchText, setOriginSearchText] = useState<string>('');
    const [destinationSearchText, setDestinationSearchText] = useState<string>('');
    const [originSearchResults, setOriginSearchResults] = useState<OpenStreetPlaceDetail[]>([]);
    const [destinationSearchResults, setDestinationSearchResults] = useState<OpenStreetPlaceDetail[]>([]);

    const [originPlace, setOriginPlace] = useState<{
        lat: number,
        lng: number,
        address: string
    } | undefined>(undefined);

    const [originMarker, setOriginMarker] = useState<LatLng>();

    const [destinationPlace, setDestinationPlace] = useState<{
        lat: number,
        lng: number,
        address: string
    } | undefined>(undefined);

    const mapRef = useRef<MapView>(null);
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [currentPositions, setCurrentPositions] = useState<Record<string, { lat: number; lng: number }>>({});



    useEffect(() => {
        if (originPlace !== undefined && destinationPlace !== undefined && shouldDrawRoute) {
            handleGetDirections();
            handleGetTimeAndDistance();
        }
    }, [originPlace, destinationPlace, shouldDrawRoute])

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                return;
            }
            if (Platform.OS === 'android') {
                const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
            }

            startRealTimeLocation();
            viewModel.initSocket();
            viewModel.listenerDriversPositionSocket((data: any) => {
                setDriverMarkers((prevMarkers) => {
                    const existingMarker = prevMarkers.find(marker => marker.idSocket === data.id_socket);
                    if (existingMarker) {
                        const newRotation = calculateRotation(existingMarker.lat, existingMarker.lng, data.lat, data.lng);

                        Animated.timing(existingMarker.animatedPosition, {
                            toValue: { x: data.lat, y: data.lng },
                            duration: 1000,
                            useNativeDriver: false,
                        }).start();

                        Animated.timing(existingMarker.animatedRotation, {
                            toValue: newRotation,
                            duration: 500,
                            useNativeDriver: false,
                        }).start();

                        return prevMarkers.map(marker =>
                            marker.idSocket === data.id_socket
                                ? { ...marker, lat: data.lat, lng: data.lng }
                                : marker
                        );
                    } else {
                        return [
                            ...prevMarkers,
                            {
                                id: data.id,
                                idSocket: data.id_socket,
                                lat: data.lat,
                                lng: data.lng,
                                animatedPosition: new Animated.ValueXY({ x: data.lat, y: data.lng }),
                                animatedRotation: new Animated.Value(0),
                            },
                        ];
                    }
                });

                setCurrentPositions(prev => ({
                    ...prev,
                    [data.id_socket]: { lat: data.lat, lng: data.lng },
                }));
            });
            viewModel.listenerDriversDisconnectedSocket((idSocket: string) => {
                setDriverMarkers((prevMarkers) => prevMarkers.filter(marker => marker.idSocket !== idSocket));
            });

        })();
    }, [])

    const startRealTimeLocation = async () => {
        if (!locationSubscription.current) {
            locationSubscription.current = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.BestForNavigation,
                    timeInterval: 1000,
                    distanceInterval: 1
                },
                (newLocation) => {
                    setLocation({
                        latitude: newLocation.coords.latitude,
                        longitude: newLocation.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421
                    });

                }
            );
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

    const handleGetDriverTripOffers = async (idClientRequest: number) => {
        viewModel.listenerNewDriverOffer(idClientRequest, async (data: number) => {
            const response = await viewModel.getDriverTripOffers(data);
            setIsDriverOfferModalVisible(true);
            setDriverTripOffers(response as DriverTripOffer[]);
        });
    }

    const handleCreateClientRequest = async () => {
        const response: number | ErrorResponse = await viewModel.createClientRequest({
            id_client: authResponse?.user.id!,
            pickup_lat: originPlace?.lat!,
            pickup_lng: originPlace?.lng!,
            pickup_description: originPlace?.address!,
            destination_lat: destinationPlace?.lat!,
            destination_lng: destinationPlace?.lng!,
            destination_description: destinationPlace?.address!,
            fare_offered: Number(offer)
        });
        if (typeof response === 'number') {
            viewModel.emitNewClientRequest(response);
            handleGetDriverTripOffers(response);
            ToastAndroid.show('Solicitud enviada', ToastAndroid.LONG);
        }
    }

    const handleGetTimeAndDistance = async () => {
        const response: TimeAndDistanceValues | ErrorResponse = await viewModel.getTimeAndDistance(
            { latitude: originPlace!.lat, longitude: originPlace!.lng },
            { latitude: destinationPlace!.lat, longitude: destinationPlace!.lng }
        );
        if ('distance' in response) {
            setTimeAndDistance(response as TimeAndDistanceValues);
        }
    }

    const handleGetDirections = async () => {
        const response: OSMRouteResponse | null = await viewModel.getDirections(
            { latitude: originPlace!.lat, longitude: originPlace!.lng },
            { latitude: destinationPlace!.lat, longitude: destinationPlace!.lng }
        );
        if (response !== null && response.routes.length) {
            setDirectionsRoute([
                { latitude: originPlace!.lat, longitude: originPlace!.lng },
                { latitude: destinationPlace!.lat, longitude: destinationPlace!.lng }
            ]);
            setOriginMarker({ latitude: originPlace!.lat, longitude: originPlace!.lng });
        }
    }

    const handleSearchOrigin = async () => {
        const results = await viewModel.getPlaceDetails(originSearchText);
        setOriginSearchResults(results);
    }

    const handleSelectOrigin = (item: OpenStreetPlaceDetail) => {
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        moveCameraToLocation(lat, lng);
        setOriginPlace({ lat, lng, address: item.display_name });
        setIsOriginModalVisible(false);
        setOriginSearchResults([]);
        setOriginSearchText('');
        setShouldDrawRoute(true);
    }

    const handleSearchDestination = async () => {
        const results = await viewModel.getPlaceDetails(destinationSearchText);
        setDestinationSearchResults(results);
    }

    const handleSelectDestination = (item: OpenStreetPlaceDetail) => {
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        setDestinationPlace({ lat, lng, address: item.display_name });
        setIsDestinationModalVisible(false);
        setDestinationSearchResults([]);
        setDestinationSearchText('');
        setShouldDrawRoute(true);
    }

    const handleGetPlaceDetailsByCoords = async (lat: number, lng: number) => {
        const response: OpenStreetPlaceDetail | null = await viewModel.getPlaceDetailsByCoords(lat, lng);
        if (response !== null) {
            setOriginPlace({ lat, lng, address: response.display_name });
            if (originPlace === undefined) {
                setShouldDrawRoute(true);
            } else {
                setShouldDrawRoute(false);
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
        return (
            <View style={styles.container}>
                <Text>No se puede obtener la ubicacion revisa los permisos</Text>
            </View>
        );
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
                        height: isInteractingWithMap ? Dimensions.get('window').height * 0.87 : Dimensions.get('window').height * 0.64
                    }}
                    initialRegion={location}
                    zoomControlEnabled={true}
                    onRegionChangeComplete={(region) => {
                        toogleView(false);
                        handleGetPlaceDetailsByCoords(region.latitude, region.longitude);
                    }}
                    onPanDrag={() => toogleView(true)}
                >
                    {
                        driverMarkers.map(driver => {
                            const rotateInterpolation = driver.animatedRotation.interpolate({
                                inputRange: [0, 360],
                                outputRange: ['0deg', '360deg'],
                            });

                            const position = currentPositions[driver.idSocket] || { lat: driver.lat, lng: driver.lng };

                            return (
                                <Marker
                                    key={driver.idSocket}
                                    coordinate={{
                                        latitude: position.lat,
                                        longitude: position.lng,
                                    }}
                                    anchor={{ x: 0.5, y: 0.5 }}
                                    title={`Id Conductor: ${driver.id}`}
                                >
                                    <Animated.View style={{ transform: [{ rotate: rotateInterpolation }] }}>
                                        <Image
                                            source={require('../../../../assets/car_yellow.png')}
                                            style={{ width: 50, height: 50, resizeMode: 'contain' }}
                                        />
                                    </Animated.View>
                                </Marker>
                            );
                        })
                    }
                    {
                        originMarker && (
                            <Marker
                                coordinate={{
                                    latitude: originMarker!.latitude,
                                    longitude: originMarker!.longitude
                                }}
                                title="Origen"
                            >
                                <View style={{ width: 45, height: 45 }}>
                                    <Image
                                        source={require('../../../../assets/location_white.png')}
                                        style={{ width: 45, height: 45, resizeMode: 'contain' }}
                                    />
                                </View>
                            </Marker>
                        )
                    }
                    {
                        destinationPlace && (
                            <Marker
                                coordinate={{
                                    latitude: destinationPlace!.lat,
                                    longitude: destinationPlace!.lng
                                }}
                                title="Destino"
                            >
                                <View style={{ width: 50, height: 50 }}>
                                    <Image
                                        source={require('../../../../assets/flag_white.png')}
                                        style={{ width: 50, height: 50, resizeMode: 'contain' }}
                                    />
                                </View>
                            </Marker>
                        )
                    }
                    {
                        directionsRoute.length > 0 && (<Polyline coordinates={directionsRoute} strokeWidth={6} strokeColor="red" />)
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
                    paddingHorizontal: 15
                }}
            >
                <View style={{ width: '100%', height: '100%' }}>
                    <TouchableOpacity style={styles.infoContainer} onPress={() => setIsOriginModalVisible(true)}>
                        <Text>{originPlace?.address ?? 'Recoger en'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.infoContainer} onPress={() => setIsDestinationModalVisible(true)}>
                        <Text>{destinationPlace?.address ?? 'Destino'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.infoContainer} onPress={() => setIsOfferModalVisible(true)}>
                        <Text>{offer === '' ? 'Oferta' : offer}</Text>
                    </TouchableOpacity>

                    <Modal visible={isOriginModalVisible} animationType="slide" transparent={true}>
                        <Pressable style={styles.modalOverlay} onPress={() => setIsOriginModalVisible(false)}>
                            <Pressable style={styles.modalContent} onPress={() => { }}>
                                <View style={styles.viewDecoration}>
                                    <Text style={styles.textDecoration}>Selecciona el lugar de recogida</Text>
                                </View>
                                <DefaultTextInput
                                    icon={require('../../../../assets/location.png')}
                                    placeholder='Buscar lugar de recogida'
                                    onChangeText={setOriginSearchText}
                                    value={originSearchText}
                                />
                                <DefaultRoundedButton onPress={handleSearchOrigin} text="Buscar" backgroundColor="black" />
                                {originSearchResults.length > 0 && (
                                    <FlatList
                                        data={originSearchResults}
                                        keyExtractor={(item) => item.place_id}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
                                                onPress={() => handleSelectOrigin(item)}
                                            >
                                                <Text>{item.display_name}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                )}
                            </Pressable>
                        </Pressable>
                    </Modal>

                    <Modal visible={isDestinationModalVisible} animationType="slide" transparent={true}>
                        <Pressable style={styles.modalOverlay} onPress={() => setIsDestinationModalVisible(false)}>
                            <Pressable style={styles.modalContent} onPress={() => { }}>
                                <View style={styles.viewDecoration}>
                                    <Text style={styles.textDecoration}>Selecciona el destino</Text>
                                </View>
                                <DefaultTextInput
                                    icon={require('../../../../assets/location.png')}
                                    placeholder='Buscar destino'
                                    onChangeText={setDestinationSearchText}
                                    value={destinationSearchText}
                                />
                                <DefaultRoundedButton onPress={handleSearchDestination} text="Buscar" backgroundColor="black" />
                                {destinationSearchResults.length > 0 && (
                                    <FlatList
                                        data={destinationSearchResults}
                                        keyExtractor={(item) => item.place_id}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}
                                                onPress={() => handleSelectDestination(item)}
                                            >
                                                <Text>{item.display_name}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                )}
                            </Pressable>
                        </Pressable>
                    </Modal>

                    <Modal visible={isOfferModalVisible} animationType="slide" transparent={true}>
                        <Pressable style={styles.modalOverlay} onPress={() => setIsOfferModalVisible(false)}>
                            <Pressable style={styles.modalContent} onPress={() => { }}>
                                <View style={styles.viewDecoration}>
                                    <Text style={styles.textDecoration}>Agrega una oferta</Text>
                                </View>
                                <DefaultTextInput
                                    icon={require('../../../../assets/dolar.png')}
                                    placeholder='Precio'
                                    onChangeText={setOffer}
                                    value={offer}
                                    keyboardType="numeric"
                                    textColor="black"
                                    placeholderTextColor="black"
                                />
                            </Pressable>
                        </Pressable>
                    </Modal>

                    <View style={styles.timeAndDistanceView}>
                        <Text style={styles.timeAndDistanceText}>Precio recomendado: ${timeAndDistance?.recommended_value.toFixed(2)}</Text>
                        <Text style={styles.timeAndDistanceText}>Tiempo y distance: {timeAndDistance?.duration.text} {timeAndDistance?.distance.text}</Text>
                    </View>

                    <DefaultRoundedButton onPress={handleCreateClientRequest} text="Solicitar conductor" backgroundColor="black" />
                </View>
            </Animated.View>

            <Image
                style={{
                    height: 50,
                    width: 50,
                    position: 'absolute',
                    top: isInteractingWithMap ? '40%' : '30%'
                }}
                source={require('../../../../assets/pin_red.png')}
            />

            <Modal visible={isDriverOfferModalVisible} animationType="fade" transparent={true}>
                <FlatList
                    data={driverTripOffers}
                    keyExtractor={(item) => item.id!.toString()}
                    renderItem={({ item }) => <DriverOfferItem viewModel={viewModel} driverTripOffer={item} navigation={navigation} />}
                />
            </Modal>
        </View>
    );
}