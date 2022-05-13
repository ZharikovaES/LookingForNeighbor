import axios from "axios";

export default class UtilService {
    static async getCities(query){
        let result = [];
        const KLADR_TOKEN = process.env.KLADR_TOKEN;
        const KLADR_API = process.env.KLADR_API;
        // console.log(query);
        // axios.interceptors.request.use((config) => {
        //     if (config.method !== 'get') {
        //       config.data = qs.stringify(config.data) // fix Rails i18n error
        //     }
        //     if (typeof config.params === 'undefined') {
        //       config.params = {}
        //     }
        //     return .getAppSetting()
        //       .then((appSetting) => {
        //         config.params.locale = appSetting.locale
        //         config.params.currency = appSetting.currency
        //         return ProfileService.getCurrentUser()
        //           .then((currentUser) => {
        //             if (currentUser) {
        //               config.headers.common.Authorization = currentUser.token
        //             }
        //             return config
        //           })
        //       })
        //   })
        const response = await axios.get(KLADR_API, { params: { 
                                                        token: KLADR_TOKEN,
                                                        query: query,
                                                        contentType: "city",
                                                        typeCode: 1
                                                    }});
        if (response)
            if (response.data){
                result = response.data.result;
                if (result) result = result.filter((el, index) => index !== 0);
            }
        return result;
    }
    static async getAddresses(cityId, query){
        let result = [];
        const DADATA_AUTHORIZATION_TOKEN = process.env.DADATA_AUTHORIZATION_TOKEN;
        const DADATA_SECRET_KEY = process.env.DADATA_SECRET_KEY;
        const DADATA_API = process.env.DADATA_SUGGESTIONS_API;
        const response = await axios.post(DADATA_API, 
                                                { 
                                                    query: query,
                                                    from_bound: { value: "city_district" },
                                                    to_bound: { value: "house" },
                                                    restrict: true,
                                                    locations: [{
                                                        kladr_id: cityId
                                                    }]
                                                },
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
                result = response.data.suggestions;
                // console.log(result);
                
                if (result) result = result.filter(el => +el.data.fias_level < 65 && el.data.settlement_type !== "д").map(el => { return { value: el.unrestricted_value, label: el.value }});
            }
        return result;
    }
    static async getJobs(query){
        let result = [];
        const HH_API = process.env.HH_API;
        const response = await axios.get(HH_API, { params: { 
                                                        text: query,
                                                        locale: 'RU'
                                                    }});
        if (response && response.data && response.data.items)
            result = response.data.items.map(el => { return { id: +el.id, 
                                                                text: el.text, 
                                                                professional_roles: el.professional_roles.map(element => {
                                                                    return {
                                                                        id: +element.id,
                                                                        name: element.name
                                                                    };
                                                                }) }});
        return result;
    }
    static async getUniversities(countryId, query){
        let result = [];
        const VK_ACCESS_TOKEN = process.env.VK_ACCESS_TOKEN;
        const VK_API_UNIVERSITIES = process.env.VK_API_UNIVERSITIES;
        const response = await axios.get(VK_API_UNIVERSITIES, { params: { 
                                                                access_token: VK_ACCESS_TOKEN,
                                                                country_id: countryId,
                                                                q: query,
                                                                count: 10,
                                                                v: 5.131
                                                            }});
        if (response)
            if (response.data)
                if (response.data.response)
                    if (response.data.response.items) {
                        result = response.data.response.items;
                        result = result.filter((el, i) => {
                            const index = result.findIndex(element => {
                                 return element.title === el.title;
                            });
                            return i === index; });
                    }
        return result;
    }

    static async getFaculties(universityId){
        let result = [];
        const VK_ACCESS_TOKEN = process.env.VK_ACCESS_TOKEN;
        const VK_API_FACULTIES = process.env.VK_API_FACULTIES;
        const response = await axios.get(VK_API_FACULTIES, { params: { 
                                                                access_token: VK_ACCESS_TOKEN,
                                                                university_id: universityId,
                                                                v: 5.131
                                                            }});
        if (response)
            if (response.data)
                if (response.data.response)
                    if (response.data.response.items) {
                        result = response.data.response.items;
                        result = result.filter((el, i) => {
                            const index = result.findIndex(element => {
                                return element.title === el.title;
                            });
                            return i === index; 
                        });
                    }
        return result;
    }

    static async getChairs(facultyId){
        let result = [];
        const VK_ACCESS_TOKEN = process.env.VK_ACCESS_TOKEN;
        const VK_API_CHAIRS = process.env.VK_API_CHAIRS;
        const response = await axios.get(VK_API_CHAIRS, { params: { 
                                                                access_token: VK_ACCESS_TOKEN,
                                                                faculty_id: facultyId,
                                                                v: 5.131
                                                            }});
        
        if (response)
            if (response.data)
                if (response.data.response)
                    if (response.data.response.items) {
                        result = response.data.response.items;
                        result = result.filter((el, i) => {
                            const index = result.findIndex(element => {
                                return element.title === el.title;
                            });
                            return i === index; 
                        });
                    }
        return result;
    }
}