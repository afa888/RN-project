import AsyncStorage from '@react-native-community/async-storage';

// 记住用户名密码
export const RememberUserKey = '@should_save_account_key';
export const UserNameKey = '@saved_user_name_key';
export const UserPwdKey = '@saved_user_password_key';
// 存储用户登录状态的key
export const LoginStateKey = '@loginState';

export const UserSession = {
    isLogin: false,     // 用户是否已经登录
    agencyStatus: 2,    // 无限代理的状态（0：正常，1：停用，2：尚未加入，-1：错误或平台尚未开通无限代理）
}

/**
 *设置
 * @param key
 * @param value
 * @return {Promise<void>}
 */
export const setStoreData = async (key, value) => {
    if (key == LoginStateKey) {
        UserSession.isLogin = value.isLogin;
    }
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
        console.log(e)
    }
    console.log('Done.')
};

/**i
 * 获取
 * @param key
 * @return {Promise<string>}
 */
export const getStoreData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return JSON.parse(value);
        }
    } catch (e) {
        console.log(e)
    }
    console.log('Done.')
};

/**
 * 合并
 * @param key
 * @param value
 * @return {Promise<void>}
 */
export const mergeStoreData = async (key, value) => {
    try {
        await AsyncStorage.mergeItem(key, JSON.stringify(value));
        return { status: 'success' };
    } catch (e) {
        console.log(e)
    }
    console.log('Done.')
};

/**
 * 删除
 * @param key
 * @return {Promise<void>}
 */
export const removeStoreData = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {
        console.log(e)
    }
    console.log('Done.')
};

/**
 * 删除所有
 * @return {Promise<void>}
 */
export const clearAllStore = async () => {
    try {
        // await AsyncStorage.clear()
        UserSession.isLogin = false;
        let unDeletedKeys = [RememberUserKey, UserNameKey, UserPwdKey];
        AsyncStorage.getAllKeys().then((keys) => {
            let keyArr = keys.filter((key) => {
                return unDeletedKeys.indexOf(key) == -1;
            })
            return AsyncStorage.multiRemove(keyArr);
        }).catch(() => {
            console.error("Read All keys failed.");
        });
    } catch (e) {
        console.log(e)
    }
    console.log('Done.')
}

/**
 * 检查用户的登录状态
 * @returns {Promise<Boolean>}
 */
export const checkLoginState = async () => {
    try {
        const value = await AsyncStorage.getItem(LoginStateKey);
        UserSession.isLogin = value == null ? false : (JSON.parse(value)).isLogin;
        return UserSession.isLogin;
    } catch (e) {
        console.error(e);
    }
}