console.log("The Eldest Daughter publisher ready");
import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, "..");

const DATA_PATH = path.join(
    ROOT,
    "data",
    "articoli.json"
);

const ARTICLES_PATH = path.join(
    ROOT,
    "articles"
);
function createSlug(title) {
    return title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}
function today() {
    return new Date().toISOString().split("T")[0];
}
function nextId(articles) {

    if (articles.length === 0) {
        return 1;
    }

    const lastArticle = articles[articles.length - 1];

    return lastArticle.id + 1;
}
function loadArticles() {

    const data = fs.readFileSync(
        DATA_PATH,
        "utf-8"
    );

    return JSON.parse(data);
}
async function askArticleData() {

    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Titolo articolo:"
        },
        {
            type: "input",
            name: "preview",
            message: "Anteprima:"
        },
        {
            type: "input",
            name: "author",
            message: "Autore:",
            default: "theeldestdaughter"
        },
        {
            type: "input",
            name: "tags",
            message: "Tag (separati da virgola):"
        },
        {
            type: "input",
            name: "cover",
            message: "Cover:",
            default: "img/cover/default.png"
        },
        {
            type : "input",
            name:"language",
            message:"Lingua:",
            default:"en"
        },
        {
            type : "input",
            name:"Type",
            message:"Tipologia: (article/community story)",
            default:"article"
        }
    ]);

    return answers;
}
function buildArticle(answers, articles) {

    const slug = createSlug(answers.title);

    return {
        id: nextId(articles),
        slug: slug,
        tags: answers.tags
            ? answers.tags.split(",").map(tag => tag.trim())
            : [],
        cover: answers.cover,
        lastUpdated: today(),
        author: answers.author,
        status: "draft",
        contentType:answers.contentType,
        translations: {
            [answers.language]: {
                title: answers.title,
                preview: answers.preview,
                file: `articles/${slug}/${answers.language}.md`
            }
        }
    };
}
const articles = loadArticles();
const answers = await askArticleData();
const newArticle = buildArticle(
    answers,
    articles
);
function getArticleFolder(article) {

    return path.join(
        ARTICLES_PATH,
        article.slug
    );

}
const folder = getArticleFolder(newArticle);

if (fs.existsSync(folder)) {
    throw new Error("Article already exists");
} else{
    createArticleFolder(folder);

}

function createArticleFolder(folder) {

    fs.mkdirSync(folder, {
        recursive: true
    });

}
function createMarkdown(articleFolder, language) {

    const filePath = path.join(
        articleFolder,
        `${language}.md`
    );

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(
            filePath,
            "# Titolo articolo\n\n"
        );
    }

    return filePath;
}
function saveArticles(articles) {

    fs.writeFileSync(
        DATA_PATH,
        JSON.stringify(
            articles,
            null,
            4
        ),
        "utf-8"
    );

}


createMarkdown(
    folder,
    answers.language
);

articles.push(newArticle);

saveArticles(articles);
console.log(newArticle);