import { Amplify } from 'aws-amplify';
import amplifyconfig from './src/amplifyconfiguration.json';
Amplify.configure(amplifyconfig);
import { DataStore } from 'aws-amplify/datastore';
// DataStore.configure({
//   syncExpressions: [syncExpression(Notes, (eachNotes) => eachNotes)]
// });
// DataStore.configure({
//   syncExpressions: [
//     DataStore.syncExpression(Notes, () => {
//       return (eachNotes) => eachNotes; // This is a placeholder condition. Define your actual condition here.
//     })
//   ]
// });
import '@azure/core-asynciterator-polyfill';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  SafeAreaView
} from 'react-native';
import { generateClient } from 'aws-amplify/api';
import { createTodo } from './src/graphql/mutations';
import { listTodos } from './src/graphql/queries';
import { StatusBar } from 'expo-status-bar';
import { Notes } from './src/models';
// App.js



const initialState = { name: '', description: '' };

const initialNotesState = { heading: '', message: '' };

const client = generateClient();
// import { View, Text, Button } from 'react-native'

export default function App() {
  // const [formState, setFormState] = useState(initialState);
  const [notesState, setNotesState] = useState(initialNotesState);
  // const [todos, setTodos] = useState([]);
  // const [notes, setNotes] = useState([]);

  useEffect(() => {
    getNotesDataStore();
  }, []);

  function setInput(key, value) {
    // console.log("changing values", key, value)
    setNotesState({...notesState, [key]: value});
    // console.log("lates", notesState)
  }
  
  async function syncData() {
    await DataStore.start();
  }



  async function updateNotesToDataStore(id) {
    try {
      // console.log("updating notes value");
      const originalNote = await DataStore.query(Notes, id);
      // console.log("found old note", originalNote);
        if (originalNote) {
            // Update the note if it exists
            await DataStore.save(
                Notes.copyOf(originalNote, updated => {
                    updated.heading = notesState.heading;
                    updated.message = notesState.message;
                    // Update other fields if necessary
                })
            );
        }


    } catch (error) {
      // console.log('Error saving post', error);
    }
  }

  async function postNotesToDataStore() {
    try {
      const notesCreated = await DataStore.save(
        new Notes({
          heading: notesState.heading,
          message: notesState.message
        })
      );
      // console.log('Post saved successfully!', notesCreated);
    } catch (error) {
      // console.log('Error saving post', error);
    }
  }

  async function getNotesDataStore() {
    try {
      await DataStore.clear();
      syncData().then(() => console.log('DataStore has started syncing'));
      const notes = await DataStore.query(Notes);
      console.log('Notes retrieved successfully!', (notes));
      // setNotes(notes);
      setNotesState({...notes[0]});
      // console.log(notesState, "tat");
    } catch (error) {
      // console.log('Error retrieving notes', error);
    }
  }

  async function fetchTodos() {
    try {
      const todoData = await client.graphql({
        query: listTodos
      });
      const todos = todoData.data.listTodos.items;
      setTodos(todos);
    } catch (err) {
      // console.log('error fetching todos');
    }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return;
      const todo = { ...formState };
      setTodos([...todos, todo]);
      setFormState(initialState);
      await client.graphql({
        query: createTodo,
        variables: {
          input: todo
        }
      });
    } catch (err) {
      // console.log('error creating todo:', err);
    }
  }

  function saveButtonTriggered() {    
    try {
      // console.log("saving called", notesState)
      if (!notesState.heading || !notesState.message) return;
      
      if(!notesState.id) {
        postNotesToDataStore();
      } else {
        updateNotesToDataStore(notesState.id);
      }
      
    } catch (err) {
      console.log('error saving the content:', err);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <TextInput
          onChangeText={(value) => setInput('heading', value)}
          style={styles.input}
          value={notesState.heading}
          placeholder="Notes heading..."
        />
        <TextInput
          onChangeText={(value) => setInput('message', value)}
          style={styles.input}
          value={notesState.message}
          placeholder="Notes content..."
        />
        <Pressable onPress={saveButtonTriggered} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>save</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );

}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   header: {
//     height: 60,
//     width: '100%',
//     backgroundColor: '#007bff',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerText: {
//     color: '#fff',
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   contentBox: {
//     marginTop: 20,
//     padding: 20,
//     borderWidth: 1,
//     borderColor: '#007bff',
//     borderRadius: 5,
//     backgroundColor: '#e9f5ff',
//   },
//   contentText: {
//     fontSize: 16,
//     color: '#333',
//   },
// });

const styles = StyleSheet.create({
  container: { width: 400, flex: 1, padding: 20, alignSelf: 'center' },
  todo: { marginBottom: 15 },
  input: {
    backgroundColor: '#ddd',
    marginBottom: 10,
    padding: 8,
    fontSize: 18
  },
  todoName: { fontSize: 20, fontWeight: 'bold' },
  buttonContainer: {
    alignSelf: 'center',
    backgroundColor: 'black',
    paddingHorizontal: 8
  },
  buttonText: { color: 'white', padding: 16, fontSize: 18 }
});

