import  * as SQLite from "expo-sqlite";


import { PLACES_DEMO } from '@/constants/PlacesDemo'

let onlineDatabase; 
const offlineCacheDB = SQLite.openDatabaseSync('places.db');


export default function useDatabase() {
    console.log("useDatabase enabled")

    function getOnlineDatabaseContent() {
        onlineDatabase = PLACES_DEMO
    
        console.log(onlineDatabase)
    }

    function initialiseOfflineCacheDB() {
        console.log("starting: initialiseOfflineCacheDB()")

        offlineCacheDB.execAsync(
            `CREATE TABLE IF NOT EXISTS places (
                id INTEGER PRIMARY KEY NOT NULL,
                name TEXT,
                type TEXT,
                languages TEXT,
                city TEXT,
                district TEXT,
                next_opening_time TEXT,
                latitude REAL,
                longitude REAL
            );`
        ).then(() => {
            console.log("Table created successfully");
        }).catch((error) => {
            console.error("Error creating table", error);
        });
    }

    function addTestingData() {
        console.log("Adding testing data...");

        const testData = [
            {
                id: 0,
                name: "Donner",
                type: "Bookstore",
                languages: ["EN", "NL", "Other"],
                city: "Rotterdam",
                district: "Stadscentrum",
                next_opening_time: "10:00",
                latitude: 51.918852498892,
                longitude: 4.479435816744115,
            },
            {
                id: 1,
                name: "Erasmus Esports",
                type: "Student Sport Association",
                languages: ["EN", "NL", "Other"],
                city: "Rotterdam",
                district: "Feijenoord",
                next_opening_time: "Wednesday 19:00",
                latitude: 51.91008440463913,
                longitude: 4.509421634628058,
            },
        ];

        for (const place of testData) {
            offlineCacheDB.runAsync(
                `INSERT OR REPLACE INTO places 
                    (id, name, type, languages, city, district, next_opening_time, latitude, longitude) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    place.id,
                    place.name,
                    place.type,
                    JSON.stringify(place.languages),
                    place.city,
                    place.district,
                    place.next_opening_time,
                    place.latitude,
                    place.longitude
                ]
            ).then(() => {
                console.log(`Inserted: ${place.name}`);
            }).catch((err) => {
                console.error(`Error inserting ${place.name}`, err);
            });
        }
    }

    async function getOfflineCacheDBContent() {
        try {
            const rows = await offlineCacheDB.getAllAsync(
                `SELECT * FROM places`
            );
    
            // Parse the JSON stringified languages field
            const parsedRows = rows.map((row) => ({
                ...row,
                languages: JSON.parse(row.languages),
            }));
    
            console.log("Offline cache content:", parsedRows);
            return parsedRows;
    
        } catch (error) {
            console.error("Error fetching data from offline cache", error);
            return [];
        }
    }

    return {
        getOnlineDatabaseContent,
        initialiseOfflineCacheDB,
        addTestingData,
        getOfflineCacheDBContent
    };
}


