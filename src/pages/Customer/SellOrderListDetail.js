import React from 'react';
import { apiGetDownLineOrderDetail } from '../../services/apiService'
import SellOrderListDetailItem from './SellOrderListDetailItem'
import {withTranslation} from 'react-i18next';
import Pagination from "react-js-pagination";
// import moment from "moment";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ClipLoader } from 'react-spinners';
import { FaEye, FaAngleLeft } from "react-icons/fa";
import { TiArrowBack } from "react-icons/ti";


class SellOrderListDetail extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      dataList:[],
      total_data:0,
      total_page:0,
      activePage:1,
      loading: true,
      selected_stage:'',
      show_serialNumber:false,
    }
  }

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
    },()=>{ this.getInitialData()})
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
      this.getInitialData()
    }, 300);
  }

  getInitialData = async() => { // 初始載入
    this.showLoading()
    let { activePage, selected_stage} = this.state
    let TicketId = this.props.match.params.id
    try {
      let res = await apiGetDownLineOrderDetail(activePage ,TicketId ,selected_stage)
      // console.log(res.data)
      if(res.data.code===1){
        this.setState({
          dataList: res.data.data.deal_cache,
          total_page:res.data.data.total_pages,
        })
      }
    } catch(err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.getInitialData(1)
  }


  render(){
    let { t } = this.props
    let { dataList } = this.state;


    return (
      <div className="container-fluid">
      
        <div className="row">
          <div className="col-md-12">
            <div className="card card-exchange">

              <div className="">
                <button className="lastpage-btn"
                 onClick={()=>window.history.back()} >
                  <TiArrowBack className="lastpage-icon"/>
                  {t('app.go_back_page')}
                </button>
              </div>

              <div className="header text-center">
                <h4 className="title">{t('app.transaction_details')}</h4>
              </div>

              <div className="filter-section">
                <div className="table-filter-section">
                  <span className="table-filter-label">
                    {t('app.stage')}  : 
                  </span>
                  <select
                    onChange={e=>this.onChangeOption(e)} 
                    className="table-select">
                      <option value="ALL">{t('app.all')}</option>
                      <option value="1">{t('app.pending')}</option>
                      <option value="2">{t('app.in_transaction')}</option>
                      <option value="3">{t('app.transaction_completed')}</option>
                      <option value="4">{t('app.has_refuse')}</option>
                      <option value="5">{t('ERRORCODE.DEAL_CANCELED_801')}</option>
                      <option value="6">{t('app.transaction_fail')}</option>
                  </select>
                </div>
                {/* <div className="data-info-section">
                  <span className="data-info-item">
                    <span className="info-item-label">{t('app.data_total_length')} :</span>
                    <span className="info-item-value">{this.state.total_data}</span>
                  </span>
                </div> */}
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
                          <SellOrderListDetailItem
                          key={index}
                          index={index}
                          {...item}
                          refreshData={this.getInitialData.bind(this,1)}
                          show_serialNumber = {this.state.show_serialNumber}
                          >
                          </SellOrderListDetailItem>)
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

export default withTranslation()(SellOrderListDetail);
