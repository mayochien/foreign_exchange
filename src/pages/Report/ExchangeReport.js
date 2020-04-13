import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { apiGetExchangeReport,apiDownloadExchangeReport } from '../../services/apiService';
import ExchangeReportListTitle  from './ExchangeReportListTitle';
import Pagination from "react-js-pagination";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ClipLoader } from 'react-spinners';
import { IoMdDownload } from "react-icons/io";
import { CSVLink } from "react-csv";
// import { createGlobalStyle } from 'styled-components';

class ExchangeReport extends Component {

  state = {
    dataList: [],
    activePage:1,
    startDate: moment().startOf('isoWeek').format('YYYY-MM-DD'),
    endDate: moment().endOf('isoWeek').format('YYYY-MM-DD'),
    picker_startDate:'',
    picker_endDate:'',
    btnActive:"thisWeek",
    loading: true,
    downloadData:''
  };

  handlePageChange (pageNumber) { // 切換頁面
    this.setState({
      activePage: pageNumber
    })
    this.getInitialData(pageNumber)
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

  // onClickDatePickerSearch = (e) => {
  //   let format_picker_startDate = moment(this.state.picker_startDate).format('YYYY-MM-DD');
  //   let format_picker_endDate = moment(this.state.picker_endDate).format('YYYY-MM-DD');
  //   this.setState({
  //     btnActive:'date-picker-search'
  //   })
  //   setTimeout(() => {
  //     this.getInitialData(format_picker_startDate,format_picker_endDate)
  //   }, 300);
  // }

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

  getDownloadData = async() => { //取得下載資料
    try {
      let resCsv = await apiDownloadExchangeReport(this.state.startDate,this.state.endDate,this.props.i18n.language)
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

  getInitialData = async() => {
    this.showLoading()
    try {
      let res = await apiGetExchangeReport(this.state.startDate,this.state.endDate);
      if(res.data.code===1){
        let resData = res.data.data
        let resultList = Object.entries(resData).map(([currency, amount]) => ({currency,amount}))
        this.setState({
          dataList: resultList,
        }
        ,()=>{this.getDownloadData()}
        )
      }
    } catch(err) {
      console.log(err);
    }
  }

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
  
  componentDidMount() {
    this.getInitialData();
  }
  
  componentWillReceiveProps(){
    this.getDownloadData()
  }

  render() {
    const { t } = this.props;
    const { dataList,btnActive } = this.state;
    // console.log(this.props.i18n.language);
    // console.log(this.props.i18n.languages[1]);


    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-exchange">
            
              <div className="header text-center">
                <h4 className="title">{t('app.exchange_report')}</h4>
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
                    <CSVLink  className="download-btn" data={this.state.downloadData} filename={"Exchange_Report.csv"}>
                      <IoMdDownload/>
                      {t('app.download')}
                  </CSVLink>
                </div>
              </div>
             
              <div className="content table-responsive table-full-width">
                <div className="table-head-exchange-report">
                  <span className="title-currency">{t('app.currency_type')}</span>
                  <span className="title-spacing">/</span>
                  <span className="title-amount">{t('app.amount')}</span>
                </div>
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
                    {dataList===undefined
                      || !dataList instanceof Array 
                      || dataList.length === 0? 
                      <td className="table-no-data" colSpan="12">
                        {t('app.no_data')}
                      </td>
                      :
                      <tbody className="table-body-exchange-report">
                        {dataList.map((item, index) => (
                          <ExchangeReportListTitle
                            key={index}
                            {...item}
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            refreshData={this.getInitialData.bind(this,1)}
                            prop_startDate ={this.state.startDate}
                            prop_endDate ={this.state.endDate}
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

export default withTranslation()(ExchangeReport);