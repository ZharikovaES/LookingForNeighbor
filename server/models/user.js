import neo4j from 'neo4j-driver';
import 'dotenv/config'
import LocationServices from '../services/location-service.js';
import QueryGenerator from './QueryGenerator.js';
const {
    url_db,
    username_db,
    password,
    database
} = process.env;

const driver = neo4j.driver(url_db,
                  neo4j.auth.basic(username_db, password), 
                  { disableLosslessIntegers: true });

const findByCityId = async (idCity, limit) => {
    const session = driver.session({ database });
    const result = await session.run(`MATCH (country:Country {code: "RUS"})-[r:INCLUDES]->(:Region)-[r1:INCLUDES]->(city:City {idKladr: $idCity})-[s:INCLUDES]->(u:User)-[s1:INCLUDES]->(d:DesiredApartment) return u, d` + (limit ? ` limit ${Math.abs(Math.trunc(+limit))}` : ''), 
                                      {
                                        idCity
                                      });
    await session.close();
    return result.records;
}
const findByCityIdByUserId = async (idCity, idUser) => {
  const session = driver.session({ database });
  const result = await session.run(`MATCH (country:Country {code: "RUS"})-[:INCLUDES*2]->(city:City {idKladr: "${idCity}"})-[s:INCLUDES]->(user:User {_id : "${idUser}"})-[s1:INCLUDES]->(searchInfo: SearchInfo) WITH city, user, searchInfo
                                    MATCH (user)-[s2:INCLUDES]->(desiredApartment: DesiredApartment)
                                    RETURN city, user, searchInfo, desiredApartment`);
  await session.close();
  return result.records;
}
const findByCityIdByUserIdRating = async (idCity, idUser, idCurrentUser) => {
  const session = driver.session({ database });
  const result = await session.run(`MATCH (country:Country {code: "RUS"})-[r:INCLUDES]->(region:Region)-[:INCLUDES]->(city:City {idKladr: "${idCity}"})-[s:INCLUDES]->(user:User {_id : "${idUser}"})-[s1:INCLUDES]->(searchInfo: SearchInfo) WITH city, user, searchInfo
                                    MATCH (user)-[s2:INCLUDES]->(desiredApartment: DesiredApartment) WITH city, user, searchInfo, desiredApartment
                                    OPTIONAL MATCH (userFrom:User{_id: $idCurrentUser})-[r:RATING]->(user) 
                                    RETURN city, user, searchInfo, desiredApartment, r.realScore AS realScore`, {
                                      idCurrentUser
                                    });
  await session.close();
  return result.records;
}
const findByCityIdByEmail = async (idCity, email) => {
  const session = driver.session({ database });
  const result = await session.run(`MATCH (country:Country {code: "RUS"})-[r:INCLUDES]->(:Region)-[r1:INCLUDES]->(city:City {idKladr: "${idCity}"})-[s:INCLUDES]->(u:User {email : "${email}"}) return u limit 1`);
  await session.close();

  return result.records.map(i => i.get('u').properties)[0];
}
const findByEmail = async email => {
  const session = driver.session({ database });
  const result = await session.run(`MATCH (country:Country {code: "RUS"})-[r:INCLUDES]->(:Region)-[r1:INCLUDES]->(city:City)-[s:INCLUDES]->(user:User {email: $email})-[s1:INCLUDES]->(searchInfo: SearchInfo) WITH city, user, searchInfo
                                    MATCH (user)-[s2:INCLUDES]->(desiredApartment: DesiredApartment)
                                    RETURN city, user, searchInfo, desiredApartment`,
                                    { email });
  const records = result.records;
  await session.close();
  return records;
}
const findByCityIdByActivationLink = async (idCity, activationLink) => {
  const session = driver.session({ database });
  const result = await session.run(`match (country:Country {code: "RUS"})-[r:INCLUDES]->(:Region)-[r1:INCLUDES]->(city:City {idKladr: ${idCity}})-[s:INCLUDES]->(u:User {activationLink : ${activationLink}}) return u limit 1`);
  await session.close();

  return result.records.map(i => i.get('u').properties)[0];
}
const findTokenByCityIdByUserId = async (idCity, idUser) => {
  const session = driver.session({ database });
  const result = await session.run(`match (country:Country {code: "RUS"})-[r:INCLUDES]->(:Region)-[r1:INCLUDES]->(city:City {idKladr: $idCity})-[s:INCLUDES]->(u:User {_id : $idUser}) return u limit 1`,
                                    {
                                      idCity, idUser
                                    });
  await session.close();
  const user = result.records.map(i => i.get('u').properties)[0];
  
  return user ? user.refreshToken : null;
}
const deleteRefreshTokenByCityIdById = async (idCity, idUser) => {
    const session = driver.session({ database });
    const result = await session.run(`match (country:Country {code: "RUS"})-[r:INCLUDES]->(:Region)-[r1:INCLUDES]->(city:City {idKladr: $idCity})-[s:INCLUDES]->(u:User {_id : $idUser}) SET u.refreshToken=null 
                                    RETURN u LIMIT 1`, 
                                      {
                                        idCity, idUser
                                      });
  await session.close();
  return result.records.map(i => i.get('u').properties)[0];
}

const pushNewRatingByCityIdByUserId = async (idCity, idUser, idRatedUser, newRating, typeOfRating) => {
  const session = driver.session({ database });
  const result = await session.run(`MATCH (country:Country {code: "RUS"})-[:INCLUDES]->(region:Region)-[:INCLUDES]->(city:City {idKladr: $idCity})-[s:INCLUDES]->(user1:User {_id : $idUser}) WITH user1 AS userFrom, country, region, city
                                    MATCH (country)-[:INCLUDES]->(region)-[:INCLUDES]->(city)-[s:INCLUDES]->(user2:User {_id : $idRatedUser}) WITH userFrom, user2 AS userTo
                                    MERGE (userFrom)-[r:RATING]->(userTo)
                                       SET r.realScore = r.realScore[0..toInteger($typeOfRating)] + $newRating + r.realScore[toInteger($typeOfRating + 1)..8]
                                    RETURN r.realScore, userTo._id`,
                                    {
                                      idCity, idUser, idRatedUser, newRating, typeOfRating
                                    });

  await session.close();
  return result.records;
}

const findUsersAndRatingByCityIdByUserId = async (idCity, idUser, typeOfRating) => {
  const session = driver.session({ database });
  const result = await session.run(`MATCH (country:Country {code: "RUS"})-[i:INCLUDES]->(region:Region)-[:INCLUDES]->(city:City {idKladr: $idCity})-[s:INCLUDES]->(user1:User)-[r:RATING]->(user2: User) WHERE r.realScore IS NOT NULL AND r.realScore[toInteger($typeOfRating)] <> 0
                                    RETURN  user1._id AS user1Id, r.realScore AS realScore, user2._id AS user2Id`,
                                    {
                                      idCity, idUser, typeOfRating
                                    });

  await session.close();
  return result.records;
}
const findUsersByCityIdByUserIdByEstimatedScore = async (idCity, idUser, scoreRange) => {
  const session = driver.session({ database });
  const result = await session.run(`MATCH (country:Country {code: "RUS"})-[i:INCLUDES]->(region:Region)-[:INCLUDES]->(city:City {idKladr: $idCity})-[s:INCLUDES]->(user1:User{_id:$idUser})-[r:RATING]->(user2: User)-[:INCLUDES]->(d:DesiredApartment) WHERE r.estimatedScoreAll IS NOT NULL AND toFloat($scoreRange[0]) <= r.estimatedScoreAll AND toFloat($scoreRange[1]) >= r.estimatedScoreAll 
                                    RETURN  user1._id AS user1Id, r.estimatedScoreAll AS estimatedScore, user2._id AS user2Id, d, user2`,
                                    {
                                      idCity, idUser, scoreRange
                                    });

  await session.close();
  return result.records;
}
const findUsersByCityIdByUserIdByEstimatedScoreByTypeOfRating = async (idCity, idUser, scoreRange, typeOfRating) => {
  const session = driver.session({ database });
  const result = await session.run(`MATCH (country:Country {code: "RUS"})-[i:INCLUDES]->(region:Region)-[:INCLUDES]->(city:City {idKladr: $idCity})-[s:INCLUDES]->(user1:User{_id:$idUser})-[r:RATING]->(user2: User)-[:INCLUDES]->(d:DesiredApartment) WHERE r.estimatedScore IS NOT NULL AND toFloat($scoreRange[0]) <= r.estimatedScore[toInteger($typeOfRating)] AND toFloat($scoreRange[1]) >= r.estimatedScore[toInteger($typeOfRating)] 
                                    RETURN  user1._id AS user1Id, r.estimatedScore AS estimatedScore, user2._id AS user2Id, d, user2`,
                                    {
                                      idCity, idUser, scoreRange, typeOfRating
                                    });

  await session.close();
  return result.records;
}
const pushEstimatedRecommendByCityIdByUserId = async (idCity, idUser, idRatedUser, recommend, typeOfRating) => {
  const session = driver.session({ database });
  const result = await session.run(`MATCH (country:Country {code: "RUS"})-[:INCLUDES]->(region:Region)-[:INCLUDES]->(city:City {idKladr: $idCity})-[s:INCLUDES]->(user1:User {_id : $idUser}) WITH user1 AS userFrom, country, region, city
                                    MATCH (country)-[:INCLUDES]->(region)-[:INCLUDES]->(city)-[s:INCLUDES]->(user2:User {_id : $idRatedUser}) WITH userFrom, user2 AS userTo
                                    MERGE (userFrom)-[r:RATING]->(userTo)
                                       SET r.estimatedScore = r.estimatedScore[0..toInteger($typeOfRating)] + $recommend + r.estimatedScore[toInteger($typeOfRating + 1)..8], r.estimatedScoreAll = reduce(totalScore = 0.0, value IN r.estimatedScore | totalScore + value) / 8
                                    RETURN r.estimatedScore, userTo._id`,
                                    {
                                      idCity, idUser, idRatedUser, recommend, typeOfRating
                                    });

  await session.close();
  return result.records;
}
const findUsersByCityIdByUserId = async (idCity, idUser, relevanceRange, limit) => {
  const session = driver.session({ database });
  await session.run(`MATCH (country:Country {code: "RUS"})-[:INCLUDES]->(region:Region)-[:INCLUDES]->(city:City {idKladr: $idCity})-[:INCLUDES]->(user:User {_id : $idUser})-[s1:INCLUDES]->(s:SearchInfo) WITH city, user, s, [10.0, 10.0] + 
                                  (CASE
                                    WHEN s.isBusy = 0 THEN [10.0, 10.0, 10.0, 10.0, 10.0]
                                    WHEN s.isBusy = 1 THEN [10.0, 10.0]
                                    WHEN s.isBusy = 2 THEN [10.0, 10.0, 10.0]
                                    ELSE [10.0, 10.0, 10.0, 10.0, 10.0] END) + [10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0] AS vector1
                                    MATCH ((user)-[:INCLUDES]->(d:DesiredApartment)) WITH user, city, s, d,
                                    vector1 + [10.0 * d.budget[0] / 300000, 10.0,
                                          10.0 * d.fullArea[0] / 10000, 10.0 * d.fullArea[1] / 10000,
                                          10.0 * d.kitchenArea[0] / 10000, 10.0 * d.kitchenArea[1] / 10000,
                                          10.0 * (d.ceilingHeight[0] - 1.5) / (10 - 1.5), 10.0 * (d.ceilingHeight[1] - 1.5) / (10 - 1.5),
                                          10.0 * (d.floorCount[0] - 1) / (300 - 1), 10.0 * (d.floorCount[1] - 1) / (300 - 1),
                                          10.0 * (d.floor[0] - 1) / (300 - 1), 10.0 * (d.floor[1] - 1) / (300 - 1),
                                        10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0] + [10.0 * (d.builtYear[0] - 1700) / (date({timezone: 'Europe/Moscow'}).year - 1700), 10.0 * (d.builtYear[1] - 1700) / (date({timezone: 'Europe/Moscow'}).year - 1700), 10.0] AS vector1
                                    OPTIONAL MATCH (city)-[p:INCLUDES]->(person: User)-[s3:INCLUDES]->(d1: DesiredApartment) WHERE person._id <> user._id WITH user, person, city, s, d, vector1,
                                    [
                                      (CASE
                                      WHEN user.smoking = 0 AND person.smoking IN [0, 1, 2] THEN 10.0
                                      WHEN user.smoking = 1 AND person.smoking IN [0, 1] THEN 10.0
                                      WHEN user.smoking = 1 AND person.smoking = 2 THEN 0.0
                                      WHEN user.smoking = 2 AND person.smoking IN [0, 2] THEN 10.0
                                      WHEN user.smoking = 2 AND person.smoking = 1 THEN 0.0
                                      ELSE 0.0 END), 
                                    (CASE 
                                      WHEN user.attitudeAlcohol = 0 AND person.attitudeAlcohol IN [0, 1, 2] THEN 10.0
                                      WHEN user.attitudeAlcohol = 1 AND person.attitudeAlcohol IN [0, 1] THEN 10.0
                                      WHEN user.attitudeAlcohol = 1 AND person.attitudeAlcohol = 2 THEN 0.0
                                      WHEN user.attitudeAlcohol = 2 AND person.attitudeAlcohol IN [0, 2] THEN 10.0
                                      WHEN user.attitudeAlcohol = 2 AND person.attitudeAlcohol = 1 THEN 0.0
                                      ELSE 0.0 END)
                                    ] + 
                                    (CASE
                                      WHEN s.isBusy = 0 THEN [10.0 * toInteger(user.jobId = person.jobId), 10.0 * gds.alpha.similarity.jaccard(user.professionalRolesId, person.professionalRolesId), 10.0 * toInteger(user.universityId = person.universityId), 10.0 * toInteger(user.facultyId = person.facultyId), 10.0 * toInteger(user.chairId = person.chairId)]
                                      WHEN s.isBusy = 1 THEN [10.0 * toInteger(user.jobId = person.jobId), 10.0 * gds.alpha.similarity.jaccard(user.professionalRolesId, person.professionalRolesId)]
                                      WHEN s.isBusy = 2 THEN [10.0 * toInteger(user.universityId = person.universityId), 10.0 * toInteger(user.facultyId = person.facultyId), 10.0 * toInteger(user.chairId = person.chairId)]
                                      ELSE [10.0 * toInteger(user.jobId = person.jobId), 10.0 * gds.alpha.similarity.jaccard(user.professionalRolesId, person.professionalRolesId), 10.0 * toInteger(user.universityId = person.universityId), 10.0 * toInteger(user.facultyId = person.facultyId), 10.0 * toInteger(user.chairId = person.chairId)] END)
                                      + [
                                    (CASE 
                                      WHEN user.attitudeСhildren = 0 AND person.attitudeСhildren IN [0, 1, 2] THEN 10.0
                                      WHEN user.attitudeСhildren = 1 AND person.attitudeСhildren IN [0, 1] THEN 10.0
                                      WHEN user.attitudeСhildren = 1 AND person.attitudeСhildren = 2 THEN 0.0
                                      WHEN user.attitudeСhildren = 2 AND person.attitudeСhildren IN [0, 2] THEN 10.0
                                      WHEN user.attitudeСhildren = 2 AND person.attitudeСhildren = 1 THEN 0.0
                                      ELSE 0.0 END), 
                                    (CASE 
                                      WHEN user.attitudeAnimals = 0 AND person.attitudeAnimals IN [0, 1, 2] THEN 10.0
                                      WHEN user.attitudeAnimals = 1 AND person.attitudeAnimals IN [0, 1] THEN 10.0
                                      WHEN user.attitudeAnimals = 1 AND person.attitudeAnimals = 2 THEN 0.0
                                      WHEN user.attitudeAnimals = 2 AND person.attitudeAnimals IN [0, 2] THEN 10.0
                                      WHEN user.attitudeAnimals = 2 AND person.attitudeAnimals = 1 THEN 0.0
                                      ELSE 0.0 END), 
                                    (CASE
                                      WHEN s.gender = 0 THEN 10.0
                                      WHEN s.gender = 1 AND person.gender = 0 OR s.gender = 2 AND person.gender = 1 THEN 10.0
                                      ELSE 0.0 END)] +  
                                    (CASE
                                      WHEN person.birthdate IS NOT NULL AND s.age[0] <= (date({timezone: 'Europe/Moscow'}).year - date(datetime({epochMillis: toInteger(person.birthdate)})).year) AND s.age[1] >= (date({timezone: 'Europe/Moscow'}).year - date(datetime({epochMillis: toInteger(person.birthdate)})).year) THEN [10.0, 10.0]
                                      WHEN person.birthdate IS NOT NULL AND s.age[0] > (date({timezone: 'Europe/Moscow'}).year - date(datetime({epochMillis: toInteger(person.birthdate)})).year) THEN [10.0 * ((date({timezone: 'Europe/Moscow'}).year - date(datetime({epochMillis: toInteger(person.birthdate)})).year) - 18) / (s.age[0] - 18), 10.0]
                                      WHEN person.birthdate IS NOT NULL AND s.age[1] < (date({timezone: 'Europe/Moscow'}).year - date(datetime({epochMillis: toInteger(person.birthdate)})).year) THEN [10.0, 10.0 * (date({timezone: 'Europe/Moscow'}).year - (date(datetime({epochMillis: toInteger(person.birthdate)})).year - s.age[1])) / (100 - s.age[1])]
                                      WHEN person.birthdate IS NOT NULL THEN [0.0, 0.0]
                                      ELSE [0.0, 0.0] END) + [10.0 * gds.alpha.similarity.jaccard(s.characteristics, person.characteristics)] + 
                                      [(CASE 
                                        WHEN s.religion = 0 THEN 10.0
                                        WHEN s.religion <> 0 AND user.religion = person.religion THEN 10.0
                                        ELSE 0.0 END)
                                      ] + 
                                      [(CASE 
                                        WHEN s.hasPhoto = 0 THEN 10.0
                                        WHEN s.hasPhoto = 1 AND NOT isEmpty(person.image) THEN 10.0
                                        ELSE 0.0 END)
                                      ] + 
                                      [10.0 * d.budget[0] / 300000, 10.0 * gds.alpha.similarity.jaccard(d.rooms, d1.rooms), 
                                      10.0 * d.fullArea[0] / 10000, 10.0 * d1.fullArea[1] / 10000,
                                      10.0 * d.kitchenArea[0] / 10000, 10.0 * d1.kitchenArea[1] / 10000,
                                      10.0 * (d.ceilingHeight[0] - 1.5) / (10 - 1.5), 10.0 * (d1.ceilingHeight[1] - 1.5) / (10 - 1.5),
                                      10.0 * (d.floorCount[0] - 1) / (300 - 1), 10.0 * (d1.floorCount[1] - 1) / (300 - 1),
                                      10.0 * (d.floor[0] - 1) / (300 - 1), 10.0 * (d1.floor[1] - 1) / (300 - 1)
                                     ] +
                                       [
                                    (CASE 
                                      WHEN d.typeOfBathroom = 0 AND d1.typeOfBathroom IN [0, 1, 2] THEN 10.0
                                      WHEN d.typeOfBathroom = 1 AND d1.typeOfBathroom IN [0, 1] THEN 10.0
                                      WHEN d.typeOfBathroom = 1 AND d1.typeOfBathroom = 2 THEN 0.0
                                      WHEN d.typeOfBathroom = 2 AND d1.typeOfBathroom IN [0, 2] THEN 10.0
                                      WHEN d.typeOfBathroom = 2 AND d1.typeOfBathroom = 1 THEN 0.0
                                      ELSE 0.0 END), 
                                    (CASE 
                                      WHEN d.view = 0 AND d1.view IN [0, 1, 2] THEN 10.0
                                      WHEN d.view = 1 AND d1.view IN [0, 1] THEN 10.0
                                      WHEN d.view = 1 AND d1.view = 2 THEN 0.0
                                      WHEN d.view = 2 AND d1.view IN [0, 2] THEN 10.0
                                      WHEN d.view = 2 AND d1.view = 1 THEN 0.0
                                      ELSE 0.0 END)
                                    ] + [10.0 * gds.alpha.similarity.jaccard(d.repairs, d1.repairs), 10.0 * gds.alpha.similarity.jaccard(d.parking, d1.parking), 10.0 * gds.alpha.similarity.jaccard(d.housingСlass, d1.housingСlass), 10.0 * gds.alpha.similarity.jaccard(d.typeOfBuilding, d1.typeOfBuilding), 10.0 * gds.alpha.similarity.jaccard(d.usability, d1.usability), 10.0 * gds.alpha.similarity.jaccard(d.permissions, d1.permissions),
                                      10.0 * (d1.builtYear[0] - 1700) / (date({timezone: 'Europe/Moscow'}).year - 1700), 10.0 * (d1.builtYear[1] - 1700) / (date({timezone: 'Europe/Moscow'}).year - 1700),
                                    10.0 * toInteger(d1.hasPhoto)] AS vector2
                                      FOREACH (_ IN CASE WHEN person IS NOT NULL THEN [1] END | MERGE (user)-[r:RELEVANCE]->(person) 
                                        ON CREATE SET r.coefficient = gds.alpha.similarity.euclidean(vector1, vector2), r.coefficientUpdateDate = datetime({timezone: 'Europe/Moscow'}).epochMillis)
                                        RETURN city, user, person
                                      `,
                                      {
                                      idCity, idUser
                                    });

  await session.close();

  const session1 = driver.session({ database });
  const result = await session1.run(`MATCH (country:Country {code: "RUS"})-[i:INCLUDES]->(:Region)-[:INCLUDES]->(city:City {idKladr: $idCity})-[s:INCLUDES]->(user:User {_id : $idUser})-[r:RELEVANCE]->(u: User)-[s1:INCLUDES]->(d:DesiredApartment) WHERE r.coefficient >= toFloat($relevanceRange[0]) AND r.coefficient <= toFloat($relevanceRange[1]) 
                                    RETURN u, d ORDER BY r.coefficient DESC` + (limit ? ` limit ${Math.abs(Math.trunc(+limit))}` : ''),
                                    {
                                      idCity, idUser,
                                      relevanceRange
                                    });

  await session1.close();
  return result.records;
}
const findUsersByCityIdByUserIdPartialMatch = async (idCity, idUser, relevanceRange, limit) => {
  const session1 = driver.session({ database });
  const result = await session1.run(`MATCH (country:Country {code: "RUS"})-[i:INCLUDES]->(:Region)-[:INCLUDES]->(city:City {idKladr: $idCity})-[s:INCLUDES]->(user:User {_id : $idUser})-[r:RELEVANCE]->(u: User)-[s1:INCLUDES]->(d:DesiredApartment) WHERE r.coefficient >= $relevanceRange[0] AND r.coefficient <= $relevanceRange[1] 
                                    RETURN u, d ORDER BY r.coefficient DESC` + (limit ? ` limit ${Math.abs(Math.trunc(+limit))}` : ''),
                                    {
                                      idCity, idUser,
                                      relevanceRange
                                    });

  await session1.close();
  return result.records;
}
const findUsersByCityIdByUserIdFullMatch = async (idCity, idUser, limit) => {
  const session1 = driver.session({ database });
  const result = await session1.run(`MATCH (country:Country {code: "RUS"})-[i:INCLUDES]->(:Region)-[:INCLUDES]->(city:City {idKladr: $idCity})-[s:INCLUDES]->(user:User {_id : $idUser})-[r:RELEVANCE]->(u: User)-[s1:INCLUDES]->(d:DesiredApartment) WHERE r.coefficient = 1 
                                    RETURN u, d ORDER BY r.coefficient DESC` + (limit ? ` limit ${Math.abs(Math.trunc(+limit))}` : ''),
                                    {
                                      idCity, idUser
                                    });

  await session1.close();
  return result.records;
}
const create = async (locationData, user, searchedUser, apartment) => {
  let location, labels = [], values = [], fullAddress = [], coordinates = [];
  if (locationData?.places?.length) {
    location = await LocationServices.getFullAddresses(locationData.places);
    labels = location.labels;  
    values = location.values;  
    fullAddress = location.fullAddress;  
    coordinates = location.coordinates;    
  }
  const session = driver.session({ database });
  const result = await session.run(`CYPHER expressionEngine=interpreted MERGE (country: Country {code: "RUS"})-[:INCLUDES]->(region:Region) WITH country, region
                                   MERGE (region)-[i:INCLUDES]->(city: City {idKladr: $cityId}) 
                                     ON CREATE SET city.name = $cityName, city.coordinates = $cityCoordinates WITH country, city
                                     CREATE (city)-[s:INCLUDES]->(user: User {
                                         _id : randomUUID(), 
                                         username: $username,
                                         birthdate: toInteger($birthdate),
                                         image: $image,
                                         email: $email,
                                         password: $password,
                                         activationLink: $activationLink,
                                         typeAuth: $typeAuth,
                                         isActivated: $isActivated,
                                         refreshToken: $refreshToken,
                                         gender : $gender,
                                         smoking: $smoking,
                                         attitudeAlcohol: $attitudeAlcohol,
                                         jobId: $jobId,
                                         jobName: $jobName,
                                         professionalRolesId: $professionalRolesId,
                                         professionalRolesNames: $professionalRolesNames,
                                         universityId: $universityId,
                                         universityTitle: $universityTitle,
                                         facultyId: $facultyId,
                                         facultyTitle: $facultyTitle,
                                         chairId: $chairId,
                                         chairTitle: $chairTitle,
                                         characteristics: $characteristics,
                                         religion: $religion,
                                         attitudeСhildren: $attitudeСhildren,
                                         attitudeAnimals: $attitudeAnimals,
                                         description: $description,
                                         registrationDate: datetime({timezone: 'Europe/Moscow'}).epochMillis,
                                         accountModificationDate: datetime({timezone: 'Europe/Moscow'}).epochMillis
                                     }) WITH city, user
                                     CREATE (user)-[s1:INCLUDES]->(searchInfo: SearchInfo {
                                         _id : randomUUID(), 
                                         gender : $genderSearchInfo, 
                                         age : $ageSearchInfo,
                                         isBusy: $isBusySearchInfo,
                                         characteristics: $characteristicsSearchInfo,
                                         religion: $religionSearchInfo,
                                         hasPhoto: $hasPhotoSearchInfo
                                     }) WITH city, user, searchInfo, 
                                       [10.0, 10.0] + 
                                       (CASE
                                         WHEN searchInfo.isBusy = 0 THEN [10.0, 10.0, 10.0, 10.0, 10.0]
                                         WHEN searchInfo.isBusy = 1 THEN [10.0, 10.0]
                                         WHEN searchInfo.isBusy = 2 THEN [10.0, 10.0, 10.0]
                                         ELSE [10.0, 10.0, 10.0, 10.0, 10.0] END) + [10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0] AS vector1
                                     CREATE (user)-[s2:INCLUDES]->(desiredApartment: DesiredApartment {
                                         _id : randomUUID(), 
                                         labelsPlaces: $labelsPlaces,
                                         valuesPlaces: $valuesPlaces,
                                         coordinatesPlaces: $coordinatesPlaces,
                                         budget: $budget,
                                         rooms: $rooms,
                                         fullArea: $fullArea,
                                         kitchenArea: $kitchenArea,
                                         ceilingHeight: $ceilingHeight,
                                         floorCount: $floorCount,
                                         floor: $floor,
                                         typeOfBathroom: $typeOfBathroom,
                                         view: $view,
                                         repairs: $repairs,
                                         parking: $parking,
                                         housingСlass: $housingСlass,
                                         typeOfBuilding: $typeOfBuilding,
                                         usability: $usability,
                                         permissions: $permissions,
                                         builtYear: $builtYear,
                                         hasPhoto: $hasPhoto
                                     }) 
                                     WITH city, user, searchInfo, desiredApartment,
                                     vector1 + [10.0 * desiredApartment.budget[0] / 300000, 10.0,
                                         10.0 * desiredApartment.fullArea[0] / 10000, 10.0 * desiredApartment.fullArea[1] / 10000,
                                         10.0 * desiredApartment.kitchenArea[0] / 10000, 10.0 * desiredApartment.kitchenArea[1] / 10000,
                                         10.0 * (desiredApartment.ceilingHeight[0] - 1.5) / (10 - 1.5), 10.0 * (desiredApartment.ceilingHeight[1] - 1.5) / (10 - 1.5),
                                         10.0 * (desiredApartment.floorCount[0] - 1) / (300 - 1), 10.0 * (desiredApartment.floorCount[1] - 1) / (300 - 1),
                                         10.0 * (desiredApartment.floor[0] - 1) / (300 - 1), 10.0 * (desiredApartment.floor[1] - 1) / (300 - 1),
                                       10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0, 10.0] + [10.0 * (desiredApartment.builtYear[0] - 1700) / (date({timezone: 'Europe/Moscow'}).year - 1700), 10.0 * (desiredApartment.builtYear[1] - 1700) / (date({timezone: 'Europe/Moscow'}).year - 1700), 10.0] AS vector1
                                 OPTIONAL MATCH (city)-[p:INCLUDES]->(person: User)-[s3:INCLUDES]->(searchApartment: DesiredApartment) WHERE person._id <> user._id WITH 
                                 city, user, person, searchInfo, desiredApartment, vector1,
                                 [
                                   (CASE
                                   WHEN user.smoking = 0 AND person.smoking IN [0, 1, 2] THEN 10.0
                                   WHEN user.smoking = 1 AND person.smoking IN [0, 1] THEN 10.0
                                   WHEN user.smoking = 1 AND person.smoking = 2 THEN 0.0
                                   WHEN user.smoking = 2 AND person.smoking IN [0, 2] THEN 10.0
                                   WHEN user.smoking = 2 AND person.smoking = 1 THEN 0.0
                                   ELSE 0.0 END), 
                                 (CASE 
                                   WHEN user.attitudeAlcohol = 0 AND person.attitudeAlcohol IN [0, 1, 2] THEN 10.0
                                   WHEN user.attitudeAlcohol = 1 AND person.attitudeAlcohol IN [0, 1] THEN 10.0
                                   WHEN user.attitudeAlcohol = 1 AND person.attitudeAlcohol = 2 THEN 0.0
                                   WHEN user.attitudeAlcohol = 2 AND person.attitudeAlcohol IN [0, 2] THEN 10.0
                                   WHEN user.attitudeAlcohol = 2 AND person.attitudeAlcohol = 1 THEN 0.0
                                   ELSE 0.0 END)
                                 ] + 
                                 (CASE
                                   WHEN searchInfo.isBusy = 0 THEN [10.0 * toInteger(user.jobId = person.jobId), 10.0 * gds.alpha.similarity.jaccard(user.professionalRolesId, person.professionalRolesId), 10.0 * toInteger(user.universityId = person.universityId), 10.0 * toInteger(user.facultyId = person.facultyId), 10.0 * toInteger(user.chairId = person.chairId)]
                                   WHEN searchInfo.isBusy = 1 THEN [10.0 * toInteger(user.jobId = person.jobId), 10.0 * gds.alpha.similarity.jaccard(user.professionalRolesId, person.professionalRolesId)]
                                   WHEN searchInfo.isBusy = 2 THEN [10.0 * toInteger(user.universityId = person.universityId), 10.0 * toInteger(user.facultyId = person.facultyId), 10.0 * toInteger(user.chairId = person.chairId)]
                                   ELSE [10.0 * toInteger(user.jobId = person.jobId), 10.0 * gds.alpha.similarity.jaccard(user.professionalRolesId, person.professionalRolesId), 10.0 * toInteger(user.universityId = person.universityId), 10.0 * toInteger(user.facultyId = person.facultyId), 10.0 * toInteger(user.chairId = person.chairId)] END)
                                   + [
                                 (CASE 
                                   WHEN user.attitudeСhildren = 0 AND person.attitudeСhildren IN [0, 1, 2] THEN 10.0
                                   WHEN user.attitudeСhildren = 1 AND person.attitudeСhildren IN [0, 1] THEN 10.0
                                   WHEN user.attitudeСhildren = 1 AND person.attitudeСhildren = 2 THEN 0.0
                                   WHEN user.attitudeСhildren = 2 AND person.attitudeСhildren IN [0, 2] THEN 10.0
                                   WHEN user.attitudeСhildren = 2 AND person.attitudeСhildren = 1 THEN 0.0
                                   ELSE 0.0 END), 
                                 (CASE 
                                   WHEN user.attitudeAnimals = 0 AND person.attitudeAnimals IN [0, 1, 2] THEN 10.0
                                   WHEN user.attitudeAnimals = 1 AND person.attitudeAnimals IN [0, 1] THEN 10.0
                                   WHEN user.attitudeAnimals = 1 AND person.attitudeAnimals = 2 THEN 0.0
                                   WHEN user.attitudeAnimals = 2 AND person.attitudeAnimals IN [0, 2] THEN 10.0
                                   WHEN user.attitudeAnimals = 2 AND person.attitudeAnimals = 1 THEN 0.0
                                   ELSE 0.0 END), 
                                 (CASE
                                   WHEN searchInfo.gender = 0 THEN 10.0
                                   WHEN searchInfo.gender = 1 AND person.gender = 0 OR searchInfo.gender = 2 AND person.gender = 1 THEN 10.0
                                   ELSE 0.0 END)] +  
                                 (CASE
                                   WHEN person.birthdate IS NOT NULL AND searchInfo.age[0] <= (date({timezone: 'Europe/Moscow'}).year - date(datetime({epochMillis: toInteger(person.birthdate)})).year) AND searchInfo.age[1] >= (date({timezone: 'Europe/Moscow'}).year - date(datetime({epochMillis: toInteger(person.birthdate)})).year) THEN [10.0, 10.0]
                                   WHEN person.birthdate IS NOT NULL AND searchInfo.age[0] > (date({timezone: 'Europe/Moscow'}).year - date(datetime({epochMillis: toInteger(person.birthdate)})).year) THEN [10.0 * ((date({timezone: 'Europe/Moscow'}).year - date(datetime({epochMillis: toInteger(person.birthdate)})).year) - 18) / (searchInfo.age[0] - 18), 10.0]
                                   WHEN person.birthdate IS NOT NULL AND searchInfo.age[1] < (date({timezone: 'Europe/Moscow'}).year - date(datetime({epochMillis: toInteger(person.birthdate)})).year) THEN [10.0, 10.0 * (date({timezone: 'Europe/Moscow'}).year - (date(datetime({epochMillis: toInteger(person.birthdate)})).year - searchInfo.age[1])) / (100 - searchInfo.age[1])]
                                   WHEN person.birthdate IS NOT NULL THEN [0.0, 0.0]
                                   ELSE [0.0, 0.0] END) + [10.0 * gds.alpha.similarity.jaccard(searchInfo.characteristics, person.characteristics)] + 
                                   [(CASE 
                                     WHEN searchInfo.religion = 0 THEN 10.0
                                     WHEN searchInfo.religion <> 0 AND user.religion = person.religion THEN 10.0
                                     ELSE 0.0 END)
                                   ] + 
                                   [(CASE 
                                     WHEN searchInfo.hasPhoto = 0 THEN 10.0
                                     WHEN searchInfo.hasPhoto = 1 AND NOT isEmpty(person.image) THEN 10.0
                                     ELSE 0.0 END)
                                   ] + 
                                   [10.0 * searchApartment.budget[0] / 300000, 10.0 * gds.alpha.similarity.jaccard(desiredApartment.rooms, searchApartment.rooms), 
                                   10.0 * searchApartment.fullArea[0] / 10000, 10.0 * searchApartment.fullArea[1] / 10000,
                                   10.0 * searchApartment.kitchenArea[0] / 10000, 10.0 * searchApartment.kitchenArea[1] / 10000,
                                   10.0 * (searchApartment.ceilingHeight[0] - 1.5) / (10 - 1.5), 10.0 * (searchApartment.ceilingHeight[1] - 1.5) / (10 - 1.5),
                                   10.0 * (searchApartment.floorCount[0] - 1) / (300 - 1), 10.0 * (searchApartment.floorCount[1] - 1) / (300 - 1),
                                   10.0 * (searchApartment.floor[0] - 1) / (300 - 1), 10.0 * (searchApartment.floor[1] - 1) / (300 - 1)
                                  ] +
                                    [
                                 (CASE 
                                   WHEN desiredApartment.typeOfBathroom = 0 AND searchApartment.typeOfBathroom IN [0, 1, 2] THEN 10.0
                                   WHEN desiredApartment.typeOfBathroom = 1 AND searchApartment.typeOfBathroom IN [0, 1] THEN 10.0
                                   WHEN desiredApartment.typeOfBathroom = 1 AND searchApartment.typeOfBathroom = 2 THEN 0.0
                                   WHEN desiredApartment.typeOfBathroom = 2 AND searchApartment.typeOfBathroom IN [0, 2] THEN 10.0
                                   WHEN desiredApartment.typeOfBathroom = 2 AND searchApartment.typeOfBathroom = 1 THEN 0.0
                                   ELSE 0.0 END), 
                                 (CASE 
                                   WHEN desiredApartment.view = 0 AND searchApartment.view IN [0, 1, 2] THEN 10.0
                                   WHEN desiredApartment.view = 1 AND searchApartment.view IN [0, 1] THEN 10.0
                                   WHEN desiredApartment.view = 1 AND searchApartment.view = 2 THEN 0.0
                                   WHEN desiredApartment.view = 2 AND searchApartment.view IN [0, 2] THEN 10.0
                                   WHEN desiredApartment.view = 2 AND searchApartment.view = 1 THEN 0.0
                                   ELSE 0.0 END)
                                 ] + [10.0 * gds.alpha.similarity.jaccard(desiredApartment.repairs, searchApartment.repairs), 10.0 * gds.alpha.similarity.jaccard(desiredApartment.parking, searchApartment.parking), 10.0 * gds.alpha.similarity.jaccard(desiredApartment.housingСlass, searchApartment.housingСlass), 10.0 * gds.alpha.similarity.jaccard(desiredApartment.typeOfBuilding, searchApartment.typeOfBuilding), 10.0 * gds.alpha.similarity.jaccard(desiredApartment.usability, searchApartment.usability), 10.0 * gds.alpha.similarity.jaccard(desiredApartment.permissions, searchApartment.permissions),
                                   10.0 * (searchApartment.builtYear[0] - 1700) / (date({timezone: 'Europe/Moscow'}).year - 1700), 10.0 * (searchApartment.builtYear[1] - 1700) / (date({timezone: 'Europe/Moscow'}).year - 1700),
                                 10.0 * toInteger(searchApartment.hasPhoto)] AS vector2
                                   FOREACH (_ IN CASE WHEN person IS NOT NULL THEN [1] END | MERGE (user)-[r:RELEVANCE]->(person) 
                                     ON CREATE SET r.coefficient = gds.alpha.similarity.euclidean(vector1, vector2), r.coefficientUpdateDate = datetime({timezone: 'Europe/Moscow'}).epochMillis)
                                      WITH city, user, searchInfo, desiredApartment, vector1, vector2
                                     RETURN city, user, searchInfo, desiredApartment, vector1, vector2`,
                                      {
                                          countryId: locationData.country.id,
                                          cityId: locationData.city.idKladr,
                                          cityName: locationData.city.name,
                                          cityCoordinates: await LocationServices.getCoordinatesByCityName(locationData.city.name),
                                          places: labels,

                                          username: user.username,
                                          birthdate: new Date(user.dateOfBirth).getTime(),
                                          gender: user.gender,
                                          image: user.image.imagePreviewUrl,
                                          email: user.email,
                                          password: user.typeAuth ? null : user?.password,
                                          isActivated: !!user.typeAuth,
                                          typeAuth: user.typeAuth,
                                          refreshToken: '',
                                          activationLink: user.typeAuth ? null : user?.activationLink,
                                          smoking: user.smoking,
                                          attitudeAlcohol: user.attitudeAlcohol,

                                          jobId: parseInt(user.job.id),
                                          jobName: user.job.name,
                                          professionalRolesId: user.job.professionalRoles.map(el => el.id),
                                          professionalRolesNames: user.job.professionalRoles.map(el => el.name),

                                          universityId: user.education.university.id,
                                          universityTitle: user.education.university.title,
                                          facultyId: user.education.faculty.id,
                                          facultyTitle: user.education.faculty.title,
                                          chairId: user.education.chair.id,
                                          chairTitle: user.education.chair.title,
                                          characteristics: user.characteristics.sort((a, b) => a - b),
                                          religion: user.religion,
                                          attitudeСhildren: user.attitudeСhildren,
                                          attitudeAnimals: user.attitudeAnimals,

                                          description: user.description,

                                          genderSearchInfo: searchedUser.gender,
                                          ageSearchInfo: searchedUser.age,
                                          isBusySearchInfo: searchedUser.isBusy,
                                          characteristicsSearchInfo: searchedUser.characteristics.sort((a, b) => a - b),
                                          religionSearchInfo: searchedUser.religion,
                                          hasPhotoSearchInfo: false,

                                          labelsPlaces: labels, valuesPlaces: values, coordinatesPlaces: coordinates,
                                          budget: apartment.budget,
                                          rooms: apartment.rooms.sort((a, b) => a - b),
                                          fullArea: apartment.fullArea,
                                          kitchenArea: apartment.kitchenArea,
                                          ceilingHeight: apartment.ceilingHeight,
                                          floorCount: apartment.floorCount,
                                          floor: apartment.floor,
                                          typeOfBathroom: apartment.typeOfBathroom,
                                          view: apartment.view,
                                          repairs: apartment.repairs.sort((a, b) => a - b),
                                          parking: apartment.parking.sort((a, b) => a - b),
                                          housingСlass: apartment.housingСlass.sort((a, b) => a - b),
                                          typeOfBuilding: apartment.typeOfBuilding.sort((a, b) => a - b),
                                          usability: apartment.usability.sort((a, b) => a - b),
                                          permissions: apartment.permissions.sort((a, b) => a - b),
                                          builtYear: apartment.builtYear,
                                          hasPhoto: apartment.hasPhoto
                                      });
  const records = result.records;
  const keys = ["metro", "districtId", "streetId", "houseId"];
  const locationId = keys.reduce((acc, el) => (acc[el] = new Set(), acc), {});
  let regionId = null;
  let cityId = null;

  for (let i = 0; i < fullAddress.length; i++){
    const newSession = driver.session({ database });
    let metroInfo = QueryGenerator.getNearestMetro(fullAddress[i]);
    let place = QueryGenerator.getPlace(fullAddress[i]);
    const result1 = await newSession.run(`MATCH (country: Country {code: "RUS"})-[:INCLUDES]->(region:Region) WITH country, region
                                        MERGE (region)-[:INCLUDES]->(city: City {idKladr: $idKladr}) WITH country, region, city, null AS district, null AS metro, null AS street, null AS house, null AS districtId, null AS streetId, null AS houseId
                                        ${place} ${metroInfo} RETURN id(region) AS regionId, id(city) AS cityId, metro, districtId, streetId, houseId`,
                                          {
                                            idKladr: locationData.city.idKladr,
                                            districtName: fullAddress[i]?.district,
                                            streetName: fullAddress[i]?.street,
                                            houseNumber: fullAddress[i]?.house,
                                            metroName: fullAddress[i]?.metro,
                                            lineName: fullAddress[i]?.line,
                                            coordinates: [ fullAddress[i]?.lat, fullAddress[i]?.lon ],
                                          });

    if (!regionId || !cityId) {
      const regionArr = result1.records.map(i => { 
        if (i.has("regionId")) 
          if (typeof i.get("regionId") === "number") 
            return i.get("regionId");
        return null;
      });
      regionId = regionArr.filter(el => el)[0] ?? null;
      const cityArr = result1.records.map(i => { 
        if (i.has("cityId")) 
          if (typeof i.get("cityId") === "number") 
            return i.get("cityId");
        return null;
      });
      cityId = cityArr.filter(el => el)[0] ?? null;

    }
    result1.records.forEach(i => { 
      for (const key of keys)
        if (i.has(key)) 
          if (typeof i.get(key) === "number") 
            locationId[key].add(i.get(key));
    })
    await newSession.close();
  } 
  if (Object.values(locationId).reduce((acc, el) => {
    return (acc + el.size)
  }, 0)) {
    for (const [key, value] of Object.entries(locationId))
      locationId[key] = Array.from(value);
    const newSession = driver.session({ database });
    const r = await newSession.run(`MATCH (country: Country {code: "RUS"})-[:INCLUDES]->(region:Region)-[:INCLUDES]->(city: City)-[:INCLUDES]->(:User)-[:INCLUDES]->(apartment:DesiredApartment{_id: $apartmentId}) WHERE id(region) = $regionId AND id(city) = $cityId 
                                            WITH country, region, city, apartment, null AS district, null AS street, null AS house, null AS metro1
                                          OPTIONAL MATCH (city)-[:INCLUDES]->(d:District) WHERE id(d) IN $districtId 
                                            WITH country, region, city, apartment, d AS district, street, house, metro1
                                          OPTIONAL MATCH (city)-[:INCLUDES*2]->(s:Street) WHERE id(s) IN $streetId 
                                            WITH country, region, city, apartment, district, s AS street, house, metro1
                                          OPTIONAL MATCH (city)-[:INCLUDES*3]->(h:House) WHERE id(h) IN $houseId 
                                            WITH country, region, city, apartment, district, street, h AS house, metro1
                                          OPTIONAL MATCH (region)<-[:MetroMetadata*3]-(m:Metro) WHERE id(m) IN $metro 
                                            WITH country, region, city, apartment, district, street, house, m AS metro1, null AS i
                                          FOREACH (_ IN CASE WHEN district IS NOT NULL THEN [1] END | CREATE (district)-[i:INCLUDES]->(apartment)) 
                                            WITH apartment, district, street, house, metro1, i
                                          FOREACH (_ IN CASE WHEN street IS NOT NULL THEN [1] END | CREATE (street)-[i:INCLUDES]->(apartment)) 
                                            WITH apartment, district, street, house, metro1, i
                                          FOREACH (_ IN CASE WHEN house IS NOT NULL THEN [1] END | CREATE (house)-[i:INCLUDES]->(apartment)) 
                                            WITH apartment, district, street, house, metro1, i
                                          FOREACH (_ IN CASE WHEN metro1 IS NOT NULL THEN [1] END | CREATE (metro1)-[i:INCLUDES]->(apartment)) 
                                            WITH apartment, district, street, house, metro1, i
                                            RETURN apartment, district, street, house, metro1`,
      {
        apartmentId: records.map(i => i.get('desiredApartment').properties)[0]?._id, 
        regionId, cityId, ...locationId,
      });
    await newSession.close();

  }


    return records;
}
const updateUser = async (location, user) => {
  const session = driver.session({ database });
  const result = await session.run(`MATCH (city:City{idKladr: $location.city.idKladr})-[s:INCLUDES]->(user: User { _id : $user._id })
                                      SET user += $user, user.accountModificationDate = datetime({timezone: 'Europe/Moscow'}).epochMillis
                                      RETURN user
                                      `, { user,
                                           location
                                        });
  await session.close();
  return result.records.map(i => i.get('user').properties)[0];
}
const updateUserAndСoefficient = async (location, user) => {
  const result = await session.run(`MATCH (city: City)-[s:INCLUDES]->(user: User { _id : $userId })
                                      SET user += $properties, user.accountModificationDate = datetime({timezone: 'Europe/Moscow'}).epochMillis
                                      WITH user, city, [user.budget[0], user.house_year_built[0], user.house_year_built[1], user.house_floor[0], user.house_floor[1], user.apartment_size[0], user.apartment_size[1]] AS vector1
                                    OPTIONAL MATCH (user)-[x:RELEVANCE]->(person) DELETE x WITH city, user, person, vector1
                                    OPTIONAL MATCH (user)<-[x:RELEVANCE]-(person) DELETE x WITH city, user, person, vector1
                                    MERGE (newCountry:Country {code: "RUS"}) 
                                      ON CREATE SET newCountry.name = "Россия" WITH city, newCountry, user, vector1
                                    MERGE (newCountry)-[i:INCLUDES]->(newCity:City {idKladr: ${location.city.code}}) 
                                      ON CREATE SET newCity.name = "${location.city.name}" WITH city, newCountry, newCity, user, vector1
                                    MERGE (newCity)-[c:INCLUDES]->(user) WITH city, newCountry, newCity, user, vector1

                                    OPTIONAL MATCH (newCity)-[p:INCLUDES]->(newPerson: User) WHERE newPerson._id <> user._id WITH city, newCity, user, newPerson, vector1, [newPerson.budget[0], newPerson.house_year_built[0], newPerson.house_year_built[1], newPerson.house_floor[0], newPerson.house_floor[1], newPerson.apartment_size[0], newPerson.apartment_size[1]] AS vector2
                                    FOREACH (_ IN CASE WHEN newPerson IS NOT NULL THEN [1] END | MERGE (user)-[r:RELEVANCE]->(newPerson) 
                                      ON CREATE SET r.coefficient = gds.alpha.similarity.pearson(vector1, vector2)) WITH city, newCity, user

                                    OPTIONAL MATCH (newCity)-[c]->(user)<-[s]-(city)
                                      DELETE s 
                                      RETURN user
                                      `, {
                                        properties: {
                                          // ...user
                                          userId: user._id,
                                          name: user.name,
                                          dateOfBirthday: user.dateOfBirthday,
                                          email: user.email,
                                          password: user.password,
                                          isActivated: user.isActivated,
                                          activationLink: user.activationLink,
                                          refreshToken: user.refreshToken,
                                          budget: user.budget, 
                                          house_year_built: user.house_year_built,
                                          house_floor: user.house_floor,
                                          apartment_size: user.apartment_size
                                          }
                                      });
  return result.records.map(i => i.get('user').properties)[0];
}

const deleteById = async (cityId, userId) => {
  const result = await session.run(`
                                    MATCH (country:Country {code: "RUS"})-[i:INCLUDES]->(:Region)-[:INCLUDES]->(city:City {idKladr: "${cityId}"})-[r:INCLUDES]->(user:User {_id: "${userId}"})-[s:INCLUDES]->(n)
                                     DETACH DELETE user, n
                                    `);
  // return result.records.map(i => i.get('user').properties)[0];
}


export default {
    findByCityId,
    findByCityIdByUserId,
    findByCityIdByEmail,
    findByEmail,
    findByCityIdByActivationLink,
    findTokenByCityIdByUserId,
    deleteRefreshTokenByCityIdById,
    findByCityIdByUserIdRating,
    findUsersByCityIdByUserId,
    findUsersByCityIdByUserIdPartialMatch,
    findUsersByCityIdByUserIdFullMatch,
    findUsersAndRatingByCityIdByUserId,
    findUsersByCityIdByUserIdByEstimatedScore,
    findUsersByCityIdByUserIdByEstimatedScoreByTypeOfRating,
    pushNewRatingByCityIdByUserId,
    pushEstimatedRecommendByCityIdByUserId,
    create,
    updateUser,
    updateUserAndСoefficient,
    deleteById
}
