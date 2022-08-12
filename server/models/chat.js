import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';
import path from 'path';

const __dirname = path.resolve();
dotenv.config({ path: __dirname + '/.env' });

const {
    url_db,
    username_db,
    password,
    database
} = process.env;

const driver = neo4j.driver(url_db, neo4j.auth.basic(username_db, password), 
                                { disableLosslessIntegers: true });

const existsChannelByCityIdByUserId = async (idCity, idCurrentUser, idUser) => {
    const session = driver.session({ database });

    const result = await session.run(`MATCH (country:Country {code: "RUS"})-[r:INCLUDES]->(:Region)-[:INCLUDES]->(city:City {idKladr: $idCity})-[s:INCLUDES]->(user1:User{_id: $idUser})-[:CONSISTSOF]->(channel:Channel)<-[:CONSISTSOF]-(user2:User{_id: $idCurrentUser})<-[:INCLUDES]-(city)
                                        RETURN channel
                                    `, 
    {
        idCity, idCurrentUser, idUser
    });

    await session.close();
    let r = result.records.map(i => i.get("channel"));
    return !!r.length;      
}
const findByCityIdByUserId = async (idCity, idUser) => {
    const session = driver.session({ database });

    const result = await session.run(`MATCH (country:Country {code: "RUS"})-[r:INCLUDES]->(:Region)-[:INCLUDES]->(city:City {idKladr: $idCity}) WITH city
                                        MATCH (city)-[s:INCLUDES]->(user1:User{_id: $idUser})-[:CONSISTSOF]->(channel:Channel)<-[:CONSISTSOF]-(user2:User)<-[:INCLUDES]-(city) WITH channel, user1, user2
                                        OPTIONAL MATCH (channel)-[:HAS]->(message1:Message)<-[:HAS]-(user1) WITH channel, message1, user2
                                        OPTIONAL MATCH (channel)-[:HAS]->(message2:Message)<-[:HAS]-(user2)
                                        RETURN channel, message1, message2, user2
                                    `, 
    {
        idCity, idUser
    });

    await session.close();
    return result.records;      
}
const createChannelByCityIdByUserId = async (idCity, idUser1, idUser2) => {
    const session = driver.session({ database });
    const result = await session.run(`MATCH (country:Country {code: "RUS"})-[:INCLUDES]->(:Region)-[:INCLUDES]->(city:City{idKladr: $idCity})-[:INCLUDES]->(user1:User{_id: $idUser1}) WITH user1
                                        MATCH (country:Country {code: "RUS"})-[:INCLUDES]->(city:City{idKladr: $idCity})-[:INCLUDES]->(user2:User{_id: $idUser2}) WITH user1, user2
                                        MERGE (user1)-[:CONSISTSOF]->(channel:Channel)<-[:CONSISTSOF]-(user2) 
                                        ON CREATE SET channel._id=randomUUID(), 
                                                        channel.idRoom=randomUUID(), 
                                                        channel.createdDate=datetime({timezone: 'Europe/Moscow'}).epochMillis,
                                                        channel.updateDate=datetime({timezone: 'Europe/Moscow'}).epochMillis
                                        ON MATCH SET channel.updateDate=datetime({timezone: 'Europe/Moscow'}).epochMillis
                                        RETURN channel._id AS idCurrentChannel
                                    `, 
    {
        idCity, idUser1, idUser2
    });
    await session.close();
    let r = result.records.map(i => i.get("idCurrentChannel"))[0] || null;
    return r;      
}
const createMessageByCityIdByUserIdByChannelId = async (idCity, idUser, idChannel, text) => {
    const session = driver.session({ database });
    const result = await session.run(`MATCH (country:Country {code: "RUS"})-[:INCLUDES]->(:Region)-[:INCLUDES]->(city:City{idKladr: $idCity})-[:INCLUDES]->(user:User{_id: $idUser})-[:CONSISTSOF]->(channel:Channel{_id: $idChannel}) WITH user, channel
                                        CREATE (user)-[:HAS]->(message:Message{_id: randomUUID(), 
                                                                                        text: $text, 
                                                                                        createdDate: datetime({timezone: 'Europe/Moscow'}).epochMillis
                                                                                    })<-[:HAS]-(channel)
                                        RETURN message
                                    `, 
    {
        idCity, idUser, idChannel, text
    });
    await session.close();
    let r = result.records.map(i => i.get("message"))[0].properties || null;
    return r;      
}

export default {
    existsChannelByCityIdByUserId,
    findByCityIdByUserId,
    createChannelByCityIdByUserId,
    createMessageByCityIdByUserIdByChannelId
}
