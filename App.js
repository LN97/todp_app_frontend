
import React from 'react';
import {Text, SafeAreaView, StyleSheet, View, ScrollView, Image } from 'react-native';
import Todos from './components/todos';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
        <Image source={require('./assets/todologo.png')} style={{ width: 50, height: 50 }} />
      </View>
        <Text style={styles.headerText}>
            Todo App
        </Text>
      </View>
  
      {/* Content */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
            <Todos />
        </View>
      </ScrollView>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height:80,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1
  },
  content: {
    padding: 20,
  },
});

export default App;
