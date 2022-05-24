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
    static convertDataDbObjToClientSimplifiedObjE(records){
        const result = [];
        for (let i = 0; i < records.map(i => i.get('user2')).length; i++){
            const user = records.map(i => i.get('user2'))[i].properties;
            const desiredApartment = records.map(i => i.get('d'))[i].properties;
            const pathAvatarUser = path.join(user._id, "images-avatar", user.image);
            let estimatedScore = 0;
            records.forEach(i => {
                if (i.has('estimatedScore') && user._id === i.get('user2Id')){
                    estimatedScore = i.get('estimatedScore')
                }
            })
            result.push({
                id: user._id,
                username: user.username,
                dateOfBirth: user.birthdate,
                gender: user.gender,
                estimatedScore: estimatedScore,
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
            let realScore = records.map(i => {
                if (i.has('realScore'))
                    return i.get('realScore')
            })[0] || [0, 0, 0, 0, 0, 0, 0, 0];
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
            return { location: null, user: null, searchedUser: null, apartment: null, realScore: [0, 0, 0, 0, 0, 0, 0, 0] };    
        }
    }
    static convertDataClientObjToDbObj(records){
        
    }
    static convertDataDbObjToMatrix(records, indexType){
        const setUser1 = new Set();
        const setUser2 = new Set();
        records.forEach(i => {
            setUser1.add(i.get('user1Id'));
            setUser2.add(i.get('user2Id'));
        });
        let vectorUser1 = Array.from(setUser1);
        let vectorUser2 = Array.from(setUser2);
        if (!vectorUser1.length || !vectorUser2.length) return;
        const matrix = [];
        for (let i = 0; i < vectorUser1.length; i++) {
            matrix.push(new Array(vectorUser2.length));
            for (let j = 0; j < vectorUser2.length; j++){
                matrix[i][j] = this.getScoreByUserId(records, vectorUser1[i], vectorUser2[j], indexType);
            }
        }
        return { vectorUser1, vectorUser2, matrix };
    }
    static getScoreByUserId(records, user1Id, user2Id, indexType){
        for (const record of records){
            if (record.get('user1Id') === user1Id && record.get('user2Id') === user2Id) {
                console.log(record.get('realScore'));
                return record.get('realScore')[indexType];
            }
        }
        return 0;
    }
    static convertChannelMessagesDbObjToClientObj(idUser, records) {
        const result = [];
        const roomsSet = new Set();
        for (const record of records){
            if (record.get('channel').properties._id) roomsSet.add(record.get('channel').properties._id);
        }
        roomsSet.forEach(el => {
            let messages = [];
            result.push({_id: el, messages});
        })
        for (const record of records){
            let channelIndex = result.findIndex(el => el._id === record.get('channel').properties._id);
            if (channelIndex >= 0) {
                result[channelIndex] = {...result[channelIndex], ...record.get('channel').properties}
                if (record.get('user2').properties._id && idUser) {
                    const pathAvatarUser = path.join(record.get('user2').properties._id, "images-avatar", record.get('user2').properties.image);
                    result[channelIndex].participants = {
                        id: record.get('user2').properties._id,
                        username: record.get('user2').properties.username,
                        dateOfBirth: record.get('user2').properties.birthdate,
                        image: {
                            file: '',
                            imagePreviewUrl: Fs.existsSync(this.__dirname + '/files/' + pathAvatarUser) ? pathAvatarUser : ''
                        },
                    }
                }
                if (record.get('message1')){
                    if (result[channelIndex].messages.findIndex(el => record.get('message1').properties._id == el._id) < 0)
                        result[channelIndex].messages.push({...record.get('message1').properties, idOwner: idUser});
                }
                if (record.get('message2')){
                    if (result[channelIndex].messages.findIndex(el => record.get('message2').properties._id == el._id) < 0)
                        result[channelIndex].messages.push({...record.get('message2').properties, idOwner: record.get('user2').properties._id});
                }
                result[channelIndex].messages.sort((a, b) => a.createdDate - b.createdDate);
            }
        }
        return result;
    }
}