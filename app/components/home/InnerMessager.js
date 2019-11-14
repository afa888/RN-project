import React, { Component } from 'react';
import { SafeAreaView, FlatList, StyleSheet } from 'react-native';
import MainTheme from '../../utils/AllColor'


export default class InnerMessager extends Component<Props> {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: (
                MainTheme.renderCommonTitle('站内信')
            ),
            headerLeft: (
                MainTheme.renderCommonBack(navigation)
            ),
        };
    };

    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <SafeAreaView>
                <FlatList>

                </FlatList>
            </SafeAreaView>
        );
    }
 
}

const styles = StyleSheet.create({

});