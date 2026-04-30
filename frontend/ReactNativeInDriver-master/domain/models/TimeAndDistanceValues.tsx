export interface TimeAndDistanceValues {
    recommended_value:     number;
    destination_addresses: string;
    origin_addresses:      string;
    distance:              Distance;
    duration:              Duration;
}

export interface Distance {
    text:  string;
    value: number;
}

export interface Duration {
    text:  string;
    value: number;
}