export interface OpenStreetDirections {
    code: string;
    routes: {
        distance: number;
        duration: number;
        legs: {
            distance: number;
            duration: number;
            steps: {
                distance: number;
                duration: number;
                name: string;
                instruction: string;
            }[];
        }[];
    }[];
}