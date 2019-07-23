'use strict';


//store is for acting on bookmark items
//eslint-disable-next-line no-unused-vars
const store = (function() {

  let addNewBookmark = false;

  let bookmarks = [];

  const findById = function(id) {
    return this.bookmarks.find(bookmark => bookmark.id === id);
  };

  const addBookmark = function(bookmark) {
    bookmark.expand= false;
    this.bookmarks.push(bookmark);
  };

  const bookmarkExpand = function(id) {
    let bookmark = this.findById(id);
    bookmark.expand = !bookmark.expand;
  };

  const deleteBookmark = function(id) {
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
  };

  return {
    findById,
    addNewBookmark,
    bookmarks,
    addBookmark,
    bookmarkExpand,
    deleteBookmark,
  };
})();