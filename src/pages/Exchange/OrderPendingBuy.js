import React from 'react';
import { apiGetBuyerPendingList } from '../../services/apiService'
import OrderPendingBuyItem from './OrderPendingBuyItem'
import {withTranslation} from 'react-i18next';
import Pagination from "react-js-pagination";
import { FaEye, FaAngleLeft } from "react-icons/fa";
import { ClipLoader } from 'react-spinners';


class OrderPendingBuy extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      state_bankList:[],
      hasClickSearch:false,
      state_accountName:'',
      resultListData:'',
      pendingList:[],
      activePage:1,
      total_page:0,
      show_serialNumber:false,
      showLoading:true,
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

  handlePageChange (pageNumber) { // 切換頁面
    // console.log(`active page is: ${pageNumber}`);
    this.setState({
      activePage: pageNumber
    },()=>{this.getInitialData()})
  }

  openSerialNumber = () => {
    this.setState({
      show_serialNumber: !this.state.show_serialNumber,
    });
  }

  getInitialData = async() => {
    try {
      let res = await apiGetBuyerPendingList(this.state.activePage)
      if(res.data.code===1){
        this.setState({
          pendingList:res.data.data.deal_cache.filter(item=>item.stage>3),
          total_page:res.data.data.total_pages
        })
      }
    } catch(err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.showLoading()
    this.getInitialData()
    this.refreshPage = setInterval(()=>{
      this.getInitialData()
      console.log('出價頁刷新',new Date().getMinutes(),':',new Date().getSeconds())
    },6000)
  }

  componentWillUnmount(){
    clearInterval(this.refreshPage);
  }


  render(){
    let {t} = this.props
    let {pendingList} = this.state
    // console.log('this props:',this.props)
    // console.log(pendingList)

    return (
      <div className="container-fluid">
      
        <div className="row">
          <div className="col-md-12">
            <div className="card card-exchange">

              <div className="header text-center">
                <h4 className="title">{t('app.my_buying_list')} ({t('app.in_transaction')})</h4>
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

                        <th>{t('app.order_id')}</th>
                        <th>{t('app.seller')}{t('app.name')}</th>
                        <th>{t('app.seller')}{t('app.rate')}</th>
                        <th>{t('app.seller')}{t('app.currency_type')}</th>

                        <th>{t('app.deal')}{t('app.amount')}</th>
                        <th>{t('app.buyer')}{t('app.currency_type')}</th>
                        <th>{t('app.deal')}{t('app.price')}</th>
                        <th>{t('app.confirm_image')}</th>
                        <th>{t('app.check_account')}</th>

                        <th>{t('app.upload_image')}</th>
                        <th>{t('app.stage')}</th>
                        <th>{t('app.update_datetime')}</th>
                      </tr>
                    </thead>
                    {!pendingList instanceof Array
                      || pendingList.length === 0 ?
                      <td className="table-no-data" colSpan="20">
                        {t('app.no_data')}
                      </td>
                      :
                      <tbody>
                        {pendingList.map((item,index) => 
                          <OrderPendingBuyItem
                          key={index}
                          index={index}
                          {...item}
                          refreshData={()=>this.getInitialData()}
                          show_serialNumber = {this.state.show_serialNumber}
                          >
                          </OrderPendingBuyItem>)}
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
export default withTranslation()(OrderPendingBuy);