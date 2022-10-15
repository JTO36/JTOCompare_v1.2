//Modules Required for API Call
const axios = require('axios'),
    cheerio = require('cheerio');

//Db Modules
const sqlite3 = require("sqlite3").verbose();

// ////////////////////////////
// //Search Website Functions//
// ////////////////////////////

//Search All Websites for Prices 
exports.searchAll = async(username) => {

    //Open App database
    db = new sqlite3.Database("./db/app.db", sqlite3.OPEN_READWRITE, (err) => {
        if (err) return console.error(err.message);
        console.log("connection sucessful");
    });

    search(username).then((response) => console.log(response));
};


//Search Websites for Price
search = async(username) => {
    //Query records from item table
    const sql = 'SELECT * FROM items where username = ?';


    db.serialize(() => {
        db.all(sql, [username], (err, rows) => {
            if (err) return console.error(err.message);
            items = [];
            rows.forEach(row => {
                // console.log(row);
                items.push(row);
            })

        })
    });

    items.forEach(async(val) => {
        const price = await fetchFromWeb(val.item_url, true, val.website_name)
            .then((price) => {
                console.log(price);
                //  //Query records from item table
                const sql = 'UPDATE items SET item_price = ? where id = ?';
                db.run(sql, [price, val.id], (err, rows) => {
                    if (err)
                        return console.error(err.message);
                });

            });
    });
};


//~Query records
//Get Price from Website
fetchFromWeb = async(url, ignoreCache, website_name, price) => {
    const HTMLData = await fetchPage(url);
    price = await processData(HTMLData, website_name, price);
    return price;
};

//Get the Webpage 
fetchPage = async(url) => {
    const HTMLData = axios
        .get(url)
        .then(res => res.data)
        .catch((error) => {
            console.error(`There was an error with ${error.url}.`);

        });
    return HTMLData;
};

//Search for the Price on the webpage, each site has a different selector path
processData = async(HTMLData, website_name, price) => {
    //    console.log(website_name);
    price = 0;
    //Check which site as the fields are different 
    if (website_name == 'AmazonDE') {
        const selectorPath = "#corePriceDisplay_desktop_feature_div > div.a-section.a-spacing-none.aok-align-center > span > span:nth-child(2) > span.a-price-whole";
        price = await WebSearch(HTMLData, selectorPath);
        //         console.log('The price at ' + website_name + ' is ' + price);
        return price;
    };

    if (website_name == 'AmazonUK') {
        const selectorPath = "#priceblock_ourprice";
        price = await WebSearch(HTMLData, selectorPath);
        //         console.log('The price at ' + website_name + ' is ' + price);
        return price;
    };

    if (website_name == 'AmazonFR') {
        const selectorPath = "#corePriceDisplay_desktop_feature_div > div.a-section.a-spacing-none.aok-align-center > span > span:nth-child(2) > span.a-price-whole";
        price = await WebSearch(HTMLData, selectorPath);
        //         console.log('The price at ' + website_name + ' is ' + price);
        return price;
    };

    if (website_name == 'AmazonES') {
        const selectorPath = "#corePriceDisplay_desktop_feature_div > div.a-section.a-spacing-none.aok-align-center > span > span.a-offscreen"
        price = await WebSearch(HTMLData, selectorPath);
        //         console.log('The price at ' + website_name + ' is ' + price);
        return price;
    };

    if (website_name == 'AmazonIT') {
        const selectorPath = ".a-offscreen"
        price = await WebSearch(HTMLData, selectorPath);
        //         console.log('The price at ' + website_name + ' is ' + price);
        return price;
    };

    if (website_name == 'BaseUK') {
        const selectorPath = "#main_frame > div.product-main-detail.product-main > div > div:nth-child(1) > div > span.price"
        price = await WebSearch(HTMLData, selectorPath);
        //         console.log('The price at ' + website_name + ' is ' + price);
        return price;
    };

    if (website_name == 'GameUK') {
        const selectorPath = "#mainPDPButtons > li > a > strong.btnPrice";
        price = await WebSearch(HTMLData, selectorPath);
        //         console.log('The price at ' + website_name + ' is ' + price);
        return price;
    };

    if (website_name == 'NintendoUK') {
        const selectorPath = "#main > div > section.section.section_1up-product > div > div > div > div > div > div > div.col-lg-6 > div > div.ProductSidebar_product__body__Db2r2 > div.ProductSidebar_product__header-lg__GeApc > div.ProductSidebar_product-price-and-gold-points__M7ZIR > div > div";
        price = await WebSearch(HTMLData, selectorPath);
        //         console.log('The price at ' + website_name + ' is ' + price);
        return price;
    };

};

// Search the Webpage for the Price using the correct selector path for the webpage 
WebSearch = async(HTMLData, selectorPath) => {
    const $ = cheerio.load(HTMLData);
    console.log($("title").text());
    try {
        var price = $(selectorPath).text()
    } catch (error) {
        console.error(error);
    }

    //  console.log($(price).text());
    return price;
};