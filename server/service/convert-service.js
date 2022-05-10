import path from 'path';
import Fs from 'fs';

export default class ConvertService {
    static __dirname = path.resolve();
    static convertDataDbObjToClientSimplifiedObj(records){
        const result = [];
        for (let i = 0; i < records.map(i => i.get('u')).length; i++){
            const user = records.map(i => i.get('u'))[i].properties;
            const desiredApartment = records.map(i => i.get('d'))[i].properties;
            const pathAvatarUser = path.join(user._id, "images-avatar", user.image);
            result.push({
                id: user._id,
                username: user.username,
                dateOfBirth: user.birthdate,
                gender: user.gender,
                image: {
                    file: '',
                    imagePreviewUrl: Fs.existsSync(this.__dirname + '/files/' + pathAvatarUser) ? pathAvatarUser : ''
                },
                coordinatesPlaces: desiredApartment.coordinatesPlaces ?? [],
                labelsPlaces: desiredApartment.labelsPlaces ?? []
            });
        }
        return result;
    }
    static convertDataDbObjToClientObj(records){
        try{
            let location = { city: records.map(i => i.get('city').properties)[0] };
            let user = records.map(i => i.get('user').properties)[0];
            let searchedUser = records.map(i => i.get('searchInfo').properties)[0];
            let apartment = records.map(i => i.get('desiredApartment').properties)[0];
                    
            location = {
                country: {
                    id: 1
                },
                city: {
                        ...location.city
                    },
                places: apartment.labelsPlaces, 
                coordinates: apartment.coordinatesPlaces,
    
            };
            user = {
                id: user._id,
                username: user.username,
                dateOfBirth: user.birthdate,
                gender: user.gender,
                image: {
                    file: '',
                    imagePreviewUrl: user.image,
                },
                email: user.email,
                password: user.password,
                smoking: user.smoking,
                attitudeAlcohol: user.attitudeAlcohol,
                job: {
                    id: user.jobId.toString(),
                    name: user.jobName
                },
                education: {
                    university: {
                        id: user.universityId,
                        title: user.universityTitle
                    },
                    faculty: {
                        id: user.facultyId,
                        title: user.facultyTitle
                    },
                    chair: {
                        id: user.chairId,
                        title: user.chairTitle
                    }
                },
                characteristics: user.characteristics,
                religion: user.religion,
                attitudeСhildren: user.attitudeСhildren,
                attitudeAnimals: user.attitudeAnimals,
                description: user.description,
            };
            return { location, user, searchedUser, apartment };    
        } catch(e){
            return { location: null, user: null, searchedUser: null, apartment: null };    
        }
    }
    static convertDataClientObjToDbObj(records){
        
    }
}