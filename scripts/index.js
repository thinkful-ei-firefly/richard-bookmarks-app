'use strict';

/*global bookmarks $*/

//initializes all javascript
const main = function() {
  bookmarks.eventBinder();
  bookmarks.onStart();
};

$(main);