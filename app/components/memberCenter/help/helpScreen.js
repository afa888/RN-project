import React, {Component} from 'react';

import { WebView } from 'react-native-webview';
import {NavigationActions} from "react-navigation";
import {SafeAreaView} from "react-native";

export default class HelpScreen extends Component{
    static navigationOptions = {
        header: null,  //隐藏顶部导航栏
    };

    /**
     * 接受 H5 window.ReactNativeWebView.postMessage('') 传递过来的事件
     * @private
     */
    _handleMessage() {
        this.props.navigation.dispatch(NavigationActions.back());
    }


    render(){
        return(
            <SafeAreaView style={{flex:1}}>
                <WebView
                    automaticallyAdjustContentInsets={false}
                    source={{uri: 'http://192.168.104.2:480/help'}}
                    javaScriptEnabled={true}
                    onMessage={this._handleMessage.bind(this)}
                    />
            </SafeAreaView>
        )
    }
}

