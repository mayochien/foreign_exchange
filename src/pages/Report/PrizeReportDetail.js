import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { apiGetPrizeDetail, apiDownloadPrizeDetail
        } from '../../services/apiService';
import PrizeReportDetailItem  from './PrizeReportDetailItem';
import Pagination from "react-js-pagination";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ClipLoader } from 'react-spinners';
import { TiArrowBack } from "react-icons/ti";
import { getDay } from 'date-fns';
import { CSVLink } from "react-csv";
import { IoMdDownload } from "react-icons/io";
import { FaEye, FaAngleLeft } from "react-icons/fa";
import  Format  from '../../services/Format';


class PrizeReportDetail extends Component {
  state = {
    dataList: [],
    total_page:0,
    activePage:1,
    startDate: this.props.match.params.startDate,
    endDate: this.props.match.params.endDate,
    picker_startDate:'',
    picker_endDate:'',
    btnActive:this.props.match.params.selectedTime,
    loading: true,
    total_trading_amount:'',
    total_banker_prize:'',
    downloadData:'',
  };

  openSerialNumber = () => {
    this.setState({
      show_serialNumber: !this.state.show_serialNumber,
      shineBackgrounf:true
    });
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

  handlePageChange (pageNumber) { // 切換頁面
    this.setState({
      activePage: pageNumber
    },()=>{this.getInitialData()})
  }

  handleStartChange = (date) => { //datePicker的起始日 (選取一週)
    this.setState({
      startDate: moment(date).format('YYYY-MM-DD'),
      btnActive:'date-picker-search',
      activePage:1
    },()=>{
      this.handleEndChange();
    })
  }

  handleEndChange = () => { // 隨著起始日連動+6
    this.setState({
      endDate: moment(this.state.startDate).add(6, 'd').format('YYYY-MM-DD'),
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

  getDownloadData = async() => { //取得下載資料
    let selectedUserId = this.props.match.params.id
    try {
      let resCsv = await apiDownloadPrizeDetail(selectedUserId, this.state.startDate,
         this.state.endDate,this.props.i18n.language)
      // console.log('下載資料',resCsv.data);
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
    let selectedUserId = this.props.match.params.id
    try {
      let res = await apiGetPrizeDetail(selectedUserId ,this.state.activePage, this.state.startDate, this.state.endDate);
      if(res.data.code===1){
        this.setState({
          dataList: res.data.data.deal_cache,
          total_page:res.data.data.total_pages,
          total_trading_amount: res.data.data.total_trading_amount,
        },()=>{this.getDownloadData()})
      }
    } catch(err) {
      console.log(err);
    }
  }

  componentDidMount(){
    this.getInitialData()
    // this.refreshPage = setInterval(()=>{
      // this.getInitialData()
      // console.log('刷新-錢包紀錄',new Date().getMinutes(),':',new Date().getSeconds())
    // },5000)
  }

  componentWillReceiveProps(){
    this.getDownloadData()
  }

  render() {
    const { t } = this.props;
    const { dataList ,btnActive, total_trading_amount  } = this.state;

    const isMonday = date => {
      const day = getDay(date);
      return day === 1;
    };

    const isSunday = date => {
      const day = getDay(date);
      return day === 0;
    };

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="card card-exchange">

              <div className="">
                <button className="lastpage-btn"
                 onClick={()=>this.props.history.push('/report/prize')}>
                    <TiArrowBack className="lastpage-icon"/>
                    {t('app.go_back_page')}
                </button>
              </div>
              
              <div className="header text-center">
                <h4 className="title">{t('app.prize_pool_detail')}</h4>
              </div>

              <div className="filter-section">
                <div className="datepicker-input-search-section">
                  <span className="datepicker-search-label">{t('app.data_date_range')} :</span>
                  <span className="datepicker-search-from-to">{t('app.from')}</span>
                  <DatePicker
                      selected={this.state.picker_startDate}
                      onChange={this.handleStartChange}
                      value={this.state.picker_startDate===''?this.state.startDate:this.state.picker_startDate}
                      filterDate={isMonday}
                      dateFormat="yyyy-MM-dd"
                      className="date-search-input"
                    />
                  <span className="datepicker-search-from-to">{t('app.to')}</span>
                  <DatePicker
                    selected={this.state.picker_endDate}
                    value={this.state.picker_endDate===''?this.state.endDate:this.state.picker_endDate}
                    filterDate={isSunday}
                    dateFormat="yyyy-MM-dd"
                    className="date-search-input"
                  />
                </div>
                <div className="date-btn-section">
                    {/* <button onClick={this.getToday} name="today"
                      className={`date-btn ${btnActive==="today"?'date-btn-active':''}`}>
                      {t('app.today')}
                    </button>
                    <button onClick={this.getYesterday} name="yesterday"
                      className={`date-btn ${btnActive==="yesterday"?'date-btn-active':''}`}>
                      {t('app.yesterday')}
                    </button> */}
                    <button onClick={this.getThisWeek} name="thisWeek"
                      className={`date-btn ${btnActive==="thisWeek"?'date-btn-active':''}`}>
                      {t('app.thisWeek')}
                    </button>
                    <button onClick={this.getLastWeek} name="lastWeek"
                      className={`date-btn ${btnActive==="lastWeek"?'date-btn-active':''}`}>
                      {t('app.lastWeek')}
                    </button>
                    {/* <button onClick={this.getThisMonth} name="thisMonth"
                      className={`date-btn ${btnActive==="thisMonth"?'date-btn-active':''}`}>
                      {t('app.thisMonth')}
                    </button>
                    <button onClick={this.getLastMonth} name="lastMonth"
                      className={`date-btn ${btnActive==="lastMonth"?'date-btn-active':''}`}>
                      {t('app.lastMonth')}
                    </button> */}
                    <CSVLink  className="download-btn" 
                      data={this.state.downloadData} 
                      filename={"Prize_Detail_Report.csv"}>
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

                        <th>{t('app.seller')}</th>
                        <th>{t('app.seller_currency')}</th>
                        <th>{t('app.seller_amount')}</th>

                        <th>{t('app.currency_rate')}</th>
                        <th>{t('app.deal_fee')} (HKD)</th>

                        <th>{t('app.buyer')}</th>
                        <th>{t('app.buyer_currency')}</th>
                        <th>{t('app.buyer_amount')}</th> 

                        <th>{t('app.trading_amount')} (HKD)</th>
                        <th>{t('app.update_datetime')}</th>
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
                            <PrizeReportDetailItem 
                              key={index}
                              {...item}
                              refreshData={this.getInitialData.bind(this,this.state.activePage)}
                              show_serialNumber = {this.state.show_serialNumber}
                              />
                          ))}
                          <tr className="tr-total-text">
                            <td>{t('app.total')}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>
                              {total_trading_amount? Format.thousandsMathRound3(total_trading_amount) : '0'}</td>
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

export default withTranslation()(PrizeReportDetail);