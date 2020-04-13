import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import DatePicker from "react-datepicker";
import moment from "moment";
import { apiGetCustomerServiceHistory, apiSearchCustomerEventsParameter } from '../../services/apiService';
import Pagination from "react-js-pagination";
// import styled from 'styled-components'
import SingleCustomerHistory from"./SingleCustomerHistory";
import { ClipLoader } from 'react-spinners';


class CustomerServiceHistory extends Component {
  state = {
    modifiable: false,
    state_remark: '',
    customerHistoryList: [],
    imageUrl:'',
    state_pages_total: 0,
    activePage: 1,
    success_messege: '',
    alert_messege: '',
    isShowResultModal:false,
    /* -------- 搜尋 ------- */
    hasClickSearch: false,
    searchType:'', //搜尋欄位
    searchInput:'' ,//搜尋輸入值
    state_username:'', //1.使用者帳號
    state_service_type:'', //2.問題種類
    startDate: moment().startOf('isoWeek').format('YYYY-MM-DD'),
    endDate: moment().endOf('isoWeek').format('YYYY-MM-DD'),
    picker_startDate:'',
    picker_endDate:'',
    btnActive:"thisWeek",
    serviceStatus: 90,
    loading: true,
    service_type:''
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
    this.showLoading()
    this.setState({
      activePage: pageNumber
    },()=>{this.getFilterData()})
  }

  handleStartChange = (date) => { //datePicker的起始日
    this.showLoading()
    this.setState({
      startDate: moment(date).format('YYYY-MM-DD'),
      btnActive:'date-picker-search'
    },()=>{this.getFilterData()})
  }

  handleEndChange = (date) => { //datePicker的結束日
    this.showLoading()
    this.setState({
      endDate: moment(date).format('YYYY-MM-DD'),
      btnActive:'date-picker-search'
    },()=>{this.getFilterData()})
  }

  clearDatePickerInput =()=>{
    this.setState({
      picker_startDate: '',
      picker_endDate: ''
    })
  }
  
  getToday = (e) => {
    this.showLoading()
    this.clearDatePickerInput()
    this.setState({
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      btnActive:e.target.name
    },()=>{this.getFilterData()})
  }

  getYesterday = (e) => {
    this.showLoading()
    this.clearDatePickerInput()
    this.setState({
      startDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      btnActive:e.target.name
    },()=>{this.getFilterData()})
  }

  getThisWeek = (e) => {
    this.showLoading()
    this.clearDatePickerInput()
    this.setState({
      startDate: moment().startOf('isoWeek').format('YYYY-MM-DD'),
      endDate: moment().endOf('isoWeek').format('YYYY-MM-DD'),
      btnActive:e.target.name
    },()=>{this.getFilterData()})
  }

  getLastWeek = (e) => {
    this.showLoading()
    this.clearDatePickerInput()
    this.setState({
      startDate: moment().subtract(1,'isoWeek').startOf('isoWeek').format('YYYY-MM-DD'),
      endDate: moment().subtract(1,'isoWeek').endOf('isoWeek').format('YYYY-MM-DD'),
      btnActive:e.target.name
    },()=>{this.getFilterData()})
  }

  getThisMonth = (e) => {
    this.showLoading()
    this.clearDatePickerInput()
    this.setState({
      startDate: moment().startOf('month').format('YYYY-MM-DD'),
      endDate: moment().endOf('month').format('YYYY-MM-DD'),
      btnActive:e.target.name
    },()=>{this.getFilterData()})
  }

  getLastMonth = (e) => {
    this.showLoading()
    this.clearDatePickerInput()
    this.setState({
      startDate: moment().subtract(1,'month').startOf('month').format('YYYY-MM-DD'),
      endDate: moment().subtract(1,'month').endOf('month').format('YYYY-MM-DD'),
      btnActive:e.target.name
    },()=>{this.getFilterData()})
  }

  onChangeServiceType = (e) => { //切換類型
    this.showLoading()
    if(e.target.value===''){
      this.setState({
        activePage:1,
        service_type:''
      },()=>{this.getInitialData()})
    }
    else{
      this.setState({
        activePage:1,
        service_type: e.target.value
      }
      ,()=>{this.getFilterData()}
      )
    }
  }

  getFilterData = async() => {
    let {activePage, startDate, endDate, service_type} = this.state
    try {
      let res = await apiSearchCustomerEventsParameter(activePage, startDate, endDate, service_type)
      if(res.data.code===1){
        this.setState({
          customerHistoryList: res.data.data.customer_services,
          state_pages_total: res.data.data.total_pages,
        })
      }
    }catch (err) {
      console.log(err)
    }
    this.setState({
      hasClickSearch:true
    })
  }

  getInitialData = async() => {
    this.showLoading();
    try {
      let res = await apiGetCustomerServiceHistory(1, this.state.startDate, this.state.endDate)
      if(res.data.code===1){
        this.setState({
          customerHistoryList: res.data.data.customer_services,
          state_pages_total: res.data.data.total_pages,
        })
      }
    }catch (err) {
      console.log(err)
    }
    this.setState({
      hasClickSearch:true
    })
  }

  componentDidMount(){
    this.getInitialData()
    this.refreshPage = setInterval(()=>{
      this.getFilterData()
      console.log('刷新-客訴歷史紀錄',new Date().getMinutes(),':',new Date().getSeconds())
    },6000)
  }

  componentWillUnmount(){
    clearInterval(this.refreshPage);
  }

  render() {
    const { t } = this.props;
    const { btnActive } = this.state;
    const { customerHistoryList, state_pages_total, activePage } = this.state;

    let path_link = (this.props.location.pathname).replace("/service/history/",'')
    let path_id = parseInt(path_link,10)

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-exchange">
              <div className="header text-center">
                <h4 className="title">{t('app.message_history')}</h4>
              </div>

              <div className="filter-section">
                <div style={{display:'flex'}} className="datepicker-input-search-section">
                  <span className="datepicker-search-label">{t('app.search_daterange')} :</span>
                  <div style={{display:'flex'}} >
                    <span className="datepicker-search-from-to">{t('app.from')}</span>
                    <DatePicker
                      className="date-search-input"
                      dateFormat="yyyy-MM-dd"
                      selected={this.state.picker_startDate}
                      onChange={this.handleStartChange}
                      value={this.state.picker_startDate===''?this.state.startDate:this.state.picker_startDate}
                      maxDate={new Date(this.state.picker_endDate===''?this.state.endDate:this.state.picker_endDate)}
                    />
                    <span className="datepicker-search-from-to">{t('app.to')}</span>
                    <DatePicker
                      className="date-search-input"
                      dateFormat="yyyy-MM-dd"
                      selected={this.state.picker_endDate}
                      onChange={this.handleEndChange}
                      value={this.state.picker_endDate===''?this.state.endDate:this.state.picker_endDate}
                      minDate={new Date(this.state.picker_startDate===''?this.state.startDate:this.state.picker_startDate)}
                    />
                  </div>
                </div>
                <div className="date-btn-section">
                  <button onClick={this.getToday} name="today"
                    className={`date-btn ${btnActive==="today"?'date-btn-active':''}`}>
                    {t('app.today')}
                  </button>
                  <button onClick={this.getYesterday} name="yesterday"
                    className={`date-btn ${btnActive==="yesterday"?'date-btn-active':''}`}>
                    {t('app.yesterday')}
                  </button>
                  <button onClick={this.getThisWeek} name="thisWeek"
                    className={`date-btn ${btnActive==="thisWeek"?'date-btn-active':''}`}>
                    {t('app.thisWeek')}
                  </button>
                  <button onClick={this.getLastWeek} name="lastWeek"
                    className={`date-btn ${btnActive==="lastWeek"?'date-btn-active':''}`}>
                    {t('app.lastWeek')}
                  </button>
                  <button onClick={this.getThisMonth} name="thisMonth"
                    className={`date-btn ${btnActive==="thisMonth"?'date-btn-active':''}`}>
                    {t('app.thisMonth')}
                  </button>
                  <button onClick={this.getLastMonth} name="lastMonth"
                    className={`date-btn ${btnActive==="lastMonth"?'date-btn-active':''}`}>
                    {t('app.lastMonth')}
                  </button>
                </div>
                <div className="table-filter-section">
                  <span className="table-filter-label">
                    {t('app.type')}  : 
                  </span>
                    <select
                      onChange={e=>this.onChangeServiceType(e)} 
                      className="table-select">
                        <option
                          label={t('app.all')}
                          value={''} 
                          >
                        </option>
                          <option
                          label={t('app.order')}
                          value={10} 
                          >
                        </option>
                        <option
                          label={t('app.transaction')}
                          value={20} 
                          >
                        </option>
                        <option
                          label={t('app.suggestion')}
                          value={30} 
                          >
                        </option>
                        <option
                          label={t('app.account')}
                          value={40} 
                          >
                        </option>
                        <option
                          label={t('app.other')}
                          value={90} 
                          >
                        </option>
                    </select>
                  <span className="mr-15"></span>
                </div>
              </div>

              <div className="content table-responsive table-full-width">
              {this.state.showLoading?
                <table className="table table-exchange text-center m-tb-30">
                  <ClipLoader
                    sizeUnit={"px"}
                    size={40}
                    color={'#999'}
                    loading={this.state.loading}
                  />
                </table>
                  :
                <table className="table table-bigboy table-exchange">
                  <thead>
                    <tr>
                      <th>{t('app.id')}</th>
                      <th>{t('app.create_datetime')}</th>
                      <th>{t('app.type')}</th>
                      <th>{t('app.username')}</th>
                      <th>{t('app.photo')}</th>
                      <th>{t('app.content')}</th>
                    </tr>
                  </thead>
                  {customerHistoryList === undefined
                    || !customerHistoryList instanceof Array
                    || customerHistoryList.length === 0 ?

                    <td className="table-no-data" colSpan="20">
                      {t('app.no_data')}
                    </td>
                    :
                    <tbody>
                      {customerHistoryList.map((data, index) => (
                        <SingleCustomerHistory
                          key={index}
                          data={data}
                          subData={data.customer_service_replies}
                          refreshData={this.getFilterData}
                          path_id={path_id}
                          />
                        ))
                      }
                    </tbody>
                    }
                </table>
               }

               {state_pages_total > 0 ?
                  <div className="page-section">
                    <Pagination
                      activePage={activePage}
                      itemsCountPerPage={20}
                      totalItemsCount={state_pages_total*20}
                      pageRangeDisplayed={3}
                      onChange={e=>this.handlePageChange(e)}
                    />
                  </div>
                :''}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(CustomerServiceHistory);