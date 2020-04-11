import React, {useReducer, useEffect, useCallback, useMemo} from 'react';

import ErrorModal from '../UI/ErrorModal';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList'
import Search from './Search';
import useHttp from '../../hooks/httpHook';

const ingredientReducer = (current, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...current, action.ingredient]
    case 'DELETE':
      return current.filter(ing => ing.id !== action.id);
    default:
      throw new Error('Oops');
  }
}

const Ingredients = () => {
  const [ingredients, dispath] = useReducer(ingredientReducer, []);
  const {loading, error, data, sendReq, extra, reqIdent, clear } = useHttp();
  
  useEffect(() => {
    if (!loading) {
      switch (reqIdent) {
        case 'ADD':
          dispath({ type: 'ADD', ingredient: { id: data.name, ...extra}})
          break;
        case 'REMOVE':
          dispath({type: 'DELETE', id: extra });
          break;
        default:
          break;
      }
    }
  }, [data, extra, reqIdent, loading]);

  const addIngredientHandler = useCallback(ingredient => {
    sendReq(process.env.REACT_APP_FIRE_BASE_DB + '/hookIngredients.json',
      'POST', JSON.stringify(ingredient), ingredient, 'ADD')
  }, [sendReq]);

  const removeIngredientHandler = useCallback(id => {
    sendReq(process.env.REACT_APP_FIRE_BASE_DB + `/hookIngredients/${id}.json`,
      'DELETE', null, id, 'REMOVE');
  }, [sendReq]);

  const filterIngredientsHandler = useCallback((filteredIngredients) => {
    dispath({ type: 'SET', ingredients: filteredIngredients})
  }, [])

  const ingredientList = useMemo(() => {
    return (<IngredientList ingredients={ingredients} onRemoveItem={removeIngredientHandler}/>)
  }, [ingredients, removeIngredientHandler])

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={loading} />

      <section>
        <Search onLoadIngredients={filterIngredientsHandler}/>
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
