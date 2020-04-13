import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import moment from "moment";
import { Link } from 'react-router-dom';
import { apiGetWithdrawList,apiGetWithdrawCurrency } from '../../services/apiService';
import WithdrawListItem  from './WithdrawListItem';
import { MdLibraryAdd } from "react-icons/md";
import Pagination from "react-js-pagination";
import { FaEye, FaAngleLeft } from "react-icons/fa";
import { ClipLoader } from 'react-spinners';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


class WithdrawList extends Component {
  state = {
    dataList: [],
    currencyOptions:[],
    show_serialNumber:false,
    showLoading:true,
    activePage:1,
    startDate: moment().startOf('isoWeek').format('YYYY-MM-DD'),
    endDate: moment().endOf('isoWeek').format('YYYY-MM-DD'),
    picker_startDate:'',
    picker_endDate:'',
    btnActive:"thisWeek",
    select_currency:'',
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

  openSerialNumber = () => {
    this.setState({
      show_serialNumber: !this.state.show_serialNumber,
    });
  }
  
  handlePageChange (pageNumber) { // 切換頁面
    this.setState({
      activePage: pageNumber
    },()=>{this.getInitialData()})
  }

  handleStartChange = (date) => {
    this.setState({
      startDate: moment(date).format('YYYY-MM-DD'),
      btnActive:'date-picker-search'
    },()=>{this.getInitialData()})
  }

  handleEndChange = (date) => {
    this.setState({
      endDate: moment(date).format('YYYY-MM-DD'),
      btnActive:'date-picker-search'
    },()=>{this.getInitialData()})
  }

  clearDatePickerInput =()=>{
    this.setState({
      picker_startDate: '',
      picker_endDate: ''
    })
  }

  clearDatePickerInput =()=>{
    this.setState({
      picker_startDate: '',
      picker_endDate: ''
    })
  }
     
  getToday = (e) => {
    this.clearDatePickerInput()
    this.setState({
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      btnActive:e.target.name,
      activePage:1,
    },()=>{this.getInitialData()})
  }

  getYesterday = (e) => {
    this.clearDatePickerInput()
    this.setState({
      startDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      btnActive:e.target.name,
      activePage:1,
    },()=>{this.getInitialData()})
  }

  getThisWeek = (e) => {
    this.clearDatePickerInput()
    this.setState({
      startDate: moment().startOf('isoWeek').format('YYYY-MM-DD'),
      endDate: moment().endOf('isoWeek').format('YYYY-MM-DD'),
      btnActive:e.target.name,
      activePage:1,
    },()=>{this.getInitialData()})
  }

  getLastWeek = (e) => {
    this.clearDatePickerInput()
    this.setState({
      startDate: moment().subtract(1,'isoWeek').startOf('isoWeek').format('YYYY-MM-DD'),
      endDate: moment().subtract(1,'isoWeek').endOf('isoWeek').format('YYYY-MM-DD'),
      btnActive:e.target.name,
      activePage:1,
    },()=>{this.getInitialData()})
  }

  getThisMonth = (e) => {
    this.clearDatePickerInput()
    this.setState({
      startDate: moment().startOf('month').format('YYYY-MM-DD'),
      endDate: moment().endOf('month').format('YYYY-MM-DD'),
      btnActive:e.target.name,
      activePage:1,
    },()=>{this.getInitialData()})
  }

  getLastMonth = (e) => {
    this.clearDatePickerInput()
    this.setState({
      startDate: moment().subtract(1,'month').startOf('month').format('YYYY-MM-DD'),
      endDate: moment().subtract(1,'month').endOf('month').format('YYYY-MM-DD'),
      btnActive:e.target.name,
      activePage:1,
    },()=>{this.getInitialData()})
  }

  getCurrencyOptions = async() => { //取得開放的提款幣別清單
    try {
      let res = await apiGetWithdrawCurrency()
      if(res.data.code===1){
        this.setState({
          currencyOptions:['All'].concat(Object.keys(res.data.data.withdraw_currency))
        })
      }
    } catch (err) {
      console.log(err);
    }
  }

  filterChangeCurrency = (e)=> { 
    if (e.target.value === 'All'){ 
      this.setState({
        select_currency:'',
        activePage:1
      },()=>this.getFilterData())
    }
    else{
      this.setState({
        select_currency:e.target.value,
        activePage:1
      },()=>this.getFilterData())
    }
  }

  getFilterData = async() => {
    this.showLoading()
    let {activePage, startDate, endDate, select_currency} = this.state
    try {
      let res = await apiGetWithdrawList(activePage, startDate, endDate, select_currency)
      // console.log('篩選出的清單:',res.data.data)
      if(res.data.code===1){
        this.setState({
          dataList:res.data.data.withdraw,
          total_page:res.data.data.total_pages,
        })
      }
    } catch(err) {
      console.log(err);
    }
  }

  getInitialData = async() => { // 初始載入
    this.showLoading()
    let {startDate, endDate,select_currency} = this.state
    try {
      let res = await apiGetWithdrawList(1, startDate, endDate, select_currency);
      if(res.data.code===1){
        this.setState({
          dataList: res.data.data.withdraw,
          total_page:res.data.data.total_pages, // 總頁數
        })
      }
    } catch(err) {
      console.log(err);
    }
  }
  
  componentDidMount() {
    this.getInitialData();
    this.getCurrencyOptions()
    if(this.state.doingFilterNow===false){ //不進行篩選功能時，才能刷新
      this.refreshPage = setInterval(()=>{
        this.getFilterData()
        console.log('刷新-提款',new Date().getMinutes(),':',new Date().getSeconds())
      },5000)
    }
  }

  // getSnapshotBeforeUpdate(prevState) {  //取代 componentWillUpdate
  //   if (prevState.dataList !== this.state.dataList){
  //       setTimeout(()=>{
  //         this.getInitialData(this.state.activePage)
  //         // console.log('儲值清單頁刷新',new Date().getMinutes(),':',new Date().getSeconds())
  //       },5000)
  //   }
  // }

  componentWillUnmount(){
    clearInterval(this.refreshPage);
  }

  render() {
    const { t } = this.props;
    const { dataList, btnActive } = this.state;
    // console.log(this.state.currencyOptions)
    // console.log(this.state.currencyOptions.unshift('ALL'));
    // console.table(this.state.currencyOptions.map(i=>i));
    let path_link = (this.props.location.pathname).replace("/withdraw/withdraw-list/",'')
    let path_id = parseInt(path_link,10)
    // console.log(path_id);

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-exchange">

              <div className="text-right">
                <Link to="/withdraw/withdraw-apply" 
                  className="text-page-link">
                  <MdLibraryAdd/>
                  <span className="ml-5">{t('app.add')}</span>
                </Link>
              </div>
              
              <div className="header text-center">
                <h4 className="title">{t('app.withdraw_list')}</h4>
              </div>

              <div className="filter-section">
                <div className="datepicker-input-search-section">
                  <span className="datepicker-search-label">{t('app.data_date_range')} :</span>
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
                    {t('app.currency_type')}
                  </span>
                  {this.state.currencyOptions instanceof Array
                    && this.state.currencyOptions.length >0 ? 
                    <select className="table-select" onChange={this.filterChangeCurrency}>
                      {this.state.currencyOptions.map((item,index) => 
                        <option key={index} value={item} label={item}>{item}</option>)
                      }
                    </select>
                  :
                    <select className="table-select">
                      <option key="" label={t('app.no_options')}></option>
                    </select>
                  }
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
                    <table className="table table-exchange">
                      <thead>
                        <tr>
                          <th>{t('app.id')}</th>

                          {this.state.show_serialNumber?
                            <th className="th-no-data">
                              {t('app.serial_number')} 
                              <button className="btn-open-serial-number ml-5"
                                onClick={this.openSerialNumber}>
                                <FaAngleLeft/>
                              </button>
                            </th> 
                            :
                            <th className="th-no-data">
                              {t('app.serial_number')} 
                              <button className="btn-open-serial-number  ml-5"
                                onClick={this.openSerialNumber}>
                                <FaEye/>                          
                              </button>
                            </th>
                          }
                          <th>{t('app.choose_withdrawal_method')}</th> {/* 提款方式 */}
                          <th>{t('app.withdrawal_amount')}</th>  {/* 提款數量 */}
                          <th>{t('app.currency_type')}</th>  {/* 幣別 */}
                          <th>{t('app.convert_amount')}</th>  {/* 轉換數量 */}
                          <th>{t('app.bank_account')}</th>   {/* 銀行帳戶 */}
                          <th>{t('app.receipt')}</th>  {/* 單據 */}
                          <th>{t('app.status')}</th>  {/* 狀態 */}
                          <th>{t('app.create_datetime')}</th>
                          <th>{t('app.remark')}</th>
                        </tr>
                      </thead>
                      {!dataList instanceof Array 
                        || dataList.length === 0? 
                        <td className="table-no-data" colSpan="20">
                          {t('app.no_data')}
                        </td>
                        :
                        <tbody>
                          {dataList.map((item, index) => (
                            <WithdrawListItem 
                              key={index}
                              // data={...item}
                              {...item}
                              refreshData={this.getInitialData.bind(this,1)}
                              show_serialNumber={this.state.show_serialNumber}
                              path_id={path_id}
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
                      show_serialNumber = {this.state.show_serialNumber}
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

export default withTranslation()(WithdrawList);