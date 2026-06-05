import { asClass, createContainer } from "awilix";
import { AuthService } from "../data/sources/remote/services/AuthService";
import { AuthRepositoryImpl } from "../data/repository/AuthRepositoryImpl";
import { LoginUseCase } from "../domain/useCases/auth/LoginUseCase";
import { LoginViewModel } from "../presentation/screens/auth/login/LoginViewModel";
import { RegisterViewModel } from "../presentation/screens/auth/register/RegisterViewModel";
import { RegisterUseCase } from "../domain/useCases/auth/RegisterUseCase";
import { LocalStorage } from "../data/sources/local/LocalStorage";
import { SaveAuthSessionUseCase } from "../domain/useCases/auth/SaveAuthSessionUseCase";
import { GetAuthSessionUseCase } from "../domain/useCases/auth/GetAuthSessionUseCase";
import { RemoveAuthSessionUseCase } from "../domain/useCases/auth/RemoveAuthSessionUseCase";
import { AuthUseCases } from "../domain/useCases/auth/AuthUseCases";
import { GooglePlacesService } from "../data/sources/remote/services/GooglePlacesService";
import { GooglePlacesRepository } from '../domain/repository/GooglePlacesRepository';
import { GooglePlacesRepositoryImpl } from '../data/repository/GooglePlacesRepositoryImpl';
import { GetPlaceDetailsUseCase } from "../domain/useCases/googlePlaces/GetPlaceDetailsUseCase";
import { GooglePlacesUseCases } from "../domain/useCases/googlePlaces/GooglePlacesUseCases";
import { ClientSerchMapViewModel } from "../presentation/screens/client/searchMap/ClientSearchMapViewModel";
import { GetPlaceDetailsByCoordsUseCase } from "../domain/useCases/googlePlaces/GetPlaceDetailsByCoordsUseCase";
import { GetDirectionsUseCase } from "../domain/useCases/googlePlaces/GetDirectionsUseCase";
import { ClientRequestService } from '../data/sources/remote/services/ClientRequestService';
import { ClientRequestRepositoryImpl } from "../data/repository/ClientRequestRepositoryImpl";
import { GetTimeAndDistanceUseCase } from "../domain/useCases/clientRequest/GetTimeAndDistanceUseCase";
import { ClientRequestUseCases } from "../domain/useCases/clientRequest/ClientRequestUseCases";
import { SocketService } from "../data/sources/remote/services/SocketService";
import { DriverMyLocationMapViewModel } from "../presentation/screens/driver/myLocationMap/DriverMyLocationMapViewModel";
import { UserService } from "../data/sources/remote/services/UserService";
import { UserRepositoryImpl } from "../data/repository/UserRepositoryImpl";
import { UpdateUserUseCase } from "../domain/useCases/user/UpdateUserUseCase";
import { UpdateImageUserUseCase } from "../domain/useCases/user/UpdateImageUserUseCase";
import { UserUseCases } from "../domain/useCases/user/UserUseCases";
import { ProfileUpdateViewModel } from "../presentation/screens/profile/update/ProfileUpdateViewModel";
import { CreateClientRequestUseCase } from "../domain/useCases/clientRequest/CreateClientRequestUseCase";
import { GetNearbyTripRequestUseCase } from "../domain/useCases/clientRequest/GetNearbyTripRequestUseCase";
import { DriverClientRequestViewModel } from "../presentation/screens/driver/clientRequest/DriverClientRequestViewModel";
import { DriverPositionService } from "../data/sources/remote/services/DriverPositionService";
import { DriverPositionRepositoryImpl } from "../data/repository/DriverPositionRepositoryImpl";
import { CreateDriverPositionUseCase } from "../domain/useCases/driverPosition/CreateDriverPositionUseCase";
import { DriverPositionUseCases } from "../domain/useCases/driverPosition/DriverPositionUseCases";
import { GetDriverPositionUseCase } from "../domain/useCases/driverPosition/GetDriverPositionUseCase";
import { DriverTripOfferService } from "../data/sources/remote/services/DriverTripOfferService";
import { DriverTripOfferRepositoryImpl } from "../data/repository/DriverTripOfferRepositoryImpl";
import { DriverTripOfferUseCases } from "../domain/useCases/driverTripOffer/DriverTripOfferUseCases";
import { CreateDriverTripOfferUseCase } from "../domain/useCases/driverTripOffer/CreateDriverTripOfferUseCase";
import { GetDriverTripOffersUseCase } from "../domain/useCases/driverTripOffer/GetDriverTripOffersUseCase";
import { UpdateDriverAssignedUseCase } from "../domain/useCases/clientRequest/UpdateDriverAssignedUseCase";
import { GetClientRequestByIdUseCase } from "../domain/useCases/clientRequest/GetClientRequestByIdUseCase";
import { ClientTripMapViewModel } from "../presentation/screens/client/tripMap/ClientTripMapViewModel";
import { DriverTripMapViewModel } from "../presentation/screens/driver/tripMap/DriverTripMapViewModel";
import { UpdateStatusUseCase } from "../domain/useCases/clientRequest/UpdateStatusUseCase";
import { UpdateDriverRatingUseCase } from "../domain/useCases/clientRequest/UpdateDriverRatingUseCase";
import { UpdateClientRatingUseCase } from "../domain/useCases/clientRequest/UpdateClientRatingUseCase";
import { DriverTripRatingViewModel } from "../presentation/screens/driver/tripRating/DriverTripRatingViewModel";
import { ClientTripRatingViewModel } from "../presentation/screens/client/tripRating/ClientTripRatingViewModel";
import { GetByClientAssignedUseCase } from "../domain/useCases/clientRequest/GetByClientAssignedUseCase";
import { GetByDriverAssignedUseCase } from "../domain/useCases/clientRequest/GetByDriverAssignedUseCase";
import { ClientTripHistoryViewModel } from "../presentation/screens/client/tripHistory/ClientTripHistoryViewModel";
import { DriverTripHistoryViewModel } from "../presentation/screens/driver/tripHistory/DriverTripHistoryViewModel";
import { UpdateNotificationTokenUseCase } from "../domain/useCases/user/UpdateNotificationTokenUseCase";
import { DriverCarInfoService } from "../data/sources/remote/services/DriverCarInfoService";
import { DriverCarInfoRepositoryImpl } from "../data/repository/DriverCarInfoRepositoryImpl";
import { CreateDriverCarInfoUseCase } from "../domain/useCases/driverCarInfo/CreateDriverCarInfoUseCase";
import { DriverCarInfoUseCases } from "../domain/useCases/driverCarInfo/DriverCarInfoUseCases";
import { DriverCarInfoViewModel } from "../presentation/screens/driver/carInfo/DriverCarInfoViewModel";
import { GetDriverCarInfoUseCase } from "../domain/useCases/driverCarInfo/GetDriverCarInfoUseCase";

const container = createContainer();

container.register({
    // SERVICES
    authService: asClass(AuthService).singleton(),
    googlePlacesService: asClass(GooglePlacesService).singleton(),
    localStorage: asClass(LocalStorage).singleton(),
    clientRequestService: asClass(ClientRequestService).singleton(),
    userService: asClass(UserService).singleton(),
    driverPositionService: asClass(DriverPositionService).singleton(),
    driverTripOfferService: asClass(DriverTripOfferService).singleton(),
    driverCarInfoService: asClass(DriverCarInfoService).singleton(),
    
    // REPOSITORY
    authRepository: asClass(AuthRepositoryImpl).singleton(),
    googlePlacesRepository: asClass(GooglePlacesRepositoryImpl).singleton(),
    clientRequestRepository: asClass(ClientRequestRepositoryImpl).singleton(),
    userRepository: asClass(UserRepositoryImpl).singleton(),
    driverPositionRepository: asClass(DriverPositionRepositoryImpl).singleton(),
    driverTripOfferRepository: asClass(DriverTripOfferRepositoryImpl).singleton(),
    driverCarInfoRepository: asClass(DriverCarInfoRepositoryImpl).singleton(),

    // USE CASES
    loginUseCase: asClass(LoginUseCase).singleton(),
    registerUseCase: asClass(RegisterUseCase).singleton(),
    saveAuthSessionUseCase: asClass(SaveAuthSessionUseCase).singleton(),
    getAuthSessionUseCase: asClass(GetAuthSessionUseCase).singleton(),
    removeAuthSessionUseCase: asClass(RemoveAuthSessionUseCase).singleton(),
    authUseCases: asClass(AuthUseCases).singleton(),
    getPlaceDetailsUseCase: asClass(GetPlaceDetailsUseCase).singleton(),
    getPlaceDetailsByCoordsUseCase: asClass(GetPlaceDetailsByCoordsUseCase).singleton(),
    getDirectionsUseCase: asClass(GetDirectionsUseCase).singleton(),
    googlePlacesUseCases: asClass(GooglePlacesUseCases).singleton(),
    getTimeAndDistanceUseCase: asClass(GetTimeAndDistanceUseCase).singleton(),
    // CLIENT REQUEST
    clientRequestUseCases: asClass(ClientRequestUseCases).singleton(),
    createClientRequestUseCase: asClass(CreateClientRequestUseCase).singleton(),
    getNearbyTripRequestUseCase: asClass(GetNearbyTripRequestUseCase).singleton(),
    updateDriverAssignedUseCase: asClass(UpdateDriverAssignedUseCase).singleton(),
    getClientRequestByIdUseCase: asClass(GetClientRequestByIdUseCase).singleton(),
    updateStatusUseCase: asClass(UpdateStatusUseCase).singleton(),
    updateDriverRatingUseCase: asClass(UpdateDriverRatingUseCase).singleton(),
    updateClientRatingUseCase: asClass(UpdateClientRatingUseCase).singleton(),
    getByClientAssignedUseCase: asClass(GetByClientAssignedUseCase).singleton(),
    getByDriverAssignedUseCase: asClass(GetByDriverAssignedUseCase).singleton(),
    // USER
    updateUserUseCase: asClass(UpdateUserUseCase).singleton(),
    updateImageUserUseCase: asClass(UpdateImageUserUseCase).singleton(),
    userUseCases: asClass(UserUseCases).singleton(),
    updateNotificationTokenUseCase: asClass(UpdateNotificationTokenUseCase).singleton(),
    // DRIVER POSITION
    driverPositionUseCases: asClass(DriverPositionUseCases).singleton(),
    createDriverPositionUseCase: asClass(CreateDriverPositionUseCase).singleton(),
    getDriverPositionUseCase: asClass(GetDriverPositionUseCase).singleton(),
    // DRIVER TRIP OFFER
    driverTripOfferUseCases: asClass(DriverTripOfferUseCases).singleton(),
    createDriverTripOfferUseCase: asClass(CreateDriverTripOfferUseCase).singleton(),
    getDriverTripOffersUseCase:asClass(GetDriverTripOffersUseCase).singleton(),
    // DRIVER CAR INFO
    driverCarInfoUseCases: asClass(DriverCarInfoUseCases).singleton(),
    createDriverCarInfoUseCase: asClass(CreateDriverCarInfoUseCase).singleton(),
    getDriverCarInfoUseCase: asClass(GetDriverCarInfoUseCase).singleton(),

    // VIEW MODEL
    loginViewModel: asClass(LoginViewModel).singleton(),
    registerViewModel: asClass(RegisterViewModel).singleton(),
    clientSearchMapViewModel: asClass(ClientSerchMapViewModel).singleton(),
    driverMyLocationMapViewModel: asClass(DriverMyLocationMapViewModel).singleton(),
    profileUpdateViewModel: asClass(ProfileUpdateViewModel).singleton(),
    driverClientRequestViewModel: asClass(DriverClientRequestViewModel).singleton(),
    clientTripMapViewModel: asClass(ClientTripMapViewModel).singleton(),
    driverTripMapViewModel: asClass(DriverTripMapViewModel).singleton(),
    driverTripRatingViewModel: asClass(DriverTripRatingViewModel).singleton(),
    clientTripRatingViewModel: asClass(ClientTripRatingViewModel).singleton(),
    clientTripHistoryViewModel: asClass(ClientTripHistoryViewModel).singleton(),
    driverTripHistoryViewModel: asClass(DriverTripHistoryViewModel).singleton(),
    driverCarInfoViewModel: asClass(DriverCarInfoViewModel).singleton(),
    // SERVICES
    socketService: asClass(SocketService).singleton(),
});

export { container };