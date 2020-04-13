import {
    USER_CHANGE_LANG,
    USER_EVENT_SOUND,
    USER_LOGIN,
    USER_LOGOUT,
    USER_READ_NOTIFY,
    USER_SETUP
} from '../actions/userActions'
import ls from 'local-storage'
import i18n from '../i18n';
import moment from 'moment';
import dingdong from '../assets/sounds/dingdong.mp3';

const defaultUserInfo = {
    lang: 'zh-TW',
    username: '',
    image: 'http://demos.creative-tim.com/light-bootstrap-dashboard-pro/assets/img/default-avatar.png',
    id: 0,
    isLogin: false,
    lastLogin: '',
    refreshSession: '',
    role: 0,
    session: '',
    credit: 0
    // image:'../assets/images /user_trans_icon.png'
};

export default function reducer(state = {user: defaultUserInfo}, action) {
    let user, userInfo, result
    // console.log(action)
    switch (action.type) {
        case USER_LOGIN:
            userInfo = action.userInfo
            user = Object.assign({}, state, {
                ...userInfo
            })
            // console.log(user)
            ls.set('user', user)
            // window.location.reload()
            window.location.assign('/')
            return user


        case USER_SETUP:
            userInfo = action.userInfo
            user = Object.assign({}, state, {
                ...userInfo
            })
            return user


        case USER_CHANGE_LANG:
            result = Object.assign({}, state,
                {
                    lang: action.lang,
                })
            ls.set('user', result)
            i18n.changeLanguage(action.lang);
            return result;

        case USER_READ_NOTIFY:
            result = Object.assign({}, state,
                {
                    event_type: action.event_type, // 通知類型
                    related_id: action.related_id, // 通知事件中->該事件的id
                    event_id: action.event_id, // 通知事件id
                    sub_deposit_id: action.sub_deposit_id // 通知事件id
                })
            return result;

        case USER_EVENT_SOUND:
            if (state.soundPlayTime == null) {
                let audio = new Audio(dingdong)
                audio.play()
                return result = Object.assign({}, state,
                    {
                        soundPlayTime: moment().add(1, "minutes"),
                    })
            } else if (action.soundPlayTime.isAfter(state.soundPlayTime)) {
                // console.log('play')
                let audio = new Audio(dingdong)
                audio.play()
                // console.log('play end')
                return result = Object.assign({}, state,
                    {
                        soundPlayTime: action.soundPlayTime.add(1, "minutes"),
                    })
            }
            return state;

        case USER_LOGOUT:
            ls.remove('user');
            // ls.set('errCode', '')
            window.location.assign('/#/login')
            // window.location.reload()
            return state;
            // break;
        default:
            return state;
    }
}
