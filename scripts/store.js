'use strict';
/*global api*/

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
    console.log(id);
    let bookmark = this.findById(id);
    bookmark.expand = !bookmark.expand;
    //this.findById(id).expand = !this.findById(id).expand;
    console.log(this.findById(id).expand);
    //console.log(bookmarks);
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