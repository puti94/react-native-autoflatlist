# react-native-autoflatlist
一个自动上拉下拉提供分页加载的FlatList组件

- 安装:
   ```
       npm install react-native-autoflatlist --save
   ```
- 使用:
   ```
       import AutoFlatList from 'react-native-autoflatlist'
   ```

   ```
    /**
     * 模拟从网络上加载数据
     * @param page
     * @returns {Promise}
     */
    loadData(page) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // reject('发生错误'); //模拟发生错误
                let data = [];
                for (let i = 0; i < 10; i++) {
                    data.push(`页数${page},数据源${i}`)
                }

                //模拟没有更多数据
                //data.splice(5, 3)

                resolve(data)
            }, 1000)
        })
    }

    renderItem(item, index) {
        return <Text style={{fontSize: 28, padding: 40, backgroundColor: 'white', marginTop: 1}}>{item}</Text>
    }

    render() {
        return (
            <AutoFlatList
                style={{flex: 1, marginTop: 64, backgroundColor: '#eee'}}
                netWork={(page) => this.loadData(page)}
                loadMoreEnable={true}
                renderItem={({item, index}) => this.renderItem(item, index)}
            />
        );
    }
  ```

## Props
| Prop | Type | Default | Note |
|---|---|---|---|
| [FlatList props...](https://facebook.github.io/react-native/docs/FlatList.html) |  |  |  组件继承 FlatList 组件的全部属性。
| style | 同View.style |  | 组件样式, 也就是组件的容器 View 的样式。
| refreshEnable | bool | true | 是否能下拉刷新
| loadMoreEnable | bool | false | 是否能上拉加载
| netWork | func |  | 数据加载方法,会传一个page,需要回传一个Promise,resolve需要传入一个数组
| emptyButtonTitle | string | '重新加载' | 空视图按钮的文字
| emptyOnPress | func |  | 默认提供空视图的按钮点击事件，不传则执行onRefresh方法
| emptyView | element |  | 覆盖原有的空视图组件
| noMoreView | element |  | 覆盖原有的没有更多数据的组件
| loadMoreView | element |  | 覆盖原有的上拉加载组件

## Events
| Event Name | Returns | Notes |
|---|---|---|
| reLoadData |  | 重新加载数据
