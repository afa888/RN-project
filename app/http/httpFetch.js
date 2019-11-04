import 'whatwg-fetch'
import qs from 'querystring';
import {Alert, DeviceEventEmitter} from 'react-native'
import {BASE_URL, RN_REALEASE} from "../utils/Config";
import {getStoreData, clearAllStore} from "./AsyncStorage";
import DeviceValue from '../utils/DeviceValue'

let baseUrl = ""
const http_fetch = (type, url, data) => {
    if (RN_REALEASE) {
        if (DeviceValue.baseUrl !== "") {
            baseUrl = DeviceValue.baseUrl;
        } else {
            baseUrl = BASE_URL;
        }
    } else {
        baseUrl = BASE_URL;
    }
    console.log("基础地址", baseUrl);
    return fetch(BASE_URL + url, {
        headers: new Headers({
            'Referer': BASE_URL,
            'Content-Type': 'application/x-www-form-urlencoded'
        }),
        credentials: 'include',
        method: type,
        body: data
    }).then(response => response.json()).then(res => {
        // 对响应数据处理
        if (res) {
            const status = Number(res.status);
            if (status === 500) {
                Alert.alert('服务器出错', '', [], {cancelable: true});
            } else if (status === 20004 || status === 20010) { // 登录超时和token失效的情况 => 清除信息，跳转登录页面
                clearAllStore();
                DeviceEventEmitter.emit('changeTabs', false); //改变Tabs内容广播
                DeviceEventEmitter.emit('login', false); //导航到login页面
            }
            return res;
        } else {
            return Promise.reject(res);
        }

    }).catch(err => console.log(err))
};

export default class http {
    /**
     * @discribe get 请求
     * loading 是否需要loading效果  true/false 如果需要显示loading 可以传入文字
     * @param (url, params, loading, alert)
     */
    static async get(url, params = {}, loading, text = '加载中...') {
        loading && global.openSpinner(text);
        try {
            let query = await qs.stringify(params);
            if (!params) {
                return await http_fetch('GET', url).then(res => {
                    loading && global.closeSpinner();
                    return res;
                });
            } else {
                return await http_fetch('GET', url + '?' + query).then(res => {
                    loading && global.closeSpinner();
                    return res;
                });
            }
        } catch (error) {
            loading && global.closeSpinner();
            return error
        }
    }

    /**
     * @discribe post 请求
     * loading 是否需要loading效果  true/false,如果需要显示loading 可以传入文字
     * @param (url, params, loading, alert)
     */
    static async post(url, params = {}, loading, text = '加载中...') {
        loading && global.openSpinner(text);
        try {
            return await http_fetch('POST', url, qs.stringify(params)).then(res => {
                loading && global.closeSpinner();
                return res;
            })
        } catch (error) {
            loading && global.closeSpinner();
            return error
        }
    }
}
