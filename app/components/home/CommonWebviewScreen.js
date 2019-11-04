import React, {Component} from 'react';
import {Image,TouchableOpacity, StyleSheet, View, Text, Alert} from "react-native";
import { NavigationActions } from 'react-navigation';

import { WebView } from 'react-native-webview';

export default class CommonWebviewScreen extends Component<Props> {

    static navigationOptions = ({ navigation }) => {
        const {params} = navigation.state
        return {
            title:params.title,
            headerTitleStyle:{flex:1, textAlign: 'center'},//解决android 标题不居中问题
            headerBackTitle:null,
            headerLeft: (
                <TouchableOpacity onPress={() => {
                        navigation.dispatch(NavigationActions.back());
                    }}>
                        <Image source={require('../../static/img/titlebar_back_normal.png')}
                               style={{
                                   resizeMode: 'contain',
                                   width: 20,
                                   height: 20,
                                   margin: 12
                               }}/>
                    </TouchableOpacity>
              ),
            };
      };
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
    }

    showLoading = () => {
        // global.openSpinner('loading')
    }

    hideLoading = () => {
      // global.closeSpinner()
    }

    render() {
        const { params } = this.props.navigation.state;
        let js = '';
        if (params.url.indexOf("aboutOne") != -1){
          js = 'var header = document.getElementsByClassName(' + '\'TopHeader\''+')[0];header.style.display = \'none\';';
        }
        return (
            <WebView source={{uri:params.url}} injectedJavaScript = {js}
              onLoadStart = {this.showLoading}
              onLoadEnd = {this.hideLoading}
            />
        )
            
    }
}
const styles = StyleSheet.create({
    
});