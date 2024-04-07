import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Camera from '../camera'
import { getCurrentLocation } from '../../funcs/goeotag';
import { apiUrl } from '../../serverconfig';

import * as FileSystem from 'expo-file-system';

const convertImageToBase64 = async (imageUri) => {
  const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: 'base64' });
  return `data:image/jpeg;base64,${base64}`;
};


const StepOne = ({ updateTodos, moveToNextStep }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reminderDate, setReminderDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAddTodo = async () => {
    try {
      const { latitude, longitude } = await getCurrentLocation();
      console.log({ latitude, longitude });

      const response = await fetch(`${apiUrl}/api/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          description: description,
          location: {
            lat: latitude,
            lng: longitude,
          },
          reminderDate: reminderDate
        }),
      });

      const {newTodos, taskId } = await response.json();  
      console.log( taskId )
      updateTodos( newTodos );      
      moveToNextStep( taskId )
    } 
    catch (error) {
      console.error('Error adding new todo:', error);
    }
  };


  return (
    <View style={stylesStep1.stepContainer}>
      <TextInput
        style={stylesStep1.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={stylesStep1.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TouchableOpacity
        style={stylesStep1.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>Select Reminder Date</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <>
         <Text>date chosen: { reminderDate.toLocaleDateString()}</Text> 
         <DateTimePicker
                testID="dateTimePicker"
                value={reminderDate}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || reminderDate;
                  setReminderDate(currentDate);
                }}
              />
        </>
      )}
      <Button title="save todo" onPress={() => handleAddTodo() } />
    </View>
  );
};

const stylesStep1 = StyleSheet.create({
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  input: {
    width: '100%',
    padding: 25,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dateButton: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
});

const StepTwo = ({ taskId, updateTodos , closeTaskCreation }) => {

  const [taskImage, setTaskImage] = useState(null);
   
  const handlePictureTaken = (photoUri) => {
      setTaskImage( photoUri );
  };

  const uploadImage = async ( ) => {
     try {
      const base64String = await convertImageToBase64( taskImage ); 
      const response = await fetch(`${apiUrl}/api/todos/${ taskId }/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64String
        }),
      });
      const { updatedTodos } = await response.json();  
      updateTodos( updatedTodos );
      closeTaskCreation();
    } 
    catch (error) {
      console.error('Error adding new todo:', error);
    }
  }

  return (
    <View style={styles.stepContainer}>
        <Text> Tag an image for the task </Text>
       
        <Camera returnImage={ handlePictureTaken } /> 
        <Button title="or, go back to view your tasks" onPress={closeTaskCreation } />
         { taskImage &&  <Button title="Submit Todo" onPress={ uploadImage } /> }
    </View>
  );
};


const AddTodoParent = ({ updateTodos }) => {
  
  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [currentTaskId, setCurrentTaskId ] = useState(null);

  const moveToNextStep = ( taskCreatedId ) =>{
     setStep(step + 1);
     setCurrentTaskId( taskCreatedId );
  };

  const closeTaskCreation = ( ) => {
    setModalVisible( false )
    setStep( 1 );
  };

  return (
    <View style={styles.container}>
      <Button title="Add New Todo" onPress={() => setModalVisible(true)} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
         <View style={styles.centeredView}>
         
          <View style={styles.modalView}> 
          <Button title="x" onPress={() => setModalVisible(false)} />
            { step === 1 && <StepOne updateTodos={ updateTodos } moveToNextStep={ moveToNextStep } /> }
            { step === 2 && <StepTwo updateTodos={ updateTodos } taskId={ currentTaskId } closeTaskCreation={ closeTaskCreation } /> }
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: for dark overlay
  },
  modalView: {
    width: '100%', // Take full width
    height: '100%', // Take full height
    backgroundColor: 'white',
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  }
});

export default AddTodoParent;
export {
  StepOne
}
