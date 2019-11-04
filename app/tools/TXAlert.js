import { Alert } from 'react-native';

export const TXAlert =  (msg) => {
    setTimeout(() =>{
        Alert.alert(msg,'',[],{ cancelable: true })
    },600)
};
