'use strict';


//store is for acting on bookmark items
//eslint-disable-next-line no-unused-vars
const store = (function() {

  let addNewBookmark = false;

  let bookmarks = [];

  const addBookmark = function(item) {
    this.bookmarks.push(item);
  };

  

  //deleteitem

  return {
    addNewBookmark,
    bookmarks,
    addBookmark,
  };
})();