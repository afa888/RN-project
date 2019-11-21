import React from "react";
// import RNProgressHUB from 'react-native-progresshub';
import ProgressHUD from "./src/ProgressHUD";
import HUD from "./src/HUD";
import MyToast from "./src/MyToast"
import {Platform} from 'react-native';

export default class TXProgressHUB {

    /**
     * 显示toast
     * @param text
     * @param duration 默认 3 秒
     */
    static show(text, duration=3000) {
        // RNProgressHUB.showSimpleText(text,duration)
        if (Platform.OS === "ios") {
            ProgressHUD.showText(text,duration);
        }
    }

    static showSpinIndeterminate(text) {
        if (Platform.OS === "ios") {
            ProgressHUD.showSpinIndeterminate(text);
        }
        
    }
 
    /**
     * 关闭toast
     * closeToast
     * @param duration
     */
    static close(duration) {
        if (Platform.OS === "ios") {
            ProgressHUD.dismiss();
        }
    }

    static dismiss () {
        if (Platform.OS === "ios") {
            ProgressHUD.dismiss();
        }
        
    }

    /**
     * 网络错误
     */
    static netError() {
        this.show('网络错误，请稍后重试！')
    }
}