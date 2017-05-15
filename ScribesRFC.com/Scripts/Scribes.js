(function () {
    console.log("001-Scribes.js running...");

    var myPath = "http://localhost:53600/";

    var navHeight = $('#scribes-home-nav').outerHeight();
    $('.header .page-heading').css('margin-bottom', -navHeight);

    var categories = [];
    var posts = [];

    function loadPosts() {

        //stor the markup in variables
        

        console.log('calling WP Posts...');

        $.ajax({
            method: 'GET',
            url: 'http://www.scribesrfc.com/wp-json/wp/v2/posts?_embed&filter[per_page]=20',
            dataType: 'json'
        })
        .always(function () {
            console.log('WP Done!');
        })
        .done(function (data) {
            posts = data;

            //get the most recent post
            var latestPost = data[0];
            var featuredMedia = latestPost._embedded['wp:featuredmedia'][0].media_details.sizes.full.source_url;
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
            var latestPostHTML = '<article id="paged-pro-feature" class="post-' + latestPost.id + ' post type-post status-publish format-standard has-post-thumbnail hentry category-news category-social-events"><div class="container-blog"><div class="hover-feature-pro"><div class="featured-image-pro"><a href="' + latestPost.link + '" class="video-hover-pro"><img src="' + featuredMedia + '" class="attachment-progression-blog-single size-progression-blog-single wp-post-image" alt=""></a></div><div class="feature-text-pro"><div class="category-list-pro">' + categoriesHTML + '</div><h2 class="blog-title-pro"><a href="' + latestPost.link + '">' + latestPost.title.rendered + '</a></h2><div class="time-stamp-pro">' + new Date(latestPost.date).toDateString() + '</div><div class="clearfix"></div></div></div></div></article>'
            //now apend to the appropriate location in the home/index view
            document.getElementById('paged-index-pro').innerHTML = latestPostHTML;

            //get all the other posts and output top 6 to the home/index view
            var topSixPosts = data.slice(1, 9); //create a new array with 6 elements
            var topSixPostsHTML = '';
            for (let i = 0; i < length; i++) {
                featuredMedia = topSixPosts[i]._embedded['wp:featuredmedia'][0].media_details.sizes['progression-blog'].source_url;
                categoriesHTML = '';
                categories = topSixPosts[i]._embedded['wp:term'][0];
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
                topSixPostsHTML += '<div class="infinite-container"><div class="grid2column-progression ' + isLastColumn +'"><article id="post-' + topSixPosts[i].id + '" class="post-' + topSixPosts[i].id + ' post type-post status-publish format-standard has-post-thumbnail hentry category-mens-rugby category-womens-rugby"><div class="container-blog"><div class="featured-image-pro"><a href="' + topSixPosts[i].link + '" class="video-hover-pro"><img src="' + featuredMedia + '" class="attachment-progression-blog size-progression-blog wp-post-image" alt=""></a></div><div class="category-list-pro">' + categoriesHTML + '</div><h2 class="blog-title-pro"><a href="' + topSixPosts[i].link + '">' + topSixPosts[i].title.rendered + '</a></h2><div class="time-stamp-pro">' + new Date(topSixPosts[i].date).toDateString() + '</div><div class="clearfix"></div></div></article></div></div>'
            }

            document.getElementById('infinite-pro').innerHTML = topSixPostsHTML;
        })
        .fail(function (jqXHR, textStatus) {
            console.log('WP Fail! - ' + textStatus);
        })
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


}());