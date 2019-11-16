import React, { Component } from 'react';
import {
    StyleSheet, View, Text, ImageBackground, Image,
    TouchableOpacity, ScrollView, SafeAreaView,
    DeviceEventEmitter, Alert
} from "react-native";
import httpBaseManager from "../../../http/httpBaseManager";
import { category_group_divide_line_color } from "../../../utils/AllColor";
import MidBalanceShow from './midBalanceShow'
import MainEntrance from './mainEntrance'
import { getStoreData } from "../../../http/AsyncStorage";
import AndroidIosNativeGameActiviy from "../../../customizeview/AndroidIosNativeGameActiviy";
import http from "../../../http/httpFetch";
import { CAGENT } from "../../../utils/Config";
import MainTheme from '../../../utils/AllColor';
import DeviceValue from "../../../utils/DeviceValue";
import { FlatList, Switch } from 'react-native-gesture-handler';
import TXToastManager from "../../../tools/TXToastManager";
import { clearAllStore } from "../../../http/AsyncStorage";

// 是否接入了无限代理
export var IS_INFINITE_AGENCY_ENABLE = true;

export default class MemberCenterIndexScreen extends Component<Props> {

    static navigationOptions = {
        header: null
    };
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            phoneVerify: false,
            cardVerify: false,
            integral: 0,
            wallet: 0,
            totalBalance: 0,
            loginTime: '',
            agencyLevel: '',    // 无限代理的等级
            agencyReward: 0,    // 无限代理的佣金
            autoTransfer: true,  // 是否自动转账
        };

        // 监听组件的四个状态回调：willFocus、didFocus、willBlur、didBlur
        // 分别是: 即将获取焦点、已经获取焦点、即将失去焦点、已经失去焦点
        if (this.props.navigation) {
            this._navListener = this.props.navigation.addListener("willFocus", () => {
                this.refreshUserInfo();
            });
        }
    }

    refreshUserInfo() {
        http.post('User/getUserInfo', null).then(res => {
            if (res.status === 10000) {
                const { username, mobileStatus, cardStatus, integral, wallet, totalBalance, login_time } = res.data;
                this.setState({
                    userName: username.slice(CAGENT.length),
                    phoneVerify: mobileStatus == 0 ? false : true,
                    cardVerify: cardStatus == 0 ? false : true,
                    integral: integral,
                    wallet: wallet,
                    totalBalance: totalBalance,
                    loginTime: login_time,
                    agencyLevel: '白银会员', // mock data
                    agencyReward: 888,      // mock data
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

    // 充值
    onRechange = () => {
        this.props.navigation.navigate('DepositManagerScreen', { isNotFromHome: true });
    }

    // 提款
    onDraw = () => {
        getStoreData('userInfoState').then((userInfo) => {
            if (userInfo && !userInfo.settedqkpwd) {
                //尚未设置提款密码
                TXToastManager.show('请先设置提款密码');
                this.props.navigation.navigate('SettingCapitalPwdScreen');
            } else if (userInfo && userInfo.bankList && userInfo.bankList.length == 0) {
                //还没有绑定银行卡
                TXToastManager.show('请先绑定银行卡');
                this.props.navigation.navigate('AddBankScreen');
            } else if (userInfo.bankList && userInfo.bankList.length > 0) {
                this.props.navigation.navigate('WithdrawalScreen');
            }
        });
    }

    // 转账
    onTransfer = () => {
        this.props.navigation.navigate('PlatformTransferScreen');
    }

    // 资金记录
    onCheckAssetsRecord = () => {
        this.props.navigation.navigate('FundRecord');
    }

    // 投注记录
    onCheckBetRecord = () => {
        this.props.navigation.navigate('BettingRecord');
    }

    // 无限代理
    onCheckAgencyDetail = () => {
        TXToastManager.show('暂未实现，敬请期待'); 
    }

    // 自动转账选项发生变化
    onChangeAutoTransferOption = (value) => {
        this.setState({ autoTransfer: value });
        TXToastManager.show('暂未实现，敬请期待');
    }

    // 显示自动转账的帮助信息
    onShowAutoTransferHelp = () => {
        TXToastManager.show("开启后，进入游戏时将会自动将钱包余额带入游戏，"
            + "\n若希望手动充值游戏，请关闭此选项。", 3000);
    }

    // 列表点击事件响应
    onOtherOperation = (item) => {
        console.log(item);
        switch (item) {
            case '安全设置':
                this.props.navigation.navigate('SecurityManagerScreen');
                break;
            case '帮助中心':
                this.props.navigation.navigate('HelpScreen');
                break;
            case '在线客服':
                this.props.navigation.navigate('CustomerService');
                break;
            case '关于':
                this.props.navigation.navigate('AboutPage');
                break;
            default:
                break;
        }
    }

    /**
     * 登录
     */
    onLogout = () => {
        Alert.alert('温馨提示', '退出账户，是否继续？', [
            { text: '取消', onPress: () => console.log('Cancel loginOut') },
            { text: '确定', onPress: () => {
                    http.post('logout.do', {}, true).then(res => {
                        if (res.status === 10000) {
                            clearAllStore();
                            DeviceEventEmitter.emit('changeTabs', false); //改变Tabs内容广播
                            this.props.navigation.navigate('LoginService');
                        }
                        TXToastManager.show(res.msg);
                    })
                }
            },
        ]);
    }

    /**
     * 用户头像
     */
    createUserAvatar() {
        return (
            <View style={{ width: 90, alignItems: 'center', paddingTop: 5 }}>
                <Image source={require('../../../static/img/ic_launcher.png')}
                    style={{
                        resizeMode: 'contain',
                        width: 70,
                        height: 70,
                        borderRadius: 35
                    }} />
            </View>
        );
    }

    /**
     * 用户名称等信息
     */
    createUserInfo() {
        const { userName, phoneVerify, cardVerify, integral, loginTime } = this.state;

        if (IS_INFINITE_AGENCY_ENABLE) {
            return (
                <View>
                    <Text style={styles.loginName}>{userName}</Text>
                    <Text style={styles.userInfo}>代理等级：{this.state.agencyLevel}</Text>
                    <Text style={styles.userInfo}>当前积分：{integral}</Text>
                    <Text style={styles.userInfo}>上次登录时间：{loginTime}</Text>
                </View>
            );
        }
        else {
            return (
                <View>
                    <Text style={styles.loginName}>{userName},欢迎您！</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.userInfo}>认证状态：</Text>
                        <Image source={phoneVerify ? require('../../../static/img/iphone_pass.png') : require('../../../static/img/iphone_nov.png')}
                            style={{
                                resizeMode: 'contain',
                                height: 24,
                                width: 30
                            }} />
                        <Image source={cardVerify ? require('../../../static/img/bank_pass.png') : require('../../../static/img/bank_nov.png')}
                            style={{
                                resizeMode: 'contain',
                                height: 20,
                                width: 30
                            }} />
                    </View>
                    <Text style={styles.userInfo}>当前积分：{integral}</Text>
                    <Text style={styles.userInfo}>上次登录时间：{loginTime}</Text>
                </View>
            );
        }
    }

    /**
     * 用户资产
     */
    crateAssetsInfo() {
        const { wallet, totalBalance, agencyReward, agencyLevel } = this.state;
        let assertsItems = [];
        if (agencyLevel.length > 0) { // 判断用户是否加入无线代理（这里是模拟实现）
            assertsItems = [['钱包余额', wallet], ['代理佣金', agencyReward], ['总共资产', totalBalance]];
        }
        else {
            assertsItems = [['钱包余额', wallet], ['总共资产', totalBalance]];
        }
        return (
            <View style={styles.assertsContainer}>
                {
                    assertsItems.map((items) => {
                        return (
                            <View style={styles.assertsItems}>
                                <Text style={styles.assetsNumber}>{items[1]}</Text>
                                <Text style={styles.assetsCategory}>{items[0]}</Text>
                            </View>
                        );
                    })
                }
            </View>
        );
    }

    /**
     * 快捷功能：充值、提款、转账
     */
    createShortcuts() {
        let shortcutOperations = [
            {
                icon: require('../../../static/img/UserCenter/userCenter_recharge.png'),
                title: '充值',
                handler: this.onRechange,
            },
            {
                icon: require('../../../static/img/UserCenter/userCenter_draw.png'),
                title: '提款',
                handler: this.onDraw,
            },
            {
                icon: require('../../../static/img/UserCenter/userCenter_transfer.png'),
                title: '转账',
                handler: this.onTransfer,
            },
        ];
        return (
            <View style={styles.shortcutContainer}>
                {
                    shortcutOperations.map(item =>
                        <TouchableOpacity style={styles.shortcutItem} onPress={item.handler} >
                            <Image source={item.icon} style={styles.shortcutIcon} />
                            <Text style={styles.shortcutTitle } > {item.title} </Text>
                        </TouchableOpacity>
                    )
                }
            </View>
        );
    }

    /**
     * 资金记录、投注记录、无线代理
     */
    createRecordItems() {
        let assetsOperations = [
            {
                image: require('../../../static/img/UserCenter/user_icon_zjjl.png'),
                handler: this.onCheckAssetsRecord,
            },
            {
                image: require('../../../static/img/UserCenter/user_icon_tzjl.png'),
                handler: this.onCheckBetRecord,
            },
            {
                image: require('../../../static/img/UserCenter/user_icon_wxdl.png'),
                handler: this.onCheckAgencyDetail,
            },
        ];
        return (
            <View style={styles.recordItemsContainer}>
                {
                    assetsOperations.map(item =>
                        <TouchableOpacity onPress={item.handler}>
                            <Image source={item.image} />
                        </TouchableOpacity>
                    )
                }
            </View>
        );
    }

    /**
     * 创建其它的设置项列表
     */
    createOtherSettings() {
        return (
            <FlatList renderItem={this.createOtherSettingsItem}
                data={['自动转账', '安全设置', '帮助中心', '在线客服', '版本', '关于']}
                style={styles.otherSettingsContainer}
                keyExtractor={({ item }) => item}
            />
        );
    }

    /**
     * 创建其它的设置的列表项
     */
    createOtherSettingsItem = ({ item, index }) => {
        switch (index) {
            case 0:
                return ( // 自动转账设置
                    <TouchableOpacity style={styles.otherSettingsAutoTransferContainer}>
                        <Text style={{ ...styles.otherSettingsTitle, textAlign: 'center' }}>{item}</Text>
                        <TouchableOpacity style={styles.otherSettingsAutoTransferMark}
                            onPress={this.onShowAutoTransferHelp}>
                            <Text style={styles.otherSettingsAutoTransferQuestion}>?</Text>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }} />
                        <Switch onValueChange={this.onChangeAutoTransferOption}
                            thumbColor={'white'}
                            ios_backgroundColor={MainTheme.GrayColor}
                            trackColor={{ false: MainTheme.GrayColor, true: MainTheme.SpecialColor }}
                            value={this.state.autoTransfer} />
                    </TouchableOpacity>
                );
            case 4:
                return ( // APP版本号
                    <TouchableOpacity style={styles.otherSettingsVersionContainer}>
                        <Text style={styles.otherSettingsTitle}>{item}</Text>
                        <Text style={styles.otherSettingsVersionDetail}>v1.0.2</Text>
                    </TouchableOpacity>
                );
            default:
                return (
                    <TouchableOpacity style={styles.otherSettingsItem}
                        onPress={() => this.onOtherOperation(item)}>
                        <Text style={styles.otherSettingsTitle}>{item}</Text>
                    </TouchableOpacity>
                );
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                    <View style={{ height: 220, position: 'relative' }}>
                        <ImageBackground style={{ flex: 1 }} resizeMode='cover'
                            source={require('../../../static/img/centertop_bg.png')} >
                            {/* 设置按钮 */}
                            <TouchableOpacity style={styles.userSettingsContaner}
                                onPress={() => this.props.navigation.navigate('PersonSetting')}>
                                <Image source={require('../../../static/img/person_setting.png')}
                                    style={styles.userSettingsIcon} />
                            </TouchableOpacity>
                            {/* 用户基本信息 */}
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                                {this.createUserAvatar()/* 头像 */}
                                {this.createUserInfo()/* 用户名称等信息 */}
                            </View>
                            {/* 用户资产 */}
                            {this.crateAssetsInfo()}
                        </ImageBackground>
                        {/* 快捷功能 */}
                        {this.createShortcuts()}
                        {/* <MidBalanceShow wallet={wallet} totalBalance={totalBalance} router={this.props.navigation} /> */}
                    </View>
                    {/* 资金记录、投注记录、无线代理 */}
                    {this.createRecordItems()}
                    {/* 自动转账、安全设置等等 */}
                    {this.createOtherSettings()}
                    {/* <MainEntrance route={this.props.navigation} /> */}
                    {/* 退出登录按钮 */}
                    <TouchableOpacity style={styles.logoutContainer} onPress={this.onLogout}>
                        <Text style={styles.logoutText}>退出登录</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    userSettingsContaner: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 24,
        marginRight: 20
    },

    userSettingsIcon: {
        resizeMode: 'contain',
        width: 22,
        height: 22,
    },

    loginName: {
        color: "#fff",
        lineHeight: 24,
        fontSize: 20,
    },

    userInfo: {
        color: "#F5CEC8",
        fontSize: 12,
    },

    assertsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 10,
    },

    assertsItems: {
        alignItems: 'center',
    },

    assetsNumber: {
        marginBottom: 10,
        color: '#FFFFFF',
        fontSize: 16,
    },

    assetsCategory: {
        color: '#F5CEC8',
        fontSize: 12,
    },

    shortcutContainer: {
        marginLeft: 25,
        marginRight: 25,
        width: DeviceValue.windowWidth - 50,
        height: 100,
        bottom: -75,
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        position: 'absolute',
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: category_group_divide_line_color,
    },

    shortcutItem: {
        width: 60,
        alignItems: 'center',
    },

    shortcutIcon: {
        width: 48,
        height: 48,
        marginBottom: 10,
    },

    shortcutTitle: {
        fontSize: 14,
        color: '#333333',
    },

    recordItemsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 100,
    },

    otherSettingsContainer: {
        margin: 25,
    },

    otherSettingsItem: {
        height: 40,
        justifyContent: 'center',
    },

    otherSettingsTitle: {
        fontSize: 14,
        color: '#333333',
    },

    otherSettingsAutoTransferContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40,
    },

    otherSettingsAutoTransferMark: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#000',
        backgroundColor: '#000',
        marginLeft: 15,
    },

    otherSettingsAutoTransferQuestion: {
        height: 15,
        width: 15,
        color: '#FFF',
        textAlign: 'center',
    },

    otherSettingsVersionContainer: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    otherSettingsVersionDetail: {
        fontSize: 12,
        color: MainTheme.GrayColor,
    },

    logoutContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 42,
        width: DeviceValue.windowWidth - 45,
        marginLeft: 22.5,
        backgroundColor: MainTheme.SpecialColor,
        marginBottom: 50,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: MainTheme.SpecialColor,
    },

    logoutText: {
        color: MainTheme.SubmitTextColor,
        fontSize: 16,
    },

});
