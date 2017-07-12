function validateLinks(links) {
  var results = [];
  var pendingRequests = 0;

  function fetchLink(link) {
    if (!/^http(s?):\/\//.test(link.href))
      return;
    var parse_url = /^((?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?)(?:(\/[^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
    var result = parse_url.exec(link.href);
    var pathname = result[6];
    var base_url = result[1];
    var url = '';
    if (pathname == "/") {
      url = base_url + pathname + ".git/config";
    } else if (pathname == undefined) {
      url = base_url + pathname + "/.git/config";
    }else {
      var path = pathname.substring(0,pathname.lastIndexOf("/") + 1);
      url = base_url + path + '.git/config';
    }
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 &&  xhr.status == 200) {
          var str = xhr.responseText;
           if(str.indexOf('repositoryformatversion')>-1)
           {
            alert(url+'发现git泄露' + link.text);
           }
         else{

         }
       }
      }
    try {
      xhr.send(null);
    } catch (e) {
      
    }

  }
    
  for (var i = 0; i < links.length; ++i)
    fetchLink(links[i]);
}

function getLinks() {
  alert(111);
  var links = document.querySelectorAll("a");
  var results = [];
  var seenLinks = {};
  for (var i  = 0; i < links.length; ++i) {
    var text = links[i].textContent;
    if (text.length > 100)
      text = text.substring(0, 100) + "...";
    var link = links[i].href.replace(/(.*)#?/, "$1");
    if (seenLinks[link])
      continue;
    seenLinks[link] = 1;
    results.push({ href: link, text: text });
  }
  results.push({href: window.location.href, text: "当前页面"});
  return results;
}

validateLinks(getLinks());

