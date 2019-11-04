import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, TextInput, DeviceEventEmitter} from "react-native";
import {qq_validate, wechat_validate} from "../../../utils/Validate";
import http from "../../../http/httpFetch";
import TXToastManager from "../../../tools/TXToastManager";
import {mergeStoreData} from "../../../http/AsyncStorage";
import {NavigationActions} from "react-navigation";

export default class ContactSetting extends Component<Props>{
    static navigationOptions = ({navigation}) => {
        const {title} = navigation.state.params;
        return {
            title: title,
            headerTitleStyle:{flex:1, textAlign: 'center'},//解决android 标题不居中问题
            headerLeft: (
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <Image source={require('../../../static/img/titlebar_back_normal.png')}
                           style={{
                               resizeMode: 'contain',
                               width: 20,
                               height: 20,
                               margin: 12
                           }}/>
                </TouchableOpacity>
            )
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            inputVal:'',
            placeholderVal:''
        }
    }

    componentDidMount() {
        const {type} = this.props.navigation.state.params;
        this.setState({
            placeholderVal: (type === 2) ? '请输入微信号' : '请输入QQ号'
        });
    }

    submit(){
        const {uid,type} = this.props.navigation.state.params;
        let params = {
            uid: uid,
            type: type,
            content: this.state.inputVal
        };
        if( type === 2 ) { // 微信号
            if (!wechat_validate(params.content)) return;
        } else if( type === 3) { // QQ号
            if (!qq_validate(params.content)) return;
        }
        http.post('User/changeUser',params,true).then(res => {
            TXToastManager.show(res.msg);
            if(res.status === 10000){
                if(type === 2) {
                    mergeStoreData('userInfoState', { weixin: params.content }).then(() => {
                        DeviceEventEmitter.emit('bindSuccess','微信修改完成');
                        this.props.navigation.dispatch(NavigationActions.back());
                    });
                } else if (type === 3) {
                    mergeStoreData('userInfoState', { qq: params.content }).then(() => {
                        DeviceEventEmitter.emit('bindSuccess','QQ修改完成');
                        this.props.navigation.dispatch(NavigationActions.back());
                    });
                }
            }
        })
    }

    render(){
        return(
            <View style={{flex: 1, backgroundColor: '#efeff4'}}>
                <TextInput
                    style={{
                        marginTop:20,
                        paddingHorizontal:16,
                        height:60,
                        backgroundColor:'#fff'
                    }}
                    underlineColorAndroid='transparent'
                    placeholder= {this.state.placeholderVal}
                    maxLength={20}
                    value={ this.state.inputVal }
                    onChangeText={(val) => this.setState({inputVal: val.trim()})}
                />
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => this.submit()}
                        style={{
                            width: 320,
                            height: 46,
                            backgroundColor: '#cda469',
                            marginTop: 34,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 3
                        }}>
                        <Text style={{color: 'white'}}>提 交</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
