import React, { Component } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    RefreshControl,
    StyleSheet
} from 'react-native';

import MainTheme from '../../utils/AllColor'
import SlideVerify from '../../customizeview/SlideVerify';

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
            data: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        };
    }

    renderItem = ({ item, index }) => {
        return (
            <View style={{
                alignItems:'center',
                paddingBottom: 10,
                paddingTop: 10,
                backgroundColor: (index % 2 == 0) ? 'green' : 'yellow'
            }}>
                <Text style={{fontSize:20}}>{item}</Text>
            </View>
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
            <View></View>
        );
    }

    renderEmptyComponent = () => {
        return (
            <View style={{justifyContent: 'center',alignItems:'center'}}>
                <Text>暂无数据</Text>
            </View>
        )
    }

    refreshData = () => {

    }

    loadMoreData = () => {

    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <FlatList
                    style={{ ...styles.listStyle, flex:2 }}
                    numColumns={1}
                    data={this.state.data}
                    keyExtractor={item => item}//这里要是使用重复的key出现莫名其妙的错误
                    ListFooterComponent={this.renderFooter}//尾巴
                    enableEmptySections={true}//数据可以为空
                    renderItem={this.renderItem}
                    onEndReachedThreshold={0.2}//执行上啦的时候10%执行
                    onEndReached={this.loadMoreData}
                    ListEmptyComponent={this.renderEmptyComponent()}
                    ItemSeparatorComponent={this.renderSeparator} // 分割线
                    refreshControl={this.renderRefreshControl()}
                />
                <View style={{
                    flex: 1,
                    backgroundColor: MainTheme.LightGrayColor,
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginTop:20,
                }}>
                    <SlideVerify />
                </View>
            </SafeAreaView>
        );
    }

}

const styles = StyleSheet.create({
    listStyle: {
        backgroundColor: MainTheme.BackgroundColor,
        flex: 5,
    }
});