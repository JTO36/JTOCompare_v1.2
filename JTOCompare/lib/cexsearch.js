//Modules Required for API Call
const axios = require('axios'),
    cheerio = require('cheerio');

//Db Modules
const sqlite3 = require("sqlite3").verbose();


//////////////////////////
//CEX API Call Functions//
//////////////////////////

//Get all of the CEX data 50 at a time as there is a 50 record limit per API call
exports.getAllCEX = async() => {
    await getCEX(1, 50, 'sellprice', 'desc');
    await getCEX(51, 49, 'sellprice', 'desc');
    await getCEX(101, 49, 'sellprice', 'desc');
    await getCEX(151, 49, 'sellprice', 'desc');
    await getCEX(201, 49, 'sellprice', 'desc');
    await getCEX(251, 49, 'sellprice', 'desc');
    await getCEX(301, 49, 'sellprice', 'desc');
    await getCEX(351, 49, 'sellprice', 'desc');
    await getCEX(401, 49, 'sellprice', 'desc');
    await getCEX(451, 49, 'sellprice', 'desc');
    await getCEX(501, 49, 'sellprice', 'desc');
}

//CEX data API call
getCEX = async(firstRecord, count, sortBy, sortOrder) => {

    //CEX Product BaseUrl
    var url = "https://wss2.cex.uk.webuy.io/v3/boxes?q=%22Amiibo%22&categoryName=%22NFC%20Figures%22&inStock=1";

    const response = await axios.get(url, {
            params: { firstRecord: firstRecord, count: count, sortBy: sortBy, sortOrder: sortOrder }
        })
        .then((response) => {
            const data = response.data.response.data.boxes;
            data.forEach(item => {
                // console.log("ID", item.boxId, "Name", item.boxName, "Sell Price", item.sellPrice, "Cash Price", item.cashPrice,
                //     "Exchange Price",
                //     item.exchangePrice,
                //     "Stock",
                //     item.ecomQuantityOnHand);

                //Insert into Table
                const sql = 'INSERT INTO cex (itemID, itemName, sellPrice, cashPrice, exchangePrice, stock) VALUES(?,?,?,?,?,?)';
                db.run(sql, [item.boxId, item.boxName, item.sellPrice, item.cashPrice, item.exchangePrice, item.ecomQuantityOnHand], (err) => {
                    if (err) return console.error(err.message);
                });
            });

        })
}