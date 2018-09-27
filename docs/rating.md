---
id: rating
title: Rating
---

An extendable Ratings components for React Native with gestures and an intuitive API

> This component was inspired from [react-native-ratings](https://github.com/Monte9/react-native-ratings) by [Monte Thakkar](https://github.com/Monte9).

```js
import { Rating } from 'react-native-elements';

handleRatingChange(rating) {
  console.log("Rating is: " + rating)
}

<Rating
  onValueChange={this.handleRatingChange}
  style={{ paddingVertical: 24 }}
/>

<Rating
  blankIconColor="#FF918E"
  blankIconName="favorite-border"
  fullIconColor="#FF1C16"
  fullIconName="favorite"
  fractions={1}
  value={3.6}
  readonly
  iconSize={60}
  style={{ paddingVertical: 24 }}
/>

<Rating
  blankIconColor="#A8C1AF"
  blankIconName="school"
  fullIconColor="#20BB34"
  fullIconName="school"
  maxValue={10}
  iconSize={24}
  fractions={0.5}
  value={8.5}
  onValueChange={this.handleRatingChange}
  style={{ paddingVertical: 24 }}
/>
```

##### Read-only mode

```js
const { rating } = this.props;

<Rating
  iconSize={20}
  readonly
  value={rating}
  style={{ styles.rating }}
/>
```

##### Fractions

```html
<Rating fractions={1} startingValue={3.3} />
<Rating fractions={0.25} startingValue={4.75} />
```

---

### Props

* [`onValueChange`](#onValueChange)
* [`blankIconColor`](#blankIconColor)
* [`blankIconName`](#blankIconName)
* [`fullIconColor`](#fullIconColor)
* [`fullIconName`](#fullIconName)
* [`fractions`](#fractions)
* [`iconSize`](#iconSize)
* [`maxValue`](#maxValue)
* [`value`](#value)
* [`readonly`](#readonly)
* [`style`](#style)

---

# Reference

### `onValueChange`

Callback method when the user finishes rating. Gives you the final rating value as a whole number **(required)**

|   Type   | Default |
| :------: | :-----: |
| function |  none   |

---

### `blankIconColor`

Pass in a color props for the background icon (optional)

|      Type      |  Default  |
| :------------: | :-------: |
| string (color) |  #FFC423  |

---

### `blankIconName`

Pass in an icon name to be use as the background icons (optional)

|  Type  |    Default    |
| :----: | :-----------: |
| string |  star-border  |

---

### `fullIconColor`

Pass in a color props for the foreground icon (optional)

|      Type      |  Default  |
| :------------: | :-------: |
| string (color) |  #FFC423  |

---

### `fullIconName`

Pass in an icon name to be use as the foreground icons (optional)

|  Type  | Default |
| :----: | :-----: |
| string |  star   |

---### `fractions`

The number of decimal places for the rating value or a value of 1/x; must be between 0 and 20 (optional)

|  Type  | Default |
| :----: | :-----: |
| number |    0    |

---

### `iconSize`

The size of each rating icon (optional)

|  Type  | Default |
| :----: | :-----: |
| number |   40    |

---

### `maxValue`

The maximum value user can input. Represented by number of rating icon (optional)

|  Type  | Default |
| :----: | :-----: |
| number |    5    |

---

### `value`

The initial rating value (optional)

|  Type  | Default |
| :----: | :-----: |
| number |    3    |

---

### `readonly`

Whether the rating can be modiefied by the user (optional)

|  Type   | Default |
| :-----: | :-----: |
| boolean |  false  |

---

### `style`

Exposes style prop to add additonal styling to the container view (optional)

|   Type   | Default |
| :------: | :-----: |
| function |  none   |

