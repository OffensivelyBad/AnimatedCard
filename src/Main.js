import React, { PureComponent } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { Card } from 'react-native-elements';
import Deck from './Deck';

const DATA = [
  { id: 1, text: 'Card #1', uri: 'https://giphy.com/static/img/labs.gif' },
  { id: 2, text: 'Card #2', uri: 'https://img-9gag-fun.9cache.com/photo/am920Oj_700b.jpg' },
  // { id: 3, text: 'Card #3', uri: 'https://camo.githubusercontent.com/c5d004381891a83bdb87f7632fe54709edca555e/687474703a2f2f692e696d6775722e636f6d2f53424c5246536f2e706e67' },
  // { id: 4, text: 'Card #4', uri: 'https://jokideo.com/wp-content/uploads/meme/2017/02/If-you-have-a-problem-with-me---meme.jpg' },
  // { id: 5, text: 'Card #5', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-04.jpg' },
  // { id: 6, text: 'Card #6', uri: 'http://www.fluxdigital.co/wp-content/uploads/2015/04/Unsplash.jpg' },
  // { id: 7, text: 'Card #7', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-09.jpg' },
  // { id: 8, text: 'Card #8', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-01.jpg' },
];

const DATA2 = [
  // { id: 1, text: 'Card #1', uri: 'https://giphy.com/static/img/labs.gif' },
  // { id: 2, text: 'Card #2', uri: 'https://img-9gag-fun.9cache.com/photo/am920Oj_700b.jpg' },
  { id: 3, text: 'Card #3', uri: 'https://camo.githubusercontent.com/c5d004381891a83bdb87f7632fe54709edca555e/687474703a2f2f692e696d6775722e636f6d2f53424c5246536f2e706e67' },
  { id: 4, text: 'Card #4', uri: 'https://jokideo.com/wp-content/uploads/meme/2017/02/If-you-have-a-problem-with-me---meme.jpg' },
  // { id: 5, text: 'Card #5', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-04.jpg' },
  // { id: 6, text: 'Card #6', uri: 'http://www.fluxdigital.co/wp-content/uploads/2015/04/Unsplash.jpg' },
  // { id: 7, text: 'Card #7', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-09.jpg' },
  // { id: 8, text: 'Card #8', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-01.jpg' },
];

class Main extends PureComponent {

  constructor(props) {
    super(props);

    this.state = { data: DATA };
  }

  onButtonPress = () => {
    const newData = this.state.data === DATA ? DATA2 : DATA;
    this.setState({ data: newData });
  }

  renderCard = item => {
    return (
      <Card
        key={item.id}
        title={item.text}
        image={{ uri: item.uri }}
      >
        <Text style={{ marginBottom: 10 }}>
          I can do stuff
        </Text>
        <Button
          icon={{ name: 'code' }}
          backgroundColor='#ff2335'
          title='Do it!'
          onPress={ this.onButtonPress }
        />
      </Card>
    );
  }

  renderNoMoreCards = () => {
    return (
      <Card title="Done">
        <Text style={{ marginBottom: 10 }}>
          No more cards to swipe
        </Text>
        <Button
          backgroundColor='#ff2335'
          title='get more!'
          onPress={ this.onButtonPress }
        />
      </Card>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Deck 
          data={this.state.data} 
          renderCard={this.renderCard}
          renderNoMoreCards={this.renderNoMoreCards}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    top: 100
  },
});

export default Main;