import React from "react";
// import RNProgressHUB from 'react-native-progresshub';

export default class TXProgressHUB {

    /**
     * 显示toast
     * @param text
     * @param duration 默认 3 秒
     */
    static show(text, duration=3000) {
        // RNProgressHUB.showSimpleText(text,duration)
    }

    static showSpinIndeterminate(text) {
        if (text) {
            // RNProgressHUB.showSpinIndeterminate(text);
        }else {
            // RNProgressHUB.showSpinIndeterminate();
        }
        
    }
 
    /**
     * 关闭toast
     * closeToast
     * @param duration
     */
    static close(duration) {
        // RNProgressHUB.dismiss();
    }

    static dismiss () {
        // RNProgressHUB.dismiss();
    }

    /**
     * 网络错误
     */
    static netError() {
        this.show('网络错误，请稍后重试！')
    }
}