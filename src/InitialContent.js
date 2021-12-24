import React, {useRef, useState} from 'react';
import {Clipboard, StyleSheet, Text, TextInput, View} from 'react-native';
import {navigate} from './Navigation';
import Style from './styles/Style';
import FocusableHighlight from './components/focusable/FocusableHighlight';
import FocusableOpacity from './components/focusable/FocusableOpacity';

const navigationList = [
  {value: 'favorites', name: 'Favorites'},
  {value: 'my-playlists', name: 'Playlists'},
  {value: 'all-classes', name: 'All Classes'},
];

const InitialContent = () => {
  const [inputUrl, setUrl] = useState(undefined);
  const [valueSubmitted, onSubmit] = useState(false);
  const [textInputFocused, setTextInputFocused] = useState(false);

  const inputTextRef = useRef(null);

  return (
    <View style={styles.left}>
      <Text style={styles.title}>Yoga Medicine</Text>
      <View style={{flexDirection: 'row'}}>
        {navigationList.map((item) => (
          <FocusableHighlight
            key={item.value}
            onPress={() => {
              navigate('YogaMedicine', {path: item.value});
            }}
            underlayColor={Style.buttonFocusedColor}
            styleFocused={{backgroundColor: '#039be5'}}
            stylePressed={{backgroundColor: 'red'}}
            style={styles.menuItem}>
            <Text style={styles.text}>{item.name}</Text>
          </FocusableHighlight>
        ))}
      </View>

      <Text style={styles.title}>Search or Browse</Text>

      <View style={{flexDirection: 'row'}}>
        <FocusableOpacity
          onPress={() => {
            setUrl('');
          }}
          underlayColor={Style.buttonUnfocusedColor}
          styleFocused={{backgroundColor: '#039be5'}}
          stylePressed={{backgroundColor: Style.buttonPressedColor}}
          style={{
            width: Style.px(300),
            height: Style.px(50),
            margin: Style.px(10),
            backgroundColor: Style.buttonUnfocusedColor,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Clear</Text>
        </FocusableOpacity>
        <View style={styles.container}>
          <TextInput
            ref={inputTextRef}
            value={inputUrl}
            onChangeText={(text) => setUrl(text)}
            nativeID={'component_text_input'}
            placeholder={'Add direct link or Search Google'}
            placeholderTextColor={'gray'}
            clearButtonMode={'always'}
            autoCorrect={false}
            autoFocus={false}
            onFocus={async () => {
              setTextInputFocused(true);
              const data = await Clipboard.getString();
              if (!data) {
                return;
              }
              if (data.startsWith('https')) {
                setUrl(data);
              }
            }}
            style={{
              width: '100%',
              height: Style.px(70),
              padding: Style.px(10),
              fontSize: Style.px(40),
              color: '#fff',
            }}
            onSubmitEditing={() => {
              console.log('sbumit', inputUrl);
              if (!inputUrl) {
                return;
              }
              onSubmit(true);
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default InitialContent;

const styles = StyleSheet.create({
  left: {
    width: Style.px(1920),
    height: Style.px(1080),
    backgroundColor: Style.backgroundColor,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: Style.px(150),
    height: Style.px(100),
    margin: Style.px(100),
    marginBottom: Style.px(20),
    resizeMode: 'contain',
  },
  title: {
    fontSize: Style.px(50),
    fontWeight: 'bold',
    color: 'white',
    margin: 20,
  },
  menu: {
    width: Style.px(400),
    height: Style.px(800),
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    width: Style.px(400),
    height: Style.px(90),
    margin: Style.px(50),
    backgroundColor: Style.buttonUnfocusedColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: Style.px(40),
    color: '#fff',
    fontWeight: '500',
  },
});
