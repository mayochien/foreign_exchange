import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import $ from "jquery";
import i18n from 'i18next';
import {withTranslation} from 'react-i18next';
import { apiGetEvent, 
         apiGetNotReadEventTotal,
         apiPutAllEventRead,
         apiGetOnlineCounts,
         apiGetBankerProfile //取得email驗證狀態用
        } from '../../services/apiService'
import { MdInfoOutline,MdMenu,MdPlaylistAddCheck } from "react-icons/md";
import { FiAlertCircle } from "react-icons/fi";
import { IoMdSettings } from "react-icons/io";
import HeaderEventItem from '../../containers/Main/HeaderEventItemContainer';
import { Link } from 'react-router-dom'
import ls from "local-storage"
import Modal from "react-responsive-modal";
import moment from 'moment';



class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      languageMenuOpen: false,
      notificationMenuOpen: false,
      totalEventList:[],
      nextPageNumber:2,
      newPageNoData:false,
      time:50*60,
      running: true,
      isShowTimeoutModal:false,
      onlinePeople:'0',
      isShowVerifieEmaildModal:false,
      isEmailVerified:false,
    }
    this.countdownStart();
  }

  
  showLogoutModal =()=> {
    this.setState({
      isShowTimeoutModal:true //開啟登出彈框
    },()=>ls.clear())
  }

  cnofirmToLogOut = () => { //登出
    window.location.assign('/')
    window.location.reload()
  }

  countdownStart() {
    this.timer = setInterval(() => {
      const newTime = this.state.time - 1;
      this.setState(
        {time: newTime >= 0 ? newTime : 0}
      );
    }, 1000);
  }

  format(time) {
    const date = new Date(time * 1000)
    let mm = date.getUTCMinutes()
    let ss = date.getSeconds()
    if (mm < 10) {mm = "0" + mm}
    if (ss < 10) {ss = "0" + ss}
    return  mm + ":"+ ss;
  }

  clickAllPageToCountdownReset = () => { //點擊全畫面，重新計算倒數時間
    let that = this;
    $(".body-page-div").click(function(){
      that.setState({
        time: 50*60
      });
    });
  }

  toggleLanguage = () => {
    this.setState({
      languageMenuOpen: !this.state.languageMenuOpen
    })
  }

  changeLang = (lang) => {
    const {dispatch, actions} = this.props;
    dispatch(actions.changeLang(lang));
  }

  toggleRightBar = () => {
    $('.body-page-div').toggleClass('nav-open')
  }
  
  toggleNotification = () => {
    this.setState({
      notificationMenuOpen: !this.state.notificationMenuOpen
    })
    //點擊鈴鐺也要重新抓API
    this.getInitialData() 
    this.getNotReadCount()
  }

  // ---------- api:get 取得未讀通知總數(跨頁) ----------
  getNotReadCount = async() => {
    try {
      let res = await apiGetNotReadEventTotal()
      if(res.data.code===1){
        this.setState({
          notReadEventTotal:res.data.data.total_events
        }, ()=>{res.data.data.total_events>0&& this.props.actions.eventSoundPlay(moment())})
      }
    } catch(err) {
      console.log(err);
    }
  }

  // ---------- api:get 取得在線人數 ----------
  getOnlineUsers = async() => {
    try {
      let res = await apiGetOnlineCounts()
      if(res.data.code===1){
        this.setState({
          onlinePeople:res.data.data.online_counts
        })
      }
    } catch(err) {
      console.log(err);
    }
  }

  // ---------- api:get 接收(第一頁)的通知 ----------
  getInitialData = async() => {
    try {
      let res = await apiGetEvent(1)
      if(res.data.code===1){
        this.setState({
          totalEventList:res.data.data.paginate_data,
          nextPageNumber:2,
        })
      }
      else{
        console.log('get notification error')
      }
    } catch(err) {
      console.log(err);
    }
  }

  // ---------- api:get 載入更多通知 ----------
  onClickLoadMore = async() => {
    try {
      let res = await apiGetEvent(this.state.nextPageNumber)
      if(res.data.code===1){
        if(res.data.data.paginate_data.length>0){ //下一頁有資料才繼續加入
          let totalEventListOld = this.state.totalEventList //保存先前的資料
          this.setState({
            totalEventList:totalEventListOld.concat(res.data.data.paginate_data),
            nextPageNumber:this.state.nextPageNumber+1 //
          },()=>{console.log('下一頁的頁數變成:',this.state.nextPageNumber)})
        }
        else{
          console.log('下一頁已經沒資料')
          this.setState({
            newPageNoData:true
          })
        }
      }
      else{
        console.log('get notification error')
      }
    } catch(err) {
      console.log(err);
    }
  }

  // ---------- api:put 已讀所有通知 ----------
  onClickReadAll = async() =>{
    try {
      let res = await apiPutAllEventRead()
      if(res.data.code===1){
        this.getInitialData()
        this.getNotReadCount()
        console.log('已讀所有成功')
      }
    }catch (err) {
      console.log(err)
      console.log('已讀所有失敗')
    }
  }

  getVerifiedStatus = async() => { //判斷依妹友認證過了沒
    try {
        let res = await apiGetBankerProfile()
        if(res.data.code===1){
          setTimeout(() => { // 3/2 改寫法:3秒以前離開首頁，就不顯示彈框
            this.setState({
              isEmailVerified:res.data.data.is_email_verified
            },()=>{this.showVerifyAlert()})
          }, 4000);
        }
    } catch (err) {
      console.log(err);
    }
  }

  showVerifyAlert = () => {     // 顯示驗證提醒彈出框 ↓↓
    if(this.state.isEmailVerified===false  // 沒驗證過
      // && document.cookie.indexOf("Verified") === -1  // 且 沒有 看過驗證提醒
      && (window.location.hash === "#/" || window.location.hash === "/")
      ){
        this.setState({
          isShowVerifieEmaildModal:true
        })
    }
    else{
      this.setState({
        isShowVerifieEmaildModal:false
      })
    }
  }

  onClickToVerifyEmail = () => { //騙去個人資料、關閉談窗
    document.cookie="hasReadVerifiedAlert=ture"; //點過之後，存取到cookie
    window.location.href="/#/banker-profile"
    // console.log('direct to a profile page ->');
    this.setState({
      isShowVerifieEmaildModal:false
    })
  }

  onClickToMyProfile= () => { //連結至個人資料
    window.location.href="/#/banker-profile"
  }

  componentDidMount(){
    this.clickAllPageToCountdownReset()
    this.getInitialData()
    this.getNotReadCount()
    // this.getOnlineUsers()
    this.getVerifiedStatus()
    this.refreshNotReadCount = setInterval(()=>{
      this.getNotReadCount()
      // console.log('刷新-通知總數',new Date().getMinutes(),':',new Date().getSeconds())
    },8000)
    // console.log('Head重新載入')
  }
      
  componentDidUpdate(prevProps, prevState) {
    if(this.state.running !== prevState.running){
      switch(this.state.running) {
        case true:
          this.countdownStart();
        break;
        default:
      }
    }
    if(this.state.time===0 && this.state.isShowTimeoutModal===false){ //時間=0 還要加上別的判斷是才不會重複setState
      this.showLogoutModal()
    }
  }

  componentWillUnmount(){
    clearInterval(this.refreshNotReadCount);
  }

  getDerivedStateFromProps(prevProps, prevState){  // 取代 componentWillReceiveProps
    this.getVerifiedStatus()
  }

  render() {
    // console.log('headers this.props:',this.props)
    // console.log('headers this.props:',this.props.user.user)
    // console.log(document.cookie);
    const { t, user } = this.props;
    let { totalEventList, nextPageNumber, newPageNoData } = this.state
    // console.log('下一頁的頁數',this.state.nextPageNumber)
    // console.log(this.state.notReadEventTotal==='0');

    return (
      <Navbar fluid={true} className="navbar-line">
  
        <div  className="navbar-flex">
          
          <div  className="navbar-flex-left">
            
            {/* 收合後的漢堡按鈕 */}
            <Navbar.Header className="hamburger-section">
              <button type="button" className="navbar-toggle hamburger-btn" data-toggle="collapse" onClick={this.toggleRightBar} >
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            </Navbar.Header>

            {/* 國旗 */}
            <div className="language-option">
            <Dropdown isOpen={this.state.languageMenuOpen} toggle={this.toggleLanguage}>
              <DropdownToggle className="dropdownToggle">
                {
                  i18n.language === 'en' &&  <img className="language-img-top"
                  src={require('../../assets/images/flag/english.png')} alt="english"/>
                }
                {
                  i18n.language === 'zh-CN' &&  <img className="language-img-top"
                  src={require('../../assets/images/flag/chinese-s.png')} alt="Chinese.S"/>
                }
                {
                  i18n.language === 'zh-TW' &&  <img className="language-img-top"
                  src={require('../../assets/images/flag/chinese-t.png')} alt="Chinese.T"/>
                }
                <i className="fa fa-angle-down" ></i>
              </DropdownToggle>

              <DropdownMenu>
                <DropdownItem id="language-item" onClick={this.changeLang.bind(this, 'en')}>
                  <img className="language-img"
                  src={require('../../assets/images/flag/english.png')} alt="english"/>
                  {i18n.language === 'en' &&   <span>English</span>}
                  {i18n.language === 'zh-CN' &&   <span>英文</span>}
                  {i18n.language === 'zh-TW' &&   <span>英文</span>}
                </DropdownItem>

                <DropdownItem id="language-item" onClick={this.changeLang.bind(this, 'zh-CN')}>
                <img className="language-img"
                  src={require('../../assets/images/flag/chinese-s.png')} alt="Chinese.S"/>
                    {i18n.language === 'en' &&   <span>Chinese.S</span>}
                    {i18n.language === 'zh-CN' &&   <span>简体中文</span>}
                    {i18n.language === 'zh-TW' &&   <span>簡體中文</span>}
                </DropdownItem>

                <DropdownItem id="language-item" onClick={this.changeLang.bind(this, 'zh-TW')}>
                  <img className="language-img"
                  src={require('../../assets/images/flag/chinese-t.png')} alt="Chinese.T"/>
                    {i18n.language === 'en' &&   <span>Chinese.T</span>}
                    {i18n.language === 'zh-CN' &&   <span>繁体中文</span>}
                    {i18n.language === 'zh-TW' &&   <span>繁體中文</span>}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        {/* ---------- 左側區塊結束 ↑ ---------- */}
        

        {/* ---------- 右側區塊 ↓  ---------- */}
        <div className="navbar-flex-right">
          <Nav pullRight className="header-control-section">

            {/* ---------- 齒輪 連結至個人資料 ↓  ---------- */}
            <NavItem className="my-profile-section" onClick={this.onClickToMyProfile}>
               <IoMdSettings/>
            </NavItem>

            <NavItem className="notify-section" >
              <Dropdown  // ********** 通知下拉選單 **********
                isOpen={this.state.notificationMenuOpen} 
                toggle={this.toggleNotification} 
                className="dropdown-notify"
                >

                <DropdownToggle className="dropdownToggle">
                <i className="pe-7s-bell"></i>
                  {this.state.notReadEventTotal ==='0'
                    || this.state.notReadEventTotal === undefined
                    || totalEventList.length === 0?
                    ''
                    :
                    // ********** 紅色框-新通知數字 **********
                    <div className={this.state.notReadEventTotal.length < 100 ? "bell-count font-under-hundred":"bell-count font-more-than-hundred"}> 
                      {this.state.notReadEventTotal}
                    </div>               
                  }
                </DropdownToggle>

                {totalEventList.length !== 0 ?
                  <DropdownMenu className="dropdown-menu">
                    <div className="dropdown-menu-header">
                      <button className="all-read-btn" 
                       onClick={this.onClickReadAll}>
                         <MdPlaylistAddCheck/>
                        {t('app.mark_all_as_read')}
                      </button>
                    </div>
                
                    <div className="dropdown-menu-body">
                        {totalEventList.map((item,index) => 
                          <HeaderEventItem key={index} {...item}
                          refreshData={()=>this.getInitialData(1)}
                          /> )
                          }
                          {/* 總資料>9筆，
                              && 下一頁有資料 => 才顯示﹝載入更多﹞ */}
                          {totalEventList.length>9 
                           && newPageNoData===false ?
                            <div className="load-more-section">
                              <button className="btn-more"
                               onClick={()=>this.onClickLoadMore()}>
                                 {t('app.load_more')}
                              </button>
                            </div>
                           :
                            // 第2頁以後，
                            // && 下一頁沒資料 => 才顯示﹝沒有更多通知﹞
                           <div className="load-more-section">
                            {nextPageNumber>1
                             && newPageNoData===true ? 
                             <div className="no-more-text">{t('app.no_more_event')}</div>
                             // ↓↓ 當只有一頁，資料未滿10筆時
                             :'' }
                           </div>
                          }
                    </div>
                     
                    <div className="dropdown-menu-footer"> 
                      <Link to="/notification/list" className="see-all">  {/* 查看全部 */}
                        <MdMenu/>{t('app.see_all')}
                      </Link>
                    </div>
                  </DropdownMenu>
                    :
                  <DropdownMenu className="dropdown-menu">
                    <div className="dropdown-menu-no-data">
                      <div className="no-data-icon">
                        <MdInfoOutline/> 
                      </div> 
                       {t('app.no_event')}
                    </div>
                  </DropdownMenu>
                  }
                  
              </Dropdown>

            </NavItem>

            <NavItem className="show-name-section" onClick={this.onClickToMyProfile}>
              {user.user.username}
            </NavItem>

            <NavItem className="logout-btn"
              onClick={this.props.actions.logout}>
              {t('app.logout')}
            </NavItem>
          </Nav>
        </div>

      </div>

      <div className="navbar-under">
        {/* <span className="online-people-box mr-20"> 
          <span className="online-people-text">
            {t('app.online_user')} {this.state.onlinePeople}
          </span>
        </span> */}
        <span className="countdown-box">
          <span className="countdown-text">
            {this.format(this.state.time)} {t('app.logout_after')}
          </span>
        </span>
      </div>

      <Modal open={this.state.isShowTimeoutModal} closeIconSize={0}>
        <div className="modal-inside">
          <div className="warining-icon-section text-center">
            <FiAlertCircle className="FiAlertCircle" />
          </div>
          <div className="modal-body">
            {t('app.action_timeout_login_again')}
          </div>
          <div className="modal-footer-mini">
            <button className="modal-action-button" onClick={this.cnofirmToLogOut}>
              {t('app.confirm')}
            </button>
          </div>
        </div>
      </Modal>

      <Modal open={this.state.isShowVerifieEmaildModal} closeIconSize={0}>
        <div className="modal-inside">
          <div className="warining-icon-section text-center">
            <FiAlertCircle className="FiAlertCircle" />
          </div>
          <div className="modal-body">
          {t('app.please_verify_account_first')}
          </div>
          <div className="modal-footer-mini">
            <button className="modal-action-button"  onClick={this.onClickToVerifyEmail}>
              {t('app.confirm')}
            </button>
          </div>
        </div>
      </Modal>

    </Navbar>
    )
  };
}

export default withTranslation()(Header);