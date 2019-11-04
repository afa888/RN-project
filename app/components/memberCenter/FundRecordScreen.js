import React, {Component} from 'react';
import {
    FlatList,
    Image,
    ImageBackground,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Alert,
    View
} from "react-native";
import {
    category_group_divide_line_color,
    category_tab_checked_bg_color,
    theme_color,
    funRecordGreen
} from "../../utils/AllColor";
import deviceValue from "../../utils/DeviceValue";
import FastImage from 'react-native-fast-image'
import {CAGENT} from "../../utils/Config";
import http from "../../http/httpFetch";
import Toast from "react-native-easy-toast";
import Picker from 'react-native-picker';
import {Calendar, CalendarList, Agenda, LocaleConfig} from 'react-native-calendars';
import ModalDialog from "../../customizeview/ModalDialog";
import CalendarDialog from "../../customizeview/CalendarDialog";

let pageSize = 1;
let total = 0;
let oldIndex = 10;
let oneDay = ''
let treeDay = '';
let oneWeek = '';
let oneMonth = '';
let startTime = '';
let endTime = '';
let lastEndTime = '';//这里因为点击了日历，如果选择了结束时间，那么点击今天，三天，一周的时候又要重新设置结束时间
let lastminData = '';//这里因为先点击结束时间就会重新设置mindata，那再点击开始时间，日历要重新设置会这种
let type = 0;
let status = 0;
let textType = ['全部', '处理中', '成功', '失败']
let isStartTag = true;
let selectDetailIndex = -1
export default class FundRecordScreen extends Component<Props> {

    constructor(props) {
        super(props);
        type = 0;
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
            type: 0,
            index: 0,
            currentData: '',
            minDate: '',

        };
    }

    static navigationOptions = ({navigation}) => {
        const {params} = navigation.state;
        return {
            headerTitle: <View
                style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                <Text style={{fontSize: 18, color: 'black', fontWeight: 'bold'}}>资金记录</Text></View>,

            headerLeft: (
                <View
                    style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                    <TouchableOpacity style={{width: 60, height: 20, alignItems: 'center'}} onPress={() => {
                        navigation.goBack()
                    }}>
                        <Image source={require('../../static/img/titlebar_back_normal.png')}
                               style={{
                                   resizeMode: 'contain',
                                   width: 25,
                                   height: 20,
                                   marginLeft: 12
                               }}/>
                    </TouchableOpacity>
                </View>
            ),
            headerRight:  <View
                style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableOpacity style={{width: 60, height: 28, alignItems: 'center'}} onPress={() => {
                    if (navigation.state.params !== undefined) {

                        navigation.state.params.choseType()
                    }
                    ;
                }}>
                    <Image
                        source={require('../../static/img/more.png')}
                        style={{
                            resizeMode: 'contain',
                            width: 25,
                            height: 25,
                            marginRight: 12
                        }}/>
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
        oldIndex = 0
        this.getmyDate()
    }

    componentDidMount() {
        this.props.navigation.setParams({choseType: this.choseType})
        this.refreshData()
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
            type: type,
            status: status,
        };
        let dicountList = [];
        http.post('User/queryByTreasurePage', prams).then(res => {
            console.log(res);
            this.setState({refreshing: false})
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
                        });
                    }

                } else {
                    this.setState({
                        data: res.data.list,
                    });
                }
                console.log("data")
                console.log(res.data.list)
            }
        }).catch(err => {
            console.error(err)
        });
    }

    choseType = () => {
        this.hideDialog()
        console.log('选择类型');
        Picker.isPickerShow((isShow, message) => {
            if (isShow) {
                Picker.hide()
            }
        })
        Picker.init({
            pickerData: [{
                全部: textType
            },
                {
                    加款: textType
                }, {
                    扣款: textType
                }, {
                    彩金4: textType
                }, {
                    优惠: textType
                }, {
                    提款: textType
                }, {
                    反水: textType
                }, {
                    转账: textType
                }, {
                    存款: textType
                }, {
                    活动: textType
                },],
            pickerConfirmBtnColor: [55, 55, 55, 1],
            pickerCancelBtnColor: [88, 88, 88, 1],
            pickerCancelBtnText: '取消',
            pickerConfirmBtnText: '确定',
            pickerTitleText: '选择类型',
            onPickerConfirm: data => {
                console.log("斤斤2计较");
                console.log(data);
                console.log(data[0]);
                console.log(data[1]);
                //0：全部 ;1：加款 ;2：扣款;3：彩金4：优惠;5：提款;6：反水;7：转账;8：存款;9；活动
                if ("全部" === data[0]) {
                    type = "0";
                } else if ("加款" === data[0]) {
                    type = "1"
                } else if ("扣款" === data[0]) {
                    type = "2";
                } else if ("彩金" === data[0]) {
                    type = "3"
                } else if ("优惠" === data[0]) {
                    type = "4"
                } else if ("提款" === data[0]) {
                    type = "5"
                } else if ("反水" === data[0]) {
                    type = "6"
                } else if ("转账" === data[0]) {
                    type = "7"
                } else if ("存款" === data[0]) {
                    type = "8"
                } else if ("活动" === data[0]) {
                    type = "9"
                }
                //0：全部;1：处理中;2：成功;3：失败
                if ("全部" === data[1]) {
                    status = "0"
                } else if ("处理中" === data[1]) {
                    status = "1"
                } else if ("成功" === data[1]) {
                    status = "2"
                } else if ("失败" === data[1]) {
                    status = "3"
                }
                this.refreshData()
            },
            onPickerCancel: data => {
                console.log("斤斤3计较");
                console.log(data);
            },
            onPickerSelect: data => {
                console.log("斤斤计较");

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


    rightItem = ({item, index}) => {
        return (
            <View>
                <View style={{
                    width: deviceValue.windowWidth, flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: category_tab_checked_bg_color,
                    height: deviceValue.windowWidth / 8, alignItems: 'center', padding: 3
                }}>

                    <Text style={[{
                        marginTop: 10,
                        fontSize: 12,
                        marginLeft: 12
                    }, item.status === '转账成功' ? {color: funRecordGreen} : {color: 'red'}]}
                          umberOfLines={2}>{item.status}</Text>
                    <View style={{
                        width: 1,
                        height: deviceValue.windowWidth / 8 - 9,
                        backgroundColor: category_group_divide_line_color,
                        marginRight: 12,
                        marginLeft: 12,
                    }}/>
                    <View style={{flex: 1, width: deviceValue.windowWidth / 2}}>
                        <Text style={{color: theme_color, marginBottom: 3}}>{item.remark}</Text>
                        <Text>{item.createDate}</Text>
                    </View>
                    <Text style={{marginRight: 6, color: theme_color}}>{item.amount}</Text>
                    <TouchableOpacity onPress={() => {
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
                        this.setState({data: clickData})
                    }}>
                        <Image
                            source={item.select !== undefined && item.select ? require('../../static/img/arrow_down.png') : require('../../static/img/arrow_right.png')}
                            style={{
                                resizeMode: 'contain',
                                width: 16,
                                height: 16,
                                marginRight: 6,
                                padding: 3
                            }}/>
                    </TouchableOpacity>
                </View>


                {item.select !== undefined && item.select && <View style={{
                    width: deviceValue.windowWidth,
                    backgroundColor: category_group_divide_line_color,
                    padding: 6
                }}>
                    <Text style={styles.itemTextRemark}>订单号 {"         " + item.orderNo}</Text>
                    <Text style={styles.itemTextRemark}>订单类型 {"       " + item.type}</Text>
                    <Text style={styles.itemTextRemark}>订单金额 {"       " + item.amount}</Text>
                    <Text style={styles.itemTextRemark}>订单状态 {"       " + item.status}</Text>
                    <Text style={styles.itemTextRemark}>创建时间 {"       " + item.createDate}</Text>
                </View>}

            </View>
        )
    }

    /*分割线*/
    separatorComponent = () => {
        return <View style={{height: 1, backgroundColor: 'black'}}/>
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
        console.log(yyyyMMdd);
    }

    getmyDate = () => {
        let date = new Date();
        console.log("日历")
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
            this.setState({minDate: (date.getFullYear() - 1).toString() + '-' + 12 + '-' + day})
            lastminData = (date.getFullYear() - 1).toString() + '-' + 12 + '-' + day
        } else {//-1个月
            if ((date.getFullYear()).toString().length === 1) {
                this.setState({minDate: year + '-' + date.getMonth().toString() + '-' + day})
                lastminData = year + '-' + date.getMonth().toString() + '-' + day
            } else {
                this.setState({minDate: year + '-0' + date.getMonth().toString() + '-' + day})
                lastminData = year + '-0' + date.getMonth().toString() + '-' + day
            }
        }
        console.log(this.props.currentData + "   当前2")
        console.log(this.props.minDate + "    最小2")
        /* Alert.alert(month.length + "month")*/
        /*  Alert.alert(year.length + "year")
        Alert.alert(day.length + "day")*/
        this.setState({endTime: year + '年' + month + '月' + day + '日', currentData: year + '-' + month + '-' + day})
        console.log('看日期', year + '-' + month + '-' + day + "          " + year + '-' + date.getMonth() + '-' + day)
        oneDay = year + '-' + month + '-' + day + ' ' + '00' + ':' + '00' + ':' + '00'
        startTime = oneDay
        this.setState({startTime: year + '年' + month + '月' + day + '日'})


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
        console.log("oldIndex=" + oldIndex)
        console.log("index=" + index)
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
        console.log("this.state.startTime.length=" + this.state.startTime + "  " + treeDay)

        if (oldIndex !== index) {
            this.refreshData()
        }
        oldIndex = index;
    }

    getSeletTime = () => {
        let viewAarry = []
        let timeAarry = ['今天', '三天', '一周', '一月']
        for (let i = 0; i < 4; i++) {
            viewAarry.push(
                <TouchableOpacity onPress={() => {
                    this.setState({index: i, data: []})
                    this.selectTime(i)
                }}><Text style={styles.timeText}>{timeAarry[i]}</Text>
                </TouchableOpacity>)
        }
        viewAarry[this.state.index] = <TouchableOpacity onPress={() => {
            this.setState({index: this.state.index, data: []})
            this.selectTime(this.state.index)
        }}>
            <Text style={styles.timeSelectText}>{timeAarry[this.state.index]}</Text>
        </TouchableOpacity>
        return viewAarry
    }
    showDialog = (blo, b) => {
        Picker.hide()
        isStartTag = b
        if (!isStartTag) {
            this.setState({minDate: startTime.split(' ')[0]});
            this.setState({currentData: oneDay.split(' ')[0]});
        } else {
            this.setState({minDate: oneMonth.split(' ')[0]});
            this.setState({currentData: endTime.split(' ')[0]});
        }
        this.setState({isDialogVisible: blo});
    }

    hideDialog = () => {
        this.setState({isDialogVisible: false});
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{backgroundColor: theme_color}}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        height: deviceValue.windowWidth / 8,
                        alignItems: 'center'
                    }}>
                        {this.getSeletTime()}

                    </View>
                    <View style={styles.timeDividerView}/>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: 5,
                        alignItems: 'center'
                    }}>
                        <Text style={{color: 'white', fontSize: 12, marginLeft: 12}}>选择时间:</Text>
                        <View>
                            <View style={{flexDirection: 'row'}}>
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

                            <View style={styles.choiceTimeDividerView}/>
                        </View>
                    </View>
                </View>

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
                            this.setState({startTime: days.year + "年" + days.month + "月" + days.day + "日"})
                            startTime = days.dateString + ' ' + '00' + ':' + '00' + ':' + '00'
                        } else {
                            this.setState({endTime: days.year + "年" + days.month + "月" + days.day + "日"})
                            endTime = days.dateString + ' ' + '23' + ':' + '59' + ':' + '59'

                        }
                        this.hideDialog()
                        this.refreshData()
                    }}
                />}

                <FlatList
                    numColumns={1}
                    style={{backgroundColor: 'white'}}
                    data={this.state.data}
                    ListFooterComponent={this.renderFooter}//尾巴
                    keyExtractor={item => item.key}//这里要是使用重复的key出现莫名其妙的错误
                    enableEmptySections={true}//数据可以为空
                    renderItem={this.rightItem}
                    onEndReachedThreshold={0.2}//执行上啦的时候10%执行
                    onEndReached={() => {
                        this.LoreMore()
                    }}
                    ListEmptyComponent={this.emptyComponent()}
                    ItemSeparatorComponent={this.separatorComponent} // 分割线
                    refreshControl={<RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.refreshData}
                        title="Loading..."/>}
                />

            </View>
        );
    }

    emptyComponent = () => {
        return <View style={styles.emptyView}>
            <View style={{alignItems: 'center'}}>
                <Image
                    source={require('../../static/img/nodata.png')}
                    style={{
                        resizeMode: 'contain',
                        width: deviceValue.windowWidth * 0.4,
                        height: deviceValue.windowWidth * 0.4,
                        marginRight: 6,
                        padding: 3
                    }}/>
                <Text style={{
                    fontSize: 16
                }}>暂无数据</Text>
            </View>

        </View>
    }
}

const styles = StyleSheet.create({
    timeSelectText: {
        color: theme_color,
        fontSize: 16,
        padding: 6,
        backgroundColor: 'white',
        marginLeft: 12,
        marginRight: 12,
        borderRadius: 10
    },
    timeText: {color: 'white', fontSize: 16, padding: 6, backgroundColor: theme_color, marginLeft: 12, marginRight: 12},
    timeDividerView: {backgroundColor: category_group_divide_line_color, height: 1, width: deviceValue.windowWidth},
    choiceTimeDividerView: {backgroundColor: 'white', height: 1, width: deviceValue.windowWidth * 0.6, marginRight: 12},
    right_item_view: {
        height: 85,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 12
    },
    itemTextRemark: {marginRight: 6, color: 'black', padding: 3, fontSize: 12, height: 25},
    emptyView: {
        flex: 1,
        width: deviceValue.windowWidth,
        height: deviceValue.windowHeight * 0.6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

