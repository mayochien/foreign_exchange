import {all} from 'redux-saga/effects'


/*------------------------------------------------------------------------------
            rootSaga
 ------------------------------------------------------------------------------*/

export default function* rootSaga() {
    yield all([
        // fork(watchSportFilterLeague),
    ])
}
