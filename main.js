import request from "request";
import cheerio from "cheerio";
import path from "path";
import fs from "fs";
import {fileURLToPath} from 'url';
import {extractRepos} from "./repos.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const websiteURL = "https://github.com";

request((websiteURL + "/topics"), (error, response, body) => {
  if (error) {
    console.log("Something went wrong with main!");
    console.error(error);
  } else {
    if (response.statusCode == 200) {
      extractTopics(body);
    }
  }
});

function extractTopics(body){
    let $ = cheerio.load(body);
    let topics = $(".f3.lh-condensed.text-center.Link--primary.mb-0.mt-1");
    let topichrefs = $(".no-underline.d-flex.flex-column.flex-justify-center");
    for(let i=0;i<topics.length;i++){
        let topicName = $(topics[i]).text().trim();
        let topicPath = path.join(__dirname, topicName);
        dirCreator(topicPath);
        let topicURL = websiteURL + $(topichrefs[i]).attr("href");
        extractRepos(topicURL, topicPath);
    }
}

function dirCreator(path){
    if(!fs.existsSync(path)){
        fs.mkdirSync(path);
    }
}


//issues.js -> take out issues INCOMPLETE