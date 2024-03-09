import { Amplify } from 'aws-amplify';
import amplifyconfig from './src/amplifyconfiguration.json';
Amplify.configure(amplifyconfig);
import { DataStore } from 'aws-amplify/datastore';
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
import { Notes } from './src/models';

import Toast from 'react-native-toast-message';

const showSuccessToast = () => {
  Toast.show({
    type: 'success',
    text1: 'Success',
    text2: 'Text saved successfully'
  });
};

const showErrorToast = () => {
  Toast.show({
    type: 'error',
    text1: 'Error',
    text2: 'Failed saving empty data on local'
  });
};
const initialNotesState = { heading: '', message: '' };
const client = generateClient();

export default function App() {
  const [notesState, setNotesState] = useState(initialNotesState);
  useEffect(() => {
    getNotesDataStore();
  }, []);

  function setInput(key, value) {
    setNotesState({...notesState, [key]: value});
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
      // await DataStore.clear();
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


  function saveButtonTriggered() {    
    try {
      // console.log("saving called", notesState)
      if (!notesState.heading || !notesState.message) {
        showErrorToast();
        return;
      }
      
      if(!notesState.id) {
        postNotesToDataStore();
      } else {
        updateNotesToDataStore(notesState.id);
      }
      showSuccessToast();
      
    } catch (err) {
      console.log('error saving the content:', err);
    }
  }

  return (

    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.heading}> Any Time Notes</Text>
        <TextInput
          onChangeText={(value) => setInput('heading', value)}
          style={styles.input}
          value={notesState.heading}
          placeholder="Notes Section..."
        />
        <TextInput
          onChangeText={(value) => setInput('message', value)}
          style={styles.message}
          value={notesState.message}
          multiline={true}
          numberOfLines={10}
          placeholder="Notes Content..."
        />
        <Pressable onPress={saveButtonTriggered} style={styles.saveButton}>
          <Text style={styles.buttonText}>save</Text>
        </Pressable>
        <Toast ref={(ref) => Toast.setRef(ref)} />
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
  container: {
    flex: 1,
    backgroundColor: '#F3EAF8', // This sets a clean background. Adjust the color as needed.
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#A890D3'
  },
  input: {
    height: 50,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    // borderColor: '#cccccc',
    borderColor: '#DCC7E1',
    backgroundColor: '#FFFFFF',
    paddingLeft: 10,
    borderRadius: 5,
  },
  message: {
    height: '15rem',
    padding: '1rem',
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#DCC7E1',
    backgroundColor: '#FFFFFF',
    paddingLeft: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#BFA2DB',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    alignItems: 'center'
  },
  buttonText: { color: 'white', color: 'white',
  fontWeight: 'bold'}
});


const stylesOld = StyleSheet.create({
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

