import React,{useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/httpHook';

import './Search.css';

const Search = React.memo(props => {
  const { onLoadIngredients } = props;
  const [filter, setFilter] = useState('');
  const inputRef = useRef();
  const {loading, error, data, sendReq, clear } = useHttp();

  useEffect(() => {
    if (!loading && !error && data) {
      const loadedIngredients = [];
      for (let key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount,
        })
      }
      onLoadIngredients(loadedIngredients);
    }
  }, [loading, error, data, onLoadIngredients]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (filter === inputRef.current.value) {
        let query = '';
        if (filter.trim().length > 0) {
          query = `?orderBy="title"&equalTo="${filter}"`;
        }
        sendReq(process.env.REACT_APP_FIRE_BASE_DB + '/hookIngredients.json' + query, 'GET');
      }
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  },[filter, sendReq, inputRef])

  return (
    <section className="search">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          {loading && <span>Loading ...</span>}
          <input type="text" value={filter} onChange={event => setFilter(event.target.value)} ref={inputRef} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
