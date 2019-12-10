import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, ScrollView } from 'react-native';
import { ListItem, Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/EvilIcons';

export default function App() {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [due, setDue] = useState('');
  const [todos, setTodos] = useState([]);

  const input1 = React.createRef();
  const input2 = React.createRef();
  const input3 = React.createRef();
  
  React.useEffect(() => { 
    fetchTodos()    
  }, []);

  const url = 'https://teknologiaserveri.herokuapp.com/api/v1/todos';

  fetchTodos = () => {
    fetch(url)
    .then((response) =>  response.json())
    .then((responseJson) =>  { 
      setTodos(responseJson);
    })
    .catch((error) => { 
      Alert.alert('Error',  error); 
    });  
  
  }

  const addTodo = () => {
    fetch(url, {
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
      input1.current.clear(); 
      input2.current.clear(); 
      input3.current.clear(); 
    
}

const deleteTodo = (index) => {
      fetch(url + '/' + index.toString(), {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(response => fetchTodos())
      .catch((error) => { 
        Alert.alert('Error',  error); 
      });
  
}

  return (
    <View style={styles.container}>
      <Input 
        placeholder='Aihe'
        onChangeText={title => setTitle(title)}
        value={title}
        ref={input1}
      />
      <Input 
        placeholder='Kuvaus'
        onChangeText={description => setDescription(description)}
        value={description}
        ref={input2}
      />
      <Input 
        placeholder='Deadline'
        onChangeText={due => setDue(due)}
        value={due}
        ref={input3}
      />

      <Button onPress={addTodo} title=" Lisää " />
      <ScrollView>
      {
      todos.map((todo) => (
        <ListItem
          key={todo.id}
          title={todo.title}
          titleStyle={{fontSize: 20}}
          subtitle={
            <View>
          <Text>{todo.description}</Text>
          <Text>{todo.due}</Text>
            </View>
          }
        //  subtitle={todo.description}
          subtitleStyle={{fontSize: 15}}
          rightIcon={<Icon name="close-o" color="red" size={30} onPress={() => deleteTodo(todo.id)}/> }
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
