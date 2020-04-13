import React from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
// import cx from 'classnames';
// import { setMobileNavVisibility } from '../../actions/layoutActions';
import { setupUser } from '../../actions/userActions';
import { withRouter } from 'react-router-dom';

import Header from '../../containers/Main/HeaderContainer';
import Footer from './Footer';
import SideBar from '../../components/SideBar';
// import ThemeOptions from '../../components/ThemeOptions';
// import MobileMenu from '../../components/MobileMenu';

//---------引用Modal顯示錯誤訊息----------------
import Modal from "react-responsive-modal";
import { popupErrorMsg, setupErrorMsg } from '../../actions/errMsgAction';


/**
 * Pages
 */
import Dashboard from '../Dashboard';
import Components from '../Components';
// import UserProfile from '../UserProfile';
// import MapsPage from '../MapsPage';
import Forms from '../Forms';
// import Charts from '../Charts';
import Tables from '../Tables';
import LoginForm from '../../containers/Login/LoginFormContainer'
import ls from 'local-storage'

// ********** 1.客戶管理 **********
import AgentAdd from "../Customer/AgentAdd";
import AgentList from "../Customer/AgentList";
import AgentMemberList from "../Customer/AgentMemberList";
import SellOrderList from "../Customer/SellOrderList";
import SellOrderListDetail from "../Customer/SellOrderListDetail";

import MemberAdd from "../Customer/MemberAdd";
import MmberList from "../Customer/MmberList"; 
import rebateSetting from  "../Customer/rebateSetting"; // 返水設定

// ********** 2. 銀行帳戶 **********
import BankAdd from "../Bank/BankAdd"; //新建銀行帳戶
import BankList from "../Bank/BankList"; //編輯銀行帳戶
import CardAdd from "../Bank/CardAdd"; //新建銀行卡
import CardList from "../Bank/CardList"; //銀行卡清單

// ********** 3.外匯單管理 **********
import ExchangeMarket from "../Exchange/ExchangeMarket"; // 3.1 換匯市場
import CreateOrder from "../Exchange/CreateOrder"; // 3.2 新增掛單
import MyOrderList from "../Exchange/MyOrderList"; // 3.3 我的掛單
import OrderPendingBuy from '../../containers/Page/OrderPendingBuyContainer'; // 3.4 我的出價(交易中)
import OrderPendingBuy_single from '../../containers/Page/OrderPendingBuySingleContainer'; //我的出價(交易中)【單筆】
import OrderPendingSell from '../../containers/Page/OrderPendingSellContainer'; // 3.5 我的掛單(交易中)
import OrderPendingSell_single from '../../containers/Page/OrderPendingSellSingleContainer'; //待我的掛單(交易中)【單筆】
import ExchangeRecord from "../Exchange/ExchangeRecord"; // 3.6 換匯交易紀錄
import ExchangeRecordSingle from "../Exchange/ExchangeRecordSingle"; // 換匯交易紀錄【單筆】

// ********** 4.存/提款 **********
import DepositApply from '../../containers/Page/DepositApplyContainer'; //用戶存款
import DepositList from "../Deposit/DepositList"; //存款報表
import DepositListDetailContainer from '../../containers/Page/DepositListDetailContainer';//存款報表【單筆】
import WithdrawApply from '../Withdraw/WithdrawApply'; //用戶存款
import WithdrawList from "../Withdraw/WithdrawList"; //存款報表

// ********** 5.報表 **********
import ExchangeReport from '../Report/ExchangeReport' // 5.1 換匯市場
import WalletRecord from "../Report/WalletRecord"; // 5.2 錢包紀錄
import BonusReport from "../Report/BonusReport"; // 5.3 推廣獎金
import BonusReportDetail from "../Report/BonusReportDetail"; // 5.3 推廣獎金(詳細)
import PrizeReport from "../Report/PrizeReport"; // 5.4 獎池
import PrizeReportDetail from "../Report/PrizeReportDetail"; // 5.4 獎池(詳細)

// ********** 6.客服 **********
import NewMessage from '../Service/NewMessage' //6.1新增客訴
import QuestionAnswerCenter from "../Service/QuestionAnswerCenter"; //6.2處理客服案件
import CustomerServiceHistory from "../Service/CustomerServiceHistory"; //6.3客服歷史紀錄

// ********** 7.通知 **********
import NotificationtList from "../Notification/NotificationtList";

// ********** 忘記密碼 **********
import SendResetEmail from "../User/SendResetEmail"; //發送忘記密碼信頁
import ResetPassword from "../User/ResetPassword"; //輸入重設密碼頁

// ********** 信箱驗證 **********
import EmailVerifyResult from "../User/EmailVerifyResult"; //信箱驗證結果頁

// ********** 個人檔案 **********
import BankerProfile from "../BankerProfile/BankerProfileContainer";
import { FiAlertCircle } from "react-icons/fi";


// ********** 套件 **********
import { Translation } from 'react-i18next';
import $ from 'jquery'

$(".close-layer").click(function(){
  $('.page-div').removeClass('nav-open')
});


const Main = ({
  // mobileNavVisibility,
  // hideMobileMenu,
  // history,
  setupUser,
  errMsg,
  showErrMsg,
  // mode,
  popupErrorMsg,
  // popupErrorMode
}) => {

  let user = ls.get('user')
  let weblink = window.location.href
  if(user===null || user.user.username===null || user.user.username===undefined || user.user.username===''){
    if(weblink.indexOf('reset') !== -1){ 
      return(
      <SendResetEmail/> //點選忘記密碼 => 輸入寄送的Email /www.banker.dcedex.com
      
      ) 
     }
     else if(weblink.indexOf('forgetPassword') !== -1){ 
      return(
        <ResetPassword/> //從信箱點選驗證連結 => 導回至《重設密碼》頁 www.banker.dcedex.com/forgetPassword/xxxxx
        ) 
     }
     else{
       return(
       <LoginForm/>
       ) 
     }

  }else{
    setupUser(user)
  }

  return (
    <div className="body-page-div">
      <div className="wrapper">
        {/* <div className="close-layer"></div> */}
        <SideBar />

        <div className="main-panel">
          <Header />
            <div className="main-panel-center"> {/* 中間主畫面 */}
              <Route exact path="/" component={Dashboard} />
              <Route path="/components" component={Components} />
              {/* <Route path="/profile" component={UserProfile} /> */}
              <Route path="/forms" component={Forms} />
              <Route path="/tables" component={Tables} />
              {/* <Route path="/maps" component={MapsPage} /> */}
              {/* <Route path="/charts" component={Charts} /> */}

              {/* ********** 莊家個人資料 ********** */}
              <Route path="/banker-profile" component={BankerProfile} />

              {/* ********** 1.客戶管理 ********** */}
              <Route path="/customer/agent-add" component={AgentAdd} />
              <Route path="/customer/agent-list" component={AgentList} />
              <Route path="/customer/agent-memberlist/:id" component={AgentMemberList} />
              <Route path="/member-sell-order-list/:id" component={SellOrderList} />  {/* 代理會員的掛單清單 */}
              <Route path="/sell-order-list/detail/:id" component={SellOrderListDetail} />
              <Route path="/customer/member-add" component={MemberAdd} />
              <Route path="/customer/member-list" component={MmberList} />
              <Route path="/customer/rebate-setting" component={rebateSetting} /> {/* 莊家/代理回饋 */}

              {/* ********** 2.銀行帳戶 ********** */}
              <Route path="/bank/bank-add" component={BankAdd} />
              <Route path="/bank/bank-list" component={BankList} />
              <Route path="/bank/card-add" component={CardAdd} />
              <Route path="/bank/card-list" component={CardList} />

              {/* ********** 3.外匯單管理 ********** */}
              <Route path="/exchange/exchange-market" component={ExchangeMarket} /> {/* 3.1 換匯市場 */}
              <Route path="/exchange/create-order" component={CreateOrder} /> {/* 3.2 新增掛單 */}
              <Route path="/exchange/my-selling-list" component={MyOrderList} /> {/* 3.3 我的掛單 */}
              <Route path="/exchange/order-pending-buy" component={OrderPendingBuy} /> {/* 3.4 我的出價(交易中) */}
              <Route path="/exchange/order-pending-buy-single/:id" component={OrderPendingBuy_single} />  {/* 我的出價(交易中)【單筆】 */}
              <Route path="/exchange/order-pending-sell" component={OrderPendingSell} /> {/* 3.5 我的掛單(交易中) */}
              <Route path="/exchange/order-pending-sell-single/:id" component={OrderPendingSell_single} />  {/* 我的掛單(交易中)【單筆】 */}
              <Route path="/exchange/exchange-record" component={ExchangeRecord} /> {/* 3.6 換匯交易紀錄 */}
              <Route path="/exchange/exchange-record-single/:id" component={ExchangeRecordSingle} />  {/* 換匯交易紀錄【單筆】 */}

              {/* ********** 4.存/提款 ***********/}
              <Route path="/deposit/deposit-apply" component={DepositApply} />
              <Route path="/deposit/deposit-list" component={DepositList} />
              <Route path="/deposit/deposit-detail/:id" component={DepositListDetailContainer} />
              <Route path="/withdraw/withdraw-apply" component={WithdrawApply} />
              <Route path="/withdraw/withdraw-list" component={WithdrawList} />

              {/* ********** 5.報表 ********** */}
              <Route path="/report/exchange-report" component={ExchangeReport} /> {/* 5.1 換匯報表 */}
              <Route path="/report/wallet-record" component={WalletRecord} />
              <Route path="/report/bonus" component={BonusReport} />
              {/* <Route path="/report/bonus/:startDate/:endDate/:selectedTime" component={BonusReport} /> */}
              <Route path="/report/bonus-detail/:id/:startDate/:endDate/:selectedTime" component={BonusReportDetail} />
              <Route path="/report/prize" component={PrizeReport} />
              <Route path="/report/prize-detail/:id/:startDate/:endDate/:selectedTime" component={PrizeReportDetail} />

              {/* ********** 6.客服 ********** */}
              <Route path="/service/new-message" component={NewMessage} />
              <Route path="/service/QA-center" component={QuestionAnswerCenter} />
              <Route path="/service/history" component={CustomerServiceHistory} />
              
              {/* ********** 其它頁面 ********** */}
              <Route path="/user/emailresult" component={EmailVerifyResult} />
              <Route path="/notification/list" component={NotificationtList} />
              
            </div>
          <Footer />

           {/* 顯示錯誤訊息*/}
           <Modal
            open={showErrMsg === true}
            closeIconSize={0}
          >
            <div className="modal-inside">
              <div className="warining-icon-section text-center">
                <FiAlertCircle className="FiAlertCircle" />
              </div>
              <div className="modal-body">
                {errMsg}
              </div>
              <div className="modal-footer-mini">
                {/* <button className="modal-action-button" onClick={popupErrorMsg.bind(this, false)}> */}
                <button className="modal-action-button" onClick={popupErrorMsg}>
                  <Translation>
                    {(t) => <span>{t('app.close')}</span>}
                  </Translation>
                </button>
              </div>
            </div>
          </Modal>

        </div>
      </div>
    </div>
  )
};

const mapStateToProp = state => ({
  // mobileNavVisibility: state.Layout.mobileNavVisibility
  errMsg: state.BankerProfile.errMsg, //錯誤訊息內容
  showErrMsg: state.BankerProfile.showErrMsg, //是否跳錯誤通知
  showLogoutErrMsg: state.BankerProfile.showLogoutErrMsg, //是否跳錯誤通知,需要登出時
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  // hideMobileMenu: () => dispatch(setMobileNavVisibility(false)),
  setupUser: (userInfo)=> dispatch(setupUser(userInfo)),
  setupErrorMsg: (errMsg)=> dispatch(setupErrorMsg(errMsg)),
  popupErrorMsg: (showErrMsg)=> dispatch(popupErrorMsg(showErrMsg)),
});

export default withRouter(connect(mapStateToProp, mapDispatchToProps)(Main));