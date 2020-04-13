import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { apiGetWalletRecordFilter,
         apiDownloadWalletReport
        } from '../../services/apiService';
import WalletRecordItem  from './WalletRecordItem';
import Pagination from "react-js-pagination";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ClipLoader } from 'react-spinners';
import { IoMdDownload } from "react-icons/io";
import { CSVLink } from "react-csv";
import  Format  from '../../services/Format';


class WalletRecord extends Component {
  state = {
    dataList: [],
    total_page:0,
    activePage:1,
    startDate: moment().startOf('isoWeek').format('YYYY-MM-DD'),
    endDate: moment().endOf('isoWeek').format('YYYY-MM-DD'),
    picker_startDate:'',
    picker_endDate:'',
    btnActive:"thisWeek",
    selected_expense:'',
    loading: true,
    downloadData:''
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

  handleStartChange = (date) => { //datePicker的起始日
    this.setState({
      startDate: moment(date).format('YYYY-MM-DD'),
      btnActive:'date-picker-search'
    },()=>{this.getInitialData()})
  }

  handleEndChange = (date) => { //datePicker的結束日
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
   
  getToday = (e) => {
    this.clearDatePickerInput()
    this.setState({
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      btnActive:e.target.name
    },()=>{this.getInitialData()})
  }

  getYesterday = (e) => {
    this.clearDatePickerInput()
    this.setState({
      startDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      btnActive:e.target.name
    },()=>{this.getInitialData()})
  }

  getThisWeek = (e) => {
    this.clearDatePickerInput()
    this.setState({
      startDate: moment().startOf('isoWeek').format('YYYY-MM-DD'),
      endDate: moment().endOf('isoWeek').format('YYYY-MM-DD'),
      btnActive:e.target.name
    },()=>{this.getInitialData()})
  }

  getLastWeek = (e) => {
    this.clearDatePickerInput()
    this.setState({
      startDate: moment().subtract(1,'isoWeek').startOf('isoWeek').format('YYYY-MM-DD'),
      endDate: moment().subtract(1,'isoWeek').endOf('isoWeek').format('YYYY-MM-DD'),
      btnActive:e.target.name
    },()=>{this.getInitialData()})
  }

  getThisMonth = (e) => {
    this.clearDatePickerInput()
    this.setState({
      startDate: moment().startOf('month').format('YYYY-MM-DD'),
      endDate: moment().endOf('month').format('YYYY-MM-DD'),
      btnActive:e.target.name
    },()=>{this.getInitialData()})
  }

  getLastMonth = (e) => {
    this.clearDatePickerInput()
    this.setState({
      startDate: moment().subtract(1,'month').startOf('month').format('YYYY-MM-DD'),
      endDate: moment().subtract(1,'month').endOf('month').format('YYYY-MM-DD'),
      btnActive:e.target.name
    },()=>{this.getInitialData()})
  }

  onChangeOption = (e) => {
    this.setState({
      activePage:1,
      selected_expense:e.target.value,
    })
    if(e.target.value==="all"){
      this.setState({
        activePage:1,
        selected_expense:'',
      })
    }
    setTimeout(() => {
      this.getInitialData()
    }, 300);
  }
  
  getDownloadData = async() => { //取得下載資料
    try {
      let resCsv = await apiDownloadWalletReport(this.state.startDate, this.state.endDate,this.props.i18n.language)
      if(resCsv.data.code===2 || resCsv.data === undefined ){  
        return false
      }
      else{
        this.setState({downloadData : resCsv.data})
      }
    } catch (err) {
      console.log(err);
    }
  }

  getInitialData = async() => { // 初始載入
    this.showLoading()
    let get_startDate = this.state.startDate
    let get_endDate = this.state.endDate
    try {
      let res = await apiGetWalletRecordFilter(this.state.activePage, get_startDate, get_endDate, this.state.selected_expense);
      if(res.data.code===1){
        this.setState({
          dataList: res.data.data.wallet_log,
          total_page:res.data.data.total_pages, // 總頁數
        },()=>{this.getDownloadData()})
      }
    } catch(err) {
      console.log(err);
    }
  }

  componentDidMount(){
    this.getInitialData()
    if(this.state.doingFilterNow===false){ //不進行篩選功能時，才能刷新
      this.refreshPage = setInterval(()=>{
        this.getInitialData()
        // console.log('刷新-錢包紀錄',new Date().getMinutes(),':',new Date().getSeconds())
      },5000)
    }
  }

  componentWillUnmount(){
    clearInterval(this.refreshPage);
  }

  componentWillReceiveProps(){
    this.getDownloadData()
  }

  render() {
    // console.log('資料頁面總數:',this.state.total_page)
    const { t } = this.props;
    const { dataList,btnActive } = this.state;
    let total_income = 0
    let total_expenses = 0
    dataList.map(item => (
      total_income += item.income
    ))
    dataList.map(item => (
      total_expenses += item.outcome
    ))

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-exchange">
              
              <div className="header text-center">
                <h4 className="title">{t('app.wallet_record')}</h4>
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
                    {t('app.expense_item')}  : 
                  </span>
                  <select
                    onChange={e=>this.onChangeOption(e)} 
                    className="table-select">
                      <option value="all">{t('app.all')}</option>
                      {/* <option value="0">{t('HANDLING_FEE_TYPE.CREATE_BANKER')}</option> */}
                      <option value="1">{t('HANDLING_FEE_TYPE.DEAL_FEE')}</option>
                      <option value="12">{t('HANDLING_FEE_TYPE.DEPOSIT_SUB_IN_CASH')}</option>
                      <option value="13">{t('HANDLING_FEE_TYPE.DEPOSIT_SUB_BY_TRANSFER')}</option>
                  </select>
                  <span className="mr-15"></span>
                  <CSVLink  className="download-btn" 
                    data={this.state.downloadData} 
                    filename={"Wallet_Record.csv"}>
                      <IoMdDownload/>
                      {t('app.download')}
                  </CSVLink>
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
                        <th>{t('app.serial_number')}</th>
                        <th>{t('app.income')} (HKD)</th>
                        <th>{t('app.expenses')} (HKD)</th>
                        <th>{t('app.remain')}</th>
                        <th>{t('app.expense_item')}</th>
                        <th>{t('app.create_datetime')}</th>
                        <th>{t('app.remark')}</th>
                      </tr>
                    </thead>
                    
                      {dataList===undefined
                        || !dataList instanceof Array 
                        || dataList.length === 0? 
                        <td className="table-no-data" colSpan="20">
                          {t('app.no_data')}
                        </td>
                        :
                        <tbody>
                          {dataList.map((item, index) => (
                            <WalletRecordItem 
                              key={index}
                              {...item}
                              refreshData={this.getInitialData.bind(this,1)}
                            />
                          ))}
                           <tr className="tr-total-text">
                            <td>{t('app.total')}</td>
                            <td>         
                              {total_income? Format.thousandsMathRound3(total_income) : '0'}
                            </td>
                            <td>
                            {total_expenses? Format.thousandsMathRound3(total_expenses) : '0'}
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
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

export default withTranslation()(WalletRecord);