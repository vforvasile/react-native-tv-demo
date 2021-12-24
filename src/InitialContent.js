import React, {useRef, useState} from 'react';
import {Clipboard, StyleSheet, Text, TextInput, View} from 'react-native';
import {navigate} from './Navigation';
import Style from './styles/Style';
import FocusableHighlight from './components/focusable/FocusableHighlight';
import FocusableOpacity from './components/focusable/FocusableOpacity';
import {navigationList} from './utils';
import useNodeHandle from './hooks/useNodeHandle';

const InitialContent = () => {
  const [inputUrl, setUrl] = useState(undefined);
  const [activeInput, setActiveInput] = useState(false);
  const [valueSubmitted, onSubmit] = useState(false);
  const [textInputFocused, setTextInputFocused] = useState(false);

  const inputTextRef = useRef(null);

  return (
    <View style={styles.left}>
      <Text style={styles.title}>Yoga Medicine</Text>
      <View style={{flexDirection: 'row'}}>
        {navigationList.map((item, index) => (
          <FocusableHighlight
            nativeID={`top_${item.value}`}
            key={item.value}
            onPress={() => {
              navigate('YogaMedicine', {path: item.value});
            }}
            underlayColor={Style.buttonFocusedColor}
            styleFocused={{backgroundColor: '#039be5'}}
            style={styles.menuItem}>
            <Text style={styles.text}>{item.name}</Text>
          </FocusableHighlight>
        ))}
      </View>

      <Text style={styles.title}>Search or Browse</Text>

      <View style={{flexDirection: 'row'}}>
        <FocusableHighlight
          nativeID="left_bottom"
          onPress={() => {
            setUrl('');
          }}
          underlayColor={Style.buttonFocusedColor}
          styleFocused={{backgroundColor: '#039be5'}}
          style={styles.smallMenuItem}>
          <Text style={styles.text}>Clear</Text>
        </FocusableHighlight>

        <View
          style={{
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {/* {!activeInput ? ( */}
          <FocusableHighlight
            nativeID="center_bottom_button"
            onPress={() => {
              setActiveInput(true);
              if (inputTextRef && inputTextRef.current) {
                inputTextRef.current.focus();
              }
            }}
            underlayColor={Style.buttonFocusedColor}
            styleFocused={{backgroundColor: '#039be5'}}
            style={[
              styles.bigMenuItem,
              activeInput ? {backgroundColor: '#039be5'} : {},
            ]}>
            <Text numberOfLines={1} style={styles.text}>
              {inputUrl ? inputUrl : 'Add direct link or Search Google'}
            </Text>
          </FocusableHighlight>
          {/* ) : ( */}
          <TextInput
            // nextFocusLeft={useNodeHandle(searchRef)}
            // nextFocusRight={useNodeHandle(searchRef)}
            nativeID="center_bottom_textinput"
            ref={inputTextRef}
            value={inputUrl}
            disabled={!activeInput}
            onChangeText={(text) => setUrl(text)}
            placeholder=""
            placeholderTextColor={'transparent'}
            numberOfLines={1}
            clearButtonMode={'always'}
            autoCorrect={false}
            autoFocus={false}
            selectionColor="#f73378"
            onBlur={() => setActiveInput(false)}
            onFocus={async () => {
              // setTextInputFocused(true);
              const data = await Clipboard.getString();
              if (!data) {
                return;
              }
              if (data.startsWith('https')) {
                setUrl(data);
              }
            }}
            style={[
              styles.inputStyle,
              {
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                color: 'transparent',
              },
            ]}
            onSubmitEditing={() => {
              console.log('submit', inputUrl);
              setActiveInput(false);
              onSubmit(true);
            }}
          />
          {/* )} */}
        </View>

        <FocusableHighlight
          hasTVPreferredFocus={true}
          nativeID="right_bottom"
          // hasTVPrefferedFocus
          onPress={() => {
            // navigate('Browser', {searchName: 'hello'});
          }}
          underlayColor={Style.buttonFocusedColor}
          styleFocused={{backgroundColor: '#039be5'}}
          style={styles.smallMenuItem}>
          <Text style={styles.text}>Search</Text>
        </FocusableHighlight>
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
  inputStyle: {
    width: '100%',
    // height: Style.px(70),
    padding: Style.px(10),
    fontSize: Style.px(40),
    // color: '#fff',
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
  bigMenuItem: {
    width: Style.px(850),
    height: Style.px(90),
    padding: Style.px(10),

    // margin: Style.px(50),
    backgroundColor: Style.buttonUnfocusedColor,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  smallMenuItem: {
    width: Style.px(180),
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
