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
export default class AgentInviteRecorder extends Component<Props> {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: (
                MainTheme.renderCommonTitle('邀请记录')
            ),
            headerLeft: (
                MainTheme.renderCommonBack(navigation)
            ),
            headerRight: (
                <View />
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
        total: 0,
        dayCount: 0,
        weekCount: 0,
        monthCount: 0,
        data: [],
    }

    constructor(props) {
        super(props);
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
        const { isLoadingMore, isRefresh } = this.state;

        if (isLoadingMore || isRefresh) {
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
            // startTime:'',
            // endTime:'',
            // timeIdentify:'',
        };
        http.post('agency/getInviteRecord', params, true).then(res => {
            if (res.status == 10000) {
                let noMoreData = res.data.list.length < PAGE_SIZE;
                this.setState({
                    total: res.data.total,
                    dayCount: res.data.dayCount,
                    weekCount: res.data.weekCount,
                    monthCount: res.data.monthCount,
                    isNoMoreData: noMoreData,
                });

                if (isRefresh) {
                    this.currentPageNo = 1;
                    this.setState({
                        isRefreshing: false,
                        isLoadingMore: false,
                        data: res.data.list,
                    });
                }
                else {
                    this.currentPageNo += 1;
                    this.setState({
                        isRefreshing: false,
                        isLoadingMore: false,
                        data: this.state.data.concat(res.data.list),
                    });
                }
            }
            else {
                this.setState({
                    isRefreshing: false,
                    isLoadingMore: false,
                });
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

    /***************************************   render方法族   ***************************************/

    /**
     * 顶部框
     */
    renderTopBanner() {
        const items = [
            { account: this.state.dayCount, title: '今天' },
            { account: this.state.weekCount, title: '本周' },
            { account: this.state.monthCount, title: '本月' },
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
                keyExtractor={item => item.agencyUserName}//这里要是使用重复的key出现莫名其妙的错误
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
                        source={require('../../static/img/agent/administer_icon_zshy.png')} />
                </View>
                <View style={styles.listHeaderCenter}>
                    <Text style={styles.listHeaderCenterUpText} >会员id</Text>
                    <Text style={styles.listHeaderCenterBottomText}>注册时间</Text>
                </View>
                <View style={styles.listHeaderTail}>
                    <Text style={styles.listHeaderTailUpText}>旗下会员</Text>
                    <Text style={styles.listHeaderTailBottomText}>累计提供佣金</Text>
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
            tailText = isNoMoreData ? '没有更多数据了' : '上拉加载更多';
        }

        return (
            <View>
                {data.length > 0 && this.renderSeparator()}
                {
                    tailText != '' && (
                        <View style={{ height: 44, justifyContent: 'center', alignItems: 'center', }}>
                            <Text style={{ marginTop: 10, color: MainTheme.GrayColor, fontSize: 12 }}>
                                {tailText}
                            </Text>
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
        const teamIcon = require('../../static/img/agent/administer_icon_tdgl.png');
        const singleIcon = require('../../static/img/agent/administer_icon_zshy.png');
        return (
            <View style={styles.listItemContainer} >
                <View style={styles.listHeaderIconContainer}>
                    <Image style={{ ...styles.listHeaderIcon, marginTop: 2.5 }}
                        source={item.memberClasses == '1' ? singleIcon : teamIcon} />
                </View>
                <View style={styles.recordItemCenterPanel}>
                    <Text style={styles.recordItemName}>{item.agencyUserName}</Text>
                    <Text style={styles.recordItemDate}>{item.registTime}</Text>
                </View>
                <View style={styles.recordItemTailPanel}>
                    <Text style={item.isAgency == 1 ? styles.recordItemCount : styles.recordItemNotAgency}>
                        {item.isAgency == 1 ? item.teamNum : '未开通代理'}
                    </Text>
                    <Text style={styles.recordItemAmount}>
                        {TXTools.formatMoneyAmount(item.accumulatedCommission, false)}
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
        marginTop: 6,
    },

    topBannerItemTitle: {
        color: MainTheme.BackgroundColor,
        fontSize: 12,
        textAlign: 'center',
        marginTop: 5,
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
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
        borderRadius: 2,
        borderWidth: 0.5,
        borderColor: MainTheme.BackgroundColor,
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
    },

    listHeaderIconContainer: {
        alignSelf: 'flex-start',
    },

    listHeaderIcon: {
        width: 15,
        height: 16,
        marginRight: 4,
    },

    listHeaderCenter: {
        minWidth: deviceValue.windowWidth * 0.4,
    },

    listHeaderCenterUpText: {
        fontSize: 12,
        textAlign: 'left',
    },

    listHeaderCenterBottomText: {
        fontSize: 12,
        textAlign: 'left',
        marginTop: 10,
    },

    listHeaderTail: {
        minWidth: deviceValue.windowWidth * 0.4,
    },

    listHeaderTailUpText: {
        fontSize: 12,
        textAlign: 'right',
    },

    listHeaderTailBottomText: {
        fontSize: 12,
        textAlign: 'right',
        marginTop: 10,
    },

    listItemContainer: {
        flexDirection: 'row',
        backgroundColor: MainTheme.BackgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 15,
        marginBottom: 3,
        marginRight: 10,
    },

    recordItemCenterPanel: {
        minWidth: deviceValue.windowWidth * 0.4 + 20,
    },

    recordItemTailPanel: {
        minWidth: deviceValue.windowWidth * 0.4,
    },

    recordItemName: {
        fontSize: 15,
        color: MainTheme.DarkGrayColor,
    },

    recordItemDate: {
        fontSize: 12,
        color: MainTheme.GrayColor,
        marginTop: 10,
    },

    recordItemCount: {
        color: MainTheme.SpecialColor,
        textAlign: 'right',
        fontSize: 12,
    },

    recordItemNotAgency: {
        color: MainTheme.GrayColor,
        textAlign: 'right',
        fontSize: 12,
    },

    recordItemAmount: {
        color: MainTheme.SpecialColor,
        textAlign: 'right',
        fontSize: 12,
        marginTop: 10,
    }

});