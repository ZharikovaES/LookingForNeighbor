import neo4j from 'neo4j-driver';
import { nanoid } from 'nanoid';

import dotenv from 'dotenv';
import path from 'path';

const __dirname = path.resolve();

dotenv.config({ path: __dirname + '/.env', debug: true, override: true });
const {
    url_db,
    username_db,
    password,
    database
} = process.env;


const driver = neo4j.driver(url_db,
                  neo4j.auth.basic(username_db, password), 
                  {/* encrypted: 'ENCRYPTION_OFF' */});
const session = driver.session({ database });

const findAll = async () => {
    const result = await session.run('match (a:Apartment) return a');
    return result.records.map(i => i.get('a').properties)
}
const findById = async id => {
    const result = await session.run(`match (a:Apartment {_id : '${id}'}) return a limit a`);
    return result.records[0].properties;
}
const create = async apartment => {
    //добавление в бд нового жилья и генерация связей с пользователями
    const result = await session.run(`create (a:Apartment {_id : '${nanoid(8)}', name : '${5}'}) return a limit a`);
    return result.records[0].properties;
}

export default {
    findAll,
    findById,
    create
}
