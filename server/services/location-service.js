import axios from "axios";

export default class LocationServices{
    static async getFullAddresses(places, distance = 0.05 * 20) {
        const noRepeatArr = places.filter((el, i, arr) => i === arr.findIndex(element => element.value === el.value));
        const labels = noRepeatArr.map(el => el.label);
        const values = labels.map(el => {
            if (el.includes("г.")){
                let arr = el.split(', ');
                arr = el.split(-(arr.length - 1));
                return arr.join(', ')
            }
            return el;
        });
        const addressesAHunter = await this.getStandartAddressesAHunter(noRepeatArr.map(el => el.value));
        const addressesDaData = await this.getStandartAddressesDaData(noRepeatArr.map(el => el.value));
        let fullAddress = [], coordinates = [];
        for (let i = 0; i < addressesAHunter.length; i++) {
            if (labels[i].includes('метро') || labels[i].toLowerCase().includes('мцд')) {
                let line = null;
                let metro = null;
                const regexp = /\(.+\)/;
                const newMetro = labels[i].replace(/\s(метро|МЦД)/g, "");

                if (regexp.test(labels[i])) {
                    const strLine = newMetro.match(regexp)[0].replace(/\(|\)/g, '');
                    if (!strLine.includes("Большая кольцевая линия") && strLine)
                        line = strLine;
                    const strWithoutBrackets = newMetro.split('(').slice(-2)[0].trim();
                    metro = strWithoutBrackets.substr(strWithoutBrackets.indexOf(",") + 2);
                } else metro = newMetro.substr(newMetro.indexOf(",") + 2);
                fullAddress.push({
                    metro, line,
                    lat: addressesDaData[i]?.geo_lat,
                    lon: addressesDaData[i]?.geo_lon,
                });
            } else if (addressesAHunter[i]) {
                    const districtName = addressesAHunter[i]?.areas?.admin_area?.name || null;
                    const streetName = addressesAHunter[i]?.fields?.find(el => el.level === "Street")?.name || null;
                    const house = addressesAHunter[i]?.fields?.find(el => el.level === "House");
                    const building = addressesAHunter[i]?.fields?.find(el => el.level === "Building");
                    const buildingCover = building?.cover?.split(' ')?.join('') ?? '';
                    const structure = addressesAHunter[i]?.fields?.find(el => el.level === "Structure");
                    const structureCover = structure?.cover?.split(' ')?.join('') ?? '';
                    const houseNumber = house?.name ? house.name + buildingCover + structureCover : null  
                fullAddress.push({
                    district: districtName,
                    street: streetName,
                    house: houseNumber,
                    nearestMetro: addressesAHunter[i]?.stations?.filter(el => el.dist <= distance && (el.type.includes("LightRail") || el.type.includes("Subway"))),
                    lat: addressesDaData[i]?.geo_lat,
                    lon: addressesDaData[i]?.geo_lon,
                });
            } else fullAddress.push({
                district: labels[i].split(' ').slice(-1)[0],
                lat: addressesDaData[i]?.geo_lat,
                lon: addressesDaData[i]?.geo_lon,
            });
        }
        return { labels, values, fullAddress, coordinates };
    }
    static async getCleanAddresses(places){
        let result = [];
        const DADATA_AUTHORIZATION_TOKEN = process.env.DADATA_AUTHORIZATION_TOKEN;
        const DADATA_SECRET_KEY = process.env.DADATA_SECRET_KEY;
        const DADATA_API = process.env.DADATA_CLEANER_API;
        const response = await axios.post(DADATA_API, 
                                                places,
                                                {
                                                    headers: {
                                                        'Accept': 'application/json',
                                                        'Content-Type': 'application/json',
                                                        'Authorization': 'Token ' + DADATA_AUTHORIZATION_TOKEN,
                                                        'X-Secret': DADATA_SECRET_KEY
                                                    }
                                                }
                                            );
        if (response)
            if (response.data)
                result = response.data;
        return result;
    }
    static async getStandartAddressesAHunter(places){
        let result = [];
        const AHUNTER_TOKEN = process.env.AHUNTER_TOKEN;
        const AHUNTER_CLEANSE_API = process.env.AHUNTER_CLEANSE_API;
        for (let place of places) {
            const response = await axios.get(AHUNTER_CLEANSE_API, 
                { params: {
                    query: place,
                    user: AHUNTER_TOKEN,
                    output: "json|pretty|ageo",
                    mode: "forcezip|weak",
                    addresslim: 1,
                    country: "rus"
                }}
            );
            if (response?.data?.check_info?.alts && !place.includes("метро")) result.push(response?.data?.addresses[0]);
            else result.push(null);
        }
        return result;
    }
    static async getStandartAddressesDaData(places){
        let result = [];
        const DADATA_AUTHORIZATION_TOKEN = process.env.DADATA_AUTHORIZATION_TOKEN;
        const DADATA_SECRET_KEY = process.env.DADATA_SECRET_KEY;
        const DADATA_API = process.env.DADATA_CLEANER_API;
        const response = await axios.post(DADATA_API, 
                                                places,
                                                {
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Authorization': 'Token ' + DADATA_AUTHORIZATION_TOKEN,
                                                        'X-Secret': DADATA_SECRET_KEY
                                                    }
                                                }
                                            );
        const resultMetro = await axios.post(DADATA_API, 
                                                    places,
                                                    {
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'Authorization': 'Token ' + DADATA_AUTHORIZATION_TOKEN,
                                                            'X-Secret': DADATA_SECRET_KEY
                                                        }
                                                    }
                                                );
        if (response?.data)
                result = response.data;
        return [ result, resultMetro ];
    }
    static async getCoordinatesByCityName(fullName) {
        const data = await this.getCleanAddresses([fullName]);
        const cities = data.filter(el => el.region_type === 'г');
        if (cities[0].qc_geo)
            if (cities[0].qc_geo !== 5) 
                return [cities[0].geo_lat, cities[0].geo_lon];
        return null;
    }
}
