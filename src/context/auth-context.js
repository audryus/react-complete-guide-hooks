import React, {useState} from 'react';

export const AuthContext = React.createContext({
  isAuth: false,
  login: () => {}
}); 

const AuthContextProvider = props => {
  const [autheticated, setAuthenticated] = useState(false);

  const loginHandler = () => {
    setAuthenticated(true);
  }

  return (
    <AuthContext.Provider value={{login: loginHandler, isAuth: autheticated }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider;