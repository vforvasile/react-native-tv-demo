import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Clipboard, StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
import Style from './styles/Style';

const BASE_URL = 'https://practice.yogamedicine.com/my-playlists/';

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

const YogaMedicine = () => {
  const [currentPath, setPath] = useState(BASE_URL);
  const [inputUrl, setUrl] = useState(undefined);
  const [valueSubmitted, onSubmit] = useState(false);
  const [textInputFocused, setTextInputFocused] = useState(false);

  const navigation = useNavigation();

  const route = useRoute();

  const inputTextRef = useRef(null);
  const webviewRef = useRef(null);

  const path = route && route.params && route.params.path;

  const showSearch = !currentPath.startsWith(
    'https://practice.yogamedicine.com/video_library/',
  );

  //   console.log('aaaa', currentPath.split('.'));

  useEffect(
    useCallback(() => {
      // Prevent react navigation to handle back button is player is fullscreen
      return navigation.addListener('beforeRemove', (e) => {
        console.log('before remove');
      });
    }, []),
  );

  useEffect(() => {
    Clipboard.setString('vasile@planable.io');
  }, []);

  //   const getInputURL = () => {
  //     if (!inputUrl || !valueSubmitted) {
  //       return ORIGINAL_URL;
  //     }
  //     if (inputUrl.startsWith('https://')) {
  //       return inputUrl;
  //     }
  //     return `https://www.google.com/search?q=${inputUrl}`;
  //   };

  return (
    <View style={styles.app}>
      <WebView
        ref={webviewRef}
        // ?playsinline=0 // attempt to autopaly
        // remove all .for-owner elements
        // scalesPageToFit={false}

        allowsFullscreenVideo
        injectedJavaScript={
          !showSearch ? appendButtonScript : removeEditOptions
        }
        // style={{flex: 1}}
        onNavigationStateChange={(state) => {
          setPath(state.url);
        }}
        focusable
        isTVSelectable
        hasTVPreferredFocus
        source={{
          uri: path ? `${BASE_URL}/${path}` : `${BASE_URL}/my-playlists`,
        }}
      />
    </View>
  );
};

export default YogaMedicine;

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
