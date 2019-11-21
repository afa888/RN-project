import React, { Component } from 'react';
import {
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import MainTheme from "../../utils/AllColor";
import deviceValue from "../../utils/DeviceValue";
import http from "../../http/httpFetch";
import Picker from 'react-native-picker';
import { LocaleConfig } from 'react-native-calendars';
import CalendarDialog from "../../customizeview/CalendarDialog";
import TXTools from '../../utils/Htools';

let pageSize = 1;
let total = 0;
let oldIndex = 10;
let oneDay = ''
let treeDay = '';
let oneWeek = '';
let oneMonth = '';
let twoWeek = '';
let startTime = '';
let endTime = '';
let lastEndTime = '';//这里因为点击了日历，如果选择了结束时间，那么点击今天，三天，一周的时候又要重新设置结束时间
let lastminData = '';//这里因为先点击结束时间就会重新设置mindata，那再点击开始时间，日历要重新设置会这种,只用来显示，不传值
let type = '';
let status = 0;
let isStartTag = true;
let selectDetailIndex = -1
export default class BettingRecordScreen extends Component<Props> {

    constructor(props) {
        super(props);
        type = '';
        status = 0;
        this.state = {
            isDialogVisible: false,
            refreshing: false,
            isLoreMoreing: 'LoreMoreing',
            listPosition: 0,
            data: [],
            startTime: '',
            endTime: '',
            total: 0,
            index: 0,
            currentData: '',
            minDate: '',
            typeDate: [],
            textType: [],
            betTotal: '0.00',     // 总投注金额
            validTotal: '0.00',   // 总的有效投注
            netTotal: '0.00',     //总的输赢金额
            extendedItemIndex: -1,
        };
    }

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        return {
            headerTitle: (
                MainTheme.renderCommonTitle('投注记录')
            ),
            headerLeft: (
                MainTheme.renderCommonBack(navigation)
            ),
            headerRight: (
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity style={{ width: 60, height: 28, alignItems: 'center' }}
                        onPress={() => {
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
            )
        };
    };

    componentWillMount() {
        this.props.navigation.setParams({ choseType: this.choseType })
        LocaleConfig.locales['fr'] = {
            monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            today: 'Aujourd\'hui'
        };
        LocaleConfig.defaultLocale = 'fr';
        oldIndex = 0
        this.getmyDate()
    }

    componentDidMount() {

        this.refreshData()
        this.postTypeList()
    }

    componentWillUnmount() {
        this.hideDialog()
        Picker.hide()
    }

    //http://m.txbet1788.com/TXW/User/queryByTreasurePage
    refreshData = () => {
        pageSize = 1;
        this.setState({
            refreshing: true,
            data: []
        });
        this.postList()
    }
    postList = () => {
        let prams = {
            pageNo: pageSize,
            pageSize: 20,
            startTime: startTime,
            endTime: endTime,
            gameType: type,
        };
        let dicountList = [];
        http.get('game/getBetInfo', prams).then(res => {
            console.log(res);
            this.setState({ refreshing: false })
            if (res.status === 10000) {
                total = res.data.total
                this.isLoreMore = false;
                if (pageSize > 1) {
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
                            validTotal: res.data.total.validBetAmountTotal,
                            betTotal: res.data.total.betAmountTotal,
                            netTotal: res.data.total.netAmountTotal,
                        });
                    }

                } else {
                    this.setState({
                        data: res.data.list,
                        validTotal: res.data.total.validBetAmountTotal,
                        betTotal: res.data.total.betAmountTotal,
                        netTotal: res.data.total.netAmountTotal,
                    });
                }
                console.log("data")
                console.log(res.data.list)
            }
        }).catch(err => {
            this.setState({ refreshing: false })
            console.error(err)
        });
    }

    postTypeList = () => {
        http.get('game/getGameListForQueryBet').then(res => {
            console.log(res);
            if (res.status === 10000) {
                console.log("data")
                console.log(res.data)
                this.setState({ typeDate: res.data })
                for (var i = 0; i < res.data.length; i++) {
                    let valueArray = []
                    let vaObj = {}
                    let catego = res.data[i].category;

                    for (var j = 0; j < res.data[i].list.length; j++) {
                        valueArray.push(res.data[i].list[j].name)
                    }
                    vaObj[catego] = valueArray
                    this.state.textType.push(vaObj);
                }

                console.log('游戏类型选择');
                console.log(this.state.textType)
                console.log(this.state.typeDate)
            }
        }).catch(err => {
            console.error(err)
        });
    }

    choseType = () => {
        this.hideDialog()
        Picker.isPickerShow((isShow, message) => {
            if (isShow) {
                Picker.hide()
            }
        })
        console.log(this.state.textType)
        if (this.state.textType.length === 0 || this.state.typeDate.length === 0) {
            return
        }
        Picker.init({
            pickerData: this.state.textType,
            pickerConfirmBtnColor: [55, 55, 55, 1],
            pickerCancelBtnColor: [88, 88, 88, 1],
            pickerCancelBtnText: '取消',
            pickerConfirmBtnText: '确定',
            pickerTitleText: '选择类型',
            onPickerConfirm: data => {

                console.log(data[0]);
                console.log(data[1]);

                if ("全部" === data[1]) {
                    status = "0"
                }
                for (var i = 0; i < this.state.typeDate.length; i++) {
                    console.log(this.state.typeDate[i].category + "   00000000")
                    if (this.state.typeDate[i].category === data[0]) {
                        for (var j = 0; j < this.state.typeDate[i].list.length; j++) {
                            console.log(this.state.typeDate[i].list[j].name + "   0000000666660")
                            if (this.state.typeDate[i].list[j].name === data[1]) {
                                type = this.state.typeDate[i].list[j].gameType
                            }
                        }
                    }
                }
                this.refreshData()
            },
            onPickerCancel: data => {

            },
            onPickerSelect: data => {


            }
        });
        Picker.show();
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
            pageSize++
            console.log("耶稣pageSize=  " + pageSize)
            this.postList()
        }
    }

    onBetRecordItemPressed = (item, index) => {
        if (this.state.extendedItemIndex == index) {
            this.setState({ extendedItemIndex: -1 });
        }
        else {
            this.setState({ extendedItemIndex: index });
        }
    }

    renderBetItem = ({ item, index }) => {
        return (
            <View>
                <TouchableOpacity onPress={() => this.onBetRecordItemPressed(item, index)}
                    style={styles.betRecordItemContainer} >

                    <View style={styles.betRecordItemLeftPanel}>
                        <Text style={styles.betRecordItemGameTitle}>{item.gameName}</Text>
                        <Text style={styles.betRecordItemGameTime}>{item.bettime}</Text>
                    </View>

                    <Text style={item.netAmount.startsWith('-') ? styles.betRecordAmountLose : styles.betRecordAmountWin}>
                        { TXTools.formatMoneyAmount(item.netAmount,false)}
                    </Text>
                </TouchableOpacity>

                {
                    this.state.extendedItemIndex == index && (
                        <View style={styles.betRecordDetailPanel}>
                            <Text style={styles.itemTextRemark}>游戏平台 {'\t\t' + item.gameName}</Text>
                            <Text style={styles.itemTextRemark}>下注金额 {"\t\t" + item.betAmount}</Text>
                            <Text style={styles.itemTextRemark}>有效投注金额 {'\t' + item.validBetAmount}</Text>
                            <Text style={styles.itemTextRemark}>输赢金额 {'\t\t' + item.netAmount}</Text>
                            <Text style={styles.itemTextRemark}>创建时间 {'\t\t' + item.bettime}</Text>
                        </View>
                    )
                }
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
     * 获取上个月月底日期
     */
    getLastMonthAndDay = () => {
        var nowDate = new Date();
        var year = nowDate.getFullYear();
        var month = nowDate.getMonth();
        if (month == 0) {
            month = 12;
            year = year - 1;
        }
        var lastDay = new Date(year, month, 0);
        var yyyyMMdd = year + "年" + month + "月" + lastDay.getDate() + "日";
    }

    getmyDate = () => {
        let date = new Date();
        let year = date.getFullYear().toString();
        let month = (date.getMonth() + 1).toString();
        if (month.length === 1) {
            month = '0' + month
        }
        let day = date.getDate().toString();
        if (day.length === 1) {
            day = '0' + day
        }
        let hour = date.getHours().toString();
        let minute = date.getMinutes().toString();
        let second = date.getSeconds().toString();

        endTime = year + '-' + month + '-' + day + ' ' + '23' + ':' + '59' + ':' + '59'
        lastEndTime = year + '年' + month + '月' + day + '日'
        if (date.getMonth() + 1 === 1) {//当是一月的时候年要-1
            this.setState({ minDate: (date.getFullYear() - 1).toString() + '-' + 12 + '-' + day })
            lastminData = (date.getFullYear() - 1).toString() + '-' + 12 + '-' + day
        } else {//-1个月
            if ((date.getFullYear()).toString().length === 1) {
                this.setState({ minDate: year + '-' + date.getMonth().toString() + '-' + day })
                lastminData = year + '-' + date.getMonth().toString() + '-' + day
            } else {
                this.setState({ minDate: year + '-0' + date.getMonth().toString() + '-' + day })
                lastminData = year + '-0' + date.getMonth().toString() + '-' + day
            }
        }
        /* Alert.alert(month.length + "month")*/
        /*  Alert.alert(year.length + "year")
        Alert.alert(day.length + "day")*/
        this.setState({ endTime: year + '年' + month + '月' + day + '日', currentData: year + '-' + month + '-' + day })
        oneDay = year + '-' + month + '-' + day + ' ' + '00' + ':' + '00' + ':' + '00'
        startTime = oneDay
        this.setState({ startTime: year + '年' + month + '月' + day + '日' })


        var treeDaydate = new Date(date - 2 * 24 * 3600 * 1000);
        var yTree = treeDaydate.getFullYear();
        var mTree = treeDaydate.getMonth() + 1 + "";
        var dTree = treeDaydate.getDate() + "";
        if (mTree.length === 1) {
            mTree = '0' + mTree
        }
        if (dTree.length === 1) {
            dTree = '0' + dTree
        }
        treeDay = yTree + '-' + mTree + '-' + dTree + ' ' + '00' + ':' + '00' + ':' + '00'

        var oneweekdate = new Date(date - 6 * 24 * 3600 * 1000);
        var yWeek = oneweekdate.getFullYear();
        var mWeek = oneweekdate.getMonth() + 1 + "";
        var dWeek = oneweekdate.getDate() + "";
        if (mWeek.length === 1) {
            mWeek = '0' + mWeek
        }
        if (dWeek.length === 1) {
            dWeek = '0' + dWeek
        }
        oneWeek = yWeek + '-' + mWeek + '-' + dWeek + ' ' + '00' + ':' + '00' + ':' + '00'

        //获取系统前一个月的时间


        var twoWeekdate = new Date(date - 13 * 24 * 3600 * 1000);
        var ytwoWeek = twoWeekdate.getFullYear();
        var mtwoWeek = twoWeekdate.getMonth() + 1 + "";
        var dtwoWeek = twoWeekdate.getDate() + "";
        if (mtwoWeek.length === 1) {
            mtwoWeek = '0' + mtwoWeek
        }

        if (dtwoWeek.length === 1) {
            dtwoWeek = '0' + dtwoWeek
        }
        twoWeek = ytwoWeek + '-' + mtwoWeek + '-' + dtwoWeek + ' ' + '00' + ':' + '00' + ':' + '00'

        var oneMouthdate = new Date(date - 30 * 24 * 3600 * 1000);
        var yMonth = oneMouthdate.getFullYear();
        var mMonth = oneMouthdate.getMonth() + 1 + "";
        var dMonth = oneMouthdate.getDate() + "";
        console.log("mMonth.length" + mMonth.length + " 月份" + mMonth)
        if (mMonth.length === 1) {
            mMonth = '0' + mMonth
        }

        if (dMonth.length === 1) {
            dMonth = '0' + dMonth
        }
        oneMonth = yMonth + '-' + mMonth + '-' + dMonth + ' ' + '00' + ':' + '00' + ':' + '00'

    }

    selectTime = (index) => {
        if (index === 0) {
            startTime = oneDay
        } else if (index === 1) {
            startTime = treeDay
        } else if (index === 2) {
            startTime = oneWeek
        } else if (index === 3) {
            startTime = oneMonth
        }
        let yearMonthDay = startTime.split(' ')[0].split('-')
        this.setState({
            startTime: yearMonthDay[0] + '年' + yearMonthDay[1] + '月' + yearMonthDay[2] + '日',
            endTime: lastEndTime
        })

        if (oldIndex !== index) {
            this.refreshData()
        }
        oldIndex = index;
    }

    renderSearchTime = () => {
        let timeAarry = ['今天', '三天', '一周', '一月']
        return (
            <View style={styles.betTimeContainer}>
                {
                    timeAarry.map((item, cur) =>
                        <TouchableOpacity onPress={() => {
                            this.setState({ index: cur, data: [] });
                            this.selectTime(cur);
                        }} style={this.state.index == cur ? styles.timeSelectContainer : styles.timeTextContainer}>
                            <Text style={this.state.index == cur ? styles.timeSelectText : styles.timeText}>{item}</Text>
                        </TouchableOpacity>
                    )
                }
            </View>
        );
    }

    showDialog = (blo, b) => {
        Picker.hide()
        isStartTag = b
        if (!isStartTag) {
            this.setState({ minDate: startTime.split(' ')[0] });
            this.setState({ currentData: oneDay.split(' ')[0] });
        } else {
            this.setState({ minDate: oneMonth.split(' ')[0] });
            this.setState({ currentData: endTime.split(' ')[0] });
        }
        this.setState({ isDialogVisible: blo });
    }

    hideDialog = () => {
        this.setState({ isDialogVisible: false });
    }

    /**
     * 显示投注信息小计
     */
    renderBetTotalInfo = () => {
        let totalInfos = [
            { title: '总投注', account: this.state.betTotal, },
            { title: '有效投注', account: this.state.validTotal, },
            { title: '输赢', account: this.state.netTotal, }
        ];

        let netTotalColor = this.state.netTotal.startsWith('-') ? MainTheme.SpecialColor : MainTheme.FundGreenColor;

        return (
            <View style={styles.userBetTotalContainer}>
                {
                    totalInfos.map((value, index) =>
                        <View style={{ ...styles.userBetTotalItem, borderLeftWidth: index > 0 ? 0.5 : 0, }}>
                            <View style={styles.userBetTotalItemTitleContainer}>
                                <Text style={styles.userBetTotalItemTitleText}>{value.title}</Text>
                            </View>
                            <View style={styles.userBetTotalItemValueContainer}>
                                <Text style={{
                                    ...styles.userBetTotalItemValueText,
                                    color: index == 2 ? netTotalColor : MainTheme.DarkGrayColor,
                                }}>{TXTools.formatMoneyAmount(value.account)}</Text>
                            </View>
                        </View>
                    )
                }
            </View>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.renderSearchTime()}
                {/* 以下为时间间隔
                <View style={styles.timeDividerView} />

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    padding: 5,
                    alignItems: 'center',
                    backgroundColor: MainTheme.SpecialColor,
                    marginLeft: 20,
                    marginRight: 20,
                }}>
                    <Text style={{ color: 'white', fontSize: 12, marginLeft: 12 }}>选择时间:</Text>
                    <View>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => {
                                this.showDialog(true, true)
                            }}>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 14
                                }}>{this.state.startTime}---</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                this.showDialog(true, false)
                            }}>
                                <Text style={{
                                    color: 'white',
                                    fontSize: 14
                                }}>{this.state.endTime}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.choiceTimeDividerView} />
                    </View>
                </View>
                */}

                {this.renderBetTotalInfo()}

                {this.state.currentData.length > 3 && this.state.minDate.length > 3 && <CalendarDialog
                    _dialogVisible={this.state.isDialogVisible}
                    currentData={this.state.currentData}
                    minDate={this.state.minDate}
                    _dialogCancle={() => {
                        this.hideDialog()
                    }}
                    onDayPress={(days) => {
                        console.log("回调", days)
                        if (isStartTag) {
                            this.setState({ startTime: days.year + "年" + days.month + "月" + days.day + "日" })
                            startTime = days.dateString + ' ' + '00' + ':' + '00' + ':' + '00'
                        } else {
                            this.setState({ endTime: days.year + "年" + days.month + "月" + days.day + "日" })
                            endTime = days.dateString + ' ' + '23' + ':' + '59' + ':' + '59'

                        }
                        this.hideDialog()
                        this.refreshData()
                    }}
                />}

                <FlatList
                    numColumns={1}
                    style={{ backgroundColor: MainTheme.BackgroundColor }}
                    data={this.state.data}
                    ListFooterComponent={this.renderFooter}//尾巴
                    keyExtractor={item => item.key}//这里要是使用重复的key出现莫名其妙的错误
                    enableEmptySections={true}//数据可以为空
                    renderItem={this.renderBetItem}
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
        color: MainTheme.commonButtonTitleColor,
        fontSize: 12,
        fontWeight: 'bold',
        padding: 6,
        marginLeft: 12,
        marginRight: 12,
    },

    timeDividerView: {
        backgroundColor: MainTheme.DivideLineColor,
        height: 1,
        width: deviceValue.windowWidth
    },

    choiceTimeDividerView: {
        backgroundColor: 'white',
        height: 1,
        width: deviceValue.windowWidth * 0.6,
        marginRight: 12
    },

    right_item_view: {
        height: 85,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 12
    },

    betRecordItemContainer: {
        width: deviceValue.windowWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        height: deviceValue.windowWidth / 8,
        alignItems: 'center',
        padding: 3,
        marginTop: 10,
    },

    betRecordItemLeftPanel: {
        flex: 1,
        width: deviceValue.windowWidth / 2,
        marginLeft: 12,
    },

    betRecordItemGameTitle: {
        fontSize: 14,
        color: MainTheme.DarkGrayColor,
        marginBottom: 10,
    },

    betRecordItemGameTime: {
        color: MainTheme.GrayColor,
        fontSize: 12,
    },

    betRecordAmountLose: {
        marginRight: 6,
        fontSize: 18,
        color: MainTheme.SpecialColor,
    },

    betRecordAmountWin: {
        marginRight: 6,
        fontSize: 18,
        color: MainTheme.FundGreenColor,
    },

    betRecordDetailPanel: {
        backgroundColor: MainTheme.LightGrayColor,
        padding: 6,
        marginLeft: 15,
        marginRight: 15,
    },

    itemTextRemark: {
        color: 'black',
        padding: 3,
        fontSize: 12,
        height: 25
    },

    emptyView: {
        flex: 1,
        width: deviceValue.windowWidth,
        height: deviceValue.windowHeight * 0.6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    userBetTotalContainer: {
        flexDirection: 'row',
        margin: 20,
        marginTop: 10,
        borderColor: MainTheme.SpecialColor,
        borderWidth: 0.5,
        borderRadius: 3,
    },

    userBetTotalItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: MainTheme.SpecialColor,
    },

    userBetTotalItemTitleContainer: {
        height: 22,
        backgroundColor: MainTheme.SpecialColor,
        width: '100%',
        justifyContent: 'center',
    },

    userBetTotalItemTitleText: {
        color: MainTheme.SubmitTextColor,
        textAlign: 'center',
        fontSize: 13,
        fontWeight: 'bold',
    },

    userBetTotalItemValueContainer: {
        height: 30,
        backgroundColor: MainTheme.SubmitTextColor,
        width: '100%',
        justifyContent: 'center',
    },

    userBetTotalItemValueText: {
        fontSize: 13,
        textAlign: 'center',
    }

});

