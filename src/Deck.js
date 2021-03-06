import React, { PureComponent } from 'react';
import { 
  View, 
  Animated, 
  PanResponder, 
  Dimensions,
  UIManager,
  LayoutAnimation
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;
const SCALE_INCREMENTOR = 0.02;
const POSITION_INCREMENTOR = 12;
const PADDING = 5;

class Deck extends PureComponent {
  static defaultProps = {
    onSwipeRight: () => {},
    onSwipeLeft: () => {},
    renderNoMoreCards: () => {}
  };
  constructor(props) {
    super(props);

    this.setupCards();
    this.state = { index: 0 };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setupCards();
      this.setState({ index: 0 });
    }
  }

  componentWillUpdate() {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  }

  setupCards() {
    const position = new Animated.ValueXY();
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy })
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          this.forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          this.forceSwipe('left');
        } else {
          this.resetPosition();
        }
      }
    });

    var itemPositions = [];
    var itemScales = [];
    this.props.data.map((item, index) => {
      const newPosition = new Animated.ValueXY({ x: 0, y: POSITION_INCREMENTOR * index });
      itemPositions.push(newPosition);

      const newScale = new Animated.Value(1 - (index * SCALE_INCREMENTOR));
      itemScales.push(newScale);
    });

    this.itemPositions = itemPositions;
    this.itemScales = itemScales;
    this.panResponder = panResponder;
    this.position = position;
  }

  resetPosition() {
    Animated.spring(this.position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }

  onSwipeComplete(direction) {
    this.bounceUp();
    const { onSwipeRight, onSwipeLeft } = this.props;
    const item = this.props.data[this.state.index];

    direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
    this.setNextCard();
  }

  setNextCard() {
    this.setState({ index: this.state.index + 1 });
    this.position.setValue({ x: 0, y: 0 });
  }

  forceSwipe(direction) {
    const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(this.position, {
      toValue: { x, y: 0},
      duration: SWIPE_OUT_DURATION
    }).start(() => this.onSwipeComplete(direction));
  }

  getCardStyle() {
    const rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg']
    });

    return {
      ...this.position.getLayout(),
      transform: [{ rotate }]
    }
  }

  bounceUp() {
    const positionAnimations = this.itemPositions.map((position, ix) => {
      return (
        Animated.timing(position, {
          toValue: { x: 0, y: position.__getValue().y - POSITION_INCREMENTOR },
          duration: 100
        })
      );
    });

    var scaleAnimations = this.itemScales.map((scale, ix) => {
      return (
        Animated.timing(scale, {
          toValue: scale.__getValue() + SCALE_INCREMENTOR,
          duration: 100
        })
      );
    });
    Animated.sequence(scaleAnimations).start();
    Animated.sequence(positionAnimations).start();
  }

  renderCards() {
    if (this.state.index >= this.props.data.length) {
      return this.props.renderNoMoreCards()
    }

    return this.props.data.map((item, ix) => {
      if (ix < this.state.index) { return null }

      if (ix === this.state.index) {
        return (
          <Animated.View
            key={item.id}
            style={[this.getCardStyle(), styles.cardStyle, {zIndex:ix * -1}]}
            {...this.panResponder.panHandlers}
          >
            {this.props.renderCard(item)}
          </Animated.View>
        );
      }
      else {
        return (
          <Animated.View
            key={item.id} 
            style={[this.itemPositions[ix].getLayout(), { transform: [{ scale: this.itemScales[ix] }] }, styles.cardStyle, { zIndex: ix * -1 } ]}
          >
            {this.props.renderCard(item)}
          </Animated.View>
        );
      }
    });
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        {this.renderCards()}
      </View>
    );
  }
}

const styles = {
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH - (PADDING * 2),
    marginLeft: PADDING,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    alignSelf: 'center',
    flex: 1
  },
  containerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  }
}

export default Deck;
