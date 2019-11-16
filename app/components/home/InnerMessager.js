import React, { Component } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    Image,
    RefreshControl,
    TouchableOpacity,
    StyleSheet
} from 'react-native';

import http from "../../http/httpFetch";
import TXTools from '../../utils/Htools';
import TXToastManager from '../../tools/TXToastManager';
import MainTheme from '../../utils/AllColor'

// 站内信列表url
const INNER_MESSAGER_MESSAGE_LIST_URL = '/User/getMessageList';
// 读取站内信详情
const INNER_MESSAGER_READ_MESSAGE_URL = '/User/getMessageInfo';
// 查询的天数
const INNER_MESSAGER_DATETIME_PERIOD = 90;

export default class InnerMessager extends Component<Props> {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: (
                MainTheme.renderCommonTitle('站内信')
            ),
            headerLeft: (
                MainTheme.renderCommonBack(navigation)
            ),
            headerRight: (
                <View />
            ),
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
            data: [],
            curIndex: -1,
        };
    }

    componentDidMount() {
        if (this.state.data.length == 0) {
            this.refreshData();
        }
    }

    refreshData = () => {
        this.setState({ refreshing: true });
        this.loadInnerMessages();
    }

    loadInnerMessages = () => {
        // 查询的日期周期
        let theDay = TXTools.dateAfter(-INNER_MESSAGER_DATETIME_PERIOD);
        let from = TXTools.formatDateToCommonString(theDay);
        let to = TXTools.formatDateToCommonString(new Date());
        // 接口参数（没有分页）
        let params = {
            bdate: from,
            edate: to,
        };
        // 发送数据请求
        http.post(INNER_MESSAGER_MESSAGE_LIST_URL, params, true, text = '加载中...')
            .then(res => {
                if (res.status == 10000) {
                    this.setState({ data: res.data });
                }
                else {
                    let { msg } = res;
                    if (msg == undefined || msg === '') {
                        msg = '未知错误，请重试！';
                    }
                    TXToastManager.show(msg);
                }

                this.setState({ refreshing: false });

            }).catch(err => {
                console.log(err);
                this.setState({ refreshing: false });
                TXToastManager.show('网络错误，请重试！');
            })
    }

    onListItemPressed = (item, index) => {
        // 正在被打开
        if (index == this.state.curIndex) {
            this.setState({ curIndex: -1 });
        }
        // 未被打开过（需要加载详情）
        else if (item.isOpened == undefined || item.isOpened == false) {
            this.readMsgDetail(item, index);
        }
        else { // 已被打开过
            this.setState({ curIndex: index });
        }
    }
    /**
     * 读取站内信详情，并标记为已读
     */
    readMsgDetail = (item, index) => {
        let params = { id: item.id };
        http.post(INNER_MESSAGER_READ_MESSAGE_URL, params, true, text = '读取中...')
            .then(res => {
                if (res.status == 10000) {
                    item.message = res.data.message;
                    item.status = res.data.status;
                    item.isOpened = true;
                    this.setState({ curIndex: index });
                }
                else {
                    let { msg } = res;
                    if (msg == undefined || msg === '') {
                        msg = '未知错误，请重试！';
                    }
                    TXToastManager.show(msg);
                }
            }).catch(err => {
                console.log(err);
                TXToastManager.show('网络错误，请重试！');
            });
    }

    /*------------------------------  Renders  -----------------------------------*/

    renderItem = ({ item, index }) => {
        // 左边的图标
        let icon = require('../../static/img/zhannei_icon_email_pre.png');
        let unreadIcon = require('../../static/img/zhannei_icon_email_nor.png');

        return (
            <TouchableOpacity style={styles.listItemContainer}
                onPress={() => this.onListItemPressed(item, index)}>
                {/* 左边的图片 */}
                <Image source={item.status == '0' ? unreadIcon : icon} style={styles.listItemIcon} />
                {/* 站内信明细 */}
                <View style={{ flex: 1 }}>
                    {/* 顶部 */}
                    <View style={styles.listItemTopContainer}>
                        {/* 站内信标题 */}
                        <Text style={item.status == '0' ? styles.listItemTitle : styles.listItemUnreadTitle}>
                            系统信息
                        </Text>
                        {/* 站内信的时间戳 */}
                        <Text style={styles.listItemDateTime}>
                            {item.addtime}
                        </Text>
                    </View>
                    {/* 站内信内容 */}
                    <Text style={item.status == '0' ? styles.listItemContent : styles.listItemUnreadContent}
                        numberOfLines={this.state.curIndex == index ? 0 : 1}
                    >
                        {item.message}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    renderRefreshControl = () => {
        return (
            <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.refreshData}
                title="Loading..." />
        );
    }

    renderSeparator = () => {
        return (
            <View style={{
                backgroundColor: MainTheme.DivideLineColor,
                height: 0.5,
                marginLeft: 10,
                marginRight: 10
            }}></View>
        );
    }

    renderFooter = () => {
        return (
            <View>
                {this.renderSeparator()}
                <View style={styles.listTail}>
                    <Text style={styles.listTailText}> 没有更多数据了 </Text>
                </View>
            </View>
        );
    }

    renderEmptyComponent = () => {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text>暂无数据</Text>
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <FlatList
                    style={styles.listStyle}
                    numColumns={1}
                    data={this.state.data}
                    keyExtractor={item => item.addtime}//这里要是使用重复的key出现莫名其妙的错误
                    ListFooterComponent={this.renderFooter}//尾巴
                    enableEmptySections={true}//数据可以为空
                    renderItem={this.renderItem}
                    onEndReachedThreshold={0.2}//执行上啦的时候10%执行
                    ListEmptyComponent={this.renderEmptyComponent()}
                    ItemSeparatorComponent={this.renderSeparator} // 分割线
                    refreshControl={this.renderRefreshControl()}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    listStyle: {
        backgroundColor: MainTheme.BackgroundColor,
        flex: 5,
    },

    listItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 15,
        paddingTop: 15,
        marginLeft: 10,
        marginRight: 10,
        backgroundColor: MainTheme.BackgroundColor,
    },

    listItemIcon: {
        marginLeft: 15,
        marginRight: 15,
        alignSelf: 'flex-start',
    },

    listItemTopContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },

    listItemTitle: {
        fontSize: 15,
        fontWeight:'bold',
        color: MainTheme.DarkGrayColor,
    },

    listItemUnreadTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: MainTheme.GrayColor,
    },

    listItemDateTime: {
        fontSize: 10,
        color: MainTheme.GrayColor,
    },

    listItemContent: {
        fontSize: 12,
        color: MainTheme.DarkGrayColor,
    },

    listItemUnreadContent: {
        fontSize: 12,
        color: MainTheme.GrayColor,
    },

    listTail: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },

    listTailText: {
        color: MainTheme.GrayColor,
        textAlign: 'center',
        fontSize: 10
    },
});