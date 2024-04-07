import React from 'react';
import { View, FlatList } from 'react-native';
import TodoItem from './todoItem'; // Adjust the path as necessary
import AddTodo2 from './addTodo2';

const TodoList = ({ todos, updateTodos }) => {
  return (
    <View> 
      <AddTodo2 updateTodos={ updateTodos } />
      <FlatList
        data={todos}
        renderItem={({ item }) => <TodoItem item={item} updateTodos={ updateTodos } />}
        keyExtractor={item => item._id}
      />
     
    </View>
  );
};

export default TodoList;