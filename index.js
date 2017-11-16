/**
 * User: puti.
 * Time: 2017/11/15 下午1:45.
 * GitHub:https://github.com/puti94
 * Email:1059592160@qq.com
 */

import React, {Component} from 'react';
import {
    View,
    FlatList,
    Text,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import PropTypes from 'prop-types';

export default class AutoFlatList extends Component {

    /**
     * netWord 是一个回调方法,会将当前page回传,需要返回一个Promise,resolve数据自行处理成array类型
     * @type {{refreshEnable: shim, loadMoreEnable: shim, netWork: (*), emptyButtonTitle: shim, emptyOnPress: shim}}
     */
    static propTypes = {
        ...FlatList.propTypes,
        refreshEnable: PropTypes.bool,
        loadMoreEnable: PropTypes.bool,
        netWork: PropTypes.func.isRequired,
        emptyButtonTitle: PropTypes.string,
        emptyOnPress: PropTypes.func,
        noMoreDataSize:PropTypes.number,
        emptyView:PropTypes.element,
        noMoreView:PropTypes.element,
        loadMoreView:PropTypes.element
    };

    static defaultProps = {
        ...FlatList.defaultProps,
        refreshEnable: true,
        loadMoreEnable: false,
        noMoreDataSize:10,
    };

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refreshing: false,
            loadMoreing: false,
            isNoMoreData: false,
            emptyViewHint: '暂无数据'
        };
    }

    componentDidMount() {
        this.page = 1;
        this.setState({refreshing: true});
        this.loadData()
    }

    /**
     * 重新刷新数据
     */
    reLoadData() {
        this.setState({data: this.state.data})
    }

    /**
     * 返回列表为空的视图
     * @returns {XML}
     */
    renderEmpty() {
        if (this.props.emptyView){
            return this.props.emptyView
        }


        return <View style={{flex: 1, alignItems: 'center', marginTop: 30, justifyContent: 'center'}}>

            <Text style={{fontSize: 18, color: 'black', marginTop: 15}}>{this.state.emptyViewHint}</Text>
            <TouchableOpacity
                style={{
                    marginTop: 20,
                    backgroundColor: '#00000000',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: 'gray',
                    height: 40,
                    width: 120,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onPress={!this.props.emptyOnPress ? () => this.onRefresh() : this.props.emptyOnPress }
            >

                <Text>{!this.props.emptyButtonTitle ? '重新加载' : this.props.emptyButtonTitle}</Text>
            </TouchableOpacity>
        </View>
    }

    /**
     * 加载数据
     */
    loadData() {
        this.props.netWork(this.page).then(data => {
            if (this.page === 1) {
                this.setState({
                    data: data,
                    refreshing: false,
                    isNoMoreData: data.length < 10
                })
            } else {
                this.setState({
                    data: this.state.data.concat(data),
                    isNoMoreData: data.length < 10,
                    loadMoreing: false
                })
            }
        }).catch((e) => {
            //加载数据发生错误时
            if (this.page !== 1) {
                this.page -= 1;
                this.setState({loadMoreing: false});
            } else {
                this.setState({refreshing: false, emptyViewHint: e});
            }
        });
    }

    /**
     * 下载刷新时出触发
     */
    onRefresh() {
        this.page = 1;
        this.setState({refreshing: true, loadMoreing: false});
        this.loadData()
    }

    onLoadMore(info) {
        if (this.state.loadMoreing || this.state.isNoMoreData) return;
        this.page += 1;
        this.loadData()
        this.setState({loadMoreing: true, refreshing: false})
    }

    renderLoadMoreView() {
        if (!this.props.loadMoreEnable || this.state.data.length === 0) return;
        if (this.state.isNoMoreData) {
            if (this.props.noMoreView) return this.props.noMoreView
            return <Text style={{alignSelf: 'center',height:40}}>没有更多数据</Text>
        }
        if (this.state.loadMoreing) {
            if (this.props.loadMoreView) return this.props.loadMoreView
            return <View
                style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flex: 1, height: 50}}>
                <ActivityIndicator/>
                <Text style={{marginLeft: 20}}>加载中...</Text>
            </View>
        }
    }

    render() {
        return (
            <FlatList
                {...this.props}
                data={this.state.data}
                ListEmptyComponent={this.renderEmpty()}
                ListFooterComponent={this.renderLoadMoreView()}
                refreshing={this.state.refreshing}
                onRefresh={this.props.refreshEnable ? () => {
                    this.onRefresh()
                } : null}
                keyExtractor={(item, index) => index }
                onEndReachedThreshold={this.props.loadMoreEnable ? 0.1 : null}
                onEndReached={this.props.loadMoreEnable ? (info) => {
                    this.onLoadMore(info)
                } : null}

            />
        );
    }
}

