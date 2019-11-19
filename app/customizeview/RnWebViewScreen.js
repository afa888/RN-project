import React, {Component} from 'react';

import {WebView} from 'react-native-webview';
import {NavigationActions} from "react-navigation";
import {DeviceEventEmitter, SafeAreaView} from "react-native";
import {BASE_H5_URL, BASE_URL, WEBNUM} from "../utils/Config";
import {highlightTrailingWhitespace} from 'jest-matcher-utils';
import { getStoreData, LoginStateKey} from "../http/AsyncStorage";
import AndroidNativeGameActiviy from "../customizeview/AndroidIosNativeGameActiviy";

let url
export default class RnWebViewScreen extends Component {
    static navigationOptions = {
        header: null,  //隐藏顶部导航栏
    };

    constructor(props) {
        super(props);
        this.state = {
            url: BASE_H5_URL + 'help',
        };


    }
    componentWillMount(): void {
        getStoreData(LoginStateKey).then((loginInfo) => {
            console.log("登入信息")
            console.log(loginInfo)
            url = "http://m.txbet1788.com/" + "Coupon?token=" + loginInfo.token
            this.setState({url:url})
        });
    }


    render() {//aboutOne
        console.log(url)
        return (
            <SafeAreaView style={{flex: 1}}>
                <WebView
                    automaticallyAdjustContentInsets={false}
                    source={{uri: url}}
                    // source={{ uri: this.state.url }}
                    javaScriptEnabled={true}
                />
            </SafeAreaView>
        )
    }
}

