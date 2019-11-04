import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Alert,
    Image,
    FlatList,
    TouchableOpacity
} from 'react-native';
import {category_tab_checked_bg_color, category_group_divide_line_color} from '../../utils/AllColor'
import DeviceValue from '../../utils/DeviceValue'
import FastImage from 'react-native-fast-image'
import http from "../../http/httpFetch";
import {BASE_H5_URL,CAGENT} from '../../utils/Config'
import AndroidNativeGameActiviy from "../../customizeview/AndroidIosNativeGameActiviy";
import Toast, {DURATION} from 'react-native-easy-toast'


let leftItemHeight
let oldIndex = 0

export default class CategoryScreen extends Component<Props> {
    static navigationOptions = {
        headerTitle: <View style={{flex: 1, alignItems: "center"}}>
            <Text style={{fontSize: 18, color: 'black', fontWeight: 'bold'}}>分类</Text>
        </View>
    }

    componentWillMount() {
        console.log("分类 走一样")
        if (DeviceValue.CategoryData.length > 0) {
            this.setState({
                data: DeviceValue.CategoryData,
                dataList: DeviceValue.CategoryDataList,
                categoryList: DeviceValue.CategoryList
            })
            leftItemHeight = DeviceValue.windowHeight / (DeviceValue.CategoryList.length + 2);
        } else {
            this.httpRefresh()
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            listPosition: 0,
            categoryList: []

            ,
            data: [],
            dataList: []
        };
    }

    httpRefresh = () => {
        let prams = {
            cagent: CAGENT,
            src: CAGENT,
            terminal: DeviceValue.terminal,
        };
        http.get('game/getPageTab', prams).then(res => {
            if (res.status === 10000) {
                let categoryList = []
                for (var i = 0; i < res.data.length; i++) {
                    let itemLeft = {key: res.data[i].name, isSelect: i == 0 ? true : false}
                    categoryList.push(itemLeft);
                }
                this.setState({
                    data: res.data,
                    dataList: res.data[this.state.listPosition].gameClassifyEntities,
                    categoryList: categoryList
                })
                leftItemHeight = DeviceValue.windowHeight / (this.state.categoryList.length + 2);
            }
            console.log(this.state.dataList);
        }).catch(err => {
            console.error(err)
        });
    }

    /*分割线*/
    separatorComponent = () => {
        return <View style={{height: 1, backgroundColor: category_group_divide_line_color}}/>
    }

    leftItem = ({item, index}) => {
        console.log(index)
        return (
            <TouchableOpacity onPress={() => {
                this.leftListClick({item, index})
            }}>
                <View style={{
                    flex: 1, alignItems: 'center', justifyContent: 'center',
                    backgroundColor: this.state.categoryList[index].isSelect ? (category_tab_checked_bg_color) : ('white'),
                    height: leftItemHeight
                }}>

                    <Text style={{color: 'black'}}>{item.key}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    rightItem = ({item, index}) => {
        console.log(index)
        return (
            <View style={{
                flex: 1, flexDirection: 'row',
                backgroundColor: category_tab_checked_bg_color,
                height: 100, alignItems: 'center'
            }}>
                <ImageBackground style={{
                    width: 120,
                    height: 90,
                    marginLeft: 6,
                }} source={require('../../static/img/loading_image.png')} resizeMode='cover'>
                    <FastImage
                        style={styles.right_item_img}
                        source={{
                            uri: item.imageUrl.startsWith('http') || item.imageUrl.startsWith('https') ? item.imageUrl : '',
                            priority: FastImage.priority.normal,

                        }}
                        resizeMode={FastImage.resizeMode.cover}

                    />
                </ImageBackground>


                <View style={styles.right_item_view}>
                    <Text style={{color: 'black', fontSize: 17}} numberOfLines={1}>{item.name}</Text>
                    <Text style={{fontSize: 13}}  numberOfLines={1}>{item.remark}</Text>
                    <View style={{
                        borderWidth: 1,
                        alignItems: 'center',
                        width: 66,
                        borderColor: 'red',
                        borderRadius: 10,
                        marginBottom: 3,
                    }}>
                        <TouchableOpacity onPress={() => {
                            this.rightListClick({item, index})
                        }}>
                            <Text style={{color: 'red', fontSize: 12, padding: 6}}>开始游戏</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>


        )
    }


    leftListClick = ({item, index}) => {
        console.log(index, item)
        if (item.key === '优惠') {
            this.props.navigation.navigate('Discount')
            return
        } else if (item.key === '帮助') {
            this.props.navigation.navigate('HelpScreen');
            return;
        } else if (item.key === '关于') {
            let aboutUrl = BASE_H5_URL + 'aboutOne'
            this.props.navigation.navigate('CommonWebviewScreen', {url: aboutUrl, title: '关于'});
            return;
        }
        if (oldIndex !== index) {
            for (var i = 0; i < this.state.categoryList.length; i++) {
                this.state.categoryList[i].isSelect = false;
            }
            this.state.categoryList[index].isSelect = true;
            this.setState({
                categoryList: this.state.categoryList,
                dataList: this.state.data[index].gameClassifyEntities
            })
            oldIndex = index;

        }

    }

    forwardGame = (item) => {

        let prams = {
            gameId: item.gameId,
            platCode: item.platformKey,
            gameType: item.gameType,
            model: 2
        };

        http.post('game/forwardGame', prams, true).then((res) => {
            if (res.status === 10000) {
                console.log(res)
                if ("error" === res.data.message) {
                    this.tostTitle('系统错误')
                } else if ("process" === res.data.message) {
                    this.tostTitle('维护中')
                } else if (res.data.url === '') {
                    this.tostTitle('获取游戏地址失败')
                } else {
                    AndroidNativeGameActiviy.openGameWith(res.data.url, item.gameId, item.platformKey);
                    //this.props.navigation.navigate('Game',{gameUrl:res.data.url})
                }
            }
        }).catch(err => {
            console.error(err)
        });
    }
    tostTitle = (msg) => {
        this.refs.toast.show(msg);
    }
    rightListClick = ({item, index}) => {
        console.log(item.id + "   jjjj  ")
        if (item.gameId === "") {
            this.props.navigation.navigate('GameList', item.logImgUrl === "" ? {
                otherParam: '',
                gameName: item.name,
                gameId: item.id,
            } : {otherParam: item.logImgUrl, gameId: item.id,})
        } else {
            this.forwardGame(item)
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Toast
                    ref="toast"
                    style={{backgroundColor: 'black'}}
                    position='center'
                    opacity={0.4}
                    textStyle={{color: 'white'}}
                />
                <View style={{flex: 1, fontWeight: 'bold', flexDirection: 'row'}}>
                    <View style={styles.left_list}>
                        <FlatList
                            data={this.state.categoryList}
                            extraData={this.state}
                            keyExtractor={item => item.key}
                            renderItem={this.leftItem}
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={this.separatorComponent}
                        />
                    </View>
                    <View style={styles.right_list}>
                        <FlatList
                            data={this.state.dataList}
                            keyExtractor={item => item.id}
                            renderItem={this.rightItem}
                        />
                    </View>
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({

    left_list: {
        flex: 1.5,
    },
    right_list: {
        flex: 8,
        backgroundColor: category_tab_checked_bg_color

    },

    right_item_img: {
        width: 120,
        height: 90,

    }
    ,
    right_item_view: {
        height: 90,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginLeft: 12
    }
});
