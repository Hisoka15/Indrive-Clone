import { LatLng } from "react-native-maps";

const getDistanceBetweenPoints = (point1: LatLng, point2: LatLng): number => {
    const R = 6371e3; // Radio de la Tierra en metros
    const lat1 = (point1.latitude * Math.PI) / 180;
    const lat2 = (point2.latitude * Math.PI) / 180;
    const deltaLat = lat2 - lat1;
    const deltaLng = ((point2.longitude - point1.longitude) * Math.PI) / 180;

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) * 
              Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

export default getDistanceBetweenPoints;