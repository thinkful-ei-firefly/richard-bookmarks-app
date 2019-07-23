'use strict';

/*global store $ api*/

//event handlers and update html
//eslint-disable-next-line no-unused-vars
const bookmarks = (function () {
  
  const render = function() {
    console.log('render ran');
    let bookmarks = [ ...store.bookmarks ];
    
    //bookmark sort by rating: 0 --> show all
    bookmarks = store.filterByRating();
    
    if (store.addNewBookmark) {
      $('.app-buttons').html('');
      $('.add-bookmarks').html(getAddBookmarkHtml());
      $('.bookmarks').html('');
    } else {
      //Expanded bookmarks
      $('.app-buttons').html(getAppButtonHtml()); 
      $('.add-bookmarks').html('');
      $('.bookmarks').html(getBookmarksHtml(bookmarks));
      
    }
  };

  const eventBinder = function() {
    handleAddNew();
    handleAddBookmark();
    handleExpandBookmark();
    handleDeleteBookmark();
    handleSortByRating();
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
      store.addNewBookmark = true;
      render();
    });
  };

  //On add bookmake page, adds the bookmark when pressed
  const handleAddBookmark = function() {
    $('main').on('click', '.js-add-bookmark', e => {
      e.preventDefault();
      store.addNewBookmark = false;
      api.createItem(serializeJson($('.add-bookmark-form')[0]))
        .then(res => res.json())
        .then(bookmark => {
          store.addBookmark(bookmark);
          render();
        });
    });
  };

  const handleExpandBookmark = function() {
    $('main').on('click', '.js-expand-bookmark', e=> {
      e.preventDefault();
      const id = $(e.target).closest('li').data('id');
      store.bookmarkExpand(id);
      render();
    });
  };

  const handleDeleteBookmark = function() {
    $('main').on('click', '.js-delete-bookmark', e=> {
      e.preventDefault();
      const id = $(e.target).closest('li').data('id');
      api.deleteItem(id)
        .then(() => {
          store.deleteBookmark(id);
          render();
        });
    });
  };

  const handleSortByRating = function() {
    $('main').on('click', '.js-sort', e => {
      e.preventDefault();
      if ($('.js-rating').val() === '1 Star') store.sortByRating = 1;
      else if ($('.js-rating').val() === '2 Stars') store.sortByRating = 2;
      else if ($('.js-rating').val() === '3 Stars') store.sortByRating = 3;
      else if ($('.js-rating').val() === '4 Stars') store.sortByRating = 4;
      else if ($('.js-rating').val() === '5 Stars') store.sortByRating = 5;
      else store.sortByRating = 0;
      render();
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
        <input type="button" class="js-sort" value="Filter by Rating"/>
        <select class="js-rating">
          <option>Show All</option>
          <option>1 Star</option>
          <option>2 Stars</option>
          <option>3 Stars</option>
          <option>4 Stars</option>
          <option>5 Stars</option>
        </select>
    </form>`;
  };

  const getAddBookmarkHtml = function() {
    return `
    <form class="add-bookmark-form">
        <label for="title">Title:</label>
        <input type="text" name="title" class="js-title-entry" required>
        <label for="url">URL:</label>
        <input type="url" id="url" name="url" class="js-url-entry" required>
        <label for="desc">Description:</label>
        <input type="text" name="desc" class="js-discription-entry" required>
        <label for="rating">Rating:</label>
        <input class="js-rating-entry" type="number" name="rating" step="1" min="1" max="5" required>
        <button class="js-add-bookmark" type="submit">Add Item</button>
    </form>`;
  };

  const getBookmarksHtml = function(bookmarks) {
    return bookmarks.map(bookmark => { 
      return `
        <li data-id=${bookmark.id}>
            <div data-id=${bookmark.id}>${bookmark.title}</div>
            ${getExpandedHtml(bookmark)}
            ${getStars(bookmark)}
            <button type="submit" class="js-expand-bookmark">Expand</button>
            <button type="submit" class="js-delete-bookmark">Delete</button>
        </li>`;
    });
  };

  const getStars = function(bookmark) {
    return [0, 1, 2, 3, 4].map((num) => {
      if (num < bookmark.rating) return '<span class="fa fa-star checked"></span>';
      else return '<span class="fa fa-star"></span>';
    })
      .join('');
  };

  const getExpandedHtml = function(bookmark) {
    if (bookmark.expand) return `<p>${bookmark.desc}</p>`;
    else return '';
  };

  return {
    render,
    eventBinder,
    onStart,
  };
})();

