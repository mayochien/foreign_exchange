import React, { Component } from 'react';
import styled from 'styled-components'
import { withTranslation } from 'react-i18next';
import { apiPostReplyCustomerMsg, } from '../../services/apiService';
import Modal from "react-responsive-modal";
import { MdDone, MdReportProblem } from "react-icons/md";
import classNames from "classnames";

export class MsgQAPopup extends Component {

  state = {
    modifiable: false,
    success_messege: '',
    alert_messege: '',
    isShowResultModal: false,
    messageArea: '',
    closeId: '',
    isRepeatClickStop:false,
  }

  onMessageChange = e => {
    this.setState({
      messageArea: e.target.value
    })
  }

  stopRepeatClick = () => {
    this.setState({
      isRepeatClickStop:true,
    })
    setTimeout(()=>{
      this.setState({
        isRepeatClickStop:false,
      })
    },2000)
  }

  submitReplyMsg = async(ticketId) => {
    const { refreshData,t } = this.props;
    const {messageArea} = this.state;
    const postData = {
      message: messageArea
    }

    this.stopRepeatClick()

    if(messageArea === ''){
      this.showAlert(t('app.please_check_required_fields'))
    }else{
      this.setState({
        alert_messege: null
      })
      try {
        let resp = await apiPostReplyCustomerMsg(ticketId, postData);
        if(resp.data.code === 1) {
          this.setState({
            isShowResultModal:true
          })
          this.showSuccess()
          refreshData();
          setTimeout(() => {
            this.setState({
              messageArea: ''
            })
          }, 1000);
        }else{
          this.showAlert(t('app.fail'))
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  showSuccess = () =>{
    let {t} = this.props
    this.setState({
      success_messege: <span>{t('app.success')}</span>
    })
    setTimeout(() => {
      this.setState({
        isShowResultModal: false,
      })
    }, 1000)
  }

  showAlert = (msg) =>{
    // let {t} = this.props
    this.setState({
      isShowResultModal: true,
      success_messege: null
    })
    this.setState({
      alert_messege: <span>{msg}</span>
    })
    setTimeout(() => {
      this.setState({
        isShowResultModal: false,
      })
    }, 1500)
  }


  escFunction = (event) => {
    const { data } = this.props;
    const msgBoxEl = document.querySelector(`#CustomerMsg${data.id}`);

    if(event.keyCode === 27 && msgBoxEl) {
      msgBoxEl.checked = false;
      this.setState({
        img_zoom_in: false
      })
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.escFunction);

    this.setState({
      closeId:this.props.data.id
    })
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.escFunction);
  }


  render() {
    const {data, subData, t } = this.props;
    // console.log(data, subData)

    return (
      <React.Fragment>
        <PopupTrigger id={`CustomerMsg${data.id}`} type="checkbox"/>
        <PopupBackdrop/>

        <PopupBox>
        <PopupBoxWrapper>
            <div className="QAMsgBox">
              <CustomerUp>
                <span className="MsgQABox-text">{t('app.user')}:&nbsp;{data.username} </span>
                {data.status === 0 && <span className="MsgQABox-text">{t('app.create_datetime')}:&nbsp;{data.create_datetime}</span>}
                {data.status === 10 && <span className="MsgQABox-text">{t('app.create_datetime')}:&nbsp;{data.create_datetime}</span>}
                {data.status === 90 && <span className="MsgQABox-text">{t('app.create_datetime')}:&nbsp;{data.create_datetime}</span>}
              </CustomerUp>

              <div className="MsgBox-new">  {/*  <-- class 沒用到 */}
                <span>{t('app.title')}:&nbsp;{data.title}</span>
                <span className="MsgBox-text">{t('app.content')}:&nbsp;{data.message}</span>
              </div>
            </div>

          <div>
            {data.status === 0 && subData.map((item, index) => (
              <div
                className={classNames("QAMsgBox", {
                  "QAMsgBox_reply": data.user_id !== item.messenger_id
                })}
              >
                <div  style={{display: "flex", flexDirection:"row", justifyContent: "space-between"}}>
                  <span className="MsgQABox-text"> {data.user_id === item.messenger_id ? 
                    <span>{t('app.user')} :&nbsp;</span>: <span>{t('app.support')} :&nbsp;</span>} {item.username}
                  </span>
                  <span className="MsgQABox-text">{t('app.create_datetime')}:&nbsp;{item.create_datetime}</span>
                </div>
                <span className="MsgBox-text">{item.message}</span>
              </div>
              ))
            }
            {data.status !== 0 && subData.map((item, index) => (
              <div
                className={classNames("QAMsgBox", {
                  "QAMsgBox_reply": data.user_id !== item.messenger_id
                })}
              >
                <div  style={{display: "flex", flexDirection:"row", justifyContent: "space-between"}}>
                  <span className="MsgQABox-text"> {data.user_id === item.messenger_id ? 
                    <span>{t('app.user')} :&nbsp;</span>: <span>{t('app.support')} :&nbsp;</span>} {item.username}
                  </span>
                  <span className="MsgQABox-text"> {data.user_id === item.messenger_id ? 
                    <span>{t('app.create_datetime')}:&nbsp;</span>: <span>{t('app.reply_time')} :&nbsp;</span>} {item.create_datetime}
                  </span>
                </div>
                <span className="MsgBox-text">{item.message}</span>
              </div>
              ))
            }
            {data.status === 90 &&
              <ActionBtn>
                <label className="popup-action-btn-down" htmlFor={`CustomerMsg${data.id}`}>{t('app.close')}</label>
              </ActionBtn>
            }

            {data.status === 0 &&
              <div style={{position:"relative",width:"90%", top:"7%", left:"5%"}}>
                <hr/>
                <div>
                  <h5>{t('app.reply')} :</h5>
                  <MessageArea
                    onChange={this.onMessageChange}
                    value={this.state.messageArea}
                    placeholder=""
                  />
                  </div>
                  <ActionBtn>
                    <label className="popup-action-btn-down modal-action-button" htmlFor={`CustomerMsg${data.id}`}>
                      {t('app.close')}
                    </label>
                    <button type="button" 
                     className="popup-action-btn-down modal-action-button" 
                     onClick={this.submitReplyMsg.bind(this, data.id )}>
                      {t('app.submit')}
                    </button>
                </ActionBtn>
              </div>
            }

            {data.status === 10 &&
              <div style={{position:"relative",width:"90%", top:"7%", left:"5%"}}>
                <hr/>
                <div>
                  <h5>{t('app.reply')} :</h5>
                  <MessageArea
                    onChange={this.onMessageChange}
                    value={this.state.messageArea}
                    placeholder=""
                  />
                  </div>
                  <ActionBtn>
                    <label className="content label popup-action-btn-down" htmlFor={`CustomerMsg${data.id}`}>{t('app.close')}</label>
                    <button type="button" 
                      className="content label popup-action-btn-down"  
                      onClick={this.state.isRepeatClickStop? '':()=>this.submitReplyMsg(data.id)}>
                      {t('app.submit')}
                    </button>
                </ActionBtn>
              </div>
            }
            </div>
          </PopupBoxWrapper>

          <Modal open={this.state.isShowResultModal}
            onClose={this.onCloseAllModal} closeIconSize={0}>
            <div className="modal-inside">
              <div className="modal-body ">
                {this.state.success_messege
                ?<span className="text-green">
                  <MdDone/>&nbsp;{this.state.success_messege}
                  </span>
                  :null
                }

                {this.state.alert_messege
                ?<span className="text-red">
                 <MdReportProblem/>&nbsp;{this.state.alert_messege}
                  </span>
                  :null
                }
              </div>
            </div>
          </Modal>

        </PopupBox>
      </React.Fragment>
    );
  }
}

export default withTranslation()(MsgQAPopup);

const PopupBackdrop = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  color: #3c4246;
  position: fixed;
  display: none;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  z-index: 999;
`;

const PopupBox = styled.div`
  width: 100%;
  max-width: 1100px;
  min-height: 300px;
  max-height: 70%;
  background-color: #f3f4f5;  ;
  color: #3c4246;
  position: fixed;
  display: none;
  top: 16%;
  left: 27%;
  z-index: 999;
  border: 1px solid #443816;
  border-radius: 5px;
  align-items: flex-start;
  justify-content: center;
  overflow-y: scroll;
  @media (max-width: 1580px) {
    max-width: 1000px;
    left: 24%;
  }
  @media (max-width: 1450px) {
    max-width: 945px;
    left: 22%;
  }
  @media (max-width: 1300px) {
    max-width: 920px;
    left: 18%;
  }
  @media (max-width: 1024px) {
    max-width: 825px;
    min-height: 500px;
    left: 8%;
  }
  @media (max-width: 898px) {
    max-width: 740px;
    left: 9%;
  }
  @media (max-width: 585px) {
    max-width: 480px;
    left: 9%;
  }
  @media (max-width: 430px) {
    max-width: 345px;
    min-height: 40%
    left: 10%;
    top: 18%
  }
  @media (max-width: 375px) {
    max-width: 330px;
    min-height: 47%
    left: 6%;
    top: 18%
}
`;
const PopupBoxWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 20px 0;
  width: 90%
  color: #3c4246;
  @media (max-width: 430px) {
    max-width: 343px;
    left: 3%;
    top: 3%;
  }
  @media (max-width: 375px) {
    max-width: 330px;
    left: 3%;
    top: 3%;
}
`;

const CustomerUp = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: #3c4246;
  @media (max-width: 430px) {
    flex-direction: column;

  }
  @media (max-width: 375px) {
    flex-direction: column;
}
`;

const PopupTrigger = styled.input`
  display: none;
  &:checked + ${PopupBackdrop} {
    display: flex;
  }
  &:checked + ${PopupBackdrop} +${PopupBox} {
    display: flex;
  }
`;

const MessageArea = styled.textarea`
  width: 100% !important;
  height: 150px !important;
  padding: 6px 16px;
  box-sizing: border-box;
  border: none;
  border-radius: 18px;
  background-color: $table-header-bg-color ;
  color: #3c4246;
  font-size: 14px;
  resize: none;
`
const ActionBtn = styled.div`
  display: flex;
  justify-content:space-around;
  width: 23%;
  margin: 10px auto;
  text-align: center;
  @media (max-width: 430px) {
    top:20px;
  }
  @media (max-width: 375px) {
    top:20px;
}
`;

// const ZoominBtn = styled.button`
//   margin: 12px;
//   background: transparent;
//   border: none !important;
//   transition:0.2s;
//   padding: 0;
//   width: 20px;
//   font-size: 24px;
//   color: #c29f40;
//   &:hover{
//     cursor: pointer;
//     color: $primary-color;
//     transform: scale(1.3);
//   }
//   &:focus{
//     outline: none;
//   }
// `;


