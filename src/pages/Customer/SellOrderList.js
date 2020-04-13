import React from 'react';
import { apiGetDownLineOrderList } from '../../services/apiService'
import SellOrderListItem from './SellOrderListItem'
import { MdLibraryAdd } from "react-icons/md";
import { Link } from 'react-router-dom';
import {withTranslation} from 'react-i18next';
// import sortBy from 'lodash/sortBy'
import Pagination from "react-js-pagination";
import { ClipLoader } from 'react-spinners';
import { TiArrowBack } from "react-icons/ti";


class SellOrderList extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      dataList:[],
      total_page:'',
      activePage:1,
      // allOriginCurrencyOptions:[],
      // allTargetCurrencyOptions:[],
      selected_origin:'',
      selected_target:'',
      // doingFilterNow:false,
      loading: true,
    }
  }

  handlePageChange (pageNumber) { // 切換頁面
    // console.log(`active page is: ${pageNumber}`);
    this.setState({
      activePage: pageNumber
    },()=>this.getInitialData())
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

  onChangeOriginCurrency =(e)=>{ 
    if (e.target.value === 'ALL'){ 
      this.setState({
        selected_origin:'',
        activePage:1
      },()=>this.getInitialData())
    }
    else{
      this.setState({
        selected_origin:e.target.value,
        activePage:1
      },()=>this.getInitialData())
    }
    this.showLoading()
  }

  onChangeTargetCurrency =(e)=>{ 
    if (e.target.value === 'ALL'){
      this.setState({
        selected_target:'',
        activePage:1
      },()=>this.getInitialData())
    }
    else{
      this.setState({
        selected_target:e.target.value,
        activePage:1
      },()=>this.getInitialData())
    }
    this.showLoading()
  }

  // ---------- get:篩選後的清單 ----------
  //  getInitialData = async() => {
  //    this.showLoading()
  //    let { activePage, selected_origin, selected_target } = this.state
  //    let downLineId = this.props.match.params.id
  //   // console.log('原始貨幣',key_origin,'目標貨幣',key_target)
  //   try {
  //     let res_filter = await apiGetBankerOrderFilterCurrency(activePage, downLineId, selected_origin, selected_target)
  //     // console.log('篩選出的清單:',res_filter.data.data)
  //     this.setState({
  //       dataList:res_filter.data.data.orders.filter(item=>item.amount-item.received_amount>0),
  //       total_page:res_filter.data.data.total_pages,
  //     })
  //   } catch(err) {
  //     console.log(err);
  //   }
  // }

  
  getInitialData = async() => { // 初始載入
    // console.log('載入初始頁面:')
    // this.showLoading()
    // this.showLoading()
    let { activePage, selected_origin, selected_target } = this.state
    let downLineId = this.props.match.params.id
    try {
      let res = await apiGetDownLineOrderList(activePage, downLineId, selected_origin, selected_target)
      // console.log(result_apiGetDownLineOrderList.data.data)
      this.setState({
        dataList:res.data.data.orders,
        total_page:res.data.data.total_pages, // 總頁數
      })
    } catch(err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.getInitialData(1)
    this.showLoading()
  }

  render(){
    let lastpageFrom=this.props.location.search.replace('?pageFrom=','')
    let { t } = this.props
    let { dataList,
          total_page,
         } = this.state;
    let showOriginDropdownOptions = ["ALL","USD","MYR","CNY","HKD","PHP","SGD","EUR","GBP","IDR","THB","TWD","AUD","VND","JPY","KRW","HKM"]

    let showTargetDropdownOptions = ["ALL","USD","MYR","CNY","HKD","PHP","SGD","EUR","GBP","IDR","THB","TWD","AUD","VND","JPY","KRW","HKM"]

    console.log(lastpageFrom);

    return (
      <div className="container-fluid">
      
        <div className="row">
          <div className="col-md-12">
            <div className="card card-exchange">

              <div className="text-right">
                <Link to="/exchange/create-order" 
                  className="text-page-link">
                  <MdLibraryAdd/>
                  <span className="ml-5">{t('app.add')}</span>
                </Link>
              </div>

              <div className="">
                <button className="lastpage-btn"
                //  如果不是從﹝代理會員清單﹞進來的，就回到﹝會員清單﹞
                 onClick={lastpageFrom==="member"?
                  ()=>this.props.history.push(`/customer/member-list`)
                  :
                  ()=>this.props.history.push(`/customer/agent-memberlist/${lastpageFrom}`)
                 }>
                  <TiArrowBack className="lastpage-icon"/>
                  {t('app.go_back_page')}
                </button>
              </div>

              <div className="header text-center">
                <h4 className="title">{t('app.sell_order_list')}</h4>
              </div>

              <div className="filter-section">
                <div className="table-filter-section">
                  <span className="table-filter-label">
                    {t('app.origin_currency')}
                  </span>
                  <select
                    onChange={e=>this.onChangeOriginCurrency(e)} 
                    className="table-select">
                    {showOriginDropdownOptions.map((item,index) => 
                      <option key={index} value={item} label={item}>
                        {item}
                      </option>)
                    }
                  </select>
                  <span className="mr-15"></span>
                  <span className="table-filter-label">
                    {t('app.target_currency')}
                  </span>
                  <select
                    onChange={e=>this.onChangeTargetCurrency(e)} 
                    className="table-select">
                    {showTargetDropdownOptions.map((item,index) => 
                      <option key={index} value={item} label={item}>
                        {item}
                      </option>)
                    }
                  </select>
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
                <table className="table table-exchange">
                  <thead>
                    <tr>
                      <th>{t('app.id')}</th>
                      <th>{t('app.origin_currency')}</th>
                      <th>{t('app.target_currency')}</th>
                      <th>{t('app.amount')}</th>
                      <th>{t('app.remain')}</th>
                      <th>{t('app.rate')}</th>
                      <th>{t('app.rate_edit')}</th>
                      <th>{t('app.create_datetime')}</th>
                      <th>{t('app.switch_on_off')}</th>
                      <th>{t('app.transaction_details')}</th>
                    </tr>
                </thead>
                  {dataList instanceof Array
                    && dataList.length !== 0 ? 
                    <tbody>
                        {dataList.map((item,index) => 
                          <SellOrderListItem
                            key={index}
                            index={index}
                            {...item}
                            refreshData={()=>this.getInitialData()}
                            dataLength={dataList.length*total_page}
                            showLoading={()=>this.showLoading()}
                            // pageFrom={lastpageFrom==="member"?'member':this.props.match.params.id}
                            pageFrom={this.props.match.params.id}
                            >
                          </SellOrderListItem>)
                        }
                    </tbody>
                    :
                      <td className="table-no-data" colSpan="20">
                        {t('app.no_data')}
                      </td>
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

export default withTranslation()(SellOrderList);