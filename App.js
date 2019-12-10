import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, TextInput, Button } from 'react-native';
import { ListItem } from 'react-native-elements';

export default function App() {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [due, setDue] = useState('');
  const [todos, setTodos] = useState([]);
  
  React.useEffect(() => { 
    fetchTodos()    
  }, []);

  fetchTodos = () => {

    const url = 'https://teknologiaserveri.herokuapp.com/api/v1/todos';
    fetch(url)
    .then((response) =>  response.json())
    .then((responseJson) =>  { 
      setTodos(responseJson);
      console.log(responseJson);
      console.log("testi");  
    })
    .catch((error) => { 
      Alert.alert('Error',  error); 
    });  
  
  }

  addTodo = () => {
    fetch('https://teknologiaserveri.herokuapp.com/api/v1/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: title,
          description: description,
          due: due
        })
      })
      .then(response => fetchTodos())
      .catch((error) => { 
        Alert.alert('Error',  error); 
      }); 
}

  return (
    <View style={styles.container}>
      <TextInput 
        style={{fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={title => setTitle(title)}
        value={title}
      />
      <TextInput 
        style={{fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={description => setDescription(description)}
        value={description}
      />
      <TextInput 
        style={{fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
        onChangeText={due => setDue(due)}
        value={due}
      />

      <Button onPress={addTodo} title=" Lisää " />
      <ScrollView>
      {
      todos.map((todo, index) => (
        <ListItem
          key={index}
          title={todo.title}
          titleStyle={{fontSize: 20}}
          subtitle={todo.description}
          subtitleStyle={{fontSize: 20}}
          bottomDivider
        />
      ))
    }
    
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 50
 //   alignItems: 'center',
  //  justifyContent: 'center',
  },
});
