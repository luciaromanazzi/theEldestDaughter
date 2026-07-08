console.log("START TED SCRIPT");
alert("JS caricato correttamente");
console.log("TED SCRIPT CARICATO");
fetch("data/articoli.json")
.then(response => response.json())
.then(articles => {

    const container = document.getElementById("blog-feed");
    articles.sort((a, b) => b.ID - a.ID);
    articles.forEach(article => {

        const articleElement = document.createElement("article");

        articleElement.classList.add("blog-card");

        articleElement.innerHTML = `

        <article class="article-card">

            <img 
                src="${article.cover}" 
                alt="${article.title}"
                class="article-image"
            >

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


                <button class="read-more">
                    Read more
                </button>


                <div class="article-content hidden">
                    ${article.paragraph}
                </div>

            </div>

        </article>

        `;

        container.appendChild(articleElement);

    });

})

.catch(error => {
    console.error("Errore caricamento articoli:", error);
});