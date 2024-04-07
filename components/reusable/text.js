import React from 'react';
import {Text, StyleSheet} from 'react-native';

const CustomText = ({children, fontSize = 16}) => (
  <Text style={[styles.text, {fontSize}]}>{children}</Text>
);

const styles = StyleSheet.create({
  text: {
    // You can set default styles that apply to all text using this component
    color: 'black',
  },
});

export default CustomText;
