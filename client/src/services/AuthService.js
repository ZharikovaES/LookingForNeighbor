import $api from "../http"

export default class AuthService {
    static async login(email, password) {
        return $api.post('/login', { email, password });
    }
    static async registration(data) {
        const formData = new FormData();
        const json = JSON.stringify(data);
        const blob = new Blob([json], {
            type: 'application/json'
        });
        formData.append("newUser", blob);
        formData.append("imageUser", data.user.image.file);
        return $api.post('/registration', formData,
           { headers: { "Content-Type": "multipart/form-data" }},
        );
    }
    
    static async authenticationByGoogle(credential) {
        const { data } = await $api.post('/authentication/google', { credential });
        return data;
    }
    static async authenticationByVK(properties) {
        const { data } = await $api.post('/authentication/vk', properties);
        return data;
    }
    static async logout(data) {
        return $api.post('/logout', data);
    }
}