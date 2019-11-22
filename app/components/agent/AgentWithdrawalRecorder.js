import React, { Component } from 'react';
import {
    View, ScrollView, Text, Image, TouchableOpacity, SafeAreaView, StyleSheet,
} from "react-native";

import { BASE_H5_URL } from "../../utils/Config";
import MainTheme from '../../utils/AllColor';

export default class AgentWithdrawalRecorder extends Component<Props> {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: (
                MainTheme.renderCommonTitle('佣金流水')
            ),
            headerLeft: (
                MainTheme.renderCommonBack(navigation)
            ),
            headerRight: (
                <View />
            )
        };
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <SafeAreaView style={styles.mainContanier}>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    mainContanier: {
        flex: 1,
        backgroundColor: MainTheme.BackgroundColor,
    }
});