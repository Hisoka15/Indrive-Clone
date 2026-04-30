export interface ClientRequest {

    id?: number;
    id_client: number;
    fare_offered: number;
    pickup_lat: number;
    pickup_lng: number;
    destination_lat: number;
    destination_lng: number;
    pickup_description: string;
    destination_description: string;

}