import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TodoList from './todoList';
import { apiUrl } from '../../serverconfig';

const App = () => {
  const [todos, setTodos] = useState([]);

   useEffect(() => {
    fetchTodos();
  }, []);

  const updateTodos = ( newState ) => {
      setTodos( newState );
  }

  const fetchTodos = async () => {
    try {
      // Replace 'YOUR_LOCAL_IP' with your actual local IP address
      const response = await fetch(`${ apiUrl}/api/todos`);
      const data = await response.json();
      console.log( 'todos', data );
      setTodos( data )
    } 
    catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  // // loading the array on component mount.
  // useEffect(() => {

  //   // Load todos from AsyncStorage when the app loads
  //   const loadTodos = async () => {
  //     try {
  //       const todosJSON = await AsyncStorage.getItem('todos');
  //       if (todosJSON !== null) {
  //         setTodos(JSON.parse(todosJSON));
  //       }
  //     } catch (e) {
  //       Alert.alert('Failed to load todos');
  //     }
  //   };

  //   loadTodos();
  // }, []);


  return (
    <View style={styles.container}>
         <TodoList todos={todos} updateTodos={ updateTodos } />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
