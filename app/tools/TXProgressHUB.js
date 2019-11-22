import React from "react";
// import RNProgressHUB from 'react-native-progresshub';
import ProgressHUD from "./src/ProgressHUD";
import HUD from "./src/HUD";
import MyToast from "./src/MyToast"
import {Platform}from'react-native';
import RNProgressHUB from 'react-native-progresshub';

export default class TXProgressHUB {

    /**
     * 显示toast
     * @param text
     * @param duration 默认 3 秒
     */
    static show(text, duration=3000) {
        // RNProgressHUB.showSimpleText(text,duration)
        if (Platform.OS == 'ios') {
            RNProgressHUB.showSimpleText(text,duration);
        }else {
            // MyToast.showText(text);
            RNProgressHUB.showSimpleText(text,duration);
        }
    }

    static showSpinIndeterminate(text) {
        if (Platform.OS == 'ios') {
            RNProgressHUB.showSpinIndeterminate(text);
        }else {
            RNProgressHUB.showSpinIndeterminate();
        }
        
    }
 
    /**
     * 关闭toast
     * closeToast
     * @param duration
     */
    static close(duration) {
        if (Platform.OS == 'ios') {
            RNProgressHUB.dismiss();
        }else {
            RNProgressHUB.dismiss();
        }
    }

    static dismiss () {
        if (Platform.OS == 'ios') {
            RNProgressHUB.dismiss();
        }else {
            RNProgressHUB.dismiss();
        }
        
    }

    /**
     * 网络错误
     */
    static netError() {
        this.show('网络错误，请稍后重试！')
    }
}