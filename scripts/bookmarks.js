'use strict';

/*global store $ api*/

//event handlers and update html
//eslint-disable-next-line no-unused-vars
const bookmarks = (function () {
  
  const render = function() {
    console.log('render ran');
    let bookmarks = [ ...store.bookmarks ];
    if (store.addNewBookmark) {
      $('.app-buttons').html('');
      $('.add-bookmarks').html(getAddBookmarkHtml());
      $('.bookmarks').html('');
    } else {

      //deal with expanded
      
      $('.app-buttons').html(getAppButtonHtml()); 
      $('.add-bookmarks').html('');
      $('.bookmarks').html(getBookmarksHtml(bookmarks));
      
    }
  };

  const eventBinder = function() {
    handleAddNew();
    handleAddBookmark();
    handleDeleteBookmark();
  };

  const onStart = function() {
    api.getItems()
      .then(res => res.json())
      .then(bookmarkList => {
        bookmarkList.forEach(bookmark => store.addBookmark(bookmark));
        render();
      } );
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
      store.addNewBookmark = false;
      api.createItem(serializeJson($('.add-bookmark-form')[0]))
        .then(res => res.json())
        .then(item => {
          item.expand = false;
          store.addBookmark(item);
          render();
        });
    });
  };

  const handleDeleteBookmark = function() {
    $('main').on('click', '.js-delete-bookmark', e=> {
      e.preventDefault();
      console.log('Delete Bookmark Button Pressed');
      const id = $(e.target).closest('li').data('id');
      api.deleteItem(id)
        .then(() => {
          store.deleteBookmark(id);
          render();
        });
      //update the store
      //render
    });
  };

  const serializeJson = function(form) {
    const formData = new FormData(form);
    const o = {};
    formData.forEach((val, name) => o[name] = val);
    return JSON.stringify(o);
  };

  const getAppButtonHtml = function() {
    return `
    <form class="js-app-form">
        <button type="submit" class="js-add-new">Add Bookmark</button>
        <button type="submit" class="js-sort">Sort by Rating</button>
    </form>`;
  };

  const getAddBookmarkHtml = function() {
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

  const getBookmarksHtml = function(bookmarks) {
    return bookmarks.map(bookmark => {
      console.log(bookmark);
      let stars = '';
      for (let i=0; i<5; i++) {
        console.log(bookmark.rating + ' ' + i);
        if(i < bookmark.rating) {
          stars += '<span class="fa fa-star checked"></span>';
          console.log('checked');
        }
        else {
          stars += '<span class="fa fa-star"></span>';
        }
      }
      return `
        <li data-id=${bookmark.id}>
            <div data-id=${bookmark.id}>${bookmark.title}</div>
            ${stars}
            <button type="submit" class="js-expand-bookmark">Expand</button>
            <button type="submit" class="js-delete-bookmark">Delete</button>
        </li>`;
    });
  };

  return {
    render,
    eventBinder,
    onStart,
  };
})();

