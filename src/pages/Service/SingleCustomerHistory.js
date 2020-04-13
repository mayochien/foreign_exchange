import React, { Component } from 'react';
import { SERVICE_TYPE } from '../../const';
import { MdPhotoLibrary } from "react-icons/md";
import { apiGetImage } from '../../services/apiService';
// import SwitchControl from '../../components/Switch'
import { withTranslation } from 'react-i18next';
// import Modal from "react-responsive-modal";
import ImagePopup from"./ImagePopup";
import MsgQAPopup from"./MsgQAPopup";
import styled from 'styled-components'
import { FaSearch } from "react-icons/fa";


class SingleCustomerHistory extends Component {

  state = {
    modifiable: false,
    state_remark: '',
    customerQuestionList: [],
    imageUrl:'',
    state_pages_total:0,
    activePage:1,
    success_messege: '',
    alert_messege: '',
    isShowResultModal:false
  };

  viewPhoto = async(id) => {
    try {
      let result_getImage = await apiGetImage(id);
      this.setState({
        imageUrl: result_getImage.data.data,
      })
    } catch(err) {
      console.log(err);
    }
  }

  onClickEdit = (remark) => {
    this.setState({
      modifiable:true,
      state_remark: remark || '',
    })
  }
  showSuccess = (msg) =>{
    // let {t} = this.props
    this.setState({
      success_messege: <span>{msg}</span>
    })
    setTimeout(() => {
      this.setState({
        isShowResultModal: false,
      })
    }, 1500)
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

  cancelEdited= (id) => {
    this.setState({
      modifiable: false,
    });
  }

  onCloseAllModal = () => {
    this.setState({
      isShowResultModal: false,
    });
  }

  // ********** 點通知該行發亮 **********
  showActiveLine = () => {
    this.setState({
      lineActiveNow:true,
      hasActiveOnce:true
    },()=>{
      setTimeout(() => {
        this.setState({
          lineActiveNow:false
        })
      }, 2800);
    })
  }

  componentDidMount(){
    if(this.props.data.id===this.props.path_id){
      this.showActiveLine()
    }
  }
  
  componentWillReceiveProps(nextProps){
    // id不同時，把點擊過歸零
    if(this.props.path_id !== nextProps.path_id){
      this.setState({
        hasActiveOnce:false
      })
    }
    //id相同，但尚未點選過該通知時，要閃爍
    // console.log(this.props.data.id,nextProps.path_id)
    if(this.props.data.id === nextProps.path_id
      && this.state.hasActiveOnce === false){
      this.showActiveLine()
    }
  }

  render() {
    const { t ,data, subData, refreshData } = this.props;
    // const { modifiable } = this.state;

    return (
      <tr className={this.state.lineActiveNow? "tr-active":""}>
        <td>{data.id}</td>
        <td>{data.create_datetime}</td>
        <td>{t(SERVICE_TYPE[data.service_type])}</td>
        <td>{data.username}</td>

        {/* 看上傳的單據 */}
        {(data.image_id !== 0 &&  data.image_id !== null) &&
          <td>
            <VerifyPhoto className="table-small-btn class-primary-text-color" htmlFor={`CustomerImage${data.image_id}`}
              onClick={this.viewPhoto.bind(this, data.image_id)}>
              <MdPhotoLibrary/>
            </VerifyPhoto>
          </td>
        }
        {(data.image_id === 0 || data.image_id === null) &&  <td><span>No Image</span></td>}

        {/* 看客訴內容 */}
        <td>
          <VerifyPhoto className="table-small-btn class-primary-text-color" htmlFor={`CustomerMsg${data.id}`}>
            <FaSearch/>
          </VerifyPhoto>
        </td>
    
        {/*  -------- PopUp 看照片 -------- */}
        <ImagePopup
          imageData={this.state.imageUrl}
          imageId={data.image_id}
          ticketId={data.id}
        />
          {/*  -------- PopUp 看客訴內容 -------- */}
          <MsgQAPopup
            data={data}
            subData={subData}
            refreshData={refreshData}
          />
      </tr>
    );
  }
}

export default withTranslation()(SingleCustomerHistory);


const VerifyPhoto = styled.label`
margin: 0 auto;
width: 24px;
display: flex;
align-items: center !important;
justify-content: center !important;
padding: 3px 4px !important;
border-radius: 3px;
border:none;
background: $btn-bg-color ;
color: $primary-text-color ;
font-size: 8px !important;
font-weight: bold;
letter-spacing: 0.5px;
transition: .2s;
svg{
  width: 14px;
  height: 14px;
  color: $primary-text-color ;
}
&:hover{
  cursor:pointer;
  background: $btn-bg-hover-color ;
  color:$primary-text-active-color ;
}
&:focus{
  outline: none;
  background: $btn-bg-hover-color ;
  color:$primary-text-active-color ;
}
&:active{
  background: $btn-bg-hover-color ;
  color:$primary-text-active-color ;
}
`;
