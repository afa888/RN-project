import React, {Component} from 'react';
import {StyleSheet, Text, View,Alert} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast'
import TXToastManager from './TXToastManager'

//Toast 提示
class ToastComponent extends React.Component {
    /**
     * 组件被移除的时候
     */
    componentWillUnmount() {
        TXToastManager.toast = null;
    }

    render() {
        return (<Toast position='center' ref={e => TXToastManager.toast = e}/>);
    }
}

export default ToastComponent;
