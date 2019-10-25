'use strict';

/*global store $ api*/

//event handlers and update html
//eslint-disable-next-line no-unused-vars
const bookmarks = (function () {
  
    //renders changes to html
    const render = function() {
    //console.log('render ran');
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

    //runs all the event handlers
    const eventBinder = function() {
        handleAddNew();
        handleAddBookmark();
        handleExpandBookmark();
        handleDeleteBookmark();
        handleSortByRating();
    };

    //On start loads all bookmarks stored in the API to store.bookmarks
    const onStart = function() {
        api.getItems()
            .then(res => res.json())
            .then(bookmarkList => {
                bookmarkList.forEach(bookmark => store.addBookmark(bookmark));
                render();
            } );
    };
  
    //Goes to add bookmark page when pressed
    const handleAddNew = function() {
        $('main').on('click', '.js-add-new', e => {
            e.preventDefault();
            store.addNewBookmark = true;
            render();
        });
    };

    //Updates the API and store with a new bookmark, with inputs filled out
    const handleAddBookmark = function() {
        $('main').on('submit', '.add-bookmark-form', e => {
            e.preventDefault();
            // console.log('add bookmark');
            store.addNewBookmark = false;
            store.sortByRating = 0;
            api.createItem(serializeJson($('.add-bookmark-form')[0]))
                .then(res => res.json())
                .then(bookmark => {
                    store.addBookmark(bookmark);
                    render();
                });
        });
    };

    //Expands a bookmark to show description and link
    const handleExpandBookmark = function() {
        $('main').on('click', '.js-expand-bookmark', e=> {
            e.preventDefault();
            const id = $(e.target).closest('li').data('id');
            store.bookmarkExpand(id);
            render();
        });
    };

    //Delete's a bookmark
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

    //Filters the bookmarks by rating
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
    <div class="app-buttons">
        <button type="submit" class="button js-add-new">Add Bookmark</button>
        <input type="button" class="button js-sort" value="Filter by Rating"/>
        <select class="button js-rating">
          <option>Show All</option>
          <option>1 Star</option>
          <option>2 Stars</option>
          <option>3 Stars</option>
          <option>4 Stars</option>
          <option>5 Stars</option>
        </select>
    </div>`;
    };

    const getAddBookmarkHtml = function() {
        return `
    <form action="#" class="add-bookmark-form">
      <ledgend class="ledgend">Add a New Bookmark</ledgend>
      <label for="title">Title:
        <input type="text" id="title" name="title" class="js-title-entry" placeholder="Google" required>
      </label>
      <label for="url">URL:
        <input type="url" id="url" name="url" class="js-url-entry" placeholder="http://www.google.com" required>
      </label>
      <label for="desc">Description:
        <input type="text" id="desc" name="desc" class="js-discription-entry" placeholder="Search engine" required>
        </label>
      <label for="rating">Rating:
        <input class="js-rating-entry" id="rating" type="number" name="rating" step="1" min="1" max="5" required>
      </label>
        <button class="js-add-bookmark" type="submit">Add Item</button>
    </form>`;
    
        
    };

    const getBookmarksHtml = function(bookmarks) {
        return bookmarks.map(bookmark => { 
            return `
        <li data-id=${bookmark.id}>
            <div class="bookmark-top">
              <div class="title">${bookmark.title}</div>
              <div class="stars">${getStars(bookmark)}</div>
            </div>
            ${getExpandedHtml(bookmark)}
            <div class="bookmark-buttons">
              <button type="submit" class="button js-expand-bookmark">Expand</button>
              <button type="submit" class="button js-delete-bookmark">Delete</button>
            </div>
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
        if (bookmark.expand) return `
      <div class="desc">Site Description: ${bookmark.desc}</div>
      <div class="url-link">\n -<a href="${bookmark.url}" target="_blank">Visit Site</a></div>`;
        else return '';
    };

    return {
        render,
        eventBinder,
        onStart,
    };
})();

