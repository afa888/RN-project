import React, { Component } from 'react';
import {
    View, FlatList, Text, Image,
    TouchableOpacity, SafeAreaView,
    StyleSheet, RefreshControl,
} from "react-native";

import deviceValue from "../../utils/DeviceValue";
import { WEBNUM } from "../../utils/Config";
import http from "../../http/httpFetch";
import MainTheme from '../../utils/AllColor';
import TXTools from '../../utils/Htools';
import TXToastManager from '../../tools/TXToastManager'

const PAGE_SIZE = 50;
export default class AgentRewardRecorder extends Component<Props> {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: (
                MainTheme.renderCommonTitle('佣金流水')
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

        startTime: '',  // 开始时间(年月日)
        endTime: '',    // 结束时间(年月日)
        sortType: '1',  // 排序方式: 1-提取时间升序 2-提取时间降序 3-提佣金额升序 4-提佣金额降序
        timeIdentify: '',   // 时间标识 today-今天 week-本周 month-本月

        outstandingCommissions: 0,  // 当前未结算佣金
        extractedTimes: 0,  // 已经提取佣金次数
        allExtractedCommissions: 0, // 累计提取佣金
        data: [],
        /*
        data: [
            {
                date: '2019-09-28',
                directCommissions: 15321.00,
                teamCommissions: 2521.00,
                outstandingCommissions: 14433.05
            },
            {
                date: '2019-09-29',
                directCommissions: 101.00,
                teamCommissions: 211.00,
                outstandingCommissions: -312.00
            },
            {
                date: '2019-09-30',
                directCommissions: 789.00,
                teamCommissions: 1888.00,
                outstandingCommissions: 3234.05
            }
        ],
        */
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
        const { isLoadingMore, isRefresh, isNoMoreData } = this.state;

        if (isLoadingMore || isRefresh || isNoMoreData) {
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
        const { isLoadingMore, isRefresh, isNoMoreData } = this.state;

        if (isLoadingMore || isRefresh || isNoMoreData) {
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
        http.post('agency/commissionPage', params, isRefresh).then(res => {
            if (res.status == 10000) {
                this.setState({
                    allExtractedCommissions: res.data.allExtractedCommissions,
                    outstandingCommissions: res.data.outstandingCommissions,
                    extractedTimes: res.data.extractedTimes,
                    isNoMoreData: res.data.list.count < PAGE_SIZE,
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

            this.setState({
                isRefreshing: false,
                isLoadingMore: false
            });

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
                        refreshing={this.state.isRefreshing}
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
                <View style={styles.listHeaderIconContainer}>
                    <Image style={styles.listHeaderIcon}
                        source={require('../../static/img/agent/administer_icon_date.png')} />
                    <Text style={styles.listHeaderDateText} >日期</Text>
                </View>
                <View style={styles.listHeaderAmountContainer}>
                    <Text style={styles.listHeaderSingleText} >直属产佣</Text>
                </View>
                <View style={styles.listHeaderAmountContainer}>
                    <Text style={styles.listHeaderTeamText}>团队产佣</Text>
                </View>
                <View style={styles.listHeaderAmountContainer}>
                    <Text style={styles.listHeaderTotalText}>合计佣金</Text>
                </View>
            </View>
        );
    }

    /**
     * 列表尾
     */
    renderFooter() {
        if (this.state.data.length > 15 && this.state.isLoadingMore == 'LoreMoreing') {
            return (
                <View style={{ height: 44, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>{'正在加载....'}</Text>
                </View>
            )
        } else if (this.state.isLoadingMore == 'LoreMoreEmpty' && this.state.data.length >= 10) {
            return (
                <View style={{ height: 44, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>{'没有更多了'}</Text>
                </View>
            )
        } else {
            return null
        }
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
                <Text style={{ fontSize: 16 }}>暂无数据</Text>
            </View>
        </View>
    }

    /***
     * 渲染列表项
     */
    renderRecordItem(item, index) {
        return (
            <View style={styles.listItemContainer} >
                <View style={styles.listHeaderIconContainer}>
                    <Image style={styles.listHeaderIcon}
                        source={require('../../static/img/agent/administer_icon_date.png')} />
                    <Text style={styles.listItemDateText}>{item.date}</Text>
                </View>
                <View style={styles.listHeaderAmountContainer}>
                    <Text style={styles.listItemSingleText}>
                        {TXTools.formatMoneyAmount(item.directCommissions, false)}
                    </Text>
                </View>
                <View style={styles.listHeaderAmountContainer}>
                    <Text style={styles.listItemTeamText}>
                        {TXTools.formatMoneyAmount(item.teamCommissions, false)}
                    </Text>
                </View>
                <View style={styles.listHeaderAmountTotalContainer}>
                    <Text style={[styles.listItemTotalText, item.outstandingCommissions < 0 && { color: MainTheme.SpecialColor }]}>
                        {TXTools.formatMoneyAmount(item.outstandingCommissions, false)}
                    </Text>
                </View>
            </View>
        )
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
                backgroundColor: MainTheme.DivideLineColor
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
        height: 50,
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 2,
        borderWidth: 0.5,
        borderColor: MainTheme.BackgroundColor,
    },

    listHeaderIconContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: deviceValue.windowWidth * 0.2,
    },

    listHeaderIcon: {
        width: 15,
        height: 16,
        marginRight: 4,
    },

    listHeaderAmountContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: deviceValue.windowWidth * 0.2,
    },

    listHeaderAmountTotalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: deviceValue.windowWidth * 0.2,
    },

    listHeaderDateText: {
        fontSize: 12,
        textAlign: 'left',
    },

    listHeaderSingleText: {
        fontSize: 12,
        textAlign: 'left',
    },

    listHeaderTeamText: {
        fontSize: 12,
        textAlign: 'center',
    },

    listHeaderTotalText: {
        fontSize: 12,
        textAlign: 'right',
        alignSelf: 'flex-end',
    },

    listItemContainer: {
        flexDirection: 'row',
        backgroundColor: MainTheme.BackgroundColor,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 3,
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        height: 50,
    },

    listItemDateText: {
        fontSize: 12,
        color: MainTheme.DarkGrayColor,
        textAlign: 'left',
    },

    listItemSingleText: {
        fontSize: 12,
        color: MainTheme.GrayColor,
        textAlign: 'left',
    },

    listItemTeamText: {
        fontSize: 12,
        color: MainTheme.GrayColor,
        textAlign: 'center',
    },

    listItemTotalText: {
        fontSize: 16,
        textAlign: 'right',
        alignSelf: 'flex-end',
        color: MainTheme.FundGreenColor,
    },

    recordItemAmount: {
        color: MainTheme.SpecialColor,
        textAlign: 'right',
        fontSize: 12,
        marginTop: 10,
    }

});