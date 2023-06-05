import axios from "axios";

export type PlaceType = {
    address: string,
    display_name: string
}

export const fetchPlace = async (latitude: number | string, longitude: number | string): Promise<PlaceType> => {
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lon=${longitude}&lat=${latitude}`);
        const placeObj: PlaceType = {
            address: response.data.address,
            display_name: response.data.display_name
        };
        return placeObj;

    } catch (error) {
        console.error('Error getting reverse geocoding data:', error);
        throw error;
    }
}