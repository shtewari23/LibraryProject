import React, {memo , useState, useEffect } from 'react';
import { View, TextInput, FlatList, Image, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import { Feather } from '@expo/vector-icons'; // Import Feather icons from Expo

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('https://openlibrary.org/people/mekBot/books/already-read.json');
      const first20Books = response.data.reading_log_entries.slice(0, 20); 
      setBooks(first20Books);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books: ', error);
    }
  };

  const toggleBookStatus = (index) => {
    const updatedBooks = [...books];
    updatedBooks[index].status = updatedBooks[index].status === 'Read' ? 'Unread' : 'Read';
    setBooks(updatedBooks);
  };

  const toggleSearchStatus = (index) => {
    const updatedResults = [...searchResults]; // Create a copy of searchResults array
    const item = updatedResults[index]; // Get the book item to update
    item.status = item.status === 'Read' ? 'Unread' : 'Read'; // Toggle the status
    updatedResults[index] = item; // Update the item in the copied array
    setSearchResults(updatedResults); // Update the searchResults state
  };

  const handleTextChange = (text) => {
    setSearchQuery(text);
  };

  const searchBooks = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`https://openlibrary.org/search.json?q=${searchQuery}`);
      setSearchResults(response.data.docs);
    } catch (error) {
      console.error('Error searching books: ', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBookItem = ({ item, index }) => (
    <View style={styles.bookItem}>
      <Image
        style={styles.bookCover}
        source={{ uri: `https://covers.openlibrary.org/b/id/${item.work.cover_id}-M.jpg` }}
        onLoadStart={() => setImageLoading(true)}
        onLoadEnd={() => setImageLoading(false)}
      />
      {imageLoading && <ActivityIndicator style={styles.loadingIndicator} size="small" color="#0000ff" />}
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>Title: {item.work.title}</Text>
        <Text style={styles.bookAuthor}>Author: {item.work.author_names}</Text>
        <Text style={styles.bookYear}>Published Year: {item.work.first_publish_year}</Text>
        <TouchableOpacity
          onPress={() => toggleBookStatus(index)}
          style={[styles.bookStatusButton, { backgroundColor: item.status === 'Read' ? '#28a745' : '#dc3545' }]}
        >
          <Text style={styles.bookStatusText}>{item.status}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSearchItem = ({ item, index }) => (
    <View style={styles.bookItem}>
      <Image
        style={styles.bookCover}
        source={{ uri: `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg` }}
        onLoadStart={() => setImageLoading(true)}
        onLoadEnd={() => setImageLoading(false)}
      />
      {imageLoading && <ActivityIndicator style={styles.loadingIndicator} size="small" color="#0000ff" />}
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>Title: {item.title}</Text>
        <Text style={styles.bookAuthor}>Author: {item.author_name}</Text>
        <Text style={styles.bookYear}>Published Year: {item.first_publish_year}</Text>
        <TouchableOpacity
          onPress={() => toggleSearchStatus(index)}
          style={[styles.bookStatusButton, { backgroundColor: item.status === 'Read' ? '#28a745' : '#dc3545' }]}
        >
          <Text style={styles.bookStatusText}>{item.status}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          onChangeText={handleTextChange}
          value={searchQuery}
          placeholder="Search books by title"
          onSubmitEditing={searchBooks}
        />
        <TouchableOpacity onPress={searchBooks } style={styles.searchIcon}>
          <Feather name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />
      ) : searchQuery === '' ? (
        <FlatList
          data={books}
          renderItem={renderBookItem}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderSearchItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'black',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 4,

  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor:'white'
  },
  searchIcon: {
    position: 'absolute',
    right: 10,
    top: 5,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor:'#0f0f0f',
    margin:10
  },
  bookCover: {
    width: 150,
    height: 200,
    borderWidth: 1,
    borderRadius: 8,
    marginRight: 10,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#F5F5DC',
    marginBottom: 3,
  },
  bookYear: {
    fontSize: 12,
    color: '#FFFDD0',
    marginBottom: 3,
  },
  bookStatusButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    width: 60,
    marginTop:40,
  },
  bookStatusText: {
    color: '#fff',
    fontSize: 12,
  },
  loadingIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 60,
    marginLeft: 50,
  },
});

export default memo(HomePage);