{
    'use strict';
    const titleClickHandler = function (event) {
        event.preventDefault();
        const clickedElement = this;
        const activeLinks = document.querySelectorAll('.titles a.active');

        for (let activeLink of activeLinks) {
            activeLink.classList.remove('active');
        }

        clickedElement.classList.add('active');
        const activeArticles = document.querySelectorAll('.posts article.active');

        for (let activeArticle of activeArticles) {
            activeArticle.classList.remove('active');
        }

        const articleSelector = clickedElement.getAttribute('href');
        const targetArticle = document.querySelector(articleSelector);
        targetArticle.classList.add('active');
    }

    const optArticleSelector = '.post',
        optTitleSelector = '.post-title',
        optTitleListSelector = '.titles',
        optArticleTagsSelector = '.post-tags .list',
        optActiveTagLinkSelector = 'a.active[href^="#tag-"]',
        optArticleAuthorSelector = '.post-author';

    function generateTitleLinks(customSelector = ''){
        const titleList = document.querySelector(optTitleListSelector);
        const clearMessages = function(){titleList.innerHTML = ''};
        clearMessages();
        const articles = document.querySelectorAll(optArticleSelector + customSelector);
        let html = '';

        for(let article of articles) {
            const articleId = article.getAttribute('id');
            const articleTitle = article.querySelector(optTitleSelector).innerHTML;
            const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
            html = html + linkHTML;
        }

        titleList.innerHTML = html;
        const links = document.querySelectorAll('.titles a');

        for (let link of links) {
            link.addEventListener('click', titleClickHandler);
        }

    }

    generateTitleLinks();

    const generateTags = function(){
        const articles = document.querySelectorAll(optArticleSelector);

        for(let article of articles) {
            const tagsWrapper = article.querySelector(optArticleTagsSelector);
            let html = '';
            const articleTags = article.getAttribute('data-tags');
            const articleTagsArray = articleTags.split(' ');

            for (let tag of articleTagsArray) {
                let tagHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li> ';
                html = html + tagHTML;
            }

            tagsWrapper.innerHTML = html;
        }
    }
    generateTags();

    const tagClickHandler = function(event){
        event.preventDefault();
        const clickedElement = this;
        const href = clickedElement.getAttribute('href');
        const tag = href.replace('#tag-', '');
        const tagLinks = document.querySelectorAll(optActiveTagLinkSelector);

        for(let tagLink of tagLinks) {
            tagLink.classList.remove('active');
        }

        const hrefTagLinks = document.querySelectorAll('a[href="' + href + '"]');

        for(let hrefTagLink of hrefTagLinks) {
            hrefTagLink.classList.add('active');
        }
        generateTitleLinks('[data-tags~="' + tag + '"]');
    }

    const addClickListenersToTags = function(){
        const links = document.querySelectorAll('a[href^="#tag-"]');
        for(let link of links) {
            link.addEventListener('click', tagClickHandler);
        }
    }

    addClickListenersToTags();

    const generateAuthors = function (){
        const articles = document.querySelectorAll(optArticleSelector);

        for (let article of articles) {
            const authorWrapper = article.querySelector(optArticleAuthorSelector);
            const articleAuthor = article.getAttribute('data-author');
            authorWrapper.innerHTML = 'by <a href="#author-' + articleAuthor + '">' + articleAuthor + '</a> ';
        }
    }
    generateAuthors();

    const authorClickHandler = function(event){
        event.preventDefault();
        const clickedElement = this;
        const href = clickedElement.getAttribute('href');
        const author = href.replace('#author-', '');
        console.log(author);

        generateTitleLinks('[data-author="' + author + '"]')
    }


    const addClickListenerToAuthors = function(){
        const authors = document.querySelectorAll('a[href^="#author-"]');
        for (let author of authors){
            author.addEventListener('click', authorClickHandler);
        }
    }

    addClickListenerToAuthors();
}
