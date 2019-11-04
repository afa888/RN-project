import React, {Component} from 'react';
import Dimensions from 'Dimensions'
import { Platform } from 'react-native';

export default class DeviceValue extends Component<Props> {
    static windowHeight = Dimensions.get('window').height;
    static windowWidth = Dimensions.get('window').width;
    static noticeUrl = []//公告
    static imgUrl = []//轮播图
    static CategoryData=[]//分类数据
    static CategoryDataList=[]
    static CategoryList=[]
    static baseUrl = "";
    static terminal = Platform.OS === "ios" ? 3 : 2;
}
