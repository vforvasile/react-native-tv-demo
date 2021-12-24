import {useRoute} from '@react-navigation/native';
import React, {useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import WebView from 'react-native-webview';
import Style from './styles/Style';

const BrowserScreen = () => {
  const route = useRoute();
  const searchName = route && route.params && route.params.searchName;

  const webviewRef = useRef(null);

  const getInputURL = () => {
    if (searchName.startsWith('https://')) {
      return searchName;
    }
    return `https://www.google.com/search?q=${searchName}`;
  };

  return (
    <View style={styles.app}>
      <WebView
        ref={webviewRef}
        allowsFullscreenVideo
        // style={{flex: 1}}
        // onNavigationStateChange={(state) => {
        //   setPath(state.url);
        // }}
        focusable
        isTVSelectable
        hasTVPreferredFocus
        source={{
          uri: getInputURL(),
        }}
      />
    </View>
  );
};

export default BrowserScreen;

const styles = StyleSheet.create({
  app: {
    width: Style.px(1920),
    height: Style.px(1080),
  },
});
