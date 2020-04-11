import React, {useContext} from 'react';

import Ingredients from './components/Ingredients/Ingredients';
import Auth from './components/Auth';
import {AuthContext} from './context/auth-context';


const App = props => {
  const auth = useContext(AuthContext);

  let content = <Auth/>
  if (auth.isAuth) {
    content = <Ingredients/>
  }
  return content;
};

export default App;
