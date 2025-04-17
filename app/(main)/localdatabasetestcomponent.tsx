import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import {
  getDBConnection,
  createTables,
  bookmarkPlace,
  removeBookmark,
  isBookmarked,
} from '../../database/database';

const Localdatabasetestcomponent = ({ place }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [db, setDb] = useState(null);

  useEffect(() => {
    const setupDb = async () => {
      const dbConn = await getDBConnection();
      await createTables(dbConn);
      setDb(dbConn);
      const result = await isBookmarked(dbConn, place.id);
      setBookmarked(result);
    };
    setupDb();
  }, [place.id]);

  const toggleBookmark = async () => {
    if (!db) return;
    if (bookmarked) {
      await removeBookmark(db, place.id);
    } else {
      await bookmarkPlace(db, place.id);
    }
    setBookmarked(!bookmarked);
  };

  return (
    <View>
      <Text>{place.name}</Text>
      <Button
        title={bookmarked ? 'Delete bookmark' : 'Bookmark'}
        onPress={toggleBookmark}
      />
      <Text style={styles.text}>test</Text>
    </View>
  );
};

export default Localdatabasetestcomponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    text: {
        color: 'white',
        fontSize: 42,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        marginBottom: 120,
    },
})