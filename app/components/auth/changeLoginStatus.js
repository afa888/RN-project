import {
    clearAllStore,
    setStoreData,
    mergeStoreData,
    LoginStateKey,
} from "../../http/AsyncStorage";
import {DeviceEventEmitter} from "react-native";
import httpBaseManager from "../../http/httpBaseManager"

/**
 * 登录、注册 后续操作
 * @param oData
 */
export const setLoginStore = (oData) => {
    setStoreData(LoginStateKey,
        {
            token: oData.token,
            session: oData.sessionId,
            userName: oData.userName,
            wallet: oData.wallet,
            integral: oData.integral,
            isLogin:true
        }).then((result) => {
            //登录状态存储成功后 获取用户基本信息
            httpBaseManager.baseRequest(); //登录成功后获取用户基础信息
        });
    if (oData.hasOwnProperty('password')) {
        mergeStoreData('userInfoState',
        {
            password: oData.password,
            mobile:oData.mobile
        });
    }

    DeviceEventEmitter.emit('changeTabs', true); //改变Tabs内容广播
};

/**
 * 退出登录 后续操作
 */
export const loginOutDo = (_this) => {
    clearAllStore();
    DeviceEventEmitter.emit('changeTabs', false); //改变Tabs内容广播
    _this.props.navigation.navigate('LoginService');
};
