import React from 'react';
import { apiGetBankerOrderList,
        apiGetBankerOrderFilterCurrency,
        apiGetOrderTransactionCurrency,
         } from '../../services/apiService'
import MyOrderListItem from './MyOrderListItem'
import { MdLibraryAdd } from "react-icons/md";
import { Link } from 'react-router-dom';
import {withTranslation} from 'react-i18next';
// import sortBy from 'lodash/sortBy'
import Pagination from "react-js-pagination";
import { ClipLoader } from 'react-spinners';


class MyOrderList extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      state_orderListData:[],
      state_pages_total:'',
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
    },()=>this.getFilterData())
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

  getTransactionCurrency = async() => { //顯示要新增的幣別(API)
    try {
      let res = await apiGetOrderTransactionCurrency()
      if(res.data.code===1){
        // console.log(res.data.data.open_currency);
        this.setState({
          // currencyOptions: res.data.data.open_currency,
          showOriginDropdownOptions : res.data.data.open_currency,
          showTargetDropdownOptions : res.data.data.open_currency,
        })
      }
    } catch (err) {
      console.log(err);
    }
  }

  onChangeOriginCurrency =(e)=>{ 
    if (e.target.value === 'ALL'){ 
      this.setState({
        selected_origin:'',
        activePage:1
      },()=>this.getFilterData())
    }
    else{
      this.setState({
        selected_origin:e.target.value,
        activePage:1
      },()=>this.getFilterData())
    }
  }

  onChangeTargetCurrency =(e)=>{ 
    if (e.target.value === 'ALL'){
      this.setState({
        selected_target:'',
        activePage:1
      },()=>this.getFilterData())
    }
    else{
      this.setState({
        selected_target:e.target.value,
        activePage:1
      },()=>this.getFilterData())
    }
  }

  getFilterData = async() => {
    this.showLoading()
    let { activePage, selected_origin, selected_target } = this.state
    try {
      let resultList_filter = await apiGetBankerOrderFilterCurrency(activePage, selected_origin, selected_target)
      this.setState({
        state_orderListData:resultList_filter.data.data.orders.filter(item=>item.amount-item.received_amount>0),
        state_pages_total:resultList_filter.data.data.total_pages,
      })
    } catch(err) {
      console.log(err);
    }
  }

  
  getInitialData = async() => {
    try {
      let res = await apiGetBankerOrderList(1)
      if(res.data.code===1){
        this.setState({
          state_orderListData:res.data.data.orders.filter(item=>item.amount-item.received_amount>0), // 顯示的清單
          state_pages_total:res.data.data.total_pages, // 總頁數
        })
      }
    } catch(err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.getInitialData()
    this.showLoading()
    this.getTransactionCurrency()
  }

  // getSnapshotBeforeUpdate(prevState) {
  //   // console.log('this.state.activePage:',this.state.activePage)
  //   if (prevState.state_orderListData !== this.state.state_orderListData
  //     ) {
  //       setTimeout(()=>{
  //         this.getInitialData(this.state.activePage)
  //         console.log('頁面已刷新')
  //       },5000)
  //   }
  // }

  render(){
    // console.log('資料頁面總數:',this.state.state_pages_total)

    let { t } = this.props
    let { state_orderListData,
          state_pages_total,
          showOriginDropdownOptions,
          showTargetDropdownOptions,
         } = this.state;

    // let state_orderList = sortBy(state_orderListData, (key)=>key.id).reverse()
    
    //↓↓ 篩選出不重複的origin_currency 
    // let showOriginDropdownOptions = Array.from(new Set(originDropdownOptions))
    // let showOriginDropdownOptions = ["ALL","USD","MYR","CNY","HKD","PHP","SGD","EUR"
    // ,"GBP","IDR","THB","TWD","AUD","VND","JPY","KRW","HKM"]
    // let showTargetDropdownOptions = Array.from(new Set(targetDropdownOptions))
    // let showTargetDropdownOptions = ["ALL","USD","MYR","CNY","HKD","PHP","SGD","EUR"
    // ,"GBP","IDR","THB","TWD","AUD","VND","JPY","KRW","HKM"]
    
    //↓↓ 在最前面加入一個"所有ALL"的選項 
    // showOriginDropdownOptions.unshift('ALL')
    // showTargetDropdownOptions.unshift('ALL')

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

              <div className="header text-center">
                <h4 className="title">{t('app.my_selling_list')}</h4>
              </div>

              <div className="filter-section">
                <div className="table-filter-section">
                  <span className="table-filter-label">
                    {t('app.origin_currency')}
                  </span>

                  {showOriginDropdownOptions instanceof Array
                    && showOriginDropdownOptions.length !== 0 ? 
                    <select
                      onChange={e=>this.onChangeOriginCurrency(e)} 
                      className="table-select">
                      <option key="" value=""  // "請選擇"要寫在Render內，不然無法即時翻譯
                        label={t('app.all')}>
                      </option> 
                      {showOriginDropdownOptions.map((item,index) => 
                        <option key={index} value={item} label={item}>
                          {item}
                        </option>)
                      }
                    </select>
                    :
                    <select className="table-select">
                      <option key="" value=""
                        label={t('app.please_select')}>
                      </option> 
                    </select>
                  }

                  <span className="mr-15"></span>
                  <span className="table-filter-label">
                    {t('app.target_currency')}
                  </span>

                  {showTargetDropdownOptions instanceof Array
                    && showTargetDropdownOptions.length !== 0 ? 
                    <select
                      onChange={e=>this.onChangeTargetCurrency(e)} 
                      className="table-select">
                      <option key="" value=""  // "請選擇"要寫在Render內，不然無法即時翻譯
                        label={t('app.all')}>
                      </option> 
                      {showTargetDropdownOptions.map((item,index) => 
                        <option key={index} value={item} label={item}>
                          {item}
                        </option>)
                      }
                    </select>
                    :
                    <select className="table-select">
                      <option key="" value=""
                        label={t('app.please_select')}>
                      </option> 
                    </select>
                  }

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
                      <th>{t('app.delete')}</th>
                    </tr>
                </thead>
                  {state_orderListData instanceof Array
                    && state_orderListData.length !== 0 ? 
                    <tbody>
                        {state_orderListData.map((item,index) => 
                          <MyOrderListItem
                          key={index}
                          index={index}
                          {...item}
                          refreshData={()=>this.getInitialData()}
                          dataLength={state_orderListData.length*state_pages_total}
                          showLoading={()=>this.showLoading()}
                          >
                          </MyOrderListItem>)
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
                {this.state.state_pages_total > 0 ?
                  <div className="page-section">
                    <Pagination
                      activePage={this.state.activePage}
                      itemsCountPerPage={20}
                      totalItemsCount={this.state.state_pages_total*20}
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

export default withTranslation()(MyOrderList);