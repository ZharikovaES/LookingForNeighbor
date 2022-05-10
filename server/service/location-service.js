import axios from "axios";

export default class LocationServices{
    static async getFullAddresses(places, distance = 0.05 * 20) {
        // const noRepeatArr = places.filter((el, i, arr) => i === arr.findIndex(element => element.value === el.value));
        // const labels = noRepeatArr.map(el => el.label);
        // const cleanAddresses = await this.getCleanAddresses(noRepeatArr.map(el => el.value));
        // let fullAddress = [], coordinates = [];
        // for (const address of cleanAddresses) {
        //     let str = '';
        //     let parts = [];

        //     if (!address.source.includes("метро") && !address.source.includes("р-н")) {
        //         parts = address.result.split(', ').filter((el, i) => i !== 0);
        //         str = address.city_district_with_type ? address.city_district_with_type : '';
        //         if (address.metro)
        //             for (const station of address.metro)
        //                 if (distance >= station.distance)
        //                     str += ', метро ' + station.name;
        //     } else parts = address.source.split(', ').filter((el, i) => i !== 0);
        //     str += parts.join(', ');
        //     if (str) {
        //         fullAddress.push(str);
        //         if (address.geo_lat && address.geo_lon)
        //             coordinates.push(address.geo_lat + ' ' + address.geo_lon);
        //         else coordinates.push(null);
        //     }
        // }
        return [
        // console.log([labels, fullAddress, coordinates]);
        [
              'г Москва, р-н Замоскворечье',
              'г Москва, ул Пятницкая, д 5',
              'г Москва, метро Юго-Западная'
            ],
            [ 'р-н Замоскворечье', 'р-н Замоскворечье, ул Пятницкая, д 5', 'метро Юго-Западная' ],
            [
              '55.7540471 37.620405',
              '55.7452241 37.6272476',
              '55.663146, 37.482852'
            ]
          ];

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
            if (response.data){
                result = response.data;
                // console.log(result);
                // if (result) result = result.filter(el => +el.data.fias_level < 65 && el.data.settlement_type !== "д").map(el => { return { value: el.unrestricted_value, label: el.value }});
                // console.log("result:");
                // console.log(result);
            }
        return result;
    }
    static async getCoordinatesByCityName(fullName) {
        const data = await this.getCleanAddresses([fullName]);
        // console.log("getCoordinatesByCityName");
        // console.log(data);
        const cities = data.filter(el => el.region_type === 'г');
        if (cities[0].qc_geo)
            if (cities[0].qc_geo !== 5) 
                return [cities[0].geo_lat, cities[0].geo_lon];
        return null;
    }
}
