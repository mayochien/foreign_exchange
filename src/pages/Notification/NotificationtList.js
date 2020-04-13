import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { apiGetEventFilter,apiDeleteEvent } from '../../services/apiService';
import NotificationtListItem from './NotificationtListItem';
import Pagination from "react-js-pagination";
import { ClipLoader } from 'react-spinners';
import { MdDelete } from "react-icons/md";


class NotificationtList extends Component {
  state = {
    dataList: [],
    total_page:0,
    activePage:1,
    selected_group:'',
    loading: true,
    checked:false,
    selectItem:[],
    deleteList:[],
    isCheckAll:false,
  };

  showLoading = () => {
    this.setState({
      showLoading:true,
    },()=>{
      setTimeout(() => {
        this.setState({
          showLoading:false,
        })
      }, 500);
    })
  }

  handlePageChange (pageNumber) { // 切換頁面
    this.setState({
      activePage: pageNumber
    },()=>{this.getInitialData()})
  }

  onChangeOption = (e) => {
    if(e.target.value==='ALL'){
      this.setState({
        activePage:1,
        selected_group:''
      },()=>{this.getInitialData()})
    }
    else{
      this.setState({
        activePage:1,
        selected_group:e.target.value,
      }
      ,()=>{this.getInitialData()}
      )
    }
  }

  onChangeSelect = (e) => {
    this.setState({
      hasSelect:e.target.value
      // hasSelect:value
    }
    ,()=>{console.log(this.state.hasSelect);}
    )
  }

  onChildChanged = (newState,checkId) => { //抓取子層的【id】
    this.setState({
      checked: newState,
    },()=>{this.setState({
        selctObj:checkId
      })
      setTimeout(() => {
        this.collectSelectArray(this.state.selctObj)
      }, 100);
    })
  }

  collectSelectArray = (key_selctObj) => { 
    this.setState({
      selectItem : [...this.state.selectItem,key_selctObj]
    },()=>{
      // 統計個數 {100:2, 101: 2, 102: 4}
      let collectSelect = this.state.selectItem.reduce(function(prev, cur) {
        prev[cur] = (prev[cur] || 0) + 1;
        return prev;
      }, {}); 

      // 把物件中點擊次數=奇數的編號，塞進陣列
      collectSelect = Object.keys(collectSelect).filter(function(key) {
        return collectSelect[key]%2>0 ;
      });

      this.setState({
        deleteList:collectSelect
      })
    })
  }

  deleteNotifyItem = async() => {
    // console.log(this.state.deleteList);
    let postData = {
      "event_list":this.state.deleteList
    }
    try {
      let res = await apiDeleteEvent(postData)
      if(res.data.code===1){
        // setTimeout(() => {
          this.setState({
            deleteList:[],
            isCheckAll:false
          })
          this.getInitialData();
        // }, 150);
      }
    } catch (err) {
      console.log(err);
    }
  }

  onClickCheckAll = () => { //父傳子全選
    this.setState({
      isCheckAll:!this.state.isCheckAll,
      deleteList:this.state.dataList.map(item=>item.id)
    })
  }

  getInitialData = async() => { // 初始載入 + 篩選資料
    this.showLoading()
    try {
      let res = await apiGetEventFilter(this.state.activePage, this.state.selected_group);
      if(res.data.code===1){
        this.setState({
          dataList: res.data.data.paginate_data,
          total_page:res.data.data.total_pages, // 總頁數
        })
      }
    } catch(err) {
      console.log(err);
    }
  }
  
  componentDidMount() {
    this.getInitialData();
  }

  render() {
    const { t } = this.props;
    const { dataList } = this.state;
    // console.log(this.state.isCheckAll);
    // console.log(this.state.checked);
    // console.log('deleteList',this.state.deleteList);
    // console.log(this.state);

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-exchange">
              
              <div className="header text-center">
                <h4 className="title">{t('app.notification_list')}</h4>
              </div>

              <div className="filter-section">
                <div className="table-filter-section">
                    <span className="table-filter-label">
                      {t('app.type')}  : 
                    </span>
                      <select
                        onChange={e=>this.onChangeOption(e)} 
                        className="table-select">
                          <option
                            label={t('app.all')}
                            value={'ALL'} 
                            >
                          </option>
                            <option
                            label={t('EVENT_TYPE_GROUP.DEPOSIT')}
                            value={2} 
                            >
                          </option>
                          <option
                            label={t('EVENT_TYPE_GROUP.EXCHANGE')}
                            value={3} 
                            >
                          </option>
                          <option
                            label={t('EVENT_TYPE_GROUP.CUSTOMER_SERVICE')}
                            value={4} 
                            >
                          </option>
                          <option
                            label={t('EVENT_TYPE_GROUP.ACCOUNT')}
                            value={5} 
                            >
                          </option>
                          <option
                            label={t('EVENT_TYPE_GROUP.WITHDRAW')}
                            value={6} 
                            >
                          </option>
                      </select>
                    <span className="mr-15"></span>
                  </div>
                </div>

                <div className="content table-responsive table-full-width">
                  {this.state.showLoading?
                    <table className="table table-exchange text-center m-tb-60">
                      <ClipLoader
                        sizeUnit={"px"}
                        size={40}
                        color={'#999'}
                        loading={this.state.loading}
                      />
                    </table>
                      :
                    <table className="table table-exchange table-notification">
                      <thead>
                        <tr>
                          {/************* 全部選擇、刪除按鈕 *************/}
                          {dataList===undefined
                            || !dataList instanceof Array 
                            || dataList.length === 0? '':
                            <th className="notify-delete-th">
                              <input className="notify-checkbox-select-all" 
                                type="checkbox" 
                                onChange={this.onClickCheckAll}
                                checked={this.state.isCheckAll}
                              />
                              {this.state.deleteList.length>0 || this.state.isCheckAll ?
                                <button className="notify-btn-delete" 
                                  onClick={this.deleteNotifyItem}>
                                  <MdDelete/>
                                </button>
                              :
                                <button className="notify-btn-delete-disable" 
                                  onClick={''}>
                                  <MdDelete/>
                                </button>
                              }
                            </th>
                          }
                          <th>{t('app.id')}</th>
                          <th>{t('app.type')}</th>
                          <th>{t('app.content')}</th>
                          <th>{t('app.related_id')}</th>
                          <th>{t('app.view')}</th>
                          <th>{t('app.create_datetime')}</th>
                        </tr>
                      </thead>
                        {dataList===undefined
                        || !dataList instanceof Array 
                        || dataList.length === 0? 
                          <td className="table-no-data" colSpan="20">
                            {t('app.no_data')}
                          </td>
                          :
                          <tbody className="tbody-notification">
                            {dataList.map((item, index) => (
                              <NotificationtListItem 
                                key={index}
                                {...item}
                                refreshData={this.getInitialData.bind(this,this.state.activePage)}
                                onChangeSelect={this.onChangeSelect}
                                hasSelect={this.state.hasSelect}
                                callbackParent={this.onChildChanged}
                                // initialChecked={this.state.checked}
                                fatherIsCheckAll={this.state.isCheckAll}
                              />
                            ))}
                          </tbody>
                        }
                    </table>
                  }
                </div>
                
                {this.state.total_page > 0 ?
                  <div className="page-section">
                    <Pagination
                      activePage={this.state.activePage}
                      itemsCountPerPage={20}
                      totalItemsCount={this.state.total_page*20}
                      pageRangeDisplayed={3}
                      onChange={e=>this.handlePageChange(e)}
                    />
                  </div>
                :''}

            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(NotificationtList);