// import React from 'react';
// import { apiGetOrderList,apiGetBankerOrderListFilter } from '../../services/apiService'
// import ExchangeMarketItem from './ExchangeMarketItem'
// import { MdLibraryAdd, MdFirstPage, MdLastPage, MdClear } from "react-icons/md";
// import { Link } from 'react-router-dom';
// import {withTranslation} from 'react-i18next';


// class ExchangeMarket extends React.Component{
//   constructor(props) {
//     super(props)
//     this.state = {
//       state_orderList:null,
//       state_orderListAll:[],
//       selectedCurrency:'All',
//       state_pages_total:[],
//       state_currentPage:1,
//       state_pages_options:1,
//     }
//     this.onChangeCurrency = this.onChangeCurrency.bind(this)
//   }


//   async getInitialData() {   //===== 取得初始清單 =====//
//     try {
//       let resultList = await apiGetOrderList(1)
//       // console.log(result_apiGetOrderList.data.data)
//       this.setState({
//         state_orderList:resultList.data.data.agent, // 顯示的清單
//         state_orderListAll:resultList.data.data.agent, // 獲取選項陣列
//         state_pages_total:resultList.data.data.total_pages, // 總頁數
//         state_pages_options:resultList.data.data.pages, // 要顯示的頁數
//         state_currentPage:resultList.data.data.current_page, //目前頁數
//       })
//     } catch(err) {
//       console.log(err);
//     }
//   }

//   async getSelectPageList(e,selectPage){ // 點選某頁數 => 取得新資料
//     try {
//       let resultList = await apiGetOrderList(selectPage)
//       console.log('selectPage',selectPage)
//       console.log('翻頁資料',this.state.state_ordersList)
//       this.setState({
//         state_orderList:resultList.data.data.agent,
//         state_pages_total:resultList.data.data.total_pages, 
//         state_currentPage:resultList.data.data.current_page,
//         state_pages_options:resultList.data.data.pages,
//       })
//     }catch (err) {
//       console.log(err)
//     }
//   }

//   async getFirstPage(){ // 點選第一頁
//     try {
//       let resultList = await apiGetOrderList(1)
//       // console.log('firstPage',firstPage)
//       this.setState({
//         state_orderList:resultList.data.data.agent,
//         state_pages_total:resultList.data.data.total_pages, 
//         state_currentPage:resultList.data.data.current_page,
//         state_pages_options:resultList.data.data.pages,
//       })
//     }catch (err) {
//       console.log(err)
//     }
//   }

//   async getFinalPage(e,finallpage){ // 點選最後一頁
//     try {
//       let resultList = await apiGetOrderList(finallpage)
//       console.log('finallpage',finallpage)
//       this.setState({
//         state_orderList:resultList.data.data.agent,
//         state_pages_total:resultList.data.data.total_pages, 
//         state_currentPage:resultList.data.data.current_page,
//         state_pages_options:resultList.data.data.pages,
//       })
//     }catch (err) {
//       console.log(err)
//     }
//   }

//   onChangeCurrency =(e)=>{ // 篩選onChange
//     // console.log('選擇的貨幣:',e.target.value)
//     if (e.target.value === 'All'){ // 選擇全部，抓取初始值
//       this.getInitialData(1)
//     }
//     else{
//       this.getFilterData(e.target.value)
//     }
//   }

//   async getFilterData(selectedCurrency) {   //===== 篩選後的清單 =====//
//     console.log('選擇的貨幣',selectedCurrency)
//     try {
//       let result_list_filter = await apiGetBankerOrderListFilter(selectedCurrency)
//       console.log('篩選出的清單:',result_list_filter.data.data)
//       this.setState({
//         state_orderList:result_list_filter.data.data.agent,
//         state_pages_total:result_list_filter.data.data.total_pages, 
//         state_currentPage:result_list_filter.data.data.current_page,
//         state_pages_options:result_list_filter.data.data.pages,
//       })
//     } catch(err) {
//       console.log(err);
//     }
//   }

//   componentDidMount() {
//     this.getInitialData()
//   }

//     render(){

//       let {t} = this.props
//       let {state_orderList,state_orderListAll} = this.state;
//       // console.log(state_orderList)

//       // ↓↓ 取得所有物件的origin_currency 
//       let allCurrencyOptions = Object.values(state_orderListAll).map(item=>item.origin_currency)
//         // console.log('抓到的貨幣',currencyOptions)

//       // ↓↓ 篩選出不重複的origin_currency 
//       let currencyOptions = Array.from(new Set(allCurrencyOptions))
//         // console.log('不重複貨幣',newCurrencyOptions)

//       // ↓↓ 在最前面加入一個"所有All"的選項 
//       currencyOptions.unshift('All')

//       // ----- 頁數相關操作 ↓ -----
//       let totalPageLength = this.state.state_pages_total.length //總頁數長度
//       let finalPage = this.state.state_pages_total[totalPageLength-1]  //取得總頁數最後一數字

//       let {state_currentPage, state_pages_options} = this.state

//       let showPageOptions = []
//       for(let i = 0; i < state_pages_options.length+1; i++) {
//         showPageOptions.push(
//         <button 
//         className="page-btn" 
//          onClick={e=>this.getSelectPageList(e,i)}>
//          {state_pages_options[i-1]}
//         </button>,<span className="page-separation"></span>)
//       }
//       // ----- 頁數相關操作 ↑ -----


//       return (
//         <div className="container-fluid">
        
//           <div className="row">
//             <div className="col-md-12">
//               <div className="card card-exchange">

//                 <div className="header text-center">
//                   <h4 className="title">{t('app.order_recommend')}</h4>
//                 </div>

//                 <div className="filter-section">
//                   <select
//                     onChange={e=>this.onChangeCurrency(e)} 
//                     className="table-select"
//                   >
//                     {currencyOptions.map((item,index) => 
//                       <option key={index} value={item} label={item}>
//                         {item}
//                       </option>)
//                     }
//                   </select>
//                 </div>

//                 <div className="content table-responsive table-full-width">
                  
//                   <table className="table table-exchange">
//                     <thead>
//                       <tr>
//                         <th>{t('app.id')}</th>
//                         <th>{t('app.user_id')}</th>
//                         <th>{t('app.origin_currency')}</th>
//                         <th>{t('app.target_currency')}</th>
//                         <th>{t('app.amount')}</th>
//                         <th>{t('app.remain')}</th>
//                         <th>{t('app.rate')}</th>
//                         <th>{t('app.create_datetime')}</th>
//                         <th>{t('app.buy_amount')}</th>
//                         <th>{t('app.buy_rate')}</th>
//                         <th>{t('app.buy')}</th>
//                       </tr>
//                     </thead>
//                     {state_orderList instanceof Array
//                       && state_orderList.length !== 0 ? 
//                       <tbody>
//                         {state_orderList.map((item,index) => 
//                           <ExchangeMarketItem
//                           key={index}
//                           index={index}
//                           {...item}
//                           refreshData={this.getInitialData.bind(this,1)}
//                           >
//                           </ExchangeMarketItem>)
//                         }
//                       </tbody>
//                       :<tbody >
//                           <td className="table-no-data" colSpan="20">{t('app.no_data')}</td>
//                       </tbody>
//                     }
//                   </table>
                  
//                   {state_orderList instanceof Array
//                     && state_orderList.length !== 0 ? 
//                     <div>
//                       <div className="page-section">
//                         {t('app.current_page')} {state_currentPage}
//                       </div>

//                       <div className="page-section"> 
//                         <button className="page-btn"
//                         onClick={e=>this.getFirstPage()}>
//                           <MdFirstPage/>
//                         </button> 
//                         {showPageOptions} 
//                         <button className="page-btn" 
//                         onClick={e=>this.getFinalPage(e,finalPage)}>
//                           <MdLastPage/>
//                         </button>
//                       </div>
//                     </div>
//                   :''}

//                 </div>
                
//               </div>
//             </div>
//           </div>
         
//         </div>
//       )
//     }
// }

// export default withTranslation()(ExchangeMarket);