import React, { Component } from 'react';

import { WebView } from 'react-native-webview';
import { NavigationActions } from "react-navigation";
import { SafeAreaView } from "react-native";
import { BASE_H5_URL } from "../../../utils/Config";
import { highlightTrailingWhitespace } from 'jest-matcher-utils';

export default class HelpScreen extends Component {
    static navigationOptions = {
        header: null,  //隐藏顶部导航栏
    };

    constructor(props) {
        super(props);

        this.state = {
            url: BASE_H5_URL + 'help',
        };
    }

    /**
     * 接受 H5 window.ReactNativeWebView.postMessage('') 传递过来的事件
     * @private
     */
    _handleMessage() {
        this.props.navigation.dispatch(NavigationActions.back());
    }

    render() {//aboutOne
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <WebView
                    automaticallyAdjustContentInsets={false}
                    source={{uri: 'http://192.168.104.2:480/help'}}
                    // source={{ uri: this.state.url }}
                    javaScriptEnabled={true}
                    onMessage={this._handleMessage.bind(this)}
                />
            </SafeAreaView>
        )
    }
}

