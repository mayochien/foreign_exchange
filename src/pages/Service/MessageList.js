// import React, { Component } from 'react';
// import { withTranslation } from 'react-i18next';
// import { apiGetWalletRecord } from '../../services/apiService';
// import MessageListItem  from './MessageListItem';
// import Pagination from "react-js-pagination";
// import moment from "moment";


// class WalletRecord extends Component {

//   state = {
//     dataList: [],
//     total_page:0,
//     activePage:1,
//     startDate: moment().startOf('isoWeek').format('YYYY-MM-DD'),
//     endDate: moment().endOf('isoWeek').format('YYYY-MM-DD'),
//   };

//   handleStartChange = (date) => {
//     this.setState({
//       startDate: date
//     });
//   }

//   handleEndChange = (date) => {
//     this.setState({
//       endDate: date
//     });
//   }

//   onClickEdit = () => {
//     this.setState({
//       modifiable:true
//     })
//   }

//   cancelEdited= (id) => {
//     this.setState({
//       modifiable: false,
//     });
//   }

//   openDepositDetail = () => {
//     this.setState({
//       depositDetailBtn: !this.state.depositDetailBtn
//     });
//   }

//   handlePageChange (pageNumber) { // 切換頁面
//     this.setState({
//       activePage: pageNumber
//     })
//     this.getInitialData(pageNumber)
//     // console.log('pageNumber',pageNumber)
//   }


//   getInitialData = async() => { // 初始載入
//     // console.log('目前資料頁數page:',page)
//     // let startDate = moment(this.state.startDate).format('YYYY-MM-DD');
//     // let endDate = moment(this.state.endDate).format('YYYY-MM-DD');
//     try {
//       let resultList = await apiGetWalletRecord(this.state.activePage, this.state.startDate, this.state.endDate );
//       this.setState({
//         dataList: resultList.data.data.wallet_log,
//         total_page:resultList.data.data.total_pages, // 總頁數
//       })
//     } catch(err) {
//       console.log(err);
//     }
//   }

//   componentDidMount() {
//     this.getInitialData();
//   }

//   getSnapshotBeforeUpdate(prevState) { //取代 componentWillUpdate
//     // if (prevState.dataList !== this.state.dataList){
//         setTimeout(()=>{
//           this.getInitialData(this.state.activePage)
//           console.log('《錢包紀錄》刷新',new Date().getMinutes(),':',new Date().getSeconds())
//         },5000)
//     // }
//   }

//   render() {
//     // console.log('資料頁面總數:',this.state.total_page)
//     const { t } = this.props;
//     const { dataList } = this.state;

//     return (
//       <div className="container-fluid">
//         <div className="row">
//           <div className="col-md-12">
//             <div className="card card-exchange">

//               <div className="header text-center">
//                 <h4 className="title">{t('app.message_history')}</h4>
//               </div>

//                 <div className="content table-responsive table-full-width">
//                   <table className="table table-exchange">
//                     <thead>
//                       <tr>
//                         <th>{t('app.id')}</th>
//                         <th>{t('app.create_datetime')}</th>
//                         <th>{t('app.type')}</th>
//                         <th>{t('app.username')}</th>
//                         <th>{t('app.photo')}</th>
//                         <th>{t('app.content')}</th>
//                         <th>{t('app.remark')}</th>
//                         <th>{t('app.edit')}</th>
//                       </tr>
//                     </thead>

//                       {dataList===undefined
//                        || !dataList instanceof Array
//                        || dataList.length === 0?
//                         <td className="table-no-data" colSpan="20">
//                           {t('app.no_data')}
//                         </td>
//                         :
//                         <tbody>
//                           {dataList.map((item, index) => (
//                             <MessageListItem
//                               key={index}
//                               {...item}
//                               refreshData={this.getInitialData.bind(this,1)}
//                               />
//                           ))}
//                         </tbody>
//                       }
//                   </table>
//                 </div>

//                 {this.state.total_page > 0 ?
//                   <div className="page-section">
//                     <Pagination
//                       activePage={this.state.activePage}
//                       itemsCountPerPage={20}
//                       totalItemsCount={this.state.total_page*20}
//                       pageRangeDisplayed={3}
//                       onChange={e=>this.handlePageChange(e)}
//                     />
//                   </div>
//                 :''}

//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }

// export default withTranslation()(WalletRecord);
