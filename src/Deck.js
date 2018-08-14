import React, { PureComponent } from 'react';
import { View, Animated } from 'react-native';

class Deck extends PureComponent {
  renderCards() {
    return this.props.data.map(item => {
      return this.props.renderCard(item);
    });
  }
  render() {
    return (
      <View>
        {this.renderCards()}
      </View>
    );
  }
}

export default Deck;
