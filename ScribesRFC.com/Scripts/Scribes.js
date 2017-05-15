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
            url: 'http://www.scribesrfc.com/wp-json/wp/v2/posts?_embed',
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
            var latestPostHTML = '<article id="paged-pro-feature" class="post-' + latestPost.id + ' post type-post status-publish format-standard has-post-thumbnail hentry category-news category-social-events"><div class="container-blog"><div class="hover-feature-pro"><div class="featured-image-pro"><a href="' + latestPost.link + '" class="video-hover-pro"><img src="' + featuredMedia + '" class="attachment-progression-blog-single size-progression-blog-single wp-post-image" alt=""></a></div><div class="feature-text-pro"><div class="category-list-pro">' + categoriesHTML + '</div><h2 class="blog-title-pro"><a href="' + latestPost.link + '">' + latestPost.title.rendered + '</a></h2><div class="time-stamp-pro">' + latestPost.date + '</div><div class="clearfix"></div></div></div></div></article>'
            //now apend to the appropriate location in the home/index view
            document.getElementById('paged-index-pro').innerHTML = latestPostHTML;
        })
        .fail(function (jqXHR, textStatus) {
            console.log('WP Fail! - ' + textStatus);
        })
    }

    function loadCategories() {

        $.ajax({
            method: 'GET',
            url: 'http://blog.cronangogarty.com/wp-json/wp/v2/posts',
            dateType: 'json'
        })
        .always(function () { })
        .done(function (data) {
            categories = data;
        })
        .fail(function (jqXHR, textStatus) { })
    }

    function loadMedia(id) {
        $.ajax({
            method: 'GET',
            url: 'http://www.scribesrfc.com/wp-json/wp/v2/media/' + id,
            dataType: 'json'
        })
        .always(function () { })
        .done(function (data) {
            return data.media_details.sizes.full.source_url;
        })
        .fail(function (jqXHR, statusText) {
            console.log(statusText);
        })
    }

    loadCategories();
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