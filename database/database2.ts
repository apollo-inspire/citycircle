import  * as SQLite from "expo-sqlite";
import * as Network from "expo-network";


import { PLACES_DEMO } from '@/constants/PlacesDemo'

let onlineDatabase; 
const offlineCacheDB = SQLite.openDatabaseSync('places.db');

let connectedToInternet = false;
let currentConnectionType: string | null = null;

export default function useDatabase() {
    console.log("useDatabase enabled")

    function getOnlineDatabaseContent() {
        onlineDatabase = PLACES_DEMO
    
        console.log("getOnlineDatabaseContent():", onlineDatabase)
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

        // monitorConnectionType();

        updateOfflineCache()

        setInterval(() => {
            console.log("Interval triggered: checking for database update...");
            updateOfflineCache();
        }, 5 * 60 * 1000); // minutes, (60) seconds, (1000) ms
    }

    // function addTestingData() {
    //     console.log("Adding testing data...");

    //     const testData = [
    //         {
    //             id: 0,
    //             name: "Donner",
    //             type: "Bookstore",
    //             languages: ["EN", "NL", "Other"],
    //             city: "Rotterdam",
    //             district: "Stadscentrum",
    //             next_opening_time: "10:00",
    //             latitude: 51.918852498892,
    //             longitude: 4.479435816744115,
    //         },
    //         {
    //             id: 1,
    //             name: "Erasmus Esports",
    //             type: "Student Sport Association",
    //             languages: ["EN", "NL", "Other"],
    //             city: "Rotterdam",
    //             district: "Feijenoord",
    //             next_opening_time: "Wednesday 19:00",
    //             latitude: 51.91008440463913,
    //             longitude: 4.509421634628058,
    //         },
    //     ];

    //     for (const place of testData) {
    //         offlineCacheDB.runAsync(
    //             `INSERT OR REPLACE INTO places 
    //                 (id, name, type, languages, city, district, next_opening_time, latitude, longitude) 
    //             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    //             [
    //                 place.id,
    //                 place.name,
    //                 place.type,
    //                 JSON.stringify(place.languages),
    //                 place.city,
    //                 place.district,
    //                 place.next_opening_time,
    //                 place.latitude,
    //                 place.longitude
    //             ]
    //         ).then(() => {
    //             console.log(`Inserted: ${place.name}`);
    //         }).catch((err) => {
    //             console.error(`Error inserting ${place.name}`, err);
    //         });
    //     }
    // }

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

    async function updateOfflineCache() {
        console.log("Starting updateOfflineCache...");

        getOnlineDatabaseContent();

        const offlineData = await getOfflineCacheDBContent();

        const offlineString = JSON.stringify(offlineData.sort((a, b) => a.id - b.id));
        const onlineString = JSON.stringify(onlineDatabase.sort((a, b) => a.id - b.id));

        if (offlineString !== onlineString) {
            console.log("Detected difference in online and offline DB — updating offline cache.");
    
            for (const place of onlineDatabase) {
                try {
                    await offlineCacheDB.runAsync(
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
                    );
                    console.log(`Synced: ${place.name}`);
                } catch (err) {
                    console.error(`Failed to sync: ${place.name}`, err);
                }
            }
    
            console.log("Offline cache successfully updated.");
            // console.log("Cached data now reads:", getOfflineCacheDBContent());
        } else {
            console.log("Offline cache is already up-to-date.");
        }


    }

    // async function monitorConnectionType() {
    //     const updateConnection = async () => {
    //         const state = await Network.getNetworkStateAsync();
    
    //         connectedToInternet = state.isConnected && state.isInternetReachable;
    //         const newType = state.type; // 'WIFI', 'CELLULAR', 'UNKNOWN', 'NONE', etc.
    
    //         // Log connection status
    //         if (connectedToInternet) {
    //             console.log("✅ Connected to the internet");
    //         } else {
    //             console.log("❌ Not connected to the internet");
    //         }
    
    //         // Detect change in connection type
    //         if (newType !== currentConnectionType) {
    //             console.log(`🔄 Connection type changed: ${currentConnectionType} ➡️ ${newType}`);
    //             currentConnectionType = newType;
    
    //             if (newType === Network.NetworkStateType.WIFI) {
    //                 console.log("📶 Now connected via Wi-Fi");
    //             } else if (newType === Network.NetworkStateType.CELLULAR) {
    //                 console.log("📱 Now connected via mobile data");
    //             } else {
    //                 console.log("⚠️ Now disconnected or unknown connection type");
    //             }
    //         }
    //     };
    
    //     // Initial check
    //     await updateConnection();
    
    //     // Poll every 20 seconds
    //     setInterval(updateConnection, 10 * 1000);
    // }

    async function getData() {
        console.log("🔍 Checking connection to decide where to fetch data from...");
    
        try {
            const state = await Network.getNetworkStateAsync();
            const type = state.type;
            const isConnected = state.isConnected && state.isInternetReachable;
    
            console.log(`Connection type: ${type}, Connected: ${isConnected}`);
    
            if (type === Network.NetworkStateType.WIFI && isConnected) {
                console.log("📶 Fetching data from online database...");
                getOnlineDatabaseContent(); // Sets `onlineDatabase`
                return onlineDatabase;
            } else {
                console.log("📱 Or ❌ Fetching data from offline cache...");
                return await getOfflineCacheDBContent();
            }
        } catch (error) {
            console.error("Error checking connection type or fetching data:", error);
            return await getOfflineCacheDBContent(); // Fallback
        }
    }



    return {
        getOnlineDatabaseContent,
        initialiseOfflineCacheDB,
        // addTestingData,
        getOfflineCacheDBContent,
        updateOfflineCache,
        getData
    };
}


