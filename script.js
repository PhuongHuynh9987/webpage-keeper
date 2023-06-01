const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl =  document.getElementById('website-url');
const bookmarksContainer =  document.getElementById('bookmarks-container');

// let bookmarks = [];

//Show Modal, Focus on Input 
function showModal(){
    modal.classList.add('show-modal');
    websiteNameEl.focus();                         //so the focus will be at the websiteNameEl right away
}

// Modal Event Listeners 
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target == modal ?  modal.classList.remove('show-modal') : false))         //click on anything in the window to close

//Validate Form

function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);

    if (!nameValue || !urlValue){
        alert('Please submit values for both fields');
        return false;
    }

    if (!urlValue.match(regex)){
        alert('not match');
        return false;
    }
    return true;
}

// fetch bookmarks every time we turn the window
function fetchBookmarks(){
    // get bookmarks from local storage if available
    if(localStorage.getItem('bookmarks')){
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }
    else {
        //create an array in localStorage
        bookmarks = [];
    }
    //after fetching, it will build bookmarks to show on the window
    buildBookmarks();
}

//buid bookmarks DOM
function buildBookmarks(){
    //remove all bookmark elements 
    bookmarksContainer.textContent = '';

    // build items
    bookmarks.forEach((bookmark) => {
        // add bookmarks to dom
        const {name, url} = bookmark;
        // create item 
        const item = document.createElement('div');
        item.classList.add('item');
        //close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times')
        closeIcon.setAttribute('title', 'Delete bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');

        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://www.google.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');
        // Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent = name;

        //append to bookmarks container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.append(item);
    })
}

// Delete bookmarks 
function deleteBookmark(url) {
    bookmarks.forEach((bookmark,i) => {
        if(bookmark.url === url){
            bookmarks.splice(i, 1);         //i for index, we want to delete one thing
        }
    })

    // update bookmarks array in localstorage
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

    // fetch bookmarks again
    fetchBookmarks();
}

// Handle data from Form
function storeBookmark(e){
    e.preventDefault();                 //by default, the form is usually submited to a web server, so it will reset, setting preventDefault will help this
    const nameValue = websiteNameEl.value;
    let urlValue  = websiteUrlEl.value;
    if(!urlValue.includes('http://') && !urlValue.includes('https://')){
        urlValue = `https://${urlValue}`;
    }
    console.log(urlValue)
    if(!validate(nameValue, urlValue)){
        return false;
    }

    const bookmark = {
         name: nameValue,
         url: urlValue,
    };

    //push the input into localStorage
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));  // JSON.stringify(object) will convert object into string

    bookmarkForm.reset();
    websiteNameEl.focus();
    buildBookmarks();

}

// submit form
bookmarkForm.addEventListener('submit', storeBookmark);
fetchBookmarks();
