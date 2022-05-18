import neo4j from 'neo4j-driver';
import LocationServices from '../service/location-service.js';
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
    const result = await session.run(`MATCH (country:Country {code: "RUS"})-[r:INCLUDES]->(city:City {idKladr: $idCity})-[s:INCLUDES]->(u:User)-[s1:INCLUDES]->(d:DesiredApartment) return u, d` + (limit ? ` limit ${Math.abs(Math.trunc(+limit))}` : ''), 
                                      {
                                        idCity
                                      });
    await session.close();
    return result.records;
}
const findByCityIdByUserId = async (idCity, idUser) => {
  const session = driver.session({ database });
  const result = await session.run(`MATCH (country:Country {code: "RUS"})-[r:INCLUDES]->(city:City {idKladr: "${idCity}"})-[s:INCLUDES]->(user:User {_id : "${idUser}"})-[s1:INCLUDES]->(searchInfo: SearchInfo) WITH city, user, searchInfo
                                    MATCH (user)-[s2:INCLUDES]->(desiredApartment: DesiredApartment)
                                    RETURN city, user, searchInfo, desiredApartment`);
  await session.close();
  return result.records;
}
const findByCityIdByUserIdRating = async (idCity, idUser, idCurrentUser) => {
  const session = driver.session({ database });
  const result = await session.run(`MATCH (country:Country {code: "RUS"})-[r:INCLUDES]->(city:City {idKladr: "${idCity}"})-[s:INCLUDES]->(user:User {_id : "${idUser}"})-[s1:INCLUDES]->(searchInfo: SearchInfo) WITH city, user, searchInfo
                                    MATCH (user)-[s2:INCLUDES]->(desiredApartment: DesiredApartment) WITH city, user, searchInfo, desiredApartment
                                    MATCH (userFrom:User{_id: $idCurrentUser})-[r:RATING]->(user) 
                                    RETURN city, user, searchInfo, desiredApartment, toInteger(r.realScore) AS realScore`, {
                                      idCurrentUser
                                    });
  await session.close();
  return result.records;
}
const findByCityIdByEmail = async (idCity, email) => {
  const session = driver.session({ database });
  const result = await session.run(`MATCH (country:Country {code: "RUS"})-[r:INCLUDES]->(city:City {idKladr: "${idCity}"})-[s:INCLUDES]->(u:User {email : "${email}"}) return u limit 1`);
  await session.close();

  return result.records.map(i => i.get('u').properties)[0];
}
const findByEmail = async email => {
  console.log(email);
  const session = driver.session({ database });
  const result = await session.run(`MATCH (country:Country {code: "RUS"})-[r:INCLUDES]->(city:City)-[s:INCLUDES]->(user:User {email: $email})-[s1:INCLUDES]->(searchInfo: SearchInfo) WITH city, user, searchInfo
                                    MATCH (user)-[s2:INCLUDES]->(desiredApartment: DesiredApartment)
                                    RETURN city, user, searchInfo, desiredApartment`,
                                    { email });
  const records = result.records;
  console.log(records);
  await session.close();
  return records;
}
const findByCityIdByActivationLink = async (idCity, activationLink) => {
  const session = driver.session({ database });
  const result = await session.run(`match (country:Country {code: "RUS"})-[r:INCLUDES]->(city:City {idKladr: ${idCity}})-[s:INCLUDES]->(u:User {activationLink : ${activationLink}}) return u limit 1`);
  await session.close();

  return result.records.map(i => i.get('u').properties)[0];
}
const findTokenByCityIdByUserId = async (idCity, idUser) => {
  // console.log("idCity, idUser");
  // console.log(idCity, idUser);
  const session = driver.session({ database });
  const result = await session.run(`match (country:Country {code: "RUS"})-[r:INCLUDES]->(city:City {idKladr: $idCity})-[s:INCLUDES]->(u:User {_id : $idUser}) return u limit 1`,
                                    {
                                      idCity, idUser
                                    });
  await session.close();
  // console.log(result.records.map(i => i.get('u').properties));
  const user = result.records.map(i => i.get('u').properties)[0];
  
  return user ? user.refreshToken : null;
}
const deleteRefreshTokenByCityIdById = async (idCity, idUser) => {
    const session = driver.session({ database });
    const result = await session.run(`match (country:Country {code: "RUS"})-[r:INCLUDES]->(city:City {idKladr: $idCity})-[s:INCLUDES]->(u:User {_id : $idUser}) SET u.refreshToken=null 
                                    RETURN u LIMIT 1`, 
                                      {
                                        idCity, idUser
                                      });
  await session.close();
  return result.records.map(i => i.get('u').properties)[0];
}

const pushNewRatingByCityIdByUserId = async (idCity, idUser, idRatedUser, newRating) => {
  console.log(idCity, idUser, idRatedUser, newRating);
  const session = driver.session({ database });
  const result = await session.run(`MATCH (country:Country {code: "RUS"})-[i:INCLUDES]->(city:City {idKladr: $idCity})-[s:INCLUDES]->(user1:User {_id : $idUser}) WITH user1 AS userFrom
                                    MATCH (country:Country {code: "RUS"})-[i:INCLUDES]->(city:City {idKladr: $idCity})-[s:INCLUDES]->(user2:User {_id : $idRatedUser}) WITH userFrom, user2 AS userTo
                                    MERGE ((userFrom)-[r:RATING]->(userTo))
                                       SET r.realScore = $newRating
                                    RETURN r.realScore, userTo._id`,
                                    {
                                      idCity, idUser, idRatedUser, newRating
                                    });

  await session.close();
  console.log(result.records);
  return result.records;
}

const findUsersAndRatingByCityIdByUserId = async (idCity, idUser) => {
  const session = driver.session({ database });
  const result = await session.run(`MATCH (country:Country {code: "RUS"})-[i:INCLUDES]->(city:City {idKladr: $idCity})-[s:INCLUDES]->(user1:User)-[r:RATING]->(user2: User) WHERE r.realScore IS NOT NULL 
                                    RETURN  user1._id AS user1Id, r.realScore AS realScore, user2._id AS user2Id`,
                                    {
                                      idCity, idUser
                                    });

  console.log(result.records);
  await session.close();
  return result.records;
}
const findUsersByCityIdByUserIdByEstimatedScore = async (idCity, idUser) => {
  const session = driver.session({ database });
  const result = await session.run(`MATCH (country:Country {code: "RUS"})-[i:INCLUDES]->(city:City {idKladr: $idCity})-[s:INCLUDES]->(user1:User{_id:$idUser})-[r:RATING]->(user2: User) WHERE r.estimatedScore IS NOT NULL 
                                    RETURN  user1._id AS user1Id, r.estimatedScore AS estimatedScore, user2._id AS user2Id`,
                                    {
                                      idCity, idUser
                                    });

  console.log(result.records);
  await session.close();
  return result.records;
}
const pushEstimatedRecommendByCityIdByUserId = async (idCity, idUser, idRatedUser, recommend) => {
  const session = driver.session({ database });
  const result = await session.run(`MATCH (country:Country {code: "RUS"})-[i:INCLUDES]->(city:City {idKladr: $idCity})-[s:INCLUDES]->(user1:User {_id : $idUser}) WITH user1 AS userFrom
                                    MATCH (country:Country {code: "RUS"})-[i:INCLUDES]->(city:City {idKladr: $idCity})-[s:INCLUDES]->(user2:User {_id : $idRatedUser}) WITH userFrom, user2 AS userTo
                                    MERGE ((userFrom)-[r:RATING]->(userTo))
                                       SET r.estimatedScore = $recommend
                                    RETURN r.estimatedScore, userTo._id`,
                                    {
                                      idCity, idUser, idRatedUser, recommend
                                    });

  console.log(result.records);
  await session.close();
  return result.records;
}
const findUsersByCityIdByUserId = async (idCity, idUser, relevanceRange, limit) => {
  const session = driver.session({ database });
  const result = await session.run(`MATCH (country:Country {code: "RUS"})-[i:INCLUDES]->(city:City {idKladr: $idCity})-[s:INCLUDES]->(user:User {_id : $idUser})-[r:RELEVANCE]->(u: User)-[s1:INCLUDES]->(d:DesiredApartment) WHERE r.coefficient >= toFloat($relevanceRange[0]) AND r.coefficient <= toFloat($relevanceRange[1]) 
                                    RETURN u, d ORDER BY r.coefficient DESC` + (limit ? ` limit ${Math.abs(Math.trunc(+limit))}` : ''),
                                    {
                                      idCity, idUser,
                                      relevanceRange
                                    });

  await session.close();
  return result.records;
}
const findUsersByCityIdByUserIdPartialMatch = async (idCity, idUser, relevanceRange, limit) => {
  const session = driver.session({ database });
  const result = await session.run(`MATCH (country:Country {code: "RUS"})-[i:INCLUDES]->(city:City {idKladr: $idCity})-[s:INCLUDES]->(user:User {_id : $idUser})-[r:RELEVANCE]->(u: User)-[s1:INCLUDES]->(d:DesiredApartment) WHERE r.coefficient >= $relevanceRange[0] AND r.coefficient <= $relevanceRange[1] 
                                    RETURN u, d ORDER BY r.coefficient DESC` + (limit ? ` limit ${Math.abs(Math.trunc(+limit))}` : ''),
                                    {
                                      idCity, idUser,
                                      relevanceRange
                                    });

  await session.close();
  return result.records;
}
const findUsersByCityIdByUserIdFullMatch = async (idCity, idUser, limit) => {
  const session = driver.session({ database });
  const result = await session.run(`MATCH (country:Country {code: "RUS"})-[i:INCLUDES]->(city:City {idKladr: $idCity})-[s:INCLUDES]->(user:User {_id : $idUser})-[r:RELEVANCE]->(u: User)-[s1:INCLUDES]->(d:DesiredApartment) WHERE r.coefficient = 1 
                                    RETURN u, d ORDER BY r.coefficient DESC` + (limit ? ` limit ${Math.abs(Math.trunc(+limit))}` : ''),
                                    {
                                      idCity, idUser
                                    });

  await session.close();
  return result.records;
}
const create = async (location, user, searchedUser, apartment) => {
  const result1 = await LocationServices.getFullAddresses(location.places);
  const [ labelsPlaces, valuesPlaces, coordinatesPlaces ] = result1;
  const session = driver.session({ database });
  const result = await session.run(`CYPHER expressionEngine=interpreted MERGE (country: Country {code: "RUS"}) 
                                      ON CREATE SET country.name = "Россия", country.idVK = 1 WITH country 
                                    MERGE (country)-[i:INCLUDES]->(city: City {idKladr: $cityId}) 
                                      ON CREATE SET city.name = $cityName, city.coordinates = $cityCoordinates WITH country, city
                                      CREATE (city)-[s:INCLUDES]->(user: User {
                                          _id : randomUUID(), 
                                          username: $username,
                                          birthdate: toInteger($birthdate),
                                          image: $image,
                                          email: $email,
                                          password: $password,
                                          activationLink: $activationLink,
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
                                      vector1 + [10.0 * desiredApartment.budget / 300000, 10.0,
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
                                      WHEN searchInfo.hasPhoto = 1 AND NOT isEmpty(pearson.image) THEN 10.0
                                      ELSE 0.0 END)
                                    ] + 
                                    [10.0 * searchApartment.budget / 300000, 10.0 * gds.alpha.similarity.jaccard(desiredApartment.rooms, searchApartment.rooms), 
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
                                      ON CREATE SET r.coefficient = gds.alpha.similarity.euclidean(vector1, vector2), r.coefficientUpdateDate = datetime({timezone: 'Europe/Moscow'}).epochMillis) WITH city, user, searchInfo, desiredApartment, vector1, vector2
                                      RETURN city, user, searchInfo, desiredApartment, vector1, vector2`,
                                      {
                                          countryId: location.country.id,
                                          cityId: location.city.idKladr,
                                          cityName: location.city.name,
                                          cityCoordinates: await LocationServices.getCoordinatesByCityName(location.city.name),
                                          places: location.places,

                                          username: user.username,
                                          birthdate: new Date(user.dateOfBirth).getTime(),
                                          gender: user.gender,
                                          image: user.image.imagePreviewUrl,
                                          email: user.email,
                                          password: user.password,
                                          isActivated: false,
                                          refreshToken: '',
                                          activationLink: user.activationLink,
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
                                          hasPhotoSearchInfo: searchedUser.hasPhoto,

                                          labelsPlaces, valuesPlaces, coordinatesPlaces,
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
                                          // repairs: ConvertService.convertArrFromMultiSelect(apartment.repairs, 4),
                                          // parking: ConvertService.convertArrFromMultiSelect(apartment.parking, 3),
                                          // housingСlass: ConvertService.convertArrFromMultiSelect(apartment.housingСlass, 3),
                                          // typeOfBuilding: ConvertService.convertArrFromMultiSelect(apartment.typeOfBuilding, 7),
                                          // usability: ConvertService.convertArrFromMultiSelect(apartment.usability, 6),
                                          // permissions: ConvertService.convertArrFromMultiSelect(apartment.permissions, 2),
                                          builtYear: apartment.builtYear,
                                          hasPhoto: apartment.hasPhoto
                                      });
    const records = result.records;
    // console.log('v1:', records.map(i => i.get('vector1')));
    // console.log('v2:', records.map(i => i.get('vector2')));
    // console.log("Model was added to DB");
    // console.log(records.map(i => i.get('city').properties)[0]);
    await session.close();
    return records;
}
const updateUser = async (location, user) => {
  // console.log("_id", location, user._id, user.refreshToken);
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
const updateUserAndСoefficientPearson = async (location, user) => {
  const result = await session.run(`MATCH (city: City)-[s:INCLUDES]->(user: User { _id : $userId })
                                      SET user += $properties, user.accountModificationDate = datetime({timezone: 'Europe/Moscow'}).epochMillis
                                      WITH user, city, [user.budget, user.house_year_built[0], user.house_year_built[1], user.house_floor[0], user.house_floor[1], user.apartment_size[0], user.apartment_size[1]] AS vector1
                                    OPTIONAL MATCH (user)-[x:RELEVANCE]->(person) DELETE x WITH city, user, person, vector1
                                    OPTIONAL MATCH (user)<-[x:RELEVANCE]-(person) DELETE x WITH city, user, person, vector1
                                    MERGE (newCountry:Country {code: "RUS"}) 
                                      ON CREATE SET newCountry.name = "Россия" WITH city, newCountry, user, vector1
                                    MERGE (newCountry)-[i:INCLUDES]->(newCity:City {idKladr: ${location.city.code}}) 
                                      ON CREATE SET newCity.name = "${location.city.name}" WITH city, newCountry, newCity, user, vector1
                                    MERGE (newCity)-[c:INCLUDES]->(user) WITH city, newCountry, newCity, user, vector1

                                    OPTIONAL MATCH (newCity)-[p:INCLUDES]->(newPerson: User) WHERE newPerson._id <> user._id WITH city, newCity, user, newPerson, vector1, [newPerson.budget, newPerson.house_year_built[0], newPerson.house_year_built[1], newPerson.house_floor[0], newPerson.house_floor[1], newPerson.apartment_size[0], newPerson.apartment_size[1]] AS vector2
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
                                    MATCH (country:Country {code: "RUS"})-[i:INCLUDES]->(city:City {idKladr: "${cityId}"})-[r:INCLUDES]->(user:User {_id: "${userId}"})-[s:INCLUDES]->(n)
                                     DETACH DELETE user, n
                                    `);
  // console.log(result);
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
    pushNewRatingByCityIdByUserId,
    pushEstimatedRecommendByCityIdByUserId,
    create,
    updateUser,
    updateUserAndСoefficientPearson,
    deleteById
}
