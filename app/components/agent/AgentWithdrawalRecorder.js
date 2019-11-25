import React, { Component } from 'react';
import {
    View, FlatList, Text, Image,
    TouchableOpacity, SafeAreaView,
    StyleSheet, RefreshControl,
} from "react-native";

import deviceValue from "../../utils/DeviceValue";
import http from "../../http/httpFetch";
import MainTheme from '../../utils/AllColor';
import TXTools from '../../utils/Htools';
import TXToastManager from '../../tools/TXToastManager';

const PAGE_SIZE = 50;

const RECORD_STATUS_ICONS = [
    require('../../static/img/UserCenter/userCenter_fund_wait.png'),
    require('../../static/img/UserCenter/userCenter_fund_success.png'),
    require('../../static/img/UserCenter/userCenter_fund_failed.png')
];
export default class AgentWithdrawalRecorder extends Component<Props> {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: (
                MainTheme.renderCommonTitle('提款记录')
            ),
            headerLeft: (
                MainTheme.renderCommonBack(navigation)
            ),
            headerRight: (
                MainTheme.renderCommonMore(navigation, () => {
                    if (navigation.state.params) {
                        navigation.state.params.choseType();
                    }
                })
            )
        };
    };


    // 当前页码
    currentPageNo = 0;

    /**
     * 页面的状态定义
     */
    state = {
        isRefreshing: false,
        isLoadingMore: false,
        isNoMoreData: false,

        startTime: '',              // 开始时间(年月日)
        endTime: '',                // 结束时间(年月日)
        sortType: '1',              // 排序方式: 1-提取时间升序 2-提取时间降序 3-提佣金额升序 4-提佣金额降序
        timeIdentify: '',           // 时间标识 today-今天 week-本周 month-本月

        outstandingCommissions: 0,  // 当前未结算佣金
        extractedTimes: 0,          // 已经提取佣金次数
        allExtractedCommissions: 0, // 累计提取佣金
        // data: [],
        data: [
            {
                orderCreateTime: '09-28 16:48', // 申请时间
                amount: 15321.00,   // 提佣金额
                operator: '',        // 操作人
                orderType: 1,        // 订单类型 0:提佣 1:佣金转存
                status: 0,           // 订单状态 0:处理中，1:成功 2:失败
                timeCircle: '9.01~9.15',        // 计佣周期
                verifyTime: '',      // 审核时间
                issuedTime: '',      // 下发时间
                remark: '',          // 备注
            },
            {
                orderCreateTime: '10-21 12:23',
                amount: 101.00,
                operator: '管理员',
                orderType: 0,
                status: 1,
                timeCircle: '10.01~10.20',
                remark: '',
            },
            {
                orderCreateTime: '11-10 19:53',
                amount: -890989.00,
                operator: '管理员',
                orderType: 1,
                status: 2,
                timeCircle: '10.21~11-09',
                remark: '',
            }
        ],
    }

    constructor(props) {
        super(props);
        this.props.navigation.setParams({ choseType: this.choseType });
    }

    componentDidMount() {
        if (this.state.data.length == 0) {
            this.refreshData();
        }
    }

    /*********************************  业务方法  ************************************/

    /**
     * 刷新数据
     */
    refreshData = () => {
        const { isLoadingMore, isRefreshing } = this.state;

        if (isLoadingMore || isRefreshing) {
            console.log("正在数据请求或没有更多数据！");
        }
        else {
            this.setState({
                isRefreshing: true,
            });
            this.doLoadData(true);
        }
    }

    /**
     * 加载更多
     */
    loadMore = () => {
        const { isLoadingMore, isRefreshing, isNoMoreData } = this.state;

        if (isLoadingMore || isRefreshing || isNoMoreData) {
            console.log("正在数据请求或没有更多数据！");
        }
        else {
            this.setState({
                isLoadingMore: true,
            });
            this.doLoadData();
        }
    }

    /**
     *  执行数据请求
     */
    doLoadData = (isRefresh = false) => {
        let params = {
            pageNo: isRefresh ? 1 : this.currentPageNo + 1,
            pageSize: PAGE_SIZE,
            // uid:'',
            //agencyUid:'',
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            sortBy: this.state.sortType,
            timeIdentify: this.state.timeIdentify,
        };
        http.post('agency/commissionRecordPage', params, isRefresh).then(res => {
            this.setState({
                isRefreshing: false,
                isLoadingMore: false
            });

            if (res.status == 10000) {
                let noMoreData = res.data.list.length < PAGE_SIZE;
                this.setState({
                    allExtractedCommissions: res.data.allExtractedCommissions,
                    outstandingCommissions: res.data.outstandingCommissions,
                    extractedTimes: res.data.extractedTimes,
                    isNoMoreData: noMoreData,
                });

                if (isRefresh) {
                    pageSize = 1;
                    this.setState({
                        data: res.data.list,
                    });
                }
                else {
                    this.currentPageNo += 1;
                    this.setState({
                        data: this.state.data.concat(res.data.list),
                    });
                }
            }
            else {
                let info = res.msg || '请求失败，请重试！';
                TXToastManager.show(info);
            }
        }).catch(err => {
            this.setState({
                isRefreshing: false,
                isLoadingMore: false
            });

            console.info(err);
            TXToastManager.show('网络错误，请重试！');
        });
    };

    choseType = () => {
        console.log('---------------------> choseType');
    }

    connectOnlineSupport = () => {
        this.props.navigation.navigate('CustomerServiceScreen');
    }

    /***************************************   render方法族   ***************************************/

    /**
     * 顶部框
     */
    renderTopBanner() {
        const items = [
            { account: TXTools.formatMoneyAmount(this.state.outstandingCommissions), title: '当前未结' },
            { account: '' + this.state.extractedTimes + ' 次', title: '已提取' },
            { account: TXTools.formatMoneyAmount(this.state.allExtractedCommissions), title: '累计提取' },
        ];
        return (
            <View style={styles.topBannerContainer}>
                {
                    items.map((item, index) =>
                        <View style={styles.topBannerItem}>
                            <Text style={styles.topBannerItemNumber}>{item.account}</Text>
                            <Text style={styles.topBannerItemTitle}>{item.title}</Text>
                        </View>
                    )
                }
            </View>
        );
    }

    /**
     * 中间的列表
     */
    renderFlatList() {
        const {isRefreshing} = this.state;
        return (
            <FlatList
                numColumns={1}
                style={{ backgroundColor: MainTheme.BackgroundColor, flex: 1 }}
                data={this.state.data}
                ListHeaderComponent={this.renderHeader()}
                ListFooterComponent={this.renderFooter()}//尾巴
                keyExtractor={item => item.date}//这里要是使用重复的key出现莫名其妙的错误
                enableEmptySections={true}//数据可以为空
                renderItem={({ item, index }) => this.renderRecordItem(item, index)}
                onEndReachedThreshold={0.2}//执行上啦的时候10%执行
                onEndReached={() => {
                    this.loadMore()
                }}
                ListEmptyComponent={this.emptyComponent()}
                ItemSeparatorComponent={() => this.renderSeparator()} // 分割线
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={this.refreshData}
                        title="正在加载..." />
                }
            />
        );
    }

    /**
     * 列表头
     */
    renderHeader() {
        return (
            <View style={styles.listHeader}>
                <View style={styles.listHeaderLeft}>
                    <Text style={styles.listHeaderLeftUpText} >提取时间</Text>
                    <Text style={styles.listHeaderLeftBottomText}>提取类型</Text>
                </View>
                <View style={styles.listHeaderCenter}>
                    <Text style={styles.listHeaderCenterUpText} >操作人</Text>
                    <Text style={styles.listHeaderCenterBottomText}>计佣周期</Text>
                </View>
                <View style={styles.listHeaderTail}>
                    <Text style={styles.listHeaderTailText}>提取金额</Text>
                </View>
            </View>
        );
    }

    /**
     * 列表尾
     */
    renderFooter() {
        const { data, isLoadingMore, isRefreshing, isNoMoreData } = this.state;
        let tailText = '';
        if (isLoadingMore || isRefreshing) {
            tailText = '正在加载....';
        }
        else if (data.length > 0) {
            if (!isNoMoreData) {
                tailText = '上拉加载更多';
            }
        }
        return (
            <View>
                {data.length > 0 && this.renderSeparator()}
                {
                    tailText != '' && (
                        <View style={{ height: 44, justifyContent: 'center', alignItems: 'center', }}>
                            <Text style={{ marginTop: 10 }}>{tailText} </Text>
                        </View>
                    )}
            </View>
        )
    }

    /***
     * 列表为空时显示
     */
    emptyComponent() {
        return <View style={styles.emptyView}>
            <View style={{ alignItems: 'center' }}>
                <Image
                    source={require('../../static/img/nodata.png')}
                    style={{
                        resizeMode: 'contain',
                        width: deviceValue.windowWidth * 0.4,
                        height: deviceValue.windowWidth * 0.4,
                        marginRight: 6,
                        padding: 3
                    }} />
                <Text style={{ fontSize: 16 }}>暂无记录</Text>
            </View>
        </View>
    }

    /***
     * 渲染列表项
     */
    renderRecordItem(item, index) {
        return (
            <View style={styles.listItemStyle}>
                <View style={styles.listItemContainer} >
                    {/* 左边部分：图标、提取时间和提取类型 */}
                    <View style={{ flexDirection: 'row', width: deviceValue.windowWidth * 0.3, }}>
                        {/* 图标 */}
                        <View style={styles.listItemIconContainer}>
                            <Image style={styles.listItemIcon}
                                source={(item.status >= 0 && item.status <= 2) && RECORD_STATUS_ICONS[item.status]}
                            />
                        </View>
                        {/* 时间和类型 */}
                        <View style={styles.listItemDateTypeContainer}>
                            <Text style={styles.listItemCreateTimeText}> {item.orderCreateTime} </Text>
                            <Text style={styles.listItemOrderTypeText}>
                                {item.orderType == 1 ? '转存' : '提现'}
                            </Text>
                        </View>
                    </View>
                    {/* 中间部分：操作人和计佣周期 */}
                    <View style={styles.listItemCenterContainer}>
                        <Text style={styles.listItemOperatorText}> {item.operator} </Text>
                        <Text style={styles.listItemJYZQText}>  {item.timeCircle} </Text>
                    </View>
                    {/* 右边部分：提取金额 */}
                    <View style={styles.listItemAmountContainer}>
                        <Text style={[styles.recordItemAmount, item.amount < 0 && { color: MainTheme.SpecialColor }]}>
                            {TXTools.formatMoneyAmount(item.amount, false)}
                        </Text>
                    </View>
                </View>
                {/* 备注 */}
                {this.renderItemRemark(item)}
            </View>
        )
    }

    renderItemRemark(item) {
        if (item.status > 0) {
            return (
                <View style={{ marginLeft: 20, marginTop: 10, flexDirection: 'row', }}>
                    <Text style={{ fontSize: 12, color: MainTheme.GrayColor, }}>
                        {item.status == 1 ? '审核已通过，请注意查收，如有疑问，请联系' : '审核未通过，原因请查看站内信或联系'}
                    </Text>
                    <TouchableOpacity onPress={this.connectOnlineSupport}>
                        <Text style={{ fontSize: 12, color: MainTheme.SpecialColor }}>客服</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    /***
     * 列表分割线
     */
    renderSeparator() {
        return (
            <View style={{
                marginLeft: 15,
                marginRight: 15,
                height: 0.5,
                backgroundColor: MainTheme.DivideLineColor,
            }} />
        );
    }

    /***
     * render方法
     */
    render() {
        return (
            <SafeAreaView style={styles.mainContanier}>
                {this.renderTopBanner()}
                {this.renderFlatList()}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    mainContanier: {
        flex: 1,
        backgroundColor: MainTheme.BackgroundColor,
    },

    topBannerContainer: {
        backgroundColor: MainTheme.SpecialColor,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },

    topBannerItem: {
        justifyContent: 'space-around',
        margin: 10,
        borderColor: MainTheme.BackgroundColor,
        borderWidth: 1.0,
        borderRadius: 5,
        minWidth: 100,
    },

    topBannerItemNumber: {
        color: MainTheme.BackgroundColor,
        fontSize: 15,
        textAlign: 'center',
        marginTop: 12.5,
    },

    topBannerItemTitle: {
        color: MainTheme.BackgroundColor,
        fontSize: 12,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 4,
    },

    emptyView: {
        flex: 1,
        width: deviceValue.windowWidth,
        height: deviceValue.windowHeight * 0.6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    listHeader: {
        flexDirection: 'row',
        backgroundColor: '#F2F2F2',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        paddingBottom: 10,
        borderRadius: 2,
        borderWidth: 0.5,
        borderColor: MainTheme.BackgroundColor,
    },

    listHeaderLeft: {
        alignSelf: 'flex-start',
        paddingTop: 10,
        marginLeft: 15,
    },

    listHeaderLeftUpText: {
        fontSize: 12,
        textAlign: 'left',
        fontWeight: 'bold',
        color: MainTheme.DarkGrayColor,
    },

    listHeaderLeftBottomText: {
        fontSize: 12,
        textAlign: 'left',
        marginTop: 10,
        fontWeight: 'bold',
        color: MainTheme.DarkGrayColor,
    },

    listHeaderCenter: {
        paddingTop: 10,
        alignItems: 'flex-start',
    },

    listHeaderCenterUpText: {
        fontSize: 12,
        textAlign: 'left',
        fontWeight: 'bold',
        color: MainTheme.DarkGrayColor,
    },

    listHeaderCenterBottomText: {
        fontSize: 12,
        textAlign: 'left',
        marginTop: 10,
        fontWeight: 'bold',
        color: MainTheme.DarkGrayColor,
    },

    listHeaderTail: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginRight: 15,
    },

    listHeaderTailText: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'right',
        marginTop: 10,
        color: MainTheme.DarkGrayColor,
    },

    listHeaderAmountContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: deviceValue.windowWidth * 0.2,
    },

    listItemStyle: {
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
    },

    listItemContainer: {
        flexDirection: 'row',
        backgroundColor: MainTheme.BackgroundColor,
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    listItemIconContainer: {
        justifyContent: 'center',
        alignSelf: 'flex-start',
        alignItems: 'flex-end',
    },

    listItemIcon: {
        width: 15,
        height: 16,
        marginRight: 4,
    },

    listItemDateText: {
        fontSize: 12,
        color: MainTheme.DarkGrayColor,
        textAlign: 'left',
    },

    listItemDateTypeContainer: {
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },

    listItemCreateTimeText: {
        fontSize: 12,
        color: MainTheme.GrayColor,
        textAlign: 'left',
    },

    listItemOrderTypeText: {
        fontSize: 12,
        color: MainTheme.GrayColor,
        textAlign: 'left',
        marginTop: 10,
    },

    listItemCenterContainer: {
        justifyContent: 'center',
        alignItems: 'flex-start',
    },

    listItemOperatorText: {
        fontSize: 12,
        color: MainTheme.GrayColor,
        textAlign: 'left',
    },

    listItemJYZQText: {
        fontSize: 12,
        color: MainTheme.GrayColor,
        marginTop: 10,
        textAlign: 'left',
    },

    listItemAmountContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: deviceValue.windowWidth * 0.3,
    },

    recordItemAmount: {
        fontSize: 16,
        textAlign: 'right',
        alignSelf: 'flex-end',
        color: MainTheme.FundGreenColor,
    },

});