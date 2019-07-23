'use strict';

//for interacting with the api
//eslint-disable-next-line no-unused-vars
const api = (function() {

  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/richard';

  const getItems = function() {
    return fetch(`${BASE_URL}/bookmarks`);
  };

  const createItem = function(newBookmark) {
    return fetch(`${BASE_URL}/bookmarks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: newBookmark,
    });
  };

  const deleteItem = function(id) {
    return fetch(`${BASE_URL}/bookmarks/${id}`, {
      method: 'DELETE',
    });
  };
  
  return {
    getItems,
    createItem,
    deleteItem,
  };

})();