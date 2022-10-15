const axios = require('axios'),
    cheerio = require('cheerio');

//const fs = require('fs'),
//    promise = require('fs/promises'),
//    path = require('path');

const sqlite3 = require("sqlite3").verbose();
const { EventEmitter } = require('events');
const EventHandler = new EventEmitter();

var items = [];

//Open Database Items
const db = new sqlite3.Database("./db/app.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
    //     console.log("connection sucessful to Search db");
});

search();

async function search() {


    //Query records from item table
    const sql = 'SELECT * FROM items WHERE website_name = ?';

    db.serialize(() => {
        db.all(sql, ['AmazonES'], (err, rows) => {
            if (err) return console.error(err.message);
            items = [];
            rows.forEach(row => {
                items.push(row);
            })
            EventHandler.emit('Done', 'The query is completed')
        })
    });

};



EventHandler.on('Done', () => {
    //     console.log('Event Triggered');

    //loop around items
    items.forEach(async(val) => {
        price = await fetchFromWeb(val.item_url, true, val.website_name);
        val.item_price = price;
        //         console.log('For EACH ' + price);
        console.log(val);


        //  //Query records from item table
        const sql = 'UPDATE items SET item_price = ? where id = ?';


        db.run(sql, [price, val.id], (err, rows) => {
            if (err) return console.error(err.message);

        })
    });

    //  db.close((err) => {
    //      if (err) return console.error(err.message);
    //      //     console.log('DB Connection closed')
    //  });


});

//~Query records
async function fetchFromWeb(url, ignoreCache, website_name, price) {
    const HTMLData = await fetchPage(url);
    price = await processData(HTMLData, website_name, price);
    return price;
};

async function fetchPage(url) {
    const HTMLData = axios
        .get(url)
        .then(res => res.data)
        .catch((error) => {
            console.error(`There was an error with ${error.url}.`);

        });
    return HTMLData;
};

async function processData(HTMLData, website_name, price) {
    //    console.log(website_name);
    price = 0;
    //Check which site as the fields are different 
    if (website_name == 'AmazonDE') {
        price = await AmazonDE(HTMLData);
        //         console.log('The price at ' + website_name + ' is ' + price);
        return HTMLData, price;
    };

    if (website_name == 'AmazonUK') {
        price = await AmazonUK(HTMLData);
        //         console.log('The price at ' + website_name + ' is ' + price);
        return price;
    };

    if (website_name == 'AmazonFR') {
        price = await AmazonFR(HTMLData);
        //         console.log('The price at ' + website_name + ' is ' + price);
        return price;
    };

    if (website_name == 'AmazonES') {
        price = await AmazonES(HTMLData);
        //         console.log('The price at ' + website_name + ' is ' + price);
        return price;
    };

    if (website_name == 'AmazonIT') {
        price = await AmazonIT(HTMLData);
        //         console.log('The price at ' + website_name + ' is ' + price);
        return price;
    };

    //  if (website_name == 'BaseUK') {
    //      console.log('BaseUK Search');
    //      BaseUK(HTMLData);
    //  };

};

async function AmazonUK(HTMLData, price) {
    if (HTMLData == null)() => {
        console.log("Error getting data from website " + website_name);
    }
    else {
        const $ = cheerio.load(HTMLData);
        console.log($("title").text());
        var price = $("#priceblock_ourprice").text();
        return price;
    };
};

async function AmazonFR(HTMLData, price) {
    if (HTMLData == null)() => {
        console.log("Error getting data from website " + website_name);
    }
    else {
        const $ = cheerio.load(HTMLData);
        console.log($("title").text());
        var price = $('.a-offscreen').first().text();
        //     console.log('func price' + price);
        return price;
    };
};

async function AmazonDE(HTMLData, price) {
    if (HTMLData == null)() => {
        console.log("Error getting data from website " + website_name);
    }
    else {
        const $ = cheerio.load(HTMLData);
        console.log($("title").text());
        price = $("#priceblock_ourprice").text();
        //var price = $(".a-offscreen").text();
        return price;
        //     console.log($(price).text());
    };
};

async function AmazonES(HTMLData, price) {
    if (HTMLData == null)() => {
        console.log("Error getting data from website " + website_name);
    }
    else {

        const $ = cheerio.load(HTMLData);
        console.log($("title").text());
        var price = $("#corePriceDisplay_desktop_feature_div > div.a-section.a-spacing-none.aok-align-center > span > span:nth-child(2) > span.a-price-whole").text();
        //        var price = $('.a-offscreen').first().text();
        console.log(price);
        return price;
    };
};

async function AmazonIT(HTMLData, price) {
    if (HTMLData == null)() => {
        console.log("Error getting data from website " + website_name);
    }
    else {
        const $ = cheerio.load(HTMLData);
        console.log($("title").text());
        var price = $('.a-offscreen', 'corePriceDisplay_desktop_feature_div').text();
        //console.log(price);
        return price;
    };
};

async function BaseUK(HTMLData) {
    const $ = cheerio.load(HTMLData);
    console.log("Amazon BASE");
    console.log($("title").text());
    var price = $(".price:last");
    console.log($(price).text());
};