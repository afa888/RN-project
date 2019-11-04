/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow       Alert.alert(
 'Alert Title')
 */

import React, {Component} from 'react';
import SplashLoardingScreen from './app/components/screen/SplashLoardingScreen'
import {ToastAndroid, BackAndroid, BackHandler, View, StatusBar} from 'react-native'
import './app/http/spinner'
import ToastComponent from './app/tools/TXToastComponent'

type Props = {};

export default class App extends Component<Props> {

    componentWillMount() {//执行一次，在初始化render之前执行，
        BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
    }

    componentWillUnmount() {//当组件要被从界面上移除的时候，就会调用componentWillUnmount(),在这个函数中，可以做一些组件相关的清理工作，例如取消计时器、网络请求等
        BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }

    onBackAndroid = () => {
        //这里的路由信息是你自己项目中的，通过这个原理，我们还是可以提示一些其他信息，比如表单没填写完整等等

        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {//按第二次的时候，记录的时间+2000 >= 当前时间就可以退出
            //最近2秒内按过back键，可以退出应用。
            BackHandler.exitApp();//退出整个应用
            return false
        }
        this.lastBackPressed = Date.now();//按第一次的时候，记录时间
        ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);//显示提示信息
        return true;

    };

    render() {
        return (
            <View style={{flex: 1}}>
                <StatusBar backgroundColor="black"/>

                <SplashLoardingScreen/>

                <ToastComponent />
            </View>
        )
    }


}


