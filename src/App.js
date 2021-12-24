import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Clipboard,
  Text,
  TextInput,
  Platform,
  ScrollView,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './Navigation';
import AppProvider from './AppProvider';
import Style from './styles/Style';
import Menu from './components/Menu';
import Content from './components/Content';

// Enable screens
import {enableScreens} from 'react-native-screens';
import WebView from 'react-native-webview';
import FocusableOpacity from './components/focusable/FocusableOpacity';
import FocusableButton from './components/focusable/FocusableButton';
import InputDemo from './components/demos/InputDemo';
import FocusableHighlight from './components/focusable/FocusableHighlight';
enableScreens();

const ORIGINAL_URL = 'https://practice.yogamedicine.com/my-playlists/';

const jsCode = `
const iframe = document.querySelector('.vimeo-js');
const player = new Vimeo.Player(iframe);
if(!player)return;
player.requestFullscreen().then(function() {
  // the player entered fullscreen
}).catch(function(error) {
  console.log("error",error)
  // an error occurred
});
player.play();

`;

const removeEditOptions = `
const removeElements = (elms) => elms.forEach(el => el.remove());
// Use like:
removeElements(document.querySelectorAll(".for_owner"));
removeElements(document.querySelectorAll(".remove-playlist"));
removeElements(document.querySelectorAll('#woocommerce-product-search-field-0'));

`;

const appendButtonScript = `

  const enableFullScreen = ()=> {
    const iframe = document.querySelector('.vimeo-js');
    const player = new Vimeo.Player(iframe);
    if(!player)return;
    player.requestFullscreen().then(function() {
      setTimeout(()=> {
        player.play();
      },1000)

      // the player entered fullscreen
    }).catch(function(error) {
      console.log("error",error)
      // an error occurred
    });
  }
	var buttonEl = document.createElement("BUTTON");
	var buttonTextEl = document.createElement("span");
	buttonTextEl.className = "success lowercase";
	buttonTextEl.innerText = "Play in FullScreen";
	buttonEl.appendChild(buttonTextEl);

  buttonEl.className = "button success lowercase expand";
	buttonEl.onclick = enableFullScreen;
  buttonEl.type="button";
  // const docs = document.getElementsByClassName('video-big');
  // if(!docs)return;
  // const [first] = docs;
  // first.appendChild(buttonEl);
	document.getElementById('content').prepend(buttonEl);
`;

const App = () => {
  const [currentPath, setPath] = useState(ORIGINAL_URL);
  const [inputUrl, setUrl] = useState(undefined);
  const [valueSubmitted, onSubmit] = useState(false);
  const [textInputFocused, setTextInputFocused] = useState(false);

  const inputTextRef = useRef(null);
  const webviewRef = useRef(null);

  const showSearch = !currentPath.startsWith(
    'https://practice.yogamedicine.com/video_library/',
  );

  console.log('aaaa', currentPath.split('.'));

  useEffect(() => {
    Clipboard.setString('vasile@planable.io');
  }, []);

  const getInputURL = () => {
    if (!inputUrl || !valueSubmitted) {
      return ORIGINAL_URL;
    }
    if (inputUrl.startsWith('https://')) {
      return inputUrl;
    }
    return `https://www.google.com/search?q=${inputUrl}`;
  };

  // const enableFullScreen = ()=> {
  //   const iframe = document.querySelector('.vimeo-js');
  //   const player = new Vimeo.Player(iframe);
  //   player.requestFullscreen().then(function() {
  //     // the player entered fullscreen
  //   }).catch(function(error) {
  //     console.log("error",error)
  //     // an error occurred
  //   });
  // }

  return (
    <AppProvider>
      <NavigationContainer ref={navigationRef}>
        <View style={styles.app}>
          {/* <View style={{padding: 10}}>
            {!showSearch && (
              <FocusableButton
                // color='transparent'
                colorFocused="red"
                // colorPressed='grey'
                style={{width: 50, height: 50, alignSelf: 'center'}}
                onPress={() => {
                  webviewRef.current.injectJavaScript(jsCode);
                }}
                title="Fullscreen"
              />
            )}
          </View> */}
          {showSearch && (
            <View style={{flexDirection: 'row'}}>
              <FocusableOpacity
                onPress={() => {
                  setUrl('');
                }}
                underlayColor={Style.buttonUnfocusedColor}
                styleFocused={{backgroundColor: Style.buttonFocusedColor}}
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
                <View
                  style={[
                    styles.textInputContainer,
                    textInputFocused && styles.textInputContainerFocused,
                  ]}>
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
                    }}
                    onSubmitEditing={() => {
                      console.log('sbumit', inputUrl);
                      if (!inputUrl) {
                        return;
                      }
                      onSubmit(true);
                    }}
                  />
                  {Platform.OS === 'android' && (
                    <FocusableHighlight
                      onPress={() => {
                        if (inputTextRef.current) {
                          inputTextRef.current.focus();
                        }
                      }}
                      hasTVPrefferedFocus={true}
                      onFocus={() => {
                        setTextInputFocused(true);
                      }}
                      onBlur={() => {
                        setTextInputFocused(false);
                      }}
                      // styleFocused="grey"s
                      style={{
                        // position: 'absolute',
                        // width: Style.px(20),
                        // height: Style.px(20),
                        backgroundColor: 'transparent',
                      }}>
                      <Text />
                    </FocusableHighlight>
                  )}
                </View>
              </View>
            </View>
          )}
          <WebView
            ref={webviewRef}
            // ?playsinline=0 // attempt to autopaly
            // remove all .for-owner elements
            // scalesPageToFit={false}

            // video-big push a button upon entering there
            allowsFullscreenVideo
            injectedJavaScript={
              !showSearch ? appendButtonScript : removeEditOptions
            }
            // style={{flex: 1}}
            onNavigationStateChange={(state) => {
              setPath(state.url);
            }}
            // pointerEvents='box-only'
            focusable
            isTVSelectable
            hasTVPreferredFocus
            source={{
              uri: getInputURL(),
            }}
          />

          {/* <Menu />
          <Content /> */}
        </View>
      </NavigationContainer>
    </AppProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  app: {
    width: Style.px(1920),
    height: Style.px(1080),
    // flex: 1,s
    // flexDirection: 'row',
    // position: 'relative',
  },
  textInputContainer: {
    position: 'absolute',
    top: 0,
    width: Style.px(680),
    height: Style.px(80),
    backgroundColor: 'white',
    borderColor: 'transparent',
    borderRadius: Style.px(5),
    borderWidth: Style.px(5),
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputContainerFocused: {
    borderColor: '#61dafb',
  },
  textInput: {
    width: Style.px(600),
    height: Style.px(70),
    padding: Style.px(10),
    fontSize: Style.px(40),
  },
  textInputClearButton: {
    width: Style.px(50),
    height: Style.px(50),
    marginLeft: Style.px(10),
    marginRight: Style.px(10),
    borderRadius: Style.px(5),
    borderWidth: Style.px(5),
    borderColor: 'transparent',
  },
  textInputClearButtonFocused: {
    borderColor: '#61dafb',
  },
  textInputClearImage: {
    width: Style.px(40),
    height: Style.px(40),
  },
});
