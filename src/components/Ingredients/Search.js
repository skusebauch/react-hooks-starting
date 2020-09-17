import React, { useState, useEffect } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  // that we can set the dependencies - that only if these props of onLoadIngredients change - the useEffect is executed(2nd arguement)
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState("");

  // execute after onChange at Input (with the second argument)
  useEffect(() => {
    const query =
      enteredFilter.length === 0
        ? ""
        : `?orderBy="title"&equalTo="${enteredFilter}"`;
    fetch(
      "https://react-hooks-update-6bc88.firebaseio.com/ingredients.json" + query
    )
      .then((response) => response.json())
      .then((responseData) => {
        const loadedIngredients = [];
        for (const key in responseData) {
          loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount,
          });
        }
        onLoadIngredients(loadedIngredients);
      });
  }, [enteredFilter, onLoadIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            value={enteredFilter}
            onChange={(event) => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
