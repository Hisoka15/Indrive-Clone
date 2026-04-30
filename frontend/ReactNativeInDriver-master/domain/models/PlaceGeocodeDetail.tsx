export interface PlaceGeocodeDetail {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  address: {
    road?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}