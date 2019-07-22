'use strict';

/*global store $ api*/

//event handlers and update html
//eslint-disable-next-line no-unused-vars
const bookmarks = (function () {
  
  const render = function() {
    console.log('render ran');
    let bookmarks = [ ...store.bookmarks ];
    if (store.addNewBookmark) {
      const mainHtml = addItemHtml();
      $('main').html(mainHtml);
    } else {

      //deal with expanded

      let mainHtml = '';//get app buttons and bookmarks html
    }
  };

  const eventBinder = function() {
    handleAddNew();
    handleAddBookmark();
  };
  
  //On main page, goes to add bookmark page when pressed
  const handleAddNew = function() {
    $('main').on('click', '.js-add-new', e => {
      e.preventDefault();
      console.log('Add Bookmark Button Pressed');
      store.addNewBookmark = true;
      render();
    });
  };

  //On add bookmake page, adds the bookmark when pressed
  const handleAddBookmark = function() {
    $('main').on('click', '.js-add-bookmark', e => {
      e.preventDefault();
      console.log('Add Bookmark Form Button Pressed');
      store.addNewItem = false;
      api.createItem(serializeJson($('.add-bookmark-form')[0]))
        .then(res => res.json())
        .then(item => {
          store.addBookmark(item);
          render();
        });
    });
  };

  const serializeJson = function(form) {
    const formData = new FormData(form);
    const o = {};
    formData.forEach((val, name) => o[name] = val);
    o.expand = false;
    return JSON.stringify(o);
  };

  const addItemHtml = function() {
    return `
    <form class="add-bookmark-form">
        <label for="title">Title:</label>
        <input type="text" name="title" class="js-title-entry" required>
        <label for="url">URL:</label>
        <input type="url" name="url" class="js-url-entry" required>
        <label for="desc">Description:</label>
        <input type="text" name="desc" class="js-discription-entry" required>
        <label for="rating">Rating</label>
        <input type="number" name="rating" list="numbers" class="js-rating-entry" required>
        <datalist id="numbers">
                <option value="5">
                <option value="4">
                <option value="3">
                <option value="2">
                <option value="1">
        </datalist>
        <button type="submit" class="js-add-bookmark">Add Item</button>
    </form>`;
  };

  return {
    render,
    eventBinder,
  };
})();

