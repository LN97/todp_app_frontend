import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { apiUrl } from '../../serverconfig';

export default function UpdateTask ({ itemToEdit, updateTodos, closeModalOnSave })  {
  let { _id, title, description, reminderDate } = itemToEdit;
  const [titleState, setTitle] = useState(title);
  const [descriptionState, setDescription] = useState(description);
  const [reminderDateState, setReminderDate] = useState(new Date(reminderDate));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleEditTodo = async () => {
    try {
      console.log('editing task')
      const response = await fetch(`${apiUrl}/api/todos/${ _id }`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: titleState,
          description: descriptionState,
          reminderDate: reminderDateState
        }),
      });

      const {newTodos } = await response.json();  
      updateTodos( newTodos );      
      closeModalOnSave();
    } 
    catch (error) {
      console.error('Error adding new todo:', error);
    }
  };

  return (
    <View style={stylesStep1.stepContainer}>
     <Button title="x" onPress={ () => closeModalOnSave() } /> 
      <TextInput
        style={stylesStep1.input}
        placeholder="Title"
        value={titleState}
        onChangeText={setTitle}
      />
      <TextInput
        style={stylesStep1.input}
        placeholder="Description"
        value={descriptionState}
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
         <Text>date chosen: { reminderDateState.toLocaleDateString()}</Text> 
         <DateTimePicker
                testID="dateTimePicker"
                value={reminderDateState}
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
      <Button title="save edited todo" onPress={() => handleEditTodo() } /> 
      
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