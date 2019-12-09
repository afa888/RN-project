import React, { Component } from 'react';
import {
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Modal,
    SafeAreaView,
    TouchableWithoutFeedback,
} from "react-native";
import {
    category_group_divide_line_color,
    MainTheme,
} from "../../utils/AllColor"
import http from "../../http/httpFetch";
import Picker from 'react-native-picker';
import { Calendar, CalendarList, Agenda, LocaleConfig } from 'react-native-calendars';
import deviceValue from "../../utils/DeviceValue";
import TXTools from '../../utils/Htools';
import CalendarDialog from "../../customizeview/CalendarDialog";
import TXProgressHUB from '../../tools/TXProgressHUB';

const TYPE_TITLE_MAP = new Map([['加款', '中心钱包加款'], ['存款', '中心钱包加款'], ['彩金', '赠送彩金'],
['优惠', '赠送优惠'], ['提款', '中心钱包扣款'], ['扣款', '中心钱包扣款'], ['返水', '游戏返水'],
['转存', '代理佣金 -> 中心钱包'], ['活动', '活动奖励'],
]);
//0：全部 ;1：加款 ;2：扣款;3：彩金4：优惠;5：提款;6：反水;7：转账;8：存款;9；活动
const RECORD_TYPES = [
    { title: '全部', key: 'all', value: '0' },
    { title: '存款', key: 'ck', value: '8' },
    { title: '提款', key: 'tk', value: '5' },
    { title: '转账', key: 'zz', value: '7' },
    { title: '加款', key: 'jk', value: '1' },
    { title: '扣款', key: 'kk', value: '2' },
    { title: '优惠', key: 'yh', value: '4' },
    { title: '彩金', key: 'cj', value: '3' },
    { title: '返水', key: 'fs', value: '6' },
    { title: '活动', key: 'hd', value: '9' },
    { title: '转存', key: 'zc', value: '10' },
];
//0：全部;1：处理中;2：成功;3：失败
const RESULT_TYPES = [
    { title: '全部', key: 'all', value: '0' },
    { title: '处理中', key: 'ck', value: '1' },
    { title: '成功', key: 'tk', value: '2' },
    { title: '失败', key: 'zz', value: '3' },
];

let pageNumber = 1;
let total = 0;
let isStartTag = true;

export default class FundRecordScreen extends Component<Props> {

    constructor(props) {
        super(props);

        this.state = {
            isDialogVisible: false,
            refreshing: false,
            isLoreMoreing: 'LoreMoreing',
            listPosition: 0,
            data: [],
            total: 0,

            maxDate: '',                // 日历控件的最大可选日期
            minDate: '',                // 日历控件的最小可选日期

            startTime: '',              // 开始时间(年月日)
            endTime: '',                // 结束时间(年月日)

            index: 0,                   // 时间段的索引（今天、三天、一周、一月），-1为自定义
            isModalVisible: false,      // 筛选Modal是否可见
            curSelectTypeIndex: 0,      // 用户在Modal中点选的记录类型的索引（RECORD_TYPES）
            curSelectResultIndex: 0,    // 用户在Modal中段暄的记录结果类型的索引（RESULT_TYPES）
        };
    }

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            headerTitle: (
                MainTheme.renderCommonTitle('资金记录')
            ),
            headerLeft: (
                MainTheme.renderCommonBack(navigation)
            ),
            headerRight: <View
                style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity style={{ width: 60, height: 28, alignItems: 'center' }} onPress={() => {
                    if (navigation.state.params !== undefined) {
                        navigation.state.params.choseType()
                    };
                }}>
                    <Image
                        source={require('../../static/img/more.png')}
                        style={{
                            resizeMode: 'contain',
                            width: 25,
                            height: 25,
                            marginRight: 12
                        }} />
                </TouchableOpacity>
            </View>
        };
    };

    componentWillMount() {
        LocaleConfig.locales['fr'] = {
            monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            today: 'Aujourd\'hui'
        };
        LocaleConfig.defaultLocale = 'fr';
        // this.getmyDate()
    }

    componentDidMount() {
        this.props.navigation.setParams({ choseType: this.choseType })
        this.selectTime(0);
    }

    componentWillUnmount() {
        this.hideModal()
        Picker.hide()
    }

    //http://m.txbet1788.com/TXW/User/queryByTreasurePage
    refreshData = () => {
        pageNumber = 1;
        this.setState({
            refreshing: true,
            data: []
        });
        this.postList()
    }

    postList = () => {
        const { startTime, endTime, curSelectTypeIndex, curSelectResultIndex } = this.state;
        const recordType = RECORD_TYPES[curSelectTypeIndex].value;
        const resultStatus = RESULT_TYPES[curSelectResultIndex].value;

        let prams = {
            pageNo: pageNumber,
            pageSize: 20,
            startTime: startTime + ' 00:00:00',
            endTime: endTime + ' 23:59:59',
            type: recordType,
            status: resultStatus,
        };

        http.post('User/queryByTreasurePage', prams).then(res => {
            console.log(res);

            this.setState({ refreshing: false })

            if (res == undefined) {
                TXProgressHUB.show('请求失败，请重试！', 2000);
                return;
            }

            if (res.status === 10000) {
                total = res.data.total
                this.isLoreMore = false;
                if (pageNumber > 1) {
                    if (res.data.list !== null) {
                        let more = this.state.data;
                        console.log("长度 " + res.data.list.length)
                        if (res.data.list.length > 0) {
                            for (var i = 0; i < res.data.list.length; i++) {
                                more.push(res.data.list[i])
                            }
                        }
                        this.setState({
                            data: more,
                        });
                    }

                } else {
                    this.setState({
                        data: res.data.list,
                    });
                }
            }
            else {
                TXProgressHUB.show(res.data.msg || '请求失败，请重试！', 2000);
            }
        }).catch(err => {
            console.error(err)
        });
    }

    /**
     * 显示筛选框
     */
    choseType = () => {
        const { startTime, endTime, curSelectTypeIndex, curSelectResultIndex } = this.state;
        this.oldState = {
            old_startTime: startTime,
            old_endTime: endTime,
            old_curSelectTypeIndex: curSelectTypeIndex,
            old_curSelectResultIndex: curSelectResultIndex,
        };
        this.setState({ isModalVisible: true });
    };

    renderFooter = () => {
        if (this.state.data.length > 15 && this.state.isLoreMoreing == 'LoreMoreing') {
            return (
                <View style={{
                    height: 44,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text>{'正在加载....'}</Text>
                </View>
            )
        } else if (this.state.isLoreMoreing == 'LoreMoreEmpty' && this.state.data.length >= 10) {
            return (
                <View style={{
                    height: 44,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text>{'没有更多了'}</Text>
                </View>
            )
        } else {
            return null
        }

    }

    isLoreMore = false;
    LoreMore = () => {
        if (this.isLoreMore == false) {
            if (this.state.data.length >= total) {
                this.setState({
                    isLoreMoreing: 'LoreMoreEmpty'
                })
                return
            }
            this.setState({
                isLoreMoreing: 'LoreMoreing',
            });
            this.isLoreMore = true;
            pageNumber++;
            this.postList()
        }
    }
    /**
     * 渲染每条记录
     */
    renderItem = ({ item, index }) => {
        return (
            <View>
                {/* 上半部分：记录的基本信息 */}
                <TouchableOpacity style={styles.recordItemCellContainer}
                    onPress={() => this.onRecordItemPressed(item, index)} >
                    {/* 最左侧小图标 */}
                    <Image source={this.getIconForItem(item)}
                        style={styles.recordItemCellLeftImage} />
                    {/* 中间部分：标题和日期 */}
                    <View style={styles.recordItemCelCenterPanel}>
                        <Text style={styles.recordItemCellTitle}> {this.switchTypeToTitle(item)} </Text>
                        <Text style={styles.recordItemCellDate}> {item.createDate} </Text>
                    </View>
                    {/* 最右侧：金额及类型 */}
                    <View style={styles.recordIetmCellRightPanel}>
                        <Text style={{ ...styles.recordItemCellAmount, color: this.getAmountColorForItem(item) }}>
                            {TXTools.formatMoneyAmount(item.amount, false)}
                        </Text>
                        <Text style={styles.recordItemCellType}>{item.type}</Text>
                    </View>
                </TouchableOpacity>
                {/* 下半部分：记录的详细信息 */}
                {item.select !== undefined && item.select && (
                    <View style={styles.recordItemCellDetailsPanel}>
                        <Text style={styles.itemTextRemark}>订单号 {"         " + item.orderNo}</Text>
                        <Text style={styles.itemTextRemark}>订单类型 {"       " + item.type}</Text>
                        <Text style={styles.itemTextRemark}>订单金额 {"       " + item.amount}</Text>
                        <Text style={styles.itemTextRemark}>订单状态 {"       " + item.status}</Text>
                        <Text style={styles.itemTextRemark}>创建时间 {"       " + item.createDate}</Text>
                    </View>
                )}
            </View>
        )
    }

    /*分割线*/
    separatorComponent = () => {
        return <View style={{
            marginLeft: 15,
            marginRight: 15,
            height: 0.5,
            backgroundColor: MainTheme.DivideLineColor
        }} />
    }
    /**
     * 根据记录的type产生对应的标题
     */
    switchTypeToTitle = (item) => {
        if (item != undefined) {
            let title = TYPE_TITLE_MAP.get(item.type);

            if (title == undefined) {
                if (item.remark.length > 0) {
                    return item.remark;
                }
                return item.type;
            }

            return title;
        }
        return '';
    }
    /**
     * 根据记录的status返回对应的图标
     */
    getIconForItem = (item) => {
        let status = item.status;
        if (status.indexOf('成功') != -1) {
            return require('../../static/img/UserCenter/userCenter_fund_success.png');
        }
        else if (status.indexOf('失败') != -1 ||
            status.indexOf('错误') != -1 ||
            status.indexOf('取消') != -1) {
            return require('../../static/img/UserCenter/userCenter_fund_failed.png');
        }

        return require('../../static/img/UserCenter/userCenter_fund_wait.png');
    }
    /**
     * 根据记录的type及amount返回相应的字体颜色
     */
    getAmountColorForItem = (item) => {
        if (item.type === '转存') {
            return MainTheme.DarkGrayColor;
        }
        else if (item.amount.startsWith('-')) {
            return MainTheme.FundGreenColor;
        }
        return MainTheme.SpecialColor;
    }
    /**
     * 响应记录被点击事件
     */
    onRecordItemPressed = (item, index) => {
        let clickData = []
        for (var i = 0; i < this.state.data.length; i++) {
            clickData[i] = this.state.data[i]
            if (i === index) {
                if (clickData[i].select !== undefined) {
                    clickData[i].select = !clickData[i].select;
                } else {
                    var key = "select";
                    var value = true

                    var key2 = "key"
                    var value2 = i
                    clickData[i][key2] = value2;
                    clickData[i][key] = value;
                }

            } else {
                if (clickData[i].select !== undefined) {
                    clickData[i].select = false;
                } else {
                    var key = "select";
                    var value = false

                    var key2 = "key"
                    var value2 = i
                    clickData[i][key2] = value2;
                    clickData[i][key] = value;
                }
            }
        }
        this.setState({ data: clickData });
    }

    /**
     * 选择时间标签
     */
    selectTime = (index) => {
        let fromDate = '', toDate = '';
        if (index === 0) {  // 今天
            fromDate = TXTools.formatDateToCommonString(new Date());
        } else if (index === 1) { // 三天
            let date = TXTools.dateAfter(-2);
            fromDate = TXTools.formatDateToCommonString(date);
        } else if (index === 2) { // 一周
            let date = TXTools.dateAfter(-6);
            fromDate = TXTools.formatDateToCommonString(date);
        } else if (index === 3) { //一月
            let date = TXTools.dateAfter(-29);
            fromDate = TXTools.formatDateToCommonString(date);
        }
        toDate = TXTools.formatDateToCommonString(new Date());

        this.setState({
            index: index,
            startTime: fromDate,
            endTime: toDate,
        }, () => this.refreshData());
    }

    /**
     * 渲染记录筛选的时间段
     */
    renderSearchTime = () => {
        let timeAarry = ['今天', '三天', '一周', '一月'];
        const { index, refreshing } = this.state;
        return (
            <View style={styles.betTimeContainer}>
                {
                    timeAarry.map((item, cur) =>
                        <TouchableOpacity onPress={() => {
                            if (!refreshing && index != cur) {
                                this.setState({ index: cur, data: [] }, () => this.selectTime(cur));
                            }
                        }} style={index == cur ? styles.timeSelectContainer : styles.timeTextContainer}>
                            <Text style={index == cur ? styles.timeSelectText : styles.timeText}>{item}</Text>
                        </TouchableOpacity>
                    )
                }
            </View>
        );
    }

    renderFilterModal = () => {
        const { startTime, endTime } = this.state;

        let arr = startTime.split('-');
        let fromDate = arr.length == 3 && (arr[0] + '年' + arr[1] + '月' + arr[2] + '日');
        let ends = endTime.split('-');
        let toDate = ends.length == 3 && (ends[0] + '年' + ends[1] + '月' + ends[2] + '日');

        return (
            <Modal visible={this.state.isModalVisible}
                transparent={true}
                animated={true}
                animationType={'fade'}
                onRequestClose={this.hideModal}
            >
                <SafeAreaView style={{ flex: 1, flexDirection: 'row', }}>
                    <TouchableWithoutFeedback onPress={this.hideModal}>
                        <View style={{ flex: 3, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
                    </TouchableWithoutFeedback>

                    <View style={styles.modalRightContainer}>
                        <Text style={styles.modalRightTitle}>筛选</Text>
                        {/* 起止时间 */}
                        <Text style={{ ...styles.modalRightSubtitle, marginTop: 40 }}>起止时间</Text>
                        <View style={styles.modalTimePeriodContainer}>
                            <TouchableOpacity onPress={() => this.showDialog(true, true)}>
                                <Text style={styles.modalRightSubtitle}>
                                    {fromDate}
                                </Text>
                            </TouchableOpacity>
                            <View style={{ marginLeft: 10, marginRight: 10 }}><Text>~</Text></View>
                            <TouchableOpacity onPress={() => this.showDialog(true, false)}>
                                <Text style={styles.modalRightSubtitle}>
                                    {toDate}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {/* 交易类型 */}
                        <Text style={{ ...styles.modalRightSubtitle, marginTop: 30 }}>交易类型</Text>
                        {/* 交易的种类列表 */}
                        <View style={{ marginTop: 10, flexDirection: 'row', flexWrap: 'wrap' }}>
                            {
                                RECORD_TYPES.map((item, index) =>
                                    <TouchableOpacity style={styles.modalFilterOptionContainer}
                                        onPress={() => this.setState({ curSelectTypeIndex: index })}>
                                        <Text style={
                                            this.state.curSelectTypeIndex == index ? styles.modalFilterOptionTextHighlighted :
                                                styles.modalFilterOptionText
                                        } >
                                            {item.title}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                        {/* 处理结果类型 */}
                        <Text style={{ ...styles.modalRightSubtitle, marginTop: 30, }}>处理结果</Text>
                        <View style={{ marginTop: 10, flexDirection: 'row', flexWrap: 'wrap' }}>
                            {
                                RESULT_TYPES.map((item, index) =>
                                    <TouchableOpacity style={styles.modalFilterOptionContainer}
                                        onPress={() => this.setState({ curSelectResultIndex: index })} >
                                        <Text style={this.state.curSelectResultIndex == index ? styles.modalFilterOptionTextHighlighted :
                                            styles.modalFilterOptionText}>{item.title}</Text>
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                        {/* 功能按钮 */}
                        <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center', }}>
                            <TouchableOpacity onPress={this.cancelFilter} style={styles.modalFilterCancelButton} >
                                <Text style={{ fontSize: 16, color: MainTheme.SpecialColor, }}>重置并取消</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.submitFilter} style={styles.modalFilterSubmitButton}>
                                <Text style={{ fontSize: 16, color: MainTheme.SubmitTextColor, }}>筛选</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* 日期选择弹框 */}
                    {this.state.maxDate.length > 3 && this.state.minDate.length > 3 &&
                        <CalendarDialog
                            _dialogVisible={this.state.isDialogVisible}
                            currentData={this.state.maxDate}
                            minDate={this.state.minDate}
                            _dialogCancle={() => { this.hideDialog() }}
                            onDayPress={(days) => {
                                if (isStartTag) {
                                    if (endTime.length > 0 && days.dateString > endTime) {
                                        this.setState({
                                            startTime: days.dateString,
                                            endTime: '',
                                            index: -1,
                                        });
                                    }
                                    else {
                                        this.setState({
                                            startTime: days.dateString,
                                            index: -1,
                                        });
                                    }
                                } else {
                                    this.setState({
                                        endTime: days.dateString,
                                        index: -1,
                                    })
                                }
                                this.hideDialog();
                            }}
                        />
                    }
                </SafeAreaView>
            </Modal>
        );
    }

    cancelFilter = () => {
        this.setState({
            isModalVisible: false,
            index: 0,
            curSelectTypeIndex: 0,
            curSelectResultIndex: 0,
        }, () => this.selectTime(0));
    }

    submitFilter = () => {
        const { startTime, endTime } = this.state;
        if (startTime.length > 0 || endTime.length > 0) {
            if (startTime.length == 0) {
                TXProgressHUB.show('请选择开始日期');
                return;
            }
            else if (endTime.length == 0) {
                TXProgressHUB.show('请选择结束日期');
                return;
            }
        }

        this.setState({ isModalVisible: false });
        this.refreshData();
    }

    hideModal = () => {
        if (this.oldState == undefined) {
            this.setState({ isModalVisible: false });
        }
        else {
            this.setState({
                isModalVisible: false,

                startTime: this.oldState.old_startTime,
                endTime: this.oldState.old_endTime,
                curSelectTypeIndex: this.oldState.old_curSelectTypeIndex,
                curSelectResultIndex: this.oldState.old_curSelectResultIndex,
            });
        }
    }

    showDialog = (blo, b) => {
        Picker.hide()
        isStartTag = b
        if (isStartTag) {
            let oneMonthAgo = TXTools.dateAfter(-29);
            this.setState({
                minDate: TXTools.formatDateToCommonString(oneMonthAgo),
                maxDate: TXTools.formatDateToCommonString(new Date),
                isDialogVisible: true,
            });

        } else {
            const { startTime } = this.state;
            this.setState({
                minDate: startTime,
                maxDate: TXTools.formatDateToCommonString(new Date),
                isDialogVisible: true,
            }, () => {
                const { maxDate, minDate } = this.state;
                console.log("MaxDate:" + maxDate + ", MinDate:" + minDate);
            });
        }
    }

    hideDialog = () => {
        this.setState({ isDialogVisible: false });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.renderSearchTime()}

                {this.renderFilterModal()}

                <FlatList
                    numColumns={1}
                    showsVerticalScrollIndicator={false}
                    style={{ backgroundColor: 'white' }}
                    data={this.state.data}
                    ListFooterComponent={this.renderFooter}//尾巴
                    keyExtractor={item => (item.orderNo + item.type)}//这里要是使用重复的key出现莫名其妙的错误
                    enableEmptySections={true}//数据可以为空
                    renderItem={this.renderItem}
                    onEndReachedThreshold={0.2}//执行上啦的时候10%执行
                    onEndReached={() => {
                        this.LoreMore()
                    }}
                    ListEmptyComponent={this.emptyComponent()}
                    ItemSeparatorComponent={this.separatorComponent} // 分割线
                    refreshControl={<RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.refreshData}
                        title="Loading..." />}
                />

            </View>
        );
    }

    emptyComponent = () => {
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
                <Text style={{
                    fontSize: 16
                }}>暂无数据</Text>
            </View>

        </View>
    }
}

const styles = StyleSheet.create({
    betTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: deviceValue.windowWidth / 8,
        alignItems: 'center',
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: MainTheme.BackgroundColor,
    },

    timeTextContainer: {
        backgroundColor: '#EEEEEE',
        borderColor: '#EEEEEE',
        borderWidth: 0.5,
        borderRadius: 4,
    },

    timeText: {
        color: MainTheme.DarkGrayColor,
        fontSize: 12,
        padding: 6,
        marginLeft: 12,
        marginRight: 12,
    },

    timeSelectContainer: {
        backgroundColor: MainTheme.SpecialColor,
        borderColor: MainTheme.SpecialColor,
        borderWidth: 0.5,
        borderRadius: 4,
    },

    timeSelectText: {
        color: MainTheme.SubmitTextColor,
        fontSize: 12,
        fontWeight: 'bold',
        padding: 6,
        marginLeft: 12,
        marginRight: 12,
    },

    timeDividerView: { backgroundColor: category_group_divide_line_color, height: 1, width: deviceValue.windowWidth },
    choiceTimeDividerView: { backgroundColor: 'white', height: 1, width: deviceValue.windowWidth * 0.6, marginRight: 12 },
    right_item_view: {
        height: 85,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 12
    },
    itemTextRemark: { marginRight: 6, color: 'black', padding: 3, fontSize: 12, height: 25 },
    emptyView: {
        flex: 1,
        width: deviceValue.windowWidth,
        height: deviceValue.windowHeight * 0.6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    recordItemCellContainer: {
        width: deviceValue.windowWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: MainTheme.BackgroundColor,
        alignItems: 'center',
        padding: 3
    },

    recordItemCellLeftImage: {
        marginLeft: 20,
        marginTop: 10,
        marginRight: 5,
        alignSelf: 'flex-start',
    },

    recordItemCelCenterPanel: {
        flex: 1,
        width: deviceValue.windowWidth / 2,
    },

    recordItemCellTitle: {
        color: MainTheme.DarkGrayColor,
        marginTop: 10,
        marginBottom: 10,
        fontSize: 14,
    },

    recordItemCellDate: {
        fontSize: 12,
        color: MainTheme.GrayColor,
        marginBottom: 5,
    },

    recordIetmCellRightPanel: {
        marginRight: 20,
    },

    recordItemCellAmount: {
        fontSize: 18,
        marginBottom: 10,
    },

    recordItemCellType: {
        color: MainTheme.GrayColor,
        fontSize: 12,
        textAlign: 'right',
    },
    // 记录的下半部分（详细信息)的背景
    recordItemCellDetailsPanel: {
        backgroundColor: MainTheme.LightGrayColor,
        padding: 6,
        marginLeft: 15,
        marginRight: 15,
    },

    modalRightContainer: {
        flex: 7,
        backgroundColor: MainTheme.BackgroundColor,
        alignItems: 'flex-start',
    },

    modalRightTitle: {
        marginTop: 20,
        marginLeft: 10,
        fontSize: 15,
        color: MainTheme.DarkGrayColor,
    },

    modalRightSubtitle: {
        fontSize: 14,
        color: MainTheme.DarkGrayColor,
        minWidth: 100,
    },

    modalTimePeriodContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
        marginLeft: 10,
    },

    modalFilterOptionContainer: {
        width: deviceValue.windowWidth * 0.2,
        marginRight: 5,
        marginBottom: 10,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalFilterOptionText: {
        backgroundColor: '#EEEEEE',
        color: MainTheme.DarkGrayColor,
        paddingTop: 5,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 5,
    },

    modalFilterOptionTextHighlighted: {
        backgroundColor: MainTheme.SpecialColor,
        color: MainTheme.SubmitTextColor,
        paddingTop: 5,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 5,
    },

    modalFilterCancelButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        marginRight: 5,
        backgroundColor: MainTheme.BackgroundColor,
        borderColor: MainTheme.SpecialColor,
        borderWidth: 0.5,
        paddingTop: 10,
        paddingBottom: 10,
    },

    modalFilterSubmitButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: MainTheme.SpecialColor,
        paddingTop: 10,
        paddingBottom: 10,
        marginLeft: 5,
        marginRight: 10,
    }

});

