import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Collapse } from 'react-bootstrap';
import {withTranslation} from 'react-i18next';
import $ from 'jquery'


class Nav extends Component {
  state = {
    openNavUser:false
  }


  toggleNav = () => { //1280px以下，點擊子目錄，自動收合選單
    if ($(window).width() < 1280) {
      // console.log('執行toggleNav');
        $('.body-page-div').removeClass('nav-open')
    }
  }

  
  render() {
    const { t } = this.props;

    return (
        <ul className="nav">

          {/* *************** 1.客戶管理 *************** */}
          <li className={this.isPathActive('/customer') || this.state.tableMenuOpen ? 'active' : null}>
            <a onClick={() => this.setState({ openNavAgent: !this.state.openNavAgent })} data-toggle="collapse">
              <div className="nav-title-box">
                <span className="nav-title">
                  1.&nbsp; {t('app.customer_management')}
                </span>
                <i className={ this.state.openNavAgent ? 'nav-angle pe-7s-angle-down' : 'nav-angle pe-7s-angle-right'}></i>
              </div>
            </a>
            <Collapse in={this.state.openNavAgent}>
              <div>
                <ul className="nav">
                  <li onClick={this.toggleNav} id="itemNav" className={this.isPathActive('/customer/agent-add') ? 'active' : null}>
                    <Link to="/customer/agent-add">1.1&nbsp; {t('app.agent_add')}</Link>
                  </li>
                  <li onClick={this.toggleNav} id="itemNav" className={this.isPathActive('/customer/agent-list') ? 'active' : null}>
                    <Link to="/customer/agent-list">1.2&nbsp; {t('app.agent_list')}</Link>
                  </li>
                  <li onClick={this.toggleNav} id="itemNav" className={this.isPathActive('/customer/member-add') ? 'active' : null}>
                    <Link to="/customer/member-add">1.3&nbsp; {t('app.member_add')}</Link>
                  </li>
                  <li onClick={this.toggleNav} id="itemNav" className={this.isPathActive('/customer/member-list') ? 'active' : null}>
                    <Link to="/customer/member-list">1.4&nbsp; {t('app.member_list')}</Link>
                  </li>
                  {/* <li className={this.isPathActive('/customer/rebate-setting') ? 'active' : null}>
                    <Link to="/customer/rebate-setting">1.5&nbsp; {t('app.rebate_setting')}</Link>
                  </li> */}
                </ul>
              </div>
            </Collapse>
          </li>


          {/* *************** 2.銀行帳戶管理 *************** */}
          <li className={this.isPathActive('/bank-account') || this.state.openNavBankAccount ? 'active' : null}>
            <a onClick={() => this.setState({ openNavBankAccount: !this.state.openNavBankAccount })} data-toggle="collapse">
              <div className="nav-title-box">
                <span className="nav-title">2.&nbsp; {t('app.bank_management')}</span>
                <i className={ this.state.openNavBankAccount ? 'nav-angle pe-7s-angle-down' : 'nav-angle pe-7s-angle-right'}></i>
              </div>
            </a>
            <Collapse in={this.state.openNavBankAccount}>
              <div>
                <ul className="nav">
                  <li onClick={this.toggleNav} id="itemNav" className={this.isPathActive('/bank/bank-add') ? 'active' : null}>
                    <Link to="/bank/bank-add">2.1&nbsp; {t('app.bank_add')}</Link>
                  </li>
                  <li onClick={this.toggleNav} id="itemNav" className={this.isPathActive('/bank/bank-list') ? 'active' : null}>
                    <Link to="/bank/bank-list">2.2&nbsp; {t('app.bank_list')}</Link>
                  </li>
                  {/* <li onClick={this.toggleNav} id="itemNav" className={this.isPathActive('/bank/card-add') ? 'active' : null}>
                    <Link to="/bank/card-add">2.3&nbsp; {t('app.card_add')}</Link>
                  </li> */}
                  <li onClick={this.toggleNav} id="itemNav" className={this.isPathActive('/bank/card-list') ? 'active' : null}>
                    <Link to="/bank/card-list">2.3&nbsp; {t('app.card_list')}</Link>
                  </li>
                </ul>
              </div>
            </Collapse>
          </li>

          {/* *************** 3.外匯交易 *************** */}
          <li className={this.isPathActive('/order') || this.state.openNavProduct ? 'active' : null}>
            <a onClick={() => this.setState({ openNavProduct: !this.state.openNavProduct })} data-toggle="collapse">
              <div className="nav-title-box">
                <span className="nav-title">3.&nbsp; {t('app.exchange_transaction')}</span>
                <i className={ this.state.openNavProduct ? 'nav-angle pe-7s-angle-down' : 'nav-angle pe-7s-angle-right'}></i>
              </div>
            </a>
            <Collapse in={this.state.openNavProduct}>
              <div>
                <ul className="nav">
                  <li onClick={this.toggleNav} id="itemNav" className={this.isPathActive('/exchange/order-all') ? 'active' : null}>
                    <Link to="/exchange/exchange-market">3.1&nbsp; {t('app.exchange_list')}</Link>
                  </li>
                  <li onClick={this.toggleNav} id="itemNav" className={this.isPathActive('/exchange/create-order') ? 'active' : null}>
                    <Link to="/exchange/create-order">3.2&nbsp; {t('app.my_selling_order_add')}</Link>
                  </li>
                  <li onClick={this.toggleNav} id="itemNav" className={this.isPathActive('/exchange/my-selling-list') ? 'active' : null}>
                    <Link to="/exchange/my-selling-list">3.3&nbsp; {t('app.my_selling_list')}</Link>
                  </li>
                  <li onClick={this.toggleNav} id="itemNav" className={this.isPathActive('/exchange/order-pending-buy') ? 'active' : null}>
                    <Link to="/exchange/order-pending-buy">3.4&nbsp; {t('app.my_buying_list')} ({t('app.in_transaction')})</Link>
                  </li>
                  <li onClick={this.toggleNav} id="itemNav" className={this.isPathActive('/exchange/order-pending-sell') ? 'active' : null}>
                    <Link to="/exchange/order-pending-sell">3.5&nbsp; {t('app.my_selling_list')} ({t('app.in_transaction')})</Link>
                  </li>
                  <li onClick={this.toggleNav} id="itemNav" className={this.isPathActive('/exchange/exchange-record') ? 'active' : null}>
                    <Link to="/exchange/exchange-record">3.6&nbsp; {t('app.exchange_record')}</Link>
                  </li>
                </ul>
              </div>
            </Collapse>
          </li>

          {/* *************** 4.存/提款 *************** */}
          <li className={this.isPathActive('/deposit') || this.state.openDepositWithdraw ? 'active' : null}>
            <a onClick={() => this.setState({ openDepositWithdraw: !this.state.openDepositWithdraw })} data-toggle="collapse">
              <div className="nav-title-box">
                <span className="nav-title">4.&nbsp; {t('app.deposit_and_withdraw')}</span>
                <i className={ this.state.openDepositWithdraw ? 'nav-angle pe-7s-angle-down' : 'nav-angle pe-7s-angle-right'}></i>
              </div>
            </a>
            <Collapse in={this.state.openDepositWithdraw}>
              <div>
                <ul className="nav">
                  <li onClick={this.toggleNav} id="itemNav" className={this.isPathActive('/deposit/deposit-apply') ? 'active' : null}>
                    <Link to="/deposit/deposit-apply">4.1&nbsp; {t('app.deposit_apply')}</Link>
                  </li>
                  <li onClick={this.toggleNav} id="itemNav" className={this.isPathActive('/deposit/deposit-list') ? 'active' : null}>
                    <Link to="/deposit/deposit-list">4.2&nbsp; {t('app.deposit_list')}</Link>
                  </li>
                  <li onClick={this.toggleNav} id="itemNav" className={this.isPathActive('/withdraw/withdraw-apply') ? 'active' : null}>
                    <Link to="/withdraw/withdraw-apply">4.3&nbsp; {t('app.withdraw_apply')}</Link>
                  </li>
                  <li onClick={this.toggleNav} id="itemNav" className={this.isPathActive('/withdraw/withdraw-list') ? 'active' : null}>
                    <Link to="/withdraw/withdraw-list">4.4&nbsp; {t('app.withdraw_list')}</Link>
                  </li>
                </ul>
              </div>
            </Collapse>
          </li>

          {/* *************** 5.報表 *************** */}
          <li className={this.isPathActive('/report') || this.state.openNavReport ? 'active' : null}>
            <a onClick={() => this.setState({ openNavReport: !this.state.openNavReport })} data-toggle="collapse">
              <div className="nav-title-box">
                <span className="nav-title">5.&nbsp; {t('app.report')}</span>
                <i className={ this.state.openNavReport ? 'nav-angle pe-7s-angle-down' : 'nav-angle pe-7s-angle-right'}></i>
              </div>
            </a>
            <Collapse in={this.state.openNavReport}>
              <div>
                <ul className="nav">
                  <li onClick={this.toggleNav} id="itemNav" className={this.isPathActive('/report/exchange-report') ? 'active' : null}>
                    <Link to="/report/exchange-report">5.1&nbsp; {t('app.exchange_report')}</Link>
                  </li>
                  <li onClick={this.toggleNav} id="itemNav" className={this.isPathActive('/report/wallet-record') ? 'active' : null}>
                    <Link to="/report/wallet-record">5.2&nbsp; {t('app.wallet_record')}</Link>
                  </li>
                  <li onClick={this.toggleNav} id="itemNav" className={this.isPathActive('/report/bonus') ? 'active' : null}>
                    <Link to="/report/bonus">5.3&nbsp; {t('app.promotion_bonus')}</Link>
                  </li>
                  <li onClick={this.toggleNav} id="itemNav" className={this.isPathActive('/report/prize') ? 'active' : null}>
                    <Link to="/report/prize">5.4&nbsp; {t('app.prize_pool')}</Link>
                  </li>
                </ul>
              </div>
            </Collapse>
          </li>

          {/* *************** 6.客服 *************** */}
          <li className={this.isPathActive('/service') || this.state.openNavService ? 'active' : null}>
            <a onClick={() => this.setState({ openNavService: !this.state.openNavService })} data-toggle="collapse">
              <div className="nav-title-box">
                <span className="nav-title">6.&nbsp; {t('app.support')}</span>
                <i className={ this.state.openNavService ? 'nav-angle pe-7s-angle-down' : 'nav-angle pe-7s-angle-right'}></i>
              </div>
            </a>
            <Collapse in={this.state.openNavService}>
              <div>
                <ul className="nav">
                  <li onClick={this.toggleNav} id="itemNav" className={this.isPathActive('/service/new-message') ? 'active' : null}>
                    <Link to="/service/new-message">6.1&nbsp; {t('app.create_message')}</Link>
                  </li>
                  <li onClick={this.toggleNav} id="itemNav" className={this.isPathActive('/service/QA-center') ? 'active' : null}>
                    <Link to="/service/QA-center">6.2&nbsp; {t('app.message_processing')}</Link>
                  </li>
                  <li onClick={this.toggleNav} id="itemNav" className={this.isPathActive('/service/history') ? 'active' : null}>
                    <Link to="/service/history">6.3&nbsp; {t('app.message_history')}</Link>
                  </li>
                </ul>
              </div>
            </Collapse>
          </li>

          
          {/* *************** 7.通知中心 *************** */}
          <li className={this.isPathActive('/notification') || this.state.openNavService ? 'active' : null}>
            <a onClick={() => this.setState({ openNavNotification: !this.state.openNavNotification })} data-toggle="collapse">
              <div className="nav-title-box">
                <span className="nav-title">7.&nbsp; {t('app.notification')}</span>
                <i className={ this.state.openNavNotification ? 'nav-angle pe-7s-angle-down' : 'nav-angle pe-7s-angle-right'}></i>
              </div>
            </a>
            <Collapse in={this.state.openNavNotification}>
              <div>
                <ul className="nav">
                  <li onClick={this.toggleNav} id="itemNav" className={this.isPathActive('/notification/list') ? 'active' : null}>
                <Link to="/notification/list">7.1&nbsp; {t('app.notification_list')}</Link>
                  </li>
                </ul>
              </div>
            </Collapse>
          </li>


          {/* <hr/> */}
          {/* ================== 預設目錄 ↓ ↓ =================== */}
          {/* ================== 預設目錄 ↓ ↓ =================== */}

           {/* <li >
            <Link to="/">
              <span className="nav-title">Dashboard</span>
            </Link>
          </li> */}
          {/*
          <li className={this.isPathActive('/charts') ? 'choice' : null}>
            <Link to="/charts">
              <span className="nav-title">圖表</span>
            </Link>
          </li>

          <li className={this.isPathActive('/components') || this.state.componentMenuOpen ? 'active' : null}>
            <a onClick={() => this.setState({ componentMenuOpen: !this.state.componentMenuOpen })}
               data-toggle="collapse">
              <p>
                Components
              </p>
            </a>
            <Collapse in={this.state.componentMenuOpen}>
              <div>
                <ul className="nav">
                  <li className={this.isPathActive('/components/buttons') ? 'active' : null}>
                    <Link to="/components/buttons">Buttons</Link>
                  </li>
                  <li className={this.isPathActive('/components/grid') ? 'active' : null}>
                    <Link to="/components/grid">Grid System</Link>
                  </li>
                  <li className={this.isPathActive('/components/icons') ? 'active' : null}>
                    <Link to="/components/icons">Icons</Link>
                  </li>
                  <li className={this.isPathActive('/components/notifications') ? 'active' : null}>
                    <Link to="/components/notifications">Notifications</Link>
                  </li>
                  <li className={this.isPathActive('/components/panels') ? 'active' : null}>
                    <Link to="/components/panels">Panels</Link>
                  </li>
                  <li className={this.isPathActive('/components/sweetalert') ? 'active' : null}>
                    <Link to="/components/sweetalert">Sweet Alert</Link>
                  </li>
                  <li className={this.isPathActive('/components/typography') ? 'active' : null}>
                    <Link to="/components/typography">Typography</Link>
                  </li>
                </ul>
              </div>
            </Collapse>
          </li>


          <li className={this.isPathActive('/forms') || this.state.formMenuOpen ? 'active' : null}>
          <a onClick={() => this.setState({ formMenuOpen: !this.state.formMenuOpen })} data-toggle="collapse">
            <p>Forms
            </p>
          </a>
          <Collapse in={this.state.formMenuOpen}>
            <div>
              <ul className="nav">
                <li className={this.isPathActive('/forms/regular-forms') ? 'active' : null}>
                  <Link to="/forms/regular-forms">Regular Forms</Link>
                </li>
                <li className={this.isPathActive('/forms/extended-forms') ? 'active' : null}>
                  <Link to="/forms/extended-forms">Extended Forms</Link>
                </li>
                <li className={this.isPathActive('/forms/validation-forms') ? 'active' : null}>
                  <Link to="/forms/validation-forms">Validation Forms</Link>
                </li>
              </ul>
            </div>
          </Collapse>
        </li>


          <li className={this.isPathActive('/tables') || this.state.tableMenuOpen ? 'active' : null}>
          <a onClick={() => this.setState({ tableMenuOpen: !this.state.tableMenuOpen })} data-toggle="collapse">
            <p>Tables <b className="caret"></b></p>
          </a>
          <Collapse in={this.state.tableMenuOpen}>
            <div>
              <ul className="nav">
                <li className={this.isPathActive('/tables/regular-tables') ? 'active' : null}>
                  <Link to="/tables/regular-tables">Regular Table</Link>
                </li>
                <li className={this.isPathActive('/tables/extended-tables') ? 'active' : null}>
                  <Link to="/tables/extended-tables">Extended Tables</Link>
                </li>
                <li className={this.isPathActive('/tables/react-bootstrap-table') ? 'active' : null}>
                  <Link to="/tables/react-bootstrap-table">React Bootstrap Table</Link>
                </li>
              </ul>
            </div>
          </Collapse>
        </li> */}

      </ul>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }
}

export default withRouter(withTranslation()(Nav));






// import React, { Component } from 'react';
// import { Link, withRouter } from 'react-router-dom';
// import { Collapse } from 'react-bootstrap';
// import { Accordion, AccordionItem } from 'react-light-accordion';
// import 'react-light-accordion/demo/css/index.css';


// class Nav extends Component {

//   state = {};

//   render() {
//     let { location } = this.props;
//     // console.log('User',this.state.openNavAgent);
//     // console.log('BankAccount',this.state.openNavBankAccount);

//     return (
//       <Accordion  atomic={true}>

//          <AccordionItem title="代理管理">
//             <ul className="nav">
//               <li className={this.isPathActive("/agent/agent-list") ? 'active' : null}>
//                 <Link to="/agent/agent-list">代理清單</Link>
//               </li>
//               <li className={this.isPathActive("/agent/agent-add") ? 'active' : null}>
//                 <Link to="/agent/agent-add">代理新增</Link>
//               </li>
//             </ul>
//           </AccordionItem>


//           <AccordionItem title="銀行帳戶管理">
//             <ul className="nav">
//               <li>
//                 <Link to="/bank/bank-list">銀行帳戶清單</Link>
//               </li>
//               <li>
//                 <Link to="/bank/bank-add">銀行帳戶新增</Link>
//               </li>
//               <li>
//                 <Link to="/bank/card-list">銀行卡清單</Link>
//               </li>
//               <li>
//                 <Link to="/bank/card-add">銀行卡新增</Link>
//               </li>
//             </ul>
//           </AccordionItem>


//           <AccordionItem title="貨量管理">
//             <ul className="nav">
//               <li>
//                 <Link to="/product/product-add">成交單新增</Link>
//               </li>
//               <li>
//                 <Link to="/product/product-list">成交單清單</Link>
//               </li>
//               <li>
//                 <Link to="/product/product-detail">貨量詳細資料</Link>
//               </li>
//               {/* <li>
//                 <Link to="/product/product-management">已上架查詢</Link>
//               </li> */}
//             </ul>
//           </AccordionItem>


//           <AccordionItem title="接單管理">
//             <ul className="nav">
//               <li>
//                 <Link to="/exchange/order-new">新進訂單</Link>
//               </li>
//               <li>
//                 <Link to="/exchange/order-cancel">已取消訂單</Link>
//               </li>
//             </ul>
//           </AccordionItem>


//           <AccordionItem title="出款管理">
//             <ul className="nav">
//               <li>
//                 <Link to="/withdraw/withdraw-new">待出款</Link>
//               </li>
//               <li>
//                 <Link to="/withdraw/withdraw-completed">已出款</Link>
//               </li>
//             </ul>
//           </AccordionItem>


//           <AccordionItem title="主管稽核">
//             <ul className="nav">
//               <li>
//                 <Link to="/audit/audit-product">上架稽核</Link>
//               </li>
//               <li>
//                 <Link to="/audit/audit-order">接單稽核</Link>
//               </li>
//               <li>
//                 <Link to="/audit/audit-withdraw">出款稽核</Link>
//               </li>
//             </ul>
//           </AccordionItem>


//           <AccordionItem title="員工管理">
//             <ul className="nav">
//               <li>
//                 <Link to="/employee/employee-add">新建員工</Link>
//               </li>
//               <li>
//                 <Link to="/employee/employee-edit">編輯員工</Link>
//               </li>
//             </ul>
//           </AccordionItem>


//           <AccordionItem title="報表">
//             <ul className="nav">
//               <li>
//                 <Link to="/report/report-today">今日進出款</Link>
//               </li>
//               <li>
//                 <Link to="/report/report-exchange">匯兌報表</Link>
//               </li>
//               <li>
//                 <Link to="/report/report-withdraw">出款報表</Link>
//               </li>
//             </ul>
//           </AccordionItem>


//           {/* <hr/> */}
//           {/* ================== 預設目錄 ↓ ↓ =================== */}
//           {/* ================== 預設目錄 ↓ ↓ =================== */}

//           {/* <li className={location.pathname === '/' ? 'choice' : null}>
//             <Link to="/">
//               <span className="nav-title">Dashboard</span>
//             </Link>
//           </li>

//           <li className={this.isPathActive('/charts') ? 'choice' : null}>
//             <Link to="/charts">
//               <span className="nav-title">圖表</span>
//             </Link>
//           </li> */}

//           {/* <li className={this.isPathActive('/components') || this.state.componentMenuOpen ? 'active' : null}>
//             <a onClick={() => this.setState({ componentMenuOpen: !this.state.componentMenuOpen })}
//                data-toggle="collapse">
//               <p>
//                 Components
//               </p>
//             </a>
//             <Collapse in={this.state.componentMenuOpen}>
//               <div>
//                 <ul className="nav">
//                   <li className={this.isPathActive('/components/buttons') ? 'active' : null}>
//                     <Link to="/components/buttons">Buttons</Link>
//                   </li>
//                   <li className={this.isPathActive('/components/grid') ? 'active' : null}>
//                     <Link to="/components/grid">Grid System</Link>
//                   </li>
//                   <li className={this.isPathActive('/components/icons') ? 'active' : null}>
//                     <Link to="/components/icons">Icons</Link>
//                   </li>
//                   <li className={this.isPathActive('/components/notifications') ? 'active' : null}>
//                     <Link to="/components/notifications">Notifications</Link>
//                   </li>
//                   <li className={this.isPathActive('/components/panels') ? 'active' : null}>
//                     <Link to="/components/panels">Panels</Link>
//                   </li>
//                   <li className={this.isPathActive('/components/sweetalert') ? 'active' : null}>
//                     <Link to="/components/sweetalert">Sweet Alert</Link>
//                   </li>
//                   <li className={this.isPathActive('/components/typography') ? 'active' : null}>
//                     <Link to="/components/typography">Typography</Link>
//                   </li>
//                 </ul>
//               </div>
//             </Collapse>
//           </li> */}


//          {/*  <li className={this.isPathActive('/forms') || this.state.formMenuOpen ? 'active' : null}>
//           <a onClick={() => this.setState({ formMenuOpen: !this.state.formMenuOpen })} data-toggle="collapse">
//             <p>Forms
//             </p>
//           </a>
//           <Collapse in={this.state.formMenuOpen}>
//             <div>
//               <ul className="nav">
//                 <li className={this.isPathActive('/forms/regular-forms') ? 'active' : null}>
//                   <Link to="/forms/regular-forms">Regular Forms</Link>
//                 </li>
//                 <li className={this.isPathActive('/forms/extended-forms') ? 'active' : null}>
//                   <Link to="/forms/extended-forms">Extended Forms</Link>
//                 </li>
//                 <li className={this.isPathActive('/forms/validation-forms') ? 'active' : null}>
//                   <Link to="/forms/validation-forms">Validation Forms</Link>
//                 </li>
//               </ul>
//             </div>
//           </Collapse>
//         </li>


//           <li className={this.isPathActive('/tables') || this.state.tableMenuOpen ? 'active' : null}>
//           <a onClick={() => this.setState({ tableMenuOpen: !this.state.tableMenuOpen })} data-toggle="collapse">
//             <p>Tables <b className="caret"></b></p>
//           </a>
//           <Collapse in={this.state.tableMenuOpen}>
//             <div>
//               <ul className="nav">
//                 <li className={this.isPathActive('/tables/regular-tables') ? 'active' : null}>
//                   <Link to="/tables/regular-tables">Regular Table</Link>
//                 </li>
//                 <li className={this.isPathActive('/tables/extended-tables') ? 'active' : null}>
//                   <Link to="/tables/extended-tables">Extended Tables</Link>
//                 </li>
//                 <li className={this.isPathActive('/tables/react-bootstrap-table') ? 'active' : null}>
//                   <Link to="/tables/react-bootstrap-table">React Bootstrap Table</Link>
//                 </li>
//               </ul>
//             </div>
//           </Collapse>
//         </li> */}


//       </Accordion>
//     );
//   }

//   isPathActive(path) {
//     return this.props.location.pathname.startsWith(path);
//   }
// }

// export default withRouter(Nav);
