export default class QueryGenerator{
    static getNearestMetro(address){
        let metroInfo = ' ';
        if (address.nearestMetro?.length)
        if (address?.street && !address?.house) {
            metroInfo = address?.nearestMetro?.map(el => `MERGE (street)-[has:HAS]->(m:Metro{name: "${el.name}"})-[:MetroMetadata]->(line:LineMetadata{name: "${el.line}"})-[:MetroMetadata]->()-[:MetroMetadata]->(region) 
                                                        ON CREATE SET m.lat = ${el.lat}, m.lon = ${el.lon}, has.distanse = ${el.dist} 
                                                        ON MATCH SET m.lat = ${el.lat}, m.lon = ${el.lon}, has.distanse = ${el.dist}
                                                        WITH region, city, district, street, house, m AS metro, districtId, streetId, houseId`).join(` `)
        } else if (address?.street && address?.house) {
            metroInfo = address?.nearestMetro?.map(el => `MERGE (house)-[has:HAS]->(m:Metro{name: "${el.name}"})-[:MetroMetadata]->(line:LineMetadata{name: "${el.line}"})-[:MetroMetadata]->()-[:MetroMetadata]->(region)
                                                      ON CREATE SET m.lat = ${el.lat}, m.lon = ${el.lon}, has.distanse = ${el.dist} 
                                                      ON MATCH SET m.lat = ${el.lat}, m.lon = ${el.lon}, has.distanse = ${el.dist}
                                                      WITH region, city, district, street, house, m AS metro, districtId, streetId, houseId`).join(` `) 
        }
        return metroInfo;
    }
    static getPlace(address){
        let place = ' ';
        if (address?.district)
            place += `MERGE (city)-[:INCLUDES]->(d: District{name: $districtName}) 
                    ${!address?.street && !address?.house ? 
                        `ON CREATE SET d.constCoordinates = true, d.coordinates = $coordinates
                        ON MATCH SET d.constCoordinates = true, d.coordinates = $coordinates
                        ` : `ON CREATE SET d.constCoordinates = false `}
                    WITH region, city, d AS district, street, house, metro, streetId, houseId, ${!address?.street && !address?.house ? `id(d) AS districtId` : `districtId`} `;
        if (address?.street)
            if (address?.house)
                place += `MERGE (district)-[:INCLUDES]->(s:Street{name: $streetName})
                            ON CREATE SET s.constCoordinates = false
                            WITH region, city, district, s AS street, house, metro, districtId, streetId, houseId
                          MERGE (street)-[:INCLUDES]->(h:House{number: $houseNumber})  
                            ON CREATE SET h.constCoordinates = true, h.coordinates = $coordinates 
                            ON MATCH SET h.constCoordinates = true, h.coordinates = $coordinates
                          WITH region, city, district, street, h AS house, metro, districtId, streetId, id(h) AS houseId`;
            else place += `MERGE (district)-[:INCLUDES]->(s:Street{name: $streetName}) 
                               ON CREATE SET s.constCoordinates = true, s.coordinates = $coordinates
                               ON MATCH SET s.constCoordinates = true, s.coordinates = $coordinates
                           WITH region, city, district, s AS street, house, metro, districtId, id(s) AS streetId, houseId`;
        if (address?.metro)
            place += `MERGE (line:LineMetadata${address?.line ? '{name: $lineName}' : ''})-[:MetroMetadata]->()-[:MetroMetadata]->(region)
                      MERGE (m:Metro{name: $metroName})-[:MetroMetadata]->(line) 
                        ON CREATE SET m.lat = $coordinates[0], m.lon = $coordinates[1]
                      WITH region, city, district, street, house, id(m) AS metro, districtId, streetId, houseId`;
                        // FIXME - заменить MERGE на MATCH при извелчении узлов "Metro"
        return place;
    }
}