import request from "request";
import cheerio from "cheerio";
import path from "path";
import fs from "fs";
import {extractIssues} from "./issues.js";

const websiteURL = "https://github.com"

function parseAllRepos(topicURL, topicPath){
    request(topicURL, (error, response, body) => {
        if(error){
            console.log("Something went wrong with repos!");
            console.error(error);
        } else {
            if(response.statusCode == 200){
                extracthtml(body, topicPath);
            }
        }
    });

}

function extracthtml(body, topicPath){
    let $ = cheerio.load(body);
    let repos = $(".text-bold.wb-break-word");
    let reposLength = repos.length >= 8 ? 8 : repos.length;
    for(let i=0;i<reposLength;i++){
        let repoName = $(repos[i]).text().trim();
        let repoURL = websiteURL + $(repos[i]).attr("href");
        extractIssues(repoURL, repoName, topicPath);
    }
}



export const extractRepos = parseAllRepos;
