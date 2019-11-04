import AsyncStorage from '@react-native-community/async-storage';

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
        await AsyncStorage.clear()
    } catch(e) {
        console.log(e)
    }
    console.log('Done.')
}

