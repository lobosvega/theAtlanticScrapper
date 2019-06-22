const cheerio = require('cheerio')

const express = require('express')

const mongoose = require("mongoose");

const axios = require('axios')

const app = express()

const db = require('./models/index.js')

const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true });

app.get('/',function (req,res){
    axios.get('https://www.theatlantic.com/news/')
  .then(function (response) {
    const $ = cheerio.load(response.data);
        $('li.article.blog-article').each(
            function (i,element){
              const newsItem = {};
                const headline = $(element).children('a').children('h2.hed').text();
                const description = $(element).children('p.dek.has-dek').text();
                const date = $(element).children('ul').children('li.date').text().trim();  
                newsItem.headline = headline;
                newsItem.description = description;     
                newsItem.date = date;  
                db.Article.create(newsItem)
                .then(function(dbArticle){
                  console.log(dbArticle);
              })
              .catch(function (error) {
                console.log(error);
              });        
          });
  });

  res.send('scrapped complete');
});

app.get("/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.Article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});



app.listen(port, function() {
    console.log('app running on port 3000');
});
