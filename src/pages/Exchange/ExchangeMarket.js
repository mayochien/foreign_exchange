import React from 'react';
import { apiGetOrderList ,
        apiGetOrdersFilterCurrency,
        apiGetOrderTransactionCurrency,
      } from '../../services/apiService'
import ExchangeMarketItem from './ExchangeMarketItem'
import {withTranslation} from 'react-i18next';
import Pagination from "react-js-pagination";
import { ClipLoader } from 'react-spinners';


class ExchangeMarket extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      dataList:[],
      state_pages_total:'',
      activePage:1,
      originDropdownOptions:[],
      targetDropdownOptions:[],
      selected_origin:'',
      selected_target:'',
      loading: true,
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
    },()=>{this.getFilterData()})
  }

  // // ********** 切換原始幣別 **********
  // onChangeOriginCurrency =(e)=> { 
  //   this.showLoading()
  //   // (1) 不篩選[原始]
  //   if(e.target.value === 'ALL'){
  //     // 且 不篩選 [目標]'
  //     if(this.state.doingFilterTarget===false || 
  //       this.selected_target==='ALL'){
  //       console.log('-----原始A-----')
  //       this.setState({
  //         activePage:1,
  //         selected_origin:'',
  //         doingFilterOrigin:false,
  //         dataList:this.state.ALLOriginData
  //       })
  //       this.getInitialDropdown()
  //       this.getInitialData(1)
  //     }
  //     // 且 篩選[目標]'
  //     else{
  //       console.log('-----原始C-----')
  //       this.setState({
  //         activePage:1,
  //         selected_origin:'',
  //         doingFilterOrigin:false
  //       },()=>{
  //         this.getFilterData()
  //       })
  //       setTimeout(() => {
  //         this.changeTargetDropdown()
  //       }, 200)
  //     }
  //   }
  //   // (2) 篩選[原始]
  //   else{
  //     // 且 不篩選 [目標]'
  //     if(this.state.doingFilterTarget===false){
  //       console.log('-----原始B-----')
  //       this.setState({
  //         activePage:1,
  //         selected_origin:e.target.value,
  //         doingFilterOrigin:true
  //       },()=>{
  //         this.getFilterData()
  //       })
  //       setTimeout(() => {
  //         this.changeOriginDropdown()
  //       }, 200)
  //     }
  //     // 且 篩選[目標]'
  //     else{
  //       console.log('-----原始D-----',this.state.doingFilterTarget)
  //       this.setState({
  //         activePage:1,
  //         selected_origin:e.target.value,
  //         doingFilterOrigin:true
  //       },()=>{
  //         this.getFilterData()
  //       })
  //       // setTimeout(() => {
  //         // this.changeTargetDropdown()
  //       // }, 200)
  //     }
  //   }
  // }


  // // ********** 切換目標幣別 **********
  // onChangeTargetCurrency = (e) => {
  //   this.showLoading()
  //   // (1) 不篩選[目標]
  //   if(e.target.value === 'ALL' ){
  //     // 且 不篩選 [原始]'
  //     if(this.state.doingFilterOrigin===false
  //       || this.selected_origin==='ALL'){
  //       console.log('-----目標A-----')
  //       this.setState({
  //         activePage:1,
  //         selected_target:'',
  //         doingFilterTarget:false,
  //         dataList:this.state.ALLOriginData
  //       })
  //       this.getInitialDropdown()
  //       this.getInitialData(1)
  //     }
  //     // 且 篩選[原始]'
  //     else{
  //       console.log('-----目標B-----')
  //       this.setState({
  //         activePage:1,
  //         selected_target:'',
  //         doingFilterTarget:false
  //       },()=>{
  //         this.getFilterData()
  //       })
  //       setTimeout(() => {
  //         this.changeOriginDropdown()
  //       }, 200)
  //     }
  //   }
  //   // (2) 篩選[目標]
  //   else{ //且 不篩選 [原始]
  //     if(this.state.doingFilterOrigin===false){
  //       console.log('-----目標C-----')
  //       this.setState({
  //         activePage:1,
  //         selected_target:e.target.value,
  //         doingFilterTarget:true
  //       },()=>{
  //         this.getFilterData()
  //       })
  //       setTimeout(() => {
  //         this.changeTargetDropdown()
  //       }, 200)
  //     }
  //     else{ //且 篩選 [原始]
  //       console.log('-----目標D-----',this.state.doingFilterOrigin)
  //       this.setState({
  //         activePage:1,
  //         selected_target:e.target.value,
  //         doingFilterTarget:true
  //       },()=>{
  //         this.getFilterData()
  //       })
  //       // setTimeout(() => {
  //         // this.changeOriginDropdown()
  //       // }, 200)
  //     }
  //   }
  // }

  // // ********** (A)都不篩選 **********
  // getInitialDropdown = () => {
  //   console.log('(A)都不篩選')
  //   this.setState({
  //     originDropdownOptions : Object.values(this.state.ALLOriginData).map(item=>item.origin_currency),
  //     targetDropdownOptions : Object.values(this.state.ALLOriginData).map(item=>item.target_currency)
  //   })
  // }

  // // ********** (B)篩選[原始]、不篩選[目標] **********
  // changeOriginDropdown = () => {
  //   console.log('(B)篩選[原始]、不篩選[目標]')
  //   this.setState({
  //     originDropdownOptions : Object.values(this.state.ALLOriginData).map(item=>item.origin_currency)
  //     ,
  //     targetDropdownOptions : Object.values(this.state.dataList.filter(item=>item.origin_currency===this.state.selected_origin)).map(item=>item.target_currency)
  //   })
  // }

  // // ********** (C)不篩選[原始]、篩選[目標] **********
  // changeTargetDropdown = () => {
  //   console.log('(C)不篩選[原始]、篩選[目標]')
  //   this.setState({
  //     originDropdownOptions : Object.values(this.state.dataList.filter(item=>item.target_currency===this.state.selected_target)).map(item=>item.origin_currency)
  //     ,
  //     targetDropdownOptions : Object.values(this.state.ALLOriginData).map(item=>item.target_currency)
  //   })
  // }

  // // ********** (D)篩選[原始]+[目標] **********
  // changeOrigin_TargetDropDropdown = () => {
  //   console.log('(D)篩選[原始]+[目標]')
  //   this.setState({
  //     originDropdownOptions : Object.values(this.state.dataList.filter(item=>item.target_currency===this.state.selected_target)).map(item=>item.origin_currency)
  //     ,
  //     targetDropdownOptions : Object.values(this.state.dataList.filter(item=>item.origin_currency===this.state.selected_origin)).map(item=>item.target_currency)
  //   })
  // }

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
    this.showLoading()
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
    this.showLoading()
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
    // this.showLoading()
    let {activePage,selected_origin,selected_target} = this.state
    try {
      let res = await apiGetOrdersFilterCurrency(activePage,selected_origin,selected_target)
      this.setState({
        dataList:res.data.data.orders,
        state_pages_total:res.data.data.total_pages,
      })
    } catch(err) {
      console.log(err);
    }
  }

   getInitialData = async() => {
    try {
      let res = await apiGetOrderList(1)
      if(res.data.code===1){
        this.setState({
          dataList:res.data.data.orders, // 顯示的清單
          ALLOriginData:res.data.data.orders, // 不變、不SetState的完整資料
          state_pages_total:res.data.data.total_pages, // 總頁數
        })
      }
    } catch(err) {
      console.log(err);
    }
  }

  refreshData = () => {
    this.refresh = setInterval(()=>{
      if(this.state.selected_origin === ''&&  this.state.selected_target === ''){
        this.getFilterData()
        // console.log('《換匯市場》刷新',new Date().getMinutes(),':',new Date().getSeconds())
      }
      else{
        this.stopRefresh()
        // console.log("中止刷新1");
      }
    },5000)
  } 

  stopRefresh = () => {
    clearInterval(this.refresh);
  } 

  componentDidMount() {
    this.getInitialData()
    this.showLoading()
    this.refreshData()
    this.getTransactionCurrency()
  }

  componentDidUpdate(preState){
    //  console.log('componentDidUpdate');
    if(this.state.selected_origin ==='' && this.state.selected_target ==='' ){
      this.refreshData()
      // console.log('刷新(Update)');
    }
    this.stopRefresh()
    // console.log("中止(Update)");
  }


  render(){

    let { t } = this.props
    let { dataList, state_pages_total,
          showOriginDropdownOptions, showTargetDropdownOptions
        } = this.state;
  
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

              <div className="header text-center">
                <h4 className="title">{t('app.exchange_list')}</h4>
              </div>

              <div className="filter-section">
                <div className="table-filter-section">
                  <span className="table-filter-label">
                    {t('app.origin_currency')}
                  </span>

                  {showOriginDropdownOptions instanceof Array
                    && showOriginDropdownOptions.length !== 0 ? 
                    <select
                      onChange={this.onChangeOriginCurrency} 
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
                      onChange={this.onChangeTargetCurrency} 
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


                  {/* <select
                    // onClick={this.onClickTarget}
                    onChange={this.onChangeTargetCurrency} 
                    className="table-select">
                    {showTargetDropdownOptions.map((item,index) => 
                      <option key={index} value={item} label={item}>
                        {item}
                      </option>)
                    }
                  </select> */}
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
                        <th>{t('app.user_id')}</th>
                        <th>{t('app.origin_currency')}</th>
                        <th>{t('app.amount')}</th>
                        <th>{t('app.remain')}</th>
                        <th>{t('app.target_currency')}</th>
                        <th>{t('app.rate')}</th>
                        <th>{t('app.create_datetime')}</th>
                        <th>{t('app.buy_amount')}</th>
                        <th>{t('app.buy_rate')}</th>
                        <th>{t('app.buy_out')}</th>
                        <th>{t('app.buy')}</th>
                      </tr>
                    </thead>
                    {dataList instanceof Array
                      && dataList.length !== 0 ? 
                      <tbody>
                        {dataList.map((item,index) => 
                          <ExchangeMarketItem
                          key={index}
                          index={index}
                          {...item}
                          refreshData={this.getInitialData.bind(this,this.state.activePage)}
                          dataLength={dataList.length*state_pages_total}
                          nowPage={this.state.activePage}
                          >
                          </ExchangeMarketItem>)
                        }
                      </tbody>
                      :<tbody >
                          <td className="table-no-data" colSpan="20">{t('app.no_data')}</td>
                      </tbody>
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

export default withTranslation()(ExchangeMarket);