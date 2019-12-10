import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, ScrollView } from 'react-native';
import { ListItem, Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/EvilIcons';

export default function App() {

  //tehdään statet joihin tiedot inputeista ja apista asetetaan
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [due, setDue] = useState('');
  const [todos, setTodos] = useState([]);

  //luodaan inputtien tyhjennys
  const input1 = React.createRef();
  const input2 = React.createRef();
  const input3 = React.createRef();
  
  //haetaan todot heti kun sovellus käynnistyy
  React.useEffect(() => { 
    fetchTodos()    
  }, []);

  //luodaan urli
  const url = 'https://teknologiaserveri.herokuapp.com/api/v1/todos';

  //luodaan fetch joka hakee todot tietokannasta
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

  //lisätään uusi todo
  //lähettää post pyynnön serverille ja sen mukana bodyn johon tiedot on talletettu
  //tyhjentää inputit sen jälkeen kun todo on lisätty
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

  //poistetaan todo lähettämällä delete pyyntö serverille
  //saa id:n parametrina listasta
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
      <Text style={{textAlign: 'center', fontSize: 25}}>Lisää tehtävä</Text>
      <Input                                               //asetetaan inputeista tuleva data stateihin
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

      <Button 
        type="outline" 
        onPress={addTodo}       //kutsuu addTodo metodia joka tallentaa todon
        buttonStyle={{
          marginTop: 20,
          marginBottom: 10,
          marginRight: 10,
          marginLeft:10,
          borderColor: 'grey',
        }}
        titleStyle={{
          color: 'grey',
          fontSize: 18
        }}
        title=" Lisää " />
      <ScrollView>
        <Text style={{textAlign: 'center', fontSize: 25, paddingTop: 10}}>Muistilista</Text>
        {
          todos.map((todo) => (       //käydään läpi todos taulukko ja tuodaan sieltä tiedot listaan
            <ListItem
              key={todo.id}           //indexinä toimii todon oma id
              title={todo.title}
              titleStyle={{fontSize: 20}}
              subtitle={
                <View>
                  <Text>{todo.description}</Text>
                  <Text>{todo.due}</Text>
                </View>
              }
              subtitleStyle={{fontSize: 15}}
              rightIcon={
                <Icon 
                  name="close-o" 
                  color="red" 
                  size={30} 
                  onPress={() => deleteTodo(todo.id)}   //lähetetään todon id delete metodille
                /> 
              }
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
    marginTop: 50,
    marginLeft: 15,
    marginRight: 15
  },
});
