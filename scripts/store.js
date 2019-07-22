'use strict';
/*global api*/

//store is for acting on bookmark items
//eslint-disable-next-line no-unused-vars
const store = (function() {

  let addNewBookmark = false;

  let bookmarks = [];

  const addBookmark = function(item) {
    this.bookmarks.push(item);
  };

  const deleteBookmark = function(id) {
    this.bookmarks.filter(bookmarkId => bookmarkId !== id);
  };

  return {
    addNewBookmark,
    bookmarks,
    addBookmark,
    deleteBookmark,
  };
})();