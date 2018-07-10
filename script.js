window.onload=function(){ 
    
    let xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange=function(){
        if(this.readyState==4 && this.status===200){

            let resultArr=JSON.parse(this.responseText).data;
            let content=document.getElementsByClassName("content")[0];
            
        
            resultArr.sort(function(arr1,arr2){
                return new Date(arr2.createdAt)-new Date(arr1.createdAt);
            });

            localStorage.setItem('sortType','dateNewOldest');

            for(let indexOfPost=21;indexOfPost<content.childNodes.length;indexOfPost+=2){
                content.childNodes[indexOfPost].classList.add("hide");
            }

            for(let i=0,indexOfPost=1;i<resultArr.length;i++,indexOfPost+=2){
                let post= content.childNodes[indexOfPost];
                post.getElementsByClassName("title")[0].innerHTML=resultArr[i].title;
                post.getElementsByClassName("description")[0].innerHTML=resultArr[i].description;
                post.getElementsByTagName("img")[0].src=resultArr[i].image;
                post.getElementsByClassName("createdAt")[0].innerHTML=resultArr[i].createdAt;
                post.getElementsByClassName("tags")[0].innerHTML=resultArr[i].tags;
            }



        }
    };
    xhttp.open("GET","https://api.myjson.com/bins/152f9j",true);
    xhttp.send();

document.getElementsByClassName("sortTag")[0].childNodes[1].onchange=sortTags;
document.getElementsByClassName("searchInput")[0].oninput=searchPost;
document.getElementsByClassName("getBack")[0].onclick=getBack;
};



//sort by date
var hideFirstTen=function(){
    let firstPost=document.getElementsByClassName("post");
    for(let countPost=0;countPost<=10;countPost++){
        firstPost[countPost].classList.add("hide");
    }
};
var showFirstTen=function(){
    let firstPost=document.getElementsByClassName("post");
    for(let countPost=0;countPost<=9;countPost++){
        firstPost[countPost].classList.remove("hide");
    }
    
}
var sortByDateOldestTop=function(){
    localStorage.setItem('sortType','dateOldestNew');
    hideFirstTen();
    let postArr=[].slice.call(document.getElementsByClassName("post"));
    postArr.sort(function(p1,p2){
        return new Date(p1.getElementsByClassName("createdAt")[0].innerHTML)- new Date(p2.getElementsByClassName("createdAt")[0].innerHTML);
    });
    document.getElementsByClassName("content")[0].innerHTML="";
    let content=document.getElementsByClassName("content")[0];
    for(let i=0;i<postArr.length;i++){
        content.appendChild(postArr[i]);
    }
    showFirstTen();
}
var sortByDateNewestTop=function(){
    localStorage.setItem('sortType','dateNewestOld');
    hideFirstTen();
    let postArr=[].slice.call(document.getElementsByClassName("post"));
    postArr.sort(function(p1,p2){
        return new Date(p2.getElementsByClassName("createdAt")[0].innerHTML)- new Date(p1.getElementsByClassName("createdAt")[0].innerHTML);
    });
    document.getElementsByClassName("content")[0].innerHTML="";
    let content=document.getElementsByClassName("content")[0];
    for(let i=0;i<postArr.length;i++){
        content.appendChild(postArr[i]);
    }
    showFirstTen();
};

document.addEventListener('DOMContentLoaded',function() {
    document.querySelector('select[name="date"]').onchange=sortHandler;
},false);
var sortHandler=function(event) {
    if(event.target.value =='oldest') sortByDateOldestTop();
    else sortByDateNewestTop();
}

//sort by tags, make case insensetive
var sortTags=function(){
    localStorage.setItem('sortType','sortByTag');
    hideFirstTen();
    let input=document.getElementsByName("tagInp")[0].value;
    let postArr=[].slice.call(document.getElementsByClassName("post"));

    var postArrHasTag=postArr.map(function(post){

        let countTags=0;
        let postTagsArr=post.getElementsByClassName("tags")[0].innerHTML.split(',');

        for(let i=0;i<postTagsArr.length;i++){
            if (input.toLowerCase().search(postTagsArr[i].toLowerCase())!=-1){
                countTags++;
            }
        }
        return [post,countTags];
    });

    postArrHasTag.sort(function(arr1,arr2){
        if((arr2[1]-arr1[1])==0){
            return new Date(arr2[0].getElementsByClassName("createdAt")[0].innerHTML)-new Date(arr1[0].getElementsByClassName("createdAt")[0].innerHTML)
        }
        else return arr2[1]-arr1[1];
    });
    
    document.getElementsByClassName("content")[0].innerHTML="";
    let content=document.getElementsByClassName("content")[0];
    for(let i=0;i<postArrHasTag.length;i++){
        content.appendChild(postArrHasTag[i][0]);
    }
    showFirstTen();
};

//search
var searchPost=function(){

    localStorage.setItem('sortType','searchSort');
    let strSearch=document.getElementsByClassName("searchInput")[0].value;
    let postArr=[].slice.call(document.getElementsByClassName("post"));
    let postArrHasSearch=postArr.map(function(post){

        let match=true;
        let postTitle=post.getElementsByClassName("title")[0].innerHTML;
            let arrStrSearch=strSearch.split(' ');
            for(let i=0;i<arrStrSearch.length;i++){
                if(!postTitle.toLowerCase().includes(arrStrSearch[i].toLowerCase())){
                    match=false;
                    break;
                }
                else continue;
            }
            return [post,match];
    });

    postArrHasSearch.sort(function(arr1,arr2){
        if (arr1[1]==arr2[1])  return new Date(arr2[0].getElementsByClassName("createdAt")[0].innerHTML)-new Date(arr1[0].getElementsByClassName("createdAt")[0].innerHTML);
        else return +arr2[1]-+arr1[1];
    });

    document.getElementsByClassName("content")[0].innerHTML="";
    let content=document.getElementsByClassName("content")[0];
    for(let i=0;i<postArrHasSearch.length;i++){
        content.appendChild(postArrHasSearch[i][0]);
    }
    showPostIfMatch(postArrHasSearch);

};
var showPostIfMatch=function(postArrHasSearch){
    for(let i=0,counter=0;i<postArrHasSearch.length;i++){
        if(postArrHasSearch[i][1]==true && counter<10){
            counter++;
            postArrHasSearch[i][0].classList.remove("hide");
        }
        else {
            if(!postArrHasSearch[i][0].classList.contains("hide")){
                postArrHasSearch[i][0].classList.add("hide");
        }
    }
}};

// //scroll to bottom
var currIndexInContentNode=0;

window.onscroll = function() {
    this.setTimeout(function(){
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        scrollToTop(800);
          currIndexInContentNode+=showNextTen(currIndexInContentNode);
        }
    },1000);
   
   
};
function scrollToTop(scrollDuration) {
    var scrollStep = -window.scrollY / (scrollDuration / 100),
        scrollInterval = setInterval(function(){
        if ( window.scrollY != 0 ) {
            window.scrollBy( 0, scrollStep );
        }
        else clearInterval(scrollInterval); 
    },0);
}

var showNextTen=function(currIndexInContentNode){
     let contentChildArr=document.getElementsByClassName("content")[0].childNodes;
     contentChildArr=[].slice.call(contentChildArr);
     contentChildArr=contentChildArr.filter(function(el){
        return (contentChildArr.indexOf(el)%2);
     });
    if(currIndexInContentNode<=contentChildArr.length-11){ 
    for(let i=currIndexInContentNode;i<contentChildArr.length && i<=currIndexInContentNode+9;i++){
        contentChildArr[i].classList.add("hide");
    }
    for(let i=currIndexInContentNode+10;i<contentChildArr.length && i<=currIndexInContentNode+19;i++){
        contentChildArr[i].classList.remove("hide");
        }
        return 10;
    }
    else {
        window.scrollToTop(600);
        return 0;
    }
};

//get back to first ten
var getBack=function(){
    let contentChildArr=document.getElementsByClassName("content")[0].childNodes;
     contentChildArr=[].slice.call(contentChildArr);
     contentChildArr=contentChildArr.filter(function(el){
        return (contentChildArr.indexOf(el)%2);
     });
    
    if(currIndexInContentNode!=0){
        console.log(currIndexInContentNode);
    for(let i=currIndexInContentNode;i<=currIndexInContentNode+9;i++){
        contentChildArr[i].classList.add("hide");
    }
}
    showFirstTen();
    currIndexInContentNode=0;
};



