export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';
export const USER_SETUP = 'USER_SETUP';
export const USER_CHANGE_LANG = 'USER_CHANGE_LANG';
export const USER_READ_NOTIFY = 'USER_READ_NOTIFY';
export const USER_EVENT_SOUND = 'USER_EVENT_SOUND';

export function login(userInfo){
    return {
        type: USER_LOGIN,
        userInfo
    }
}

export function setupUser(userInfo){
    return {
        type: USER_SETUP,
        userInfo
    }
}

export function logout(errCode){
    return {
        type: USER_LOGOUT,
        errCode
    }
}

export function changeLang(lang){
    return {
      type: USER_CHANGE_LANG,
      lang,
    }
}

export function readNotifyevent(event_type,related_id,event_id,sub_deposit_id){
    return {
      type: USER_READ_NOTIFY,
      event_type, // 通知類型
      related_id, // 通知事件中->該事件的id
      event_id, // 通知事件id
      sub_deposit_id // 存款子單id
    }
}

export function eventSoundPlay(soundPlayTime){
    return {
        type: USER_EVENT_SOUND,
        soundPlayTime
    }
}