document.addEventListener("DOMContentLoaded", () => {
    loadArticles();
    loadPreview();
    privacySetup();
    articlePage();
});
function loadArticles(){
    fetch("data/articoli.json")
    .then(response => response.json())
    .then(articles => {
        articles = sortArticles(articles);
        const container = document.getElementById("blog-feed");
        const limit = container.dataset.limit;
        if (limit){

            articles = articles.slice(0,limit);
        }
        articles.forEach(article =>{
            renderArticle(article,container);
        });

    })

    .catch(error => {
        console.error("Errore caricamento articoli:", error);
    });
}
function loadPreview(limit){
    fetch("data/articoli.json")
    .then(response => response.json())
    .then(articles => {
        articles = sortArticles(articles);
        const container = document.getElementById("blog-preview");
        const limit = container.dataset.limit;
        if (limit){

            articles = articles.slice(0,limit);
        }
        articles.forEach((article, index) =>{
            if (index === articles.length - 1) {
                // ultima iterazione, passo index per rimuovere linea divisoria
                renderPreview(article,container, index);
            }else{
                renderPreview(article,container);
            }
            
            
        });

    })

    .catch(error => {
        console.error("Errore caricamento articoli:", error);
    });
}
function sortArticles(articles) {
    return articles.sort((a, b) => 
        new Date(b.lastUpdated) - new Date(a.lastUpdated)
    );
}
function renderArticle(article, container){
    const articleElement = document.createElement("article");

    articleElement.classList.add("blog-card");
    let date = formatDate(article.lastUpdated);
    articleElement.innerHTML = `

    <article class="article-card">

        

        <div class="article-body">

            <span class="article-category">
                ${date} - 
                @ ${article.author}
            </span><br>
            <span class="article-category">
                ${article.tags.join(", ")}
            </span>


            <h2>
                ${article.translations.en.title}
            </h2>


            <p class="article-preview">
                ${article.translations.en.preview}
            </p>


            <a href="article.html?id=${article.id}">
                <button class="read-more">
                    Read more
                </button>
            </a>


            <div class="article-content hidden">
                ${article.paragraph}
            </div>

        </div>

    </article>

    `;

    container.appendChild(articleElement);
}
function renderPreview(article,container, index = null){
    const articleElement = document.createElement("article");
    let date = formatDate(article.lastUpdated);
    articleElement.classList.add("blog-card");
    const breakline = "<hr>"
    articleElement.innerHTML = `
    <a href="article.html?id=${article.id}">
        <article class="preview-card">
            <div class="preview-body">
                <span class="preview-category">
                    ${date}
                </span>
                <h2>
                    ${article.translations.en.title}
                </h2>
                <a href="article.html?id=${article.id}">
                    <button class="read">
                        Read 
                    </button>
                </a>
            </div>
        </article>
    </a>
    
    `;
    if (!index){
        articleElement.innerHTML = articleElement.innerHTML+breakline;
    }else{
        articleElement.innerHTML = articleElement.innerHTML;
    }
    container.appendChild(articleElement);
}
function articlePage(language = "en"){
    const params = new URLSearchParams(window.location.search);
    const articleId = Number(params.get("id"));
    fetch("data/articoli.json")
    .then(response => response.json())
    .then(articles => {

        let blogpost = articles.find(
            item => item.id == articleId
        );
        if (!blogpost) return;
        const currentIndex = articles.findIndex(
            item => item.id === articleId
        );

        const previousPost = articles[currentIndex + 1];
        const nextPost = articles[currentIndex - 1];
        const previousLink = document.getElementById("previous");
        const nextLink = document.getElementById("next");
        //from `article.html?id=${previousPost.id}` 
        //to blogpost.translations.en.file

        if (previousPost) {
            previousLink.href = previousPost.translations[language].file;
            previousLink.textContent = `← ${previousPost.translations[language].title}`;
        }else{
            previousLink.hidden = true;
        }


        if (nextPost) {
            nextLink.href = nextPost.translations[language].file;
            nextLink.textContent = `${nextPost.translations[language].title} →`;
        }else{
            nextLink.hidden = true;
        }

        document.getElementById("blogpost-title").textContent = blogpost.translations[language].title;

        document.getElementById("blogpost-author").textContent = blogpost.lastUpdated + " | "+ blogpost.author;
        document.getElementById("blogpost-tag").textContent = blogpost.tags.join(", ");
        document.getElementById("blogpost-img").src = blogpost.cover;

        //let postPath = blogpost.translations[language].file.split("/")[1];
        fetch(blogpost.translations[language].file)
            .then(response => response.text())
            .then(markdown => {

                document.getElementById("blogpost-content").innerHTML = marked.parse(markdown);

            });


        });
}

/////////////////////////////////////////////////// UTILITIES /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function privacySetup(){
    const privacyLink = document.querySelector("#privacy-link");
    const privacyModal = document.querySelector("#privacy-modal");
    const closePrivacy = document.querySelector("#close-privacy");
    if (privacyLink && privacyModal && closePrivacy) {


        privacyLink.addEventListener("click", (event) => {
            event.preventDefault();
            privacyModal.style.display = "flex";
        });


        closePrivacy.addEventListener("click", () => {
            privacyModal.style.display = "none";
        });


        privacyModal.addEventListener("click", (event) => {
            if (event.target === privacyModal) {
                privacyModal.style.display = "none";
            }
        });
    }
}
function formatDate(dateString, language = "en-GB") {
    const date = new Date(dateString);

    return date.toLocaleDateString(language, {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}
