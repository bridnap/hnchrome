window.onload = function(){
  main();
  setupEvents();
};
function setupEvents() {
  $('#submitLink').click(submitCurrentTab);
//  $('#refresh').click(refreshLinks);
  $('#searchbox').keypress(searchOnEnter);
  $('a#options').click(function(){
    openOptions();
  });
}
function main() {
  if (localStorage['HN.NumLinks'] == null) {
    buildPopupAfterResponse = true;
    UpdateFeed();
  }
  else {
    buildPopup(RetrieveLinksFromLocalStorage());
  }
}

function buildPopup(links) {
  var header = document.getElementById("header");
  var feed = document.getElementById("feed");
  

  //Setup Title Link
  var title = document.getElementById("title");
  title.addEventListener("click", openLink);

  //Setup search button
  var searchButton = document.getElementById("searchbutton");
  searchButton.addEventListener("click", search);

  for (var i=0; i<links.length; i++) {
    hnLink = links[i];
    var row = document.createElement("tr");
    row.className = "link";
	var num = document.createElement("span");
	num.className = "badge";
    num.innerText = i+1 + ". ";
    var link_col = document.createElement("td")
    var title = document.createElement("a");
      title.className = "text-capitalize text-primary";
      title.innerText = hnLink.Title + " ";
      title.title = hnLink.Link + " ";
      title.href = hnLink.Link;
      title.addEventListener("click", openLink);
	var points = document.createElement("a");
      points.className = "label label-primary";
	  points.href = hnLink.ItemLink;
	  points.title = hnLink.ItemLink;
      points.innerText = " " + hnLink.Points + " pts";
	  points.addEventListener("click", openLink);
	row.appendChild(num);
    row.appendChild(link_col)
    link_col.appendChild(title);
    link_col.appendChild(points);

    feed.appendChild(row);
  }
  hideElement("spinner");
  showElement("container");
}

function searchOnEnter(e) {
  if (e.keyCode == 13) {
    search();
  }
}

function search() {
  var searchBox = document.getElementById("searchbox");
  var keywords = searchBox.value;
  if (keywords.length > 0) {
    var search_url = "https://hn.algolia.com/?query=&sort=byPopularity&prefix&page=0&dateRange=last24h&type=story" + keywords.replace(" ", "+") + "&start=0";
    openUrl(search_url, true);
  }
}

function refreshLinks() {
  var linkTable = document.getElementById("feed");
  while(linkTable.hasChildNodes()) linkTable.removeChild(linkTable.firstChild); //Remove all current links
  toggle("container");
  toggle("spinner");
  buildPopupAfterResponse = true;
  UpdateFeed();
  updateLastRefreshTime();
}

//Submit the current tab
function submitCurrentTab() {
  chrome.windows.getCurrent(function(win){
    chrome.tabs.getSelected(win.id, function(tab){
      var submit_url = "http://news.ycombinator.com/submitlink?u=" + encodeURIComponent(tab.url) + "&t=" + encodeURIComponent(tab.title);
      openUrl(submit_url, true);
    });
  });
}
