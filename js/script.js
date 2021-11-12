{
    'use strict';

    const templates = {
        articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
        tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
        authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
        tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
        authorListLink: Handlebars.compile(document.querySelector('#template-author-list-link').innerHTML)
    }

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
        optArticleAuthorSelector = '.post-author',
        optCloudClassCount = 5,
        optCloudClassPrefix = 'tag-size-',
        optAuthorsListSelector = '.authors';

    function generateTitleLinks(customSelector = ''){
        const titleList = document.querySelector(optTitleListSelector);
        const clearMessages = function(){titleList.innerHTML = ''};
        clearMessages();
        const articles = document.querySelectorAll(optArticleSelector + customSelector);
        let html = '';

        for(let article of articles) {
            const articleId = article.getAttribute('id');
            const articleTitle = article.querySelector(optTitleSelector).innerHTML;
            const linkHTMLData = {id: articleId, title: articleTitle};
            const linkHTML = templates.articleLink(linkHTMLData);
            html = html + linkHTML;
        }

        titleList.innerHTML = html;
        const links = document.querySelectorAll('.titles a');

        for (let link of links) {
            link.addEventListener('click', titleClickHandler);
        }

    }

    generateTitleLinks();

    const calculateTagsParams = function(tags){
        let params = {
            min: 999999,
            max: 0
        }

        for(let tag in tags){
            if(tags[tag] > params.max){
                params.max = tags[tag];
            }
            if(tags[tag] < params.min){
                params.min = tags[tag]
            }
            console.log(tag + ' is used ' + tags[tag] + ' times');
        }

        return params;
    }

    const calculateTagClass = function (count, params){
        const normalizedCount = count - params.min;
        const normalizedMax = params.max - params.min;
        const percentage = normalizedCount / normalizedMax;
        const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
        return classNumber;
    }

    const generateTags = function(){
        let allTags = {};
        const articles = document.querySelectorAll(optArticleSelector);

        for(let article of articles) {
            const tagsWrapper = article.querySelector(optArticleTagsSelector);
            let html = '';
            const articleTags = article.getAttribute('data-tags');
            const articleTagsArray = articleTags.split(' ');

            for (let tag of articleTagsArray) {
                const tagHTMLData = {id: tag};
                const tagHTML = templates.tagLink(tagHTMLData);
                html = html + tagHTML;
                if(!allTags[tag]) {
                    allTags[tag] = 1;
                } else {
                    allTags[tag]++;
                }
            }
            tagsWrapper.innerHTML = html;
        }
        const tagList = document.querySelector('.tags');
        const tagsParams = calculateTagsParams(allTags);
        console.log('tagsParams:', tagsParams)
        const allTagsData = {tags: []};

        for(let tag in allTags){
            allTagsData.tags.push({
                tag: tag,
                count: allTags[tag],
                classPrefix: optCloudClassPrefix,
                className: calculateTagClass(allTags[tag], tagsParams)
            });
        }

        tagList.innerHTML = templates.tagCloudLink(allTagsData);
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
        let allAuthors = {};

        const articles = document.querySelectorAll(optArticleSelector);

        for (let article of articles) {
            const authorWrapper = article.querySelector(optArticleAuthorSelector);
            const articleAuthor = article.getAttribute('data-author');
            const authorHTMLData = {id: articleAuthor};
            const authorHTML = templates.authorLink(authorHTMLData);
            authorWrapper.innerHTML = authorHTML;

            if (!allAuthors[articleAuthor]) {
                allAuthors[articleAuthor] = 1;
            } else {
                allAuthors[articleAuthor]++;
            }
        }
            const authorList = document.querySelector(optAuthorsListSelector);
            const allAuthorsData = {tags: []};
            for (let author in allAuthors){
                allAuthorsData.tags.push({
                    author: author,
                    count: allAuthors[author],
                });
            }
            authorList.innerHTML = templates.authorListLink(allAuthorsData);
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
