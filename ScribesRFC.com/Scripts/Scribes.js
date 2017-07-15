(function () {
    console.log("001-Scribes.js running...");

    var myPath = "http://localhost:53600/";

    var navHeight = $('#scribes-home-nav').outerHeight();
    $('.header .page-heading').css('margin-bottom', -navHeight);

    var categories = [];
    var posts = [];
    var pageNumber = 1;
    var btnLoadPostsInit = document.getElementById('btnLoadPostsInit');

    function loadPosts() {

        //store the markup in variables

        console.log('calling WP Posts...');

        refreshNews(true);

        $.ajax({
            method: 'GET',
            url: 'http://www.scribesrfc.com/wp-json/wp/v2/posts?_embed&per_page=5&page=' + pageNumber,
            dataType: 'json'
        })
        .always(function () {
            console.log('WP Done!');
            refreshNews(false);
        })
        .done(function (data, textStatus, jqXHR) {
            posts = data;

            if (posts.length > 0) {
                let totalPages = parseInt(jqXHR.getResponseHeader('X-WP-TotalPages'), 10);
                console.log('totalPages = ' + totalPages);

                //get the most recent post
                var latestPost = data[0];

                //get featuredmedia (if it exists) for post index
                var featuredMedia = function (post) {
                    let result = null;
                    let nest = null;

                    //set result to a default image
                    let host = window.location.host;
                    //result = 'http://' + host + '/Content/Images/wp-posts-default-img-232x412.png';
                    result = null;

                    let searchPost = data[post];
                    if (post == 0) {
                        //result = 'http://' + host + '/Content/Images/wp-posts-default-img-300x844.png';
                        result = 'http://' + host + '/Content/Images/ladies-team.png';
                    }
                    else {
                        result = 'http://' + host + '/Content/Images/wp-posts-default-img-300x344.png';
                    }
                    try {
                        if (searchPost.featured_media > 0) {
                            if (searchPost._embedded["wp:featuredmedia"][0].source_url) {
                                nest = searchPost._embedded["wp:featuredmedia"][0]; //var to hold drilldown position
                                result = nest.source_url;
                                if (nest["media_details"]["sizes"]) {
                                    if (post == 0 && nest.media_details.sizes.full.source_url) {
                                        result = nest.media_details.sizes.full.source_url;
                                    }
                                    else {

                                        if (nest.media_details.sizes['progression-blog']) {
                                            result = nest.media_details.sizes['progression-blog'].source_url;
                                        }

                                        //if (nest.media_details.sizes['full']) {
                                        //    result = nest.media_details.sizes['full'].source_url;
                                        //}
                                    }
                                }
                            }
                        }
                    } catch (e) {
                        console.error = e.message;
                    }
                    return result;
                }
                var categories = latestPost._embedded['wp:term'][0];
                var categoriesHTML = '';
                for (let i = 0; i < categories.length; i++) {
                    if (i == categories.length - 1) {
                        //if this is the last item we don't want to append the bullet point
                        categoriesHTML += '<a href="' + categories[i].link + '" rel="category tag">' + categories[i].name + '</a>';
                    }
                    else {
                        categoriesHTML += '<a href="' + categories[i].link + '" rel="category tag">' + categories[i].name + '</a> &#8226; ';
                    }
                }
                var latestPostHTML = '<article id="paged-pro-feature" class="post-' + latestPost.id + ' post type-post status-publish format-standard has-post-thumbnail hentry category-news category-social-events"><div class="container-blog"><div class="hover-feature-pro"><div class="featured-image-pro"><a href="' + latestPost.link + '" class="video-hover-pro"><img src="' + featuredMedia(0) + '" class="img-responsive" alt=""></a></div><div class="feature-text-pro"><div class="category-list-pro">' + categoriesHTML + '</div><h2 class="blog-title-pro"><a href="' + latestPost.link + '">' + latestPost.title.rendered + '</a></h2><div class="time-stamp-pro">' + new Date(latestPost.date).toDateString() + '</div><div class="clearfix"></div></div></div></div></article>'
                //now apend to the appropriate location in the home/index view
                document.getElementById('paged-index-pro').innerHTML = latestPostHTML;

                //output next 4 posts to the home/index view
                var topFourPosts = data.slice(1, 5); //create a new array with 4 elements
                var topFourPostsHTML = '';
                for (let i = 0; i < topFourPosts.length; i++) {
                    //TODO:older posts do not have the media_details.sizes['progression-blog'] properties... figure a way to show old and new posts that all show images
                    //var oldfeaturedMedia = topFourPosts[i]._embedded['wp:featuredmedia'][0].media_details.sizes['progression-blog'].source_url;
                    let postMedia = featuredMedia(i + 1);
                    categoriesHTML = '';
                    categories = topFourPosts[i]._embedded['wp:term'][0];
                    for (let j = 0; j < categories.length; j++) {
                        if (j == categories.length - 1) {
                            //if this is the last item we don't want to append the bullet point
                            categoriesHTML += '<a href="' + categories[j].link + '" rel="category tag">' + categories[j].name + '</a>';
                        }
                        else {
                            categoriesHTML += '<a href="' + categories[j].link + '" rel="category tag">' + categories[j].name + '</a> &#8226; ';
                        }
                    }

                    var isLastColumn = (i % 2 != 0) ? "lastcolumn-progression" : null;
                    topFourPostsHTML += '<div class="infinite-container"><div class="grid2column-progression ' + isLastColumn + '"><article id="post-' + topFourPosts[i].id + '" class="post-' + topFourPosts[i].id + ' post type-post status-publish format-standard has-post-thumbnail hentry category-mens-rugby category-womens-rugby"><div class="container-blog"><div class="featured-image-pro"><a href="' + topFourPosts[i].link + '" class="video-hover-pro"><img src="' + postMedia + '" class="img-responsive" alt=""></a></div><div class="category-list-pro">' + categoriesHTML + '</div><h2 class="blog-title-pro"><a href="' + topFourPosts[i].link + '">' + topFourPosts[i].title.rendered + '</a></h2><div class="time-stamp-pro">' + new Date(topFourPosts[i].date).toDateString() + '</div><div class="clearfix"></div></div></article></div></div>'
                }

                topFourPostsHTML += '<div class="clearfix"></div>';

                document.getElementById('infinite-pro').innerHTML = topFourPostsHTML;

                //create the pagination buttons
                var paginationButtons = '';
                console.log('pagination : pageNumber = ' + pageNumber);
                if (pageNumber > 1) {
                    paginationButtons += '<li><span class="page-numbers" data-page-number="1">‹‹ First</span></li>';
                }

                if (pageNumber == 1) {
                    paginationButtons += '<li><span class="page-numbers current" data-page-number="' + (pageNumber) + '">' + (pageNumber) + '</span></li><li><span class="page-numbers" data-page-number="' + (pageNumber + 1) + '">' + (pageNumber + 1) + '</span></li><li><span class="page-numbers" data-page-number="' + (pageNumber + 2) + '">' + (pageNumber + 2) + '</span></li>'
                }

                if (pageNumber != 1 && pageNumber != totalPages) {
                    paginationButtons += '<li><span class="page-numbers" data-page-number="' + (pageNumber - 1) + '">' + (pageNumber - 1) + '</span></li><li><span class="page-numbers current" data-page-number="' + (pageNumber) + '">' + (pageNumber) + '</span></li><li><span class="page-numbers" data-page-number="' + (pageNumber + 1) + '">' + (pageNumber + 1) + '</span></li>'
                }

                if (pageNumber < totalPages) {
                    paginationButtons += '<span class="page-numbers" data-page-number="' + totalPages + '">Last ››</span>';
                }

                if (pageNumber == totalPages) {
                    paginationButtons += '<li><span class="page-numbers" data-page-number="1">‹‹ First</span></li><li><span class="page-numbers" data-page-number="' + (pageNumber - 2) + '">' + (pageNumber - 2) + '</span></li><li><span class="prev page-numbers" data-page-number="' + (pageNumber - 1) + '">' + (pageNumber - 1) + '</span></li><li><span class="page-numbers current" data-page-number="' + (pageNumber) + '">' + (pageNumber) + '</span></li>'
                }

                document.getElementById('ul-page-numbers').innerHTML = paginationButtons;
            }
            else {
                btnLoadPostsInit.style.visibility = 'visible';
            }
        })
        .fail(function (jqXHR, textStatus) {
            console.log('WP Fail! - ' + textStatus);
            btnLoadPostsInit.style.visibility = 'visible';
        })
    }

    $('#ul-page-numbers').on('click', '.page-numbers', function () {
        console.log('click...');

        var element = document.getElementById("h4-latest-news");
        element.scrollIntoView();

        location.hash = 'latest-news';

        let $this = $(this);
        pageNumber = (parseInt($this.attr('data-page-number'), 10));
        loadPosts();
    });

    function refreshNews(status) {
        let $animationDiv = $('#animation-div');
        
        if (status) {
            console.log('show animation...');
            $('#posts-div').hide();

            //location.hash = 'latest-news';

            let protocol = window.location.protocol;
            let host = window.location.host;
            let spinner = '<img src="' + protocol + '//' + host + '/Content/Images/loading_spinner.gif" margin:auto;" />';
            $animationDiv.html(spinner);
            $animationDiv.css('display', 'block');
            

            //
            //let aniPanel = '';
            //let appendAt = document.getElementById('h4-latest-news');
            //$(aniPanel).show().appendTo(appendAt);
        }

        else {
            console.log('hide animation...');
            $animationDiv.css('display', 'none');
            $('#posts-div').show();
        }
        

    }

    //function loadCategories() {

    //    $.ajax({
    //        method: 'GET',
    //        url: 'http://blog.cronangogarty.com/wp-json/wp/v2/posts',
    //        dateType: 'json'
    //    })
    //    .always(function () { })
    //    .done(function (data) {
    //        categories = data;
    //    })
    //    .fail(function (jqXHR, textStatus) { })
    //}

    //function loadMedia(id) {
    //    $.ajax({
    //        method: 'GET',
    //        url: 'http://www.scribesrfc.com/wp-json/wp/v2/media/' + id,
    //        dataType: 'json'
    //    })
    //    .always(function () { })
    //    .done(function (data) {
    //        return data.media_details.sizes.full.source_url;
    //    })
    //    .fail(function (jqXHR, statusText) {
    //        console.log(statusText);
    //    })
    //}

    //loadCategories();
    loadPosts();

    //$('#grid-mini-rugby').mouseover(function () {
    //    $('#img-grid-mini')
    //        .attr("src", myPath + "Content/Images/Image-Grid/mini-rugby-vibrant-360.png");
    //})
    //.mouseout(function () {
    //    $('#img-grid-mini')
    //        .attr("src", myPath + "Content/Images/Image-Grid/mini-rugby-greyscale-720.png");
    //});


    //nasty rollover code - do not use in production environment
    //$('.gridItem').mouseover(function () {
    //    var currentImg = $(this).find('img')
    //    var originalImgSrc = new String(currentImg[0].currentSrc);
    //    var hoverImgSrc = originalImgSrc.replace('greyscale', 'vibrant');
    //    currentImg
    //        .attr("src", hoverImgSrc);
    //})
    //    .mouseout(function () {
    //        var currentImg = $(this).find('img')
    //        var originalImgSrc = new String(currentImg[0].currentSrc);
    //        var hoverImgSrc = originalImgSrc.replace('vibrant', 'greyscale');
    //        currentImg
    //            .attr("src", hoverImgSrc);
    //    });

    // document.onkeyup(function(){
    //     var focusedElement = document.activeElement;

    //     console.log(focusedElement);
    // });

    //attach an event handler to the load posts button
    btnLoadPostsInit.addEventListener('click', function () {
        
        loadPosts();
        console.log('loadPosts called...');

    }, false);

    //capture a click on a post
    document.getElementById('content-container').addEventListener('click', function (e) {
        //if (e.target && (e.target.nodeName == 'IMG' || (e.target.nodeName == 'A'))) {
        //    e.preventDefault();
        //    console.log('click captured and prevented...');

        //    let host = window.location.host;
        //    let postRef = function(){
        //        if (e.parentElement.href) {
        //            return e.parentElement.href;
        //        }
        //    };
        //    let loadPostURL = host + '/Blog/ViewPost/' + postRef;
        //    console.log('loadPostURL = ...;\n' + loadPostURL);
        //    document.location.assign(loadPostURL)
        //}
    }, false);


}());

var POSTS = {
    viewPost : function(){
        console.log('viewPost running...');
    }
}