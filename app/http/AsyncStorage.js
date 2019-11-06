import AsyncStorage from '@react-native-community/async-storage';

// 记住用户名密码
export const RememberUserKey = '@should_save_account_key';
export const UserNameKey = '@saved_user_name_key';
export const UserPwdKey = '@saved_user_password_key';

/**
 *设置
 * @param key
 * @param value
 * @return {Promise<void>}
 */
export const setStoreData = async (key,value) => {
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
        if(value !== null) {
            return JSON.parse(value);
        }
    } catch(e) {
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
export const mergeStoreData = async (key,value) => {
    try {
        await AsyncStorage.mergeItem(key, JSON.stringify(value));
        return {status:'success'};
    } catch(e) {
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
    } catch(e) {
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
        let unDeletedKeys = [RememberUserKey, UserNameKey, UserPwdKey];
        AsyncStorage.getAllKeys().then((keys) => {
            let keyArr = keys.filter((key) => {
                return unDeletedKeys.indexOf(key) == -1;
            })
            return AsyncStorage.multiRemove(keyArr);
        }).catch(() => {
            console.error("Read All keys failed.");
        });
    } catch(e) {
        console.log(e)
    }
    console.log('Done.')
}

