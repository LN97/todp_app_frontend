import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Button, Modal } from 'react-native';
import { apiUrl } from '../../serverconfig';
import UpdateTask from './editTask';

const imagestyles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  stretch: {
    width: '100%',
    height: 150,
    resizeMode: 'stretch',
  },
});

const DisplayAnImageWithStyle = ({source}) => {
  return (
    <View style={imagestyles.container}>
      <Image
        style={imagestyles.stretch}
        source={{ uri: source }}
      />
    </View>
  );
};


const TodoItem = ({ item, updateTodos }) => {
  
  const [modalVisible, setModalVisible] = useState(false);

  const closeModalOnSave = () => setModalVisible( false );

  // Format createdAt date if available
  const formattedDate = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'No date';

  // Function to call the API and delete the todo item
  const deleteTodo = async () => {
    try {
      const response = await fetch(`${ apiUrl}/api/todos/${item._id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Problem deleting the todo item');
      }
      // Call the onDelete callback if provided, to update the UI accordingly
      let todos = await response.json();
      console.log( 'todos after deletion', response );
      updateTodos( todos );
    } catch (error) {
      console.error(error);
    }
  };

    // Function to toggle the status of the todo item
  const toggleStatus = async () => {
    try {
      const response = await fetch(`${ apiUrl}/api/todos/${item._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: !item.status,
        }),
      });
      if (!response.ok) {
        throw new Error('Problem updating the todo item status');
      }
      let updatedTodo = await response.json();
      updateTodos(updatedTodo); // Assuming updateTodos can handle individual todo updates
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.itemContainer}>

       <Modal
        animationType="slide"
        visible={ modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}>
          <UpdateTask updateTodos={ updateTodos } itemToEdit={ item } closeModalOnSave={ closeModalOnSave } />
      </Modal>

      <View>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    
      <Text> Description: {item.description}</Text>
      <Text> Complete By: {new Date( item.reminderDate ).toLocaleDateString()}</Text>
      <Text> Location for task: [ Lat: { item.location.lat } Lng: { item.location.lng } ] </Text>
      <Text>Created At: {formattedDate}</Text>

      { item.photoUri && 
        <DisplayAnImageWithStyle source={ item.photoUri } />
      }

      <View style={ styles.container }>
            <TouchableOpacity onPress={toggleStatus} style={[styles.statusButton, {backgroundColor: item.status ? 'lightgreen' : 'green'}]}>
              <Text style={styles.statusButtonText}>{item.status ? 'Completed' : 'Mark as Completed'} </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={deleteTodo} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>Del </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={ () => setModalVisible( true ) } style={styles.editButton }>
                <Text style={styles.editButtonText }> Edit </Text>
            </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
    flexDirection: 'row', // Align items in a row
    justifyContent: 'flex-end', // Align items to the right
    padding: 10, // Add some padding around
  },
  itemContainer: {
    padding: 20,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  title: {
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingHorizontal: 10, justifyContent: 'center',  paddingVertical: 10
  },
  editButton:{
    backgroundColor: 'blue', marginLeft: 10,
    paddingHorizontal: 10, justifyContent: 'center'
  },
  editButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  statusButton: {
    flex:1, marginRight: 10, justifyContent: 'center',
    backgroundColor: 'blue',
  },
  statusButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default TodoItem;
