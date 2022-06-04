import request from "request";
import cheerio from "cheerio";
import path from "path";
import fs from "fs";
import pdfkit from "pdfkit";

const websiteURL = "https://github.com"
function parseIssues(repoURL, repoName, topicPath) {
  request(repoURL, (error, response, body) => {
    if (error) {
      console.log("Something went wrong with issues!");
      console.error(error);
    } else {
      if (response.statusCode == 200) {
        extracthtml(body, repoName, topicPath);
      }
    }
  });
}

function extracthtml(body, repoName, topicPath) {
  let $ = cheerio.load(body);
  let issuesTab = websiteURL + $("#issues-tab").attr("href");
  request(issuesTab, (error, response, body) => {
    if (error) {
      console.log("No issues found for", repoName);
    } else {
      if (response.statusCode == 200) {
        getIssues(body , repoName, topicPath);
      }
    }
  });

}

function getIssues(body, repoName, topicPath) {
    let $ = cheerio.load(body);
    let issues = $(".Link--primary.h4");
    let issuesArray = [];
    
    for(let i=0;i<issues.length;i++){
        let issueLink = $(issues[i]).attr("href");
        issuesArray.push(websiteURL+issueLink);
    }

    let pdfpath = path.join(topicPath, repoName + ".pdf")
    let pdfDoc = new pdfkit();
    pdfDoc.pipe(fs.createWriteStream(pdfpath));
    pdfDoc.fontSize(15).text(JSON.stringify(issuesArray));
    pdfDoc.end();
}

export const extractIssues = parseIssues;

