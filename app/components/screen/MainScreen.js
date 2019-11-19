import React, { Component } from 'react';
import { Image, StyleSheet, DeviceEventEmitter } from 'react-native';

import CategoryScreen from '../game/CategoryScreen'
import RegisterScreen from '../auth/RegisterScreen'
import CustomerServiceScreen from '../home/CustomerServiceScreen'
import LoginScreen from '../auth/LoginScreen'

import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from "../home/HomeScreen";
import NoticeScreen from "../home/NoticeScreen";
import GameScreen from "../game/GameScreen";
import GameListScreen from "../game/GameListScreen";
import SeachGameListScreen from "../game/SeachGameListScreen";
import AddBankScreen from "../capital/BankCard/AddBankScreen"
import NewBankCardScreen from '../capital/BankCard/NewBankCardScreen'
import SettingCapitalPwdScreen from "../capital/BankCard/SettingCapitalPwdScreen"
import PlatformTransferScreen from "../capital/Transfer/PlatformTransferScreen"
import WithdrawalScreen from "../capital/Withdrawal/WithdrawalScreen"
import DepositManagerScreen from "../capital/Deposit/DepositManagerScreen"
import DepositBankTransferScreen from "../capital/Deposit/DepositBankTransferScreen"
import DepositPayResultScreen from "../capital/Deposit/DepositPayResultScreen"
import MemberCenterIndexScreen from "../memberCenter/memIndex/memberCenterIndex";
import { getStoreData } from "../../http/AsyncStorage";
import DiscountsScreen from "../home/DiscountsScreen";
import DiscountsDitailScreen from "../home/DiscountsDitailScreen";
import FundRecordScreen from "../memberCenter/FundRecordScreen";
import BettingRecordScreen from "../memberCenter/BettingRecordScreen";
import CommonWebviewScreen from "../home/CommonWebviewScreen"
import SecurityManagerScreen from "../memberCenter/security/SecurityManagerScreen"
import ChangeLoginPwdScreen from "../memberCenter/security/ChangeLoginPwdScreen"
import ChangeCapitalPwdScreen from "../memberCenter/security/ChangeCapitalPwdScreen"
import BindPhoneNumScreen from "../memberCenter/security/BindPhoneNumScreen"
import BankCardInfoScreen from "../memberCenter/security/BankCardInfoScreen"
import PersonSetting from "../memberCenter/personSetting/PersonSetting"
import ContactSetting from "../memberCenter/personSetting/ContactSetting"
import AssetDetailScreen from "../memberCenter/AssetDetailScreen"
import HelpScreen from "../memberCenter/help/helpScreen";
import AboutPage from '../memberCenter/help/AboutPage';
import InnerMessager from "../home/InnerMessager";
import RnWebViewScreen from "../../customizeview/RnWebViewScreen"

import { theme_color } from "../../utils/AllColor";

const HomeStack = createStackNavigator({
    Home: { screen: HomeScreen, },
});

const CategoryStack = createStackNavigator({
    Category: { screen: CategoryScreen },
});

const RegisterStack = createStackNavigator(
    {
        Register: { screen: RegisterScreen },
    },
    {
        navigationOptions: {
            header: null,
        },
    }
);

const DepositStack = createStackNavigator({
    Deposit: { screen: DepositManagerScreen },
});

const DiscountsScreenStack = createStackNavigator({
    DiscountsScreen: { screen: DiscountsScreen },
});

const LoginStack = createStackNavigator({
    LoginService: { screen: LoginScreen },
});

const MemberCenterIndexStack = createStackNavigator({
    MemberCenterIndex: { screen: MemberCenterIndexScreen },
});

const LoginBeforeTabs = {
    首页: { screen: HomeStack },
    分类: { screen: CategoryStack },
    注册: { screen: RegisterStack, navigationOptions: { tabBarVisible: false } },
    优惠: { screen: DiscountsScreenStack },
    登录: { screen: LoginStack, navigationOptions: { tabBarVisible: false } }
};
const LoginAfterTabs = {
    首页: { screen: HomeStack },
    分类: { screen: CategoryStack },
    存款: { screen: DepositStack, navigationOptions: { tabBarVisible: false, color: theme_color }, color: theme_color },
    优惠: { screen: DiscountsScreenStack },
    会员中心: { screen: MemberCenterIndexStack }
};
export default class MainScreen extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            bottomTabs: LoginBeforeTabs,
            initRoute: 'Home'
        }
    }

    componentWillMount() {
        // 加载时，如果本地缓存有登录状态
        getStoreData('@loginState').then((loginInfo) => {
            if (loginInfo.isLogin) {
                this.setState({ bottomTabs: LoginAfterTabs })
            }
        });
        this.listener = DeviceEventEmitter.addListener('changeTabs', (val) => {
            if (val) {
                this.setState({ bottomTabs: LoginAfterTabs, initRoute: 'Home' })
            } else {
                this.setState({ bottomTabs: LoginBeforeTabs, initRoute: 'LoginService' })
            }
        });
    }

    componentDidMount() {

    }


    componentWillUnmount() {
        this.listener.remove();
    }

    TabBottom = () => (createBottomTabNavigator(
        { ...(this.state.bottomTabs) },
        {
            tabBarOptions: {
                showIcon: true,
                resetOnBlur: true, //切换离开屏幕时，重置所有嵌套导航器的状态
                activeTintColor: theme_color,
                inactiveTintColor: '#a6a1aa',
                style: { backgroundColor: 'white', height: 50 },
                labelStyle: { fontSize: 12 },
            },
            defaultNavigationOptions: ({ navigation }) => ({
                tabBarIcon: ({ focused, tintColor }) => {
                    const { routeName } = navigation.state;
                    if (routeName === '首页') {
                        return <Image
                            source={focused ? require('../../static/img/tab_home_hover.png') :
                                require('../../static/img/tab_home_normal.png')}
                            style={styles.tab_icom} />;
                    } else if (routeName === '分类') {
                        return <Image
                            source={focused ? require('../../static/img/tab_category_hover.png') :
                                require('../../static/img/tab_category_normal.png')}
                            style={styles.tab_icom} />;
                    } else if (routeName === '注册') {
                        return <Image
                            source={focused ? require('../../static/img/tab_register.png') :
                                require('../../static/img/tab_register.png')}
                            style={styles.tab_icom_regiter} />;
                    } else if (routeName === '存款') {
                        return <Image
                            source={focused ? require('../../static/img/tab_deposit_hover.png') :
                                require('../../static/img/tab_deposit_hover.png')}
                            style={styles.tab_icom_regiter} />;
                    } else if (routeName === '优惠') {
                        return <Image
                            source={focused ? require('../../static/img/tab_cs_hover.png') :
                                require('../../static/img/tab_cs_normal.png')}
                            style={styles.tab_icom} />;
                    } else if (routeName === '登录') {
                        return <Image
                            source={focused ? require('../../static/img/tab_user_hover.png') :
                                require('../../static/img/tab_user_normal.png')}
                            style={styles.tab_icom} />;
                    } else if (routeName === '会员中心') {
                        return <Image
                            source={focused ? require('../../static/img/tab_user_hover.png') :
                                require('../../static/img/tab_user_normal.png')}
                            style={styles.tab_icom} />;
                    }
                },
            }),
        }
    ));
    RootStack = () => (createStackNavigator(
        {
            Home: {
                screen: this.TabBottom(),
            },
            Register: { screen: RegisterStack },
            Game: { screen: GameScreen },
            GameList: { screen: GameListScreen },
            SeachGameList: { screen: SeachGameListScreen },
            AddBankScreen: { screen: AddBankScreen },
            NewBankCardScreen: { screen: NewBankCardScreen },
            DepositManagerScreen: { screen: DepositManagerScreen },
            SettingCapitalPwdScreen: { screen: SettingCapitalPwdScreen },
            PlatformTransferScreen: { screen: PlatformTransferScreen },
            DepositBankTransferScreen: { screen: DepositBankTransferScreen },
            WithdrawalScreen: { screen: WithdrawalScreen },
            DepositPayResultScreen: { screen: DepositPayResultScreen },
            LoginService: { screen: LoginScreen },
            CustomerServiceScreen: { screen: CustomerServiceScreen },
            DiscountDetail: { screen: DiscountsDitailScreen },
            NoticeScreen: { screen: NoticeScreen },
            CommonWebviewScreen: { screen: CommonWebviewScreen },
            SecurityManagerScreen: { screen: SecurityManagerScreen },
            ChangeLoginPwdScreen: { screen: ChangeLoginPwdScreen },
            ChangeCapitalPwdScreen: { screen: ChangeCapitalPwdScreen },
            BindPhoneNumScreen: { screen: BindPhoneNumScreen },
            BankCardInfoScreen: { screen: BankCardInfoScreen },
            FundRecord: { screen: FundRecordScreen },
            BettingRecord: { screen: BettingRecordScreen },
            PersonSetting: { screen: PersonSetting },
            ContactSetting: { screen: ContactSetting },
            AssetDetailScreen: { screen: AssetDetailScreen },
            HelpScreen: { screen: HelpScreen },
            AboutPage: { screen: AboutPage },
            CustomerService: { screen: CustomerServiceScreen },
            InnerMessager: { screen: InnerMessager },
            RnWebScreen:{screen:RnWebViewScreen }
        },
        {
            initialRouteName: this.state.initRoute,
            defaultNavigationOptions: ({ navigation }) => {
                const routeName = navigation.state.routeName;
                if (routeName === 'Home') {
                    return {
                        header: null,
                        headerBackTitle: null,
                    };
                }
            },
        },
    ));

    render() {
        let AppContainer = createAppContainer(this.RootStack());
        return <AppContainer />;
    }
}

const styles = StyleSheet.create({
    tab_icom: {
        flex: 1,
        resizeMode: 'contain',
        width: 26
    },
    tab_icom_regiter: {
        resizeMode: 'contain',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: 45,
        height: 45,
        marginBottom: 20
    },
});

