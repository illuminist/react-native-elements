/*global require:true*/
/*eslint no-undef: "error"*/
/*eslint-disable no-console */
import times from 'lodash.times';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ViewPropTypes from '../config/ViewPropTypes';
import Icon from '../icons/Icon';

const styles = StyleSheet.create({
  outerContainer: {
    display: 'flex',
    // backgroundColor: '#cda',
    position: 'relative',
  },
  starContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    position: 'absolute',
  },
  blankStarContainer: {
    // backgroundColor: '#bcd',
  },
  fullStarContainer: {
    overflow: 'hidden',
    // backgroundColor: '#dcb',
  },
  star: {
    flex: 1,
  },
});

class Rating extends PureComponent {
  static defaultProps = {
    blankIconColor: '#FFC423',
    blankIconName: 'star-border',
    fractions: 0,
    fullIconColor: '#FFC423',
    fullIconName: 'star',
    iconSize: 40,
    maxValue: 5,
    onChangeValue: value => console.log('Attach function here', value),
    readonly: false,
    value: 3,
  };

  constructor(props) {
    super(props);

    const previewValue = new Animated.Value(0);

    this.panResponder = PanResponder.create({
      // Prevent pan response losing response on a component
      onPanResponderTerminationRequest: () => false,
      // Make pan response to response after drag move
      // allow user to touch an icon to set value
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: this.handlePanMove,
      onPanResponderRelease: this.handlePanRelease,
    });

    this.state = {
      startingValue: props.value,
      targetValue: 0,
      previewValue,
    };
  }

  componentDidMount = () => {
    this.setTargetValue(this.props.value);
  };

  componentDidUpdate = prevProps => {
    const { value } = this.props;
    if (prevProps.value !== value) {
      this.setState(
        {
          startingValue: value,
        },
        () => this.setTargetValue(value)
      );
    }
  };

  cleanValue = value => {
    const { fractions, readonly } = this.props;
    if (readonly) {
      // If is readonly then ignore value cleaning
      return value;
    }
    if (fractions > 0 && fractions < 1) {
      // Icon part division
      return Math.round(value / fractions) * fractions;
    }
    // Icon decimal division
    return Math.round(value * 10 ** fractions) / 10 ** fractions;
  };

  setTargetValue = value => {
    this.setState(
      {
        targetValue: this.cleanValue(value),
      },
      () => this.setPreviewValue(this.state.targetValue)
    );
  };

  setPreviewValue = value => {
    Animated.spring(this.state.previewValue, {
      toValue: value,
    }).start();
  };

  handleIconPress = value => () => {
    const cleanedValue = this.cleanValue(value);
    this.props.onChangeValue(cleanedValue);
    this.setState(
      {
        startingValue: cleanedValue,
      },
      this.setTargetValue(value)
    );
  };

  handlePanMove = (e, gesture) => {
    const { iconSize } = this.props;
    const { startingValue } = this.state;
    const dvalue = gesture.dx / iconSize;
    this.setTargetValue(startingValue + dvalue);
  };

  handlePanRelease = () => {
    const { onChangeValue } = this.props;
    const { targetValue: value } = this.state;
    onChangeValue(value);
    this.setState({
      startingValue: value,
    });
  };

  renderSingleStar = (iconName, iconColor, index) => {
    const { iconSize, readonly } = this.props;
    const star = (
      <Icon
        key={index}
        size={iconSize}
        style={styles.star}
        name={iconName}
        color={iconColor}
      />
    );
    if (readonly) {
      return star;
    }
    return (
      <TouchableOpacity key={index} onPress={this.handleIconPress(index + 1)}>
        {star}
      </TouchableOpacity>
    );
  };

  renderStars = (iconName, iconColor) => {
    const { maxValue } = this.props;
    return times(maxValue, i => this.renderSingleStar(iconName, iconColor, i));
  };

  render() {
    const {
      blankIconColor,
      blankIconName,
      fullIconColor,
      fullIconName,
      iconSize,
      maxValue,
      readonly,
      style,
    } = this.props;
    const { previewValue } = this.state;

    return (
      <View
        style={[
          styles.outerContainer,
          style,
          {
            height: iconSize,
            width: iconSize * maxValue,
          },
        ]}
        pointerEvents={readonly ? 'none' : 'auto'}
        {...(readonly ? {} : this.panResponder.panHandlers)}
      >
        <View style={[styles.starContainer, styles.blankStarContainer]}>
          {this.renderStars(blankIconName, blankIconColor)}
        </View>
        <Animated.View
          style={[
            styles.starContainer,
            styles.fullStarContainer,
            {
              width: previewValue.interpolate({
                inputRange: [0, maxValue],
                outputRange: [0, maxValue * iconSize],
                extrapolate: 'clamp',
              }),
            },
          ]}
        >
          {this.renderStars(fullIconName, fullIconColor)}
        </Animated.View>
      </View>
    );
  }
}

const fractionsType = (props, propName, componentName) => {
  if (props[propName]) {
    const value = props[propName];
    if (typeof value === 'number') {
      if (value < 0 || value > 20) {
        return new Error(
          `\`${propName}\` in \`${componentName}\` must be between 0 and 20`
        );
      }
      if (value > 1 && !Number.isInteger(value)) {
        return new Error(
          `\`${propName}\` in \`${componentName}\` must be either decimal in between 0 and 1 inclusively or be integer greater than 1`
        );
      }
      return null;
    }

    return new Error(
      `\`${propName}\` in \`${componentName}\` must be a number`
    );
  }
};

Rating.propTypes = {
  blankIconColor: PropTypes.string,
  blankIconName: PropTypes.string,
  fractions: fractionsType,
  fullIconColor: PropTypes.string,
  fullIconName: PropTypes.string,
  iconSize: PropTypes.number,
  maxValue: PropTypes.number,
  onChangeValue: PropTypes.func,
  readonly: PropTypes.bool,
  style: ViewPropTypes.style,
  value: PropTypes.number,
};

export default Rating;
