import path from 'path';
import fs from 'fs';

export default class FileService {
    static __dirname = path.resolve();
    static async uploadFile(idUser, file){
        try {
            const path = this.__dirname + "/files/" + idUser + "/images-avatar/";
            if (!fs.existsSync(path))
                fs.mkdirSync(path, { recursive: true });
            file.mv(path + file.name);
            
        } catch(error){
            console.log(error);
        }
    }
}