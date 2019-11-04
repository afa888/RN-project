import React from "react";
import Toast from "react-native-easy-toast";
import {StyleSheet, Text, View,Alert} from 'react-native';

export default class TXToastManager {
    /**
     * 静态toast
     */
    static toast;

    /**
     * 显示toast
     * showToast
     * @param text
     * @param duration
     * @param callback
     */
    static show(text, duration, callback) {
        this.toast && this.toast.show(text, duration, callback);
    }

    /**
     * 关闭toast
     * closeToast
     * @param duration
     */
    static close(duration) {
        this.toast && this.toast.close(duration);
    }

    /**
     * 网络错误
     */
    static netError() {
        this.show('网络错误，请稍后重试！')
    }
}