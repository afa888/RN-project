import React, {Component} from 'react';
import {StyleSheet, View, Text, ImageBackground, Image, TouchableOpacity, ScrollView, SafeAreaView, DeviceEventEmitter} from "react-native";
import httpBaseManager from "../../../http/httpBaseManager";
import {category_group_divide_line_color} from "../../../utils/AllColor";
import MidBalanceShow from './midBalanceShow'
import MainEntrance from './mainEntrance'
import {getStoreData} from "../../../http/AsyncStorage";
import AndroidIosNativeGameActiviy from "../../../customizeview/AndroidIosNativeGameActiviy";
import http from "../../../http/httpFetch";
import {CAGENT} from "../../../utils/Config";

export default class MemberCenterIndexScreen extends Component<Props> {
    static navigationOptions = {
        header: null
    };
    constructor(props){
        super(props);
        this.state = {
            userName: '',
            phoneVerify: false,
            cardVerify: false,
            integral: 0,
            wallet: 0,
            totalBalance: 0,
            loginTime: ''
        };

        // 监听组件的四个状态回调：willFocus、didFocus、willBlur、didBlur
        // 分别是: 即将获取焦点、已经获取焦点、即将失去焦点、已经失去焦点
        if (this.props.navigation) {
            this._navListener = this.props.navigation.addListener("willFocus", () => {
                this.refreshUserInfo();
            });
        }
    }

    refreshUserInfo(){
        http.post('User/getUserInfo', null).then( res => {
            if (res.status === 10000) {
                const {username, mobileStatus,cardStatus,integral,wallet,totalBalance,login_time} = res.data;
                this.setState({
                    userName: username.slice(CAGENT.length),
                    phoneVerify: mobileStatus == 0 ? false : true,
                    cardVerify: cardStatus == 0 ? false : true,
                    integral: integral,
                    wallet: wallet,
                    totalBalance: totalBalance,
                    loginTime: login_time
                })
            }
        })
    }

    async componentDidMount() {
        // 获取用户信息并存储
        await httpBaseManager.baseRequest();
    }

    componentWillUnmount() {
        this._navListener.remove();//删除订阅
    };

    render(){
        const { userName, phoneVerify, cardVerify, integral, loginTime, wallet, totalBalance } = this.state;
        return(
            <SafeAreaView style={{flex:1}}>
                <ScrollView style={{flex: 1, backgroundColor: category_group_divide_line_color}}>
                    <View style={{height:220, position:'relative'}}>
                        <ImageBackground style={{ flex:1 }}
                                         source={require('../../../static/img/centertop_bg.png')}
                                         resizeMode='cover'>
                            {/* 设置 */}
                            <TouchableOpacity style={{
                                flexDirection:'row',
                                justifyContent:'flex-end',
                                marginTop:24,
                                marginRight:20
                            }}
                                onPress={() => this.props.navigation.navigate('PersonSetting')}>
                                <Image source={require('../../../static/img/person_setting.png')}
                                       style={{
                                           resizeMode: 'contain',
                                           width: 22,
                                           height: 22
                                       }}/>
                            </TouchableOpacity>

                            {/* 信息展示 */}
                            <View style={{
                                flex:1,
                                flexDirection:'row',
                            }}>
                                <View style={{ width:120,alignItems:'center',paddingTop:16}}>
                                    <Image source={require('../../../static/img/ic_launcher.png')}
                                           style={{
                                               resizeMode: 'contain',
                                               width: 70,
                                               height: 70,
                                               borderRadius:35
                                           }}/>
                                </View>
                                <View style={{ color:'#fff' }}>
                                    <Text style={styles.mainText}>{userName},欢迎您！</Text>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>
                                        <Text style={styles.mainText}>认证状态：</Text>
                                        <Image source={phoneVerify ? require('../../../static/img/iphone_pass.png') : require('../../../static/img/iphone_nov.png')}
                                               style={{
                                                   resizeMode: 'contain',
                                                   height: 24,
                                                   width:30
                                               }}/>
                                        <Image source={cardVerify ? require('../../../static/img/bank_pass.png') : require('../../../static/img/bank_nov.png')}
                                               style={{
                                                   resizeMode: 'contain',
                                                   height: 20,
                                                   width:30
                                               }}/>
                                    </View>
                                    <Text style={styles.mainText}>当前积分：{integral}</Text>
                                    <Text style={styles.mainText}>上次登录时间：{loginTime}</Text>
                                </View>
                            </View>

                        </ImageBackground>

                        <MidBalanceShow wallet={wallet} totalBalance={totalBalance} router={this.props.navigation}/>
                    </View>
                    <MainEntrance route={this.props.navigation}/>

                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    mainText:{
        color: "#fff",
        lineHeight:24
    }
});
