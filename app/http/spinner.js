import {DeviceEventEmitter} from "react-native";

/**
 * 定义 Loadging 全局开关方法
 * 在 入口文件 APP.js 中引入
 */

global.openSpinner = (text) => {
    DeviceEventEmitter.emit('spinnerStatus', {show:true,text:text});
};

global.closeSpinner = () => {
    DeviceEventEmitter.emit('spinnerStatus', {show:false,text:''});
};