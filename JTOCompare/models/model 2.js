//db
const sqlite3 = require("sqlite3").verbose();

class AppDAO {
    constructor(dbFilePath) {
        //Open User database Users
        this.db = new sqlite3.Database(dbFilePath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) return console.error(err.message);
            else {
                console.log("connection sucessful");
            }
        });
    }

    run(sql, params = []) {
        this.db.run(sql, params, function(err) {
            if (err) {
                console.log('Error running sql ' + sql)
                console.log(err)
                    //    reject(err)
            } else {
                //        resolve({ id: this.lastID })
            }
        })
    }

    get(sql, params = []) {
        return this.db.get(sql, params, (err, result) => {
            if (err) {
                console.log('Error running sql: ' + sql)
                console.log(err)

            } else {
                //            resolve(result)
            }
        })

    }

    all(sql, params = []) {
        return this.db.all(sql, params, (err, rows) => {
            if (err) {
                console.log('Error running sql: ' + sql)
                console.log(err)

                //   reject(err)
            } else {
                //         resolve(rows)
            }
        })
    }


}
module.exports = AppDAO