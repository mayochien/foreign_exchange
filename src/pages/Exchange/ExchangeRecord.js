import React from 'react';
import { apiGetDealNoteList, apiGetDealNoteFilter } from '../../services/apiService'
import ExchangeRecordItem from './ExchangeRecordItem'
import {withTranslation} from 'react-i18next';
import Pagination from "react-js-pagination";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ClipLoader } from 'react-spinners';
import { FaEye, FaAngleLeft } from "react-icons/fa";


class ExchangeRecord extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      dataList:[],
      total_page:0,
      activePage:1,
      startDate: moment().startOf('isoWeek').format('YYYY-MM-DD'),
      endDate: moment().endOf('isoWeek').format('YYYY-MM-DD'),
      picker_startDate:'',
      picker_endDate:'',
      btnActive:"thisWeek",
      loading: true,
      originDropdownOptions:[],
      targetDropdownOptions:[],
      selected_origin:'ALL',
      selected_target:'ALL',
      selected_stage:'',
      doingFilterOrigin:false, //正在進行原始幣別篩選
      doingFilterTarget:false, //正在進行目標幣別篩選
      show_serialNumber:false,
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

  openSerialNumber = () => {
    this.setState({
      show_serialNumber: !this.state.show_serialNumber,
      shineBackgrounf:true
    });
  }
  
  handlePageChange (pageNumber) { // 切換頁面
    this.setState({
      activePage: pageNumber
    },()=>{ this.getFilterData()})
  }

  handleStartChange = (date) => {
    this.setState({
      startDate: moment(date).format('YYYY-MM-DD'),
      btnActive:'date-picker-search'
    },()=>{this.getFilterData()})
  }

  handleEndChange = (date) => {
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
    },()=>{this.getFilterData()})
  }

  getYesterday = (e) => {
    this.clearDatePickerInput()
    this.setState({
      startDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      endDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),
      btnActive:e.target.name
    },()=>{this.getFilterData()})
  }

  getThisWeek = (e) => {
    this.clearDatePickerInput()
    this.setState({
      // startDate: moment().startOf('week').add('d',1).format('YYYY-MM-DD'),
      // endDate: moment().endOf('week').add('d',1).format('YYYY-MM-DD'),
        // 改成 ↓↓
      startDate: moment().startOf('isoWeek').format('YYYY-MM-DD'),
      endDate: moment().endOf('isoWeek').format('YYYY-MM-DD'),
      btnActive:e.target.name
    },()=>{this.getFilterData()})
  }

  getLastWeek = (e) => {
    this.clearDatePickerInput()
    this.setState({
      startDate: moment().subtract(1,'isoWeek').startOf('isoWeek').format('YYYY-MM-DD'),
      endDate: moment().subtract(1,'isoWeek').endOf('isoWeek').format('YYYY-MM-DD'),
      btnActive:e.target.name
    },()=>{this.getFilterData()})
  }

  getThisMonth = (e) => {
    this.clearDatePickerInput()
    this.setState({
      startDate: moment().startOf('month').format('YYYY-MM-DD'),
      endDate: moment().endOf('month').format('YYYY-MM-DD'),
      btnActive:e.target.name
    },()=>{this.getFilterData()})
  }

  getLastMonth = (e) => {
    this.clearDatePickerInput()
    this.setState({
      startDate: moment().subtract(1,'month').startOf('month').format('YYYY-MM-DD'),
      endDate: moment().subtract(1,'month').endOf('month').format('YYYY-MM-DD'),
      btnActive:e.target.name
    },()=>{this.getFilterData()})
  }


  // ********** 切換原始幣別 **********
  onChangeOriginCurrency =(e)=> { 
    // (1) 不篩選[原始]
    if(e.target.value === 'ALL'){
      // 且 不篩選 [目標]'
      if(this.state.doingFilterTarget===false || 
        this.selected_target==='ALL'){
        console.log('-----原始A-----')
        this.setState({
          activePage:1,
          selected_origin:'ALL',
          doingFilterOrigin:false,
          dataList:this.state.AllOriginData
        })
        this.getInitialDropdown()
        this.getInitialData(1)
      }
      // 且 篩選[目標]'
      else{
        console.log('-----原始C-----')
        this.setState({
          activePage:1,
          selected_origin:'ALL',
          doingFilterOrigin:false
        },()=>{
          this.getFilterData()
        })
        setTimeout(() => {
          this.changeTargetDropdown()
        }, 200)
      }
    }
    // (2) 篩選[原始]
    else{
      // 且 不篩選 [目標]'
      if(this.state.doingFilterTarget===false){
        console.log('-----原始B-----')
        this.setState({
          activePage:1,
          selected_origin:e.target.value,
          selected_target:'ALL',
          doingFilterOrigin:true
        },()=>{
          this.getFilterData()
        })
        setTimeout(() => {
          this.changeOriginDropdown()
        }, 200)
      }
      // 且 篩選[目標]'
      else{
        console.log('-----原始D-----',this.state.doingFilterTarget)
        this.setState({
          activePage:1,
          selected_origin:e.target.value,
          doingFilterOrigin:true
        },()=>{
          this.getFilterData()
        })
      }
    }
  }


  // ********** 切換目標幣別 **********
  onChangeTargetCurrency = (e) => {
    // (1) 不篩選[目標]
    if(e.target.value === 'ALL' ){
      // 且 不篩選 [原始]'
      if(this.state.doingFilterOrigin===false
        || this.selected_origin==='ALL'){
        console.log('-----目標A-----')
        this.setState({
          activePage:1,
          selected_target:'ALL',
          doingFilterTarget:false,
          dataList:this.state.AllOriginData
        })
        this.getInitialDropdown()
        this.getInitialData(1)
      }
      // 且 篩選[原始]'
      else{
        console.log('-----目標B-----')
        this.setState({
          activePage:1,
          selected_target:'ALL',
          doingFilterTarget:false
        },()=>{
          this.getFilterData()
        })
        setTimeout(() => {
          this.changeOriginDropdown()
        }, 200)
      }
    }
    // (2) 篩選[目標]
    else{ //且 不篩選 [原始]
      if(this.state.doingFilterOrigin===false){
        console.log('-----目標C-----')
        this.setState({
          activePage:1,
          selected_target:e.target.value,
          selected_origin:'ALL',
          doingFilterTarget:true
        },()=>{this.getFilterData()})
        setTimeout(() => {
          this.changeTargetDropdown()
        }, 200)
      }
      else{ //且 篩選 [原始]
        console.log('-----目標D-----',this.state.doingFilterOrigin)
        this.setState({
          activePage:1,
          selected_target:e.target.value,
          doingFilterTarget:true
        },()=>{this.getFilterData()})
      }
    }
  }

  // ********** (A)都不篩選 **********
  getInitialDropdown = () => {
    // console.log('(A)都不篩選')
    this.setState({
      originDropdownOptions : this.state.AllOriginData.map(item=>item.seller_currency),
      targetDropdownOptions : this.state.AllOriginData.map(item=>item.buyer_currency)
    }
    // ,()=>{console.log(this.state.originDropdownOptions);}
    )
  }

  // ********** (B)篩選[原始]、不篩選[目標] **********
  changeOriginDropdown = () => {
    // console.log('(B)篩選[原始]、不篩選[目標]')
    this.setState({
      originDropdownOptions : this.state.AllOriginData.map(item=>item.seller_currency)
      ,
      targetDropdownOptions : this.state.dataList.filter(item=>item.seller_currency===this.state.selected_origin).map(item=>item.buyer_currency)
    })
  }

  // ********** (C)不篩選[原始]、篩選[目標] **********
  changeTargetDropdown = () => {
    // console.log('(C)不篩選[原始]、篩選[目標]')
    this.setState({
      originDropdownOptions : this.state.dataList.filter(item=>item.buyer_currency===this.state.selected_target).map(item=>item.seller_currency)
      ,
      targetDropdownOptions : this.state.AllOriginData.map(item=>item.buyer_currency)
    })
  }

  // ********** (D)篩選[原始]+[目標] **********
  changeOrigin_TargetDropDropdown = () => {
    // console.log('(D)篩選[原始]+[目標]')
    this.setState({
      originDropdownOptions : this.state.dataList.filter(item=>item.buyer_currency===this.state.selected_target).map(item=>item.seller_currency)
      ,
      targetDropdownOptions : this.state.dataList.filter(item=>item.seller_currency===this.state.selected_origin).map(item=>item.buyer_currency)
    })
  }

  onChangeOption = (e) => {
    this.setState({
      activePage:1,
      selected_stage:e.target.value,
    })
    if(e.target.value==="ALL"){
      this.setState({
        activePage:1,
        selected_stage:'',
      })
    }
    setTimeout(() => {
      this.getFilterData()
    }, 300);
  }

  getFilterData = async() => {
    this.showLoading()
    try {
      let res = await apiGetDealNoteFilter(
          this.state.activePage,
          this.state.startDate,
          this.state.endDate,
          this.state.selected_origin,
          this.state.selected_target,
          this.state.selected_stage
      )
      if(res.data.code===1){
        this.setState({
          dataList: res.data.data.deal_note,
          total_page:res.data.data.total_pages,
          total_data:res.data.data.total_data,
        })
      }
    } catch(err) {
      console.log(err);
    }
  }

  getInitialData = async() => {
    this.showLoading()
    let {startDate,endDate,selected_stage} = this.state
    try {
      let res = await apiGetDealNoteList(1, startDate, endDate, selected_stage)
      if(res.data.code===1){
        this.setState({
          dataList: res.data.data.deal_note,
          AllOriginData:res.data.data.deal_note, // 不變、不SetState的完整資料
          total_page:res.data.data.total_pages,
          total_data:res.data.data.total_data,
        }
        ,()=>{this.getInitialDropdown()}
        )
      }
    } catch(err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.getInitialData()
  }


  render(){
    let { t } = this.props
    let { dataList, btnActive } = this.state;

    let showOriginDropdownOptions = ["ALL","USD","MYR","CNY","HKD","PHP","SGD","EUR"
    ,"GBP","IDR","THB","TWD","AUD","VND","JPY","KRW","HKM"]
    // let showTargetDropdownOptions = Array.from(new Set(targetDropdownOptions))
    let showTargetDropdownOptions = ["ALL","USD","MYR","CNY","HKD","PHP","SGD","EUR"
    ,"GBP","IDR","THB","TWD","AUD","VND","JPY","KRW","HKM"]
    
    //↓↓ 在最前面加入一個"所有All"的選項 
    // showOriginDropdownOptions.unshift('All')
    // showTargetDropdownOptions.unshift('All')

    return (
      <div className="container-fluid">
      
        <div className="row">
          <div className="col-md-12">
            <div className="card card-exchange">

              <div className="header text-center">
                <h4 className="title">{t('app.exchange_record')}</h4>
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
                    {t('app.seller_currency')}
                  </span>
                  <select
                    // onClick={this.onClickOrigin}
                    onChange={this.onChangeOriginCurrency} 
                    className="table-select">
                    {showOriginDropdownOptions.map((item,index) => 
                      <option key={index} value={item} label={item}>
                        {item}
                      </option>)
                    }
                  </select>
                  <span className="mr-15"></span>
                  <span className="table-filter-label">
                    {t('app.buyer_currency')}
                  </span>
                  <select
                    // onClick={this.onClickTarget}
                    onChange={this.onChangeTargetCurrency} 
                    className="table-select">
                    {showTargetDropdownOptions.map((item,index) => 
                      <option key={index} value={item} label={item}>
                        {item}
                      </option>)
                    }
                  </select>
                  <span className="mr-15"></span>
                  <span className="table-filter-label">
                    {t('app.stage')}  : 
                  </span>
                  <select
                    onChange={e=>this.onChangeOption(e)} 
                    className="table-select">
                      <option value="ALL">{t('app.all')}</option>
                      <option value="60">{t('app.transaction_completed')}</option>
                      <option value="2">{t('app.transaction_fail')}</option>
                      <option value="3">{t('EVENT_TYPE.OFFER_RECEIVE_DEAL_EXPIRE')}</option>
                      <option value="0">{t('app.buyer_seller_refuse_trade')}</option>
                      <option value="1">{t('app.buyer_you_cancel_trade')}</option>
                  </select>
                </div>
                <div className="data-info-section">
                  <span className="data-info-item">
                    <span className="info-item-label">{t('app.data_total_length')} :</span>
                    <span className="info-item-value">{this.state.total_data}</span>
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
                      <tr>
                        <th>
                          {t('app.id')}
                        </th>

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

                        <th>{t('app.stage')}</th>
                        {/* <th>{t('app.confirm_method')}</th> */}
                        <th>{t('app.update_datetime')}</th>
                      </tr>
                    </thead>
                    {dataList instanceof Array
                      && dataList.length !== 0 ? 
                      <tbody>
                        {dataList.map((item,index) => 
                          <ExchangeRecordItem
                          key={index}
                          index={index}
                          {...item}
                          refreshData={this.getInitialData.bind(this,1)}
                          show_serialNumber = {this.state.show_serialNumber}
                          >
                          </ExchangeRecordItem>)
                        }
                      </tbody>
                      :<tbody >
                        <td className="table-no-data" colSpan="20">
                          {t('app.no_data')}
                        </td>
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
    )
  }
}

export default withTranslation()(ExchangeRecord);
