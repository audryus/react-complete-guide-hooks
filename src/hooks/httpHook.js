import {useReducer, useCallback} from 'react';

const initialState = { loading: false, error: null, data: null, extra: null, ident: null};

const httpReducer = (state, action) => {
  switch(action.type) {
    case 'SEND':
      return {error: null, loading: true, data: null, extra: null, ident: null}
    case 'RESPONSE':
      return {...state, data: action.data, extra: action.extra, ident: action.ident}
    case 'SUCCESS':
      return {...state, loading: false}
    case 'ERROR':
      return {loading: false, error: action.error}
    case 'CLEAR':
      return initialState
    default:
      throw new Error('Oops');
  }
}

const useHttp = () => {
  const [stateHttp, dispatchHttp] = useReducer(httpReducer, initialState);

  const clear = () => dispatchHttp({type: 'CLEAR'},  []);

  const sendReq = useCallback((url, method, body, reqExtra, reqIdent) => {
    dispatchHttp({type: 'SEND'});
    //process.env.REACT_APP_FIRE_BASE_DB + `/hookIngredients/${id}.json`
    fetch(url, {
      method: method,
      body: body,
      headers: { 'Content-Type': 'applicaton/json' }
    }).then(res => {
      return res.json();
    }).then(data => {
      console.log('meu dta', reqExtra)
      dispatchHttp({type: 'RESPONSE', data: data, extra: reqExtra, ident: reqIdent});
      dispatchHttp({type: 'SUCCESS'});
    }).catch(err => {
      dispatchHttp({type: 'ERROR', error: err.message});
    })
  }, [])

  return {
    loading: stateHttp.loading,
    error: stateHttp.error,
    data: stateHttp.data,
    sendReq: sendReq,
    extra: stateHttp.extra,
    reqIdent: stateHttp.ident,
    clear: clear, 
  };
}

export default useHttp;
