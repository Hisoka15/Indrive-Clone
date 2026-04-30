export interface ClientRequestResponse {
    id:                      number;
    id_client:               number;
    fare_offered:            string;
    pickup_description:      string;
    destination_description: string;
    status:                  string;
    updated_at:              Date;
    pickup_position:         Position;
    destination_position:    Position;
    distance:                number;
    time_difference:         string;
    client:                  Client;
    driver:                  Driver;
    google_distance_matrix:  GoogleDistanceMatrix;
}

export interface Client {
    name:     string;
    image:    string;
    phone:    string;
    lastname: string;
}

export interface Driver {
    name:     string;
    image:    string;
    phone:    string;
    lastname: string;
}

export interface Position {
    x: number;
    y: number;
}

export interface GoogleDistanceMatrix {
    distance: Distance;
    duration: Distance;
    status:   string;
}

export interface Distance {
    text:  string;
    value: number;
}