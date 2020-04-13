import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { apiGetBouns, apiDownloadBouns } from '../../services/apiService';
import BonusReportItem  from './BonusReportItem';
import Pagination from "react-js-pagination";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ClipLoader } from 'react-spinners';
import { CSVLink } from "react-csv";
import { IoMdDownload } from "react-icons/io";
import { MdClear } from "react-icons/md";
import Format from '../../services/Format'


class BonusReport extends Component {
  state = {
    dataList: [],
    total_page:0,
    activePage:1,
    startDate: moment().startOf('isoWeek').format('YYYY-MM-DD'),
    endDate: moment().endOf('isoWeek').format('YYYY-MM-DD'),
    picker_startDate:'',
    picker_endDate:'',
    btnActive:"thisWeek",
    loading: true,
    downloadData:'',
    total_deal_fee:0,
    total_trading_amount:0,
    total_promote_bonus:0,
    search_value:'',
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
      btnActive:'date-picker-search',
      activePage:1,
    },()=>{this.getInitialData()})
  }

  handleEndChange = (date) => { //datePicker的結束日
    this.setState({
      endDate: moment(date).format('YYYY-MM-DD'),
      btnActive:'date-picker-search',
      activePage:1,
    },()=>{this.getInitialData()})
  }
  
  clearDatePickerInput =()=>{
    this.setState({
      picker_startDate: '',
      picker_endDate: '',
      activePage:1,
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

  onchangeInput = (e) => {
    this.setState({
      search_value:e.target.value,
    })
  }

  clearSearch = () => { // 清除搜尋
    this.setState({
      search_value:'',
      activePage:1
    },()=>{this.getInitialData()})
  }

  getFirstTimeSearchData = () => { // 第一次搜尋，強制切回第一頁
    this.setState({
      activePage:1
    },()=>{this.getInitialData()}
    )
  }

  getDownloadData = async() => { //取得下載資料
    // let {t} = this.props
    let {startDate, endDate} = this.state
    try {
      let resCsv = await apiDownloadBouns(startDate, endDate, this.props.i18n.language)
      // console.log('下載資料',resCsv.data);
      if(resCsv.data.code===2 || resCsv.data === undefined ){  
        return false
      }
      else{
        this.setState({downloadData : resCsv.data})
      }
    } catch (error) {
      console.log(error);
    }
  }

  getInitialData = async() => { // 初始載入
    this.showLoading()
    let { activePage, startDate, endDate, search_value } = this.state
    try {
      let res = await apiGetBouns(activePage, startDate, endDate, search_value);
      if(res.data.code===1){
        this.setState({
          dataList: res.data.data.bonus,
          total_page:res.data.data.total_pages,
          total_deal_fee: res.data.data.total_deal_fee,
          total_promote_bonus: res.data.data.total_promote_bonus,
          total_trading_amount: res.data.data.total_trading_amount,
        },()=>{this.getDownloadData()})
      }
    } catch(err) {
      console.log(err);
    }
  }

  componentDidMount(){
    this.getInitialData()
  }

  componentWillReceiveProps(){
    this.getDownloadData()
  }

  render() {
    const { t } = this.props;
    const { dataList,btnActive, total_deal_fee, total_trading_amount, total_promote_bonus} = this.state;


    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-exchange">
              
              <div className="header text-center">
                <h4 className="title">{t('app.promotion_bonus')}</h4>
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
                    <CSVLink  className="download-btn" 
                      data={this.state.downloadData} 
                      filename={"Bonus_Report.csv"}>
                        <IoMdDownload/>
                        {t('app.download')}
                    </CSVLink>
                </div>

                <div className="table-filter-section">
                  <span className="table-filter-label">{t('app.search')} {t('app.username')} :</span>
                  <span className="search-form-fieldset">
                    <input type="search" className="input-search" 
                      onChange={this.onchangeInput}
                      value={this.state.search_value}
                      onKeyPress={e => {
                        if (e.key === 'Enter') {
                          this.getFirstTimeSearchData()
                        }
                        if (e.key === 'Esc') {
                          this.clearSearch()
                        }
                      }} 
                      />
                    <button className="btn-search-clear"
                      onClick={this.clearSearch}> 
                      {this.state.search_value!==''?<MdClear/>:<span></span> }
                    </button>
                  </span>
                  <button className="button-search"
                    onClick={this.getFirstTimeSearchData}>
                      <i className="fa fa-search"></i>
                  </button>
                </div>

                <div className="data-info-section">
                  <span className="ml-auto mr-30" >
                    {t('app.total_fee')} : {total_deal_fee? Format.thousandsMathRound3(total_deal_fee) : '0' } 
                  </span>
                  <span className="mr-30" >
                    {t('app.total')} : {total_trading_amount? Format.thousandsMathRound3(total_trading_amount) : '0' } 
                  </span>
                  <span className="" >
                    {t('app.allocated_promotion_bonus')} : {total_promote_bonus? Format.thousandsMathRound3(total_promote_bonus) : '0'}
                  </span>
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
                      <tr className="tr-double-first">
                        <th colSpan="5">{t('app.dwonline_list')}</th>
                      </tr>
                      <tr className="tr-double-second">
                        <th>{t('app.id')}</th>
                        <th>{t('app.username')}</th>
                        <th>{t('app.trading_amount')} (HKD)</th>
                        <th>{t('app.promotion_bonus')}</th>
                        <th>{t('app.detail')}</th>
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
                            <BonusReportItem 
                              key={index}
                              {...item}
                              refreshData={this.getInitialData.bind(this,1)}
                              startDate={this.state.startDate}
                              endDate={this.state.endDate}
                              selectedTime={this.state.btnActive}
                              />
                          ))}
                          {/* <tr className="tr-total-text">
                            <td>{t('app.total')}</td>
                            <td></td>
                            <td>{total_trading_amount?
                              Format.thousandsMathRound3(total_trading_amount)
                              :'0.000'}
                            </td>
                            <td>{total_promote_bonus?
                              Format.thousandsMathRound3(total_promote_bonus)
                              :'0.000'}
                            </td>
                            <td></td>
                          </tr> */}
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

export default withTranslation()(BonusReport);