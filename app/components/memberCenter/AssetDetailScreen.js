import React, { Component } from 'react';
import {
    View, Text, SafeAreaView,
    Image, TouchableOpacity,
    FlatList, DeviceEventEmitter,
    StyleSheet,
} from "react-native";
import FastImage from "react-native-fast-image";
import DeviceValue from "../../utils/DeviceValue";
import http from "../../http/httpFetch";
import TXToastManager from "../../tools/TXToastManager";
import { mergeStoreData } from "../../http/AsyncStorage";
import TXTools from '../../utils/Htools';
import { MainTheme } from "../../utils/AllColor";

export default class AssetDetailScreen extends Component<Props>{
    static navigationOptions = ({ navigation }) => {
        return {
            title: '资产明细',
            headerTitleStyle: { flex: 1, textAlign: 'center' },//解决android 标题不居中问题
            headerLeft: (
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <Image source={require('../../static/img/titlebar_back_normal.png')}
                        style={{
                            resizeMode: 'contain',
                            width: 20,
                            height: 20,
                            margin: 12
                        }} />
                </TouchableOpacity>
            )
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            totalBalance: '0.00',
            assetList: []
        }
    }

    componentDidMount() {
        // 获取列表信息
        this.getGameList();
    }

    /**
     * 获取列表信息
     */
    getGameList() {
        http.get('transfer/transferGameList', null, true).then(res => {
            if (res.status === 10000) {
                const { totalBalance, wallet, list } = res.data;
                let listItem = [{
                    balance: wallet,
                    platCode: 0,
                    platImg: require('../../static/img/ic_launcher.png'),
                    platName: '钱包余额',
                    status: 1
                }, ...list];
                this.setState({
                    totalBalance: totalBalance,
                    assetList: listItem
                })
            }
        })
    }

    /**
     * 一键回收
     */
    receiveAll() {
        http.post('transfer/oneclickrecycling', null, true).then(res => {
            if (res.status === 10000) {
                const { wallet, detail } = res.data;
                let list = this.state.assetList;
                // 更新中心钱包数据
                list[0].balance = wallet;
                // 更新其他回收数据
                list.forEach(item1 => {
                    detail.forEach(item2 => {
                        if (item1.platCode === item2.platCode) {
                            item1.balance = 0;
                        }
                    })
                });
                this.setState({ assetList: list });
                // 更新本地缓存
                mergeStoreData('userInfoState',
                    { balance: wallet }).then(() => {
                        DeviceEventEmitter.emit('bindSuccess', '更新钱包余额');
                    });
            }
            TXToastManager.show(res.msg);
        })
    }

    /**
     * list
     * @param item
     * @param index
     * @return {*}
     */
    assetItem = ({ item, index }) => {
        return (
            <View style={[styles.listItemStyle,
            { backgroundColor: (item.status === 0 ? MainTheme.LightGrayColor : MainTheme.BackgroundColor) }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FastImage
                        style={{ width: 40, height: 40 }}
                        source={
                            item.platCode === 0 ?
                                item.platImg :
                                {
                                    uri: 'http:' + item.platImg,
                                    priority: FastImage.priority.normal
                                }
                        }
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    <Text style={{ marginLeft: 10 }}>{item.platName}</Text>
                </View>
                <Text>{this.filterMoney(item.balance)}</Text>
            </View>
        )
    };

    /**
     * 金额数据请精确到小数位两位
     * @param num
     */
    filterMoney = (num) => {
        if (isNaN(num)) {
            return num;
        } else {
            let money = ((parseFloat(num) * 100) / 100).toFixed(2);
            return TXTools.formatMoneyAmount(money);
        }
    };

    /**
     * 快捷功能：提款、充值、回ོ收ོ
     */
    createOperations() {
        let shortcutOperations = [
            {
                icon: require('../../static/img/UserCenter/userCenter_draw.png'),
                title: '提款',
                handler: () => this.props.navigation.navigate('WithdrawalScreen'),
            },
            {
                icon: require('../../static/img/UserCenter/userCenter_recharge.png'),
                title: '存款',
                handler: () => this.props.navigation.navigate('DepositManagerScreen', { isNotFromHome: true }),
            },
            {
                icon: require('../../static/img/UserCenter/userCenter_recycle.png'),
                title: '回收',
                handler: () => this.receiveAll(),
            },
        ];
        return (
            <View style={styles.shortcutContainer}>
                {
                    shortcutOperations.map(item =>
                        <TouchableOpacity style={styles.shortcutItem} onPress={item.handler} >
                            <Image source={item.icon} style={styles.shortcutIcon} />
                            <Text style={styles.shortcutTitle} > {item.title} </Text>
                        </TouchableOpacity>
                    )
                }
            </View>
        );
    }

    showDescription = () => {
        TXToastManager.show('总资产包括钱包余额，游戏内余额，以及代理佣金（不可直接用于游戏）', 3000);
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: MainTheme.BackgroundColor }}>
                <View style={styles.imageBackground}>
                    <Text style={styles.totalBalance}>
                        {this.filterMoney(this.state.totalBalance)}
                    </Text>
                    <Text style={{ fontSize: 16, color: '#fff' }}>总资产(元)</Text>
                </View>

                <TouchableOpacity style={{ position: 'absolute', top: 20, right: 20 }}
                    onPress={this.showDescription}>
                    <Image source={require('../../static/img/UserCenter/userCenter_gth.png')} />
                </TouchableOpacity>

                {this.createOperations()}

                <FlatList
                    style={{ marginTop: 20, marginBottom: 10 }}
                    data={this.state.assetList}
                    extraData={this.state}
                    keyExtractor={item => item.platCode}
                    enableEmptySections={true}//数据可以为空
                    renderItem={this.assetItem}
                />
            </SafeAreaView>
        )
    }

}

const styles = StyleSheet.create({
    imageBackground: {
        height: 120,
        margin: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: MainTheme.SpecialColor,
    },

    totalBalance: {
        fontSize: 22,
        fontWeight: 'bold',
        lineHeight: 44,
        color: '#fff'
    },

    shortcutContainer: {
        marginLeft: 15,
        marginRight: 15,
        height: 90,
        backgroundColor: MainTheme.BackgroundColor,
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: MainTheme.DivideLineColor,
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

    listItemStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        paddingHorizontal: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: MainTheme.DivideLineColor,
    },
});