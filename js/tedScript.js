document.addEventListener("DOMContentLoaded", () => {
    loadArticles();
    loadPreview();
    privacySetup();
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
    return articles.sort((a, b) => b.ID - a.ID);
}
function renderArticle(article, container){
    const articleElement = document.createElement("article");

    articleElement.classList.add("blog-card");

    articleElement.innerHTML = `

    <article class="article-card">

        

        <div class="article-body">

            <span class="article-category">
                ${article.date} - 
            </span>
            <span class="article-author">
                @ ${article.author}
            </span><br>
            <span class="article-category">
                ${article.tag}
            </span>


            <h2>
                ${article.title}
            </h2>


            <p class="article-preview">
                ${article.preview}
            </p>


            <a href="article.html?id=${article.ID}">
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
    
    articleElement.classList.add("blog-card");
    const breakline = "<hr>"
    articleElement.innerHTML = `
    <a href="${article.ID}.html">
        <article class="preview-card">
            <div class="preview-body">
                <span class="preview-category">
                    ${article.date}
                </span>
                <h2>
                    ${article.title}
                </h2>
                <a href="article.html?id=${article.ID}">
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
function articlePage(){
    const params = new URLSearchParams(window.location.search);
    const articleId = Number(params.get("ID"));
    fetch("data/articoli.json")
    .then(response => response.json())
    .then(articles => {

        const blogpost = articles.find(
            blogpost => blogpost.DI == articleId
        );

        document.getElementById("#blogpost-title").textContent = blogpost.title;

        document.getElementById("#blogpost-author").textContent = blogpost.date + " | "+ blogpost.author;
        document.getElementById("#blogpost-tag").textContent = blogpost.tag;
        document.getElementById("#blogpost-cover").src = blogpost.cover;


        fetch(`articles/${blogpost.file}`)
            .then(response => response.text())
            .then(markdown => {

                document.getElementById("#blogpost-content").innerHTML = marked.parse(markdown);

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
