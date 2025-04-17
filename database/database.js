import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export const getDBConnection = async () => {
  SQLite.DEBUG(true);
  return SQLite.openDatabase({ name: 'app.db', location: 'default' });
};

export const createTables = async (db) => {
  const query = `
    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      placeId TEXT UNIQUE
    );
  `;
  await db.executeSql(query);
};


export const bookmarkPlace = async (db, placeId) => {
    const query = `INSERT OR IGNORE INTO bookmarks (placeId) VALUES (?);`;
    await db.executeSql(query, [placeId]);
  };
  
export const removeBookmark = async (db, placeId) => {
const query = `DELETE FROM bookmarks WHERE placeId = ?;`;
await db.executeSql(query, [placeId]);
};

export const isBookmarked = async (db, placeId) => {
const [results] = await db.executeSql(
    `SELECT * FROM bookmarks WHERE placeId = ?`,
    [placeId]
);
return results.rows.length > 0;
};

export const getAllBookmarks = async (db) => {
const [results] = await db.executeSql(`SELECT * FROM bookmarks`);
const bookmarks = [];
for (let i = 0; i < results.rows.length; i++) {
    bookmarks.push(results.rows.item(i).placeId);
}
return bookmarks;
};