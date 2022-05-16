import path from 'path';
import Fs from 'fs';

export default class ConvertService {
    static __dirname = path.resolve();
    // estimatedScore
    static convertDataDbObjToClientSimplifiedObj(records){
        const result = [];
        for (let i = 0; i < records.map(i => i.get('u')).length; i++){
            const user = records.map(i => i.get('u'))[i].properties;
            const desiredApartment = records.map(i => i.get('d'))[i].properties;
            const pathAvatarUser = path.join(user._id, "images-avatar", user.image);
            let estimatedScore = records.map(i => {
                if (i.has('estimatedScore'))
                    return i.get('estimatedScore')
            })[0] || 0;

            result.push({
                id: user._id,
                username: user.username,
                dateOfBirth: user.birthdate,
                gender: user.gender,
                estimatedScore: estimatedScore * 100 / 5.0,
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
            console.log("records");
            console.log(records);
            let location = { city: records.map(i => i.get('city').properties)[0] };
            let user = records.map(i => i.get('user').properties)[0];
            let searchedUser = records.map(i => i.get('searchInfo').properties)[0];
            let apartment = records.map(i => i.get('desiredApartment').properties)[0];
            let realScore = records.map(i => {
                if (i.has('realScore'))
                    return i.get('realScore')
            })[0] || 0;
            console.log("realScore");     
            console.log(realScore);     
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
            return { location, user, searchedUser, apartment, realScore };    
        } catch(e){
            return { location: null, user: null, searchedUser: null, apartment: null, realScore: 0 };    
        }
    }
    static convertDataClientObjToDbObj(records){
        
    }
    static convertDataDbObjToMatrix(records){
        console.log(123);
        // console.log(records);
        const setUser1 = new Set();
        const setUser2 = new Set();
        records.forEach(i => {
            setUser1.add(i.get('user1Id'));
            setUser2.add(i.get('user2Id'));
        });
        let vectorUser1 = Array.from(setUser1);
        let vectorUser2 = Array.from(setUser2);
        console.log("vectorUser1, vectorUser2");
        console.log(vectorUser1, vectorUser2);
        // vectorUser1 = vectorUser1.slice(0, vectorUser2.length);
        if (!vectorUser1.length || !vectorUser2.length) return;
        const matrix = [];
        for (let i = 0; i < vectorUser1.length; i++) {
            matrix.push(new Array(vectorUser2.length));
            for (let j = 0; j < vectorUser2.length; j++){
                matrix[i][j] = this.getScoreByUserId(records, vectorUser1[i], vectorUser2[j]);
            }
        }
        console.log("matrix");
        // console.log(matrix);
        return {vectorUser1, vectorUser2, matrix};
    }
    static getScoreByUserId(records, user1Id, user2Id){
        for (const record of records){
            if (record.get('user1Id') === user1Id && record.get('user2Id') === user2Id)
                return record.get('realScore');
        }
        return 0;
    }
}