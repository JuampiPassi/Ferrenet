var Firebird = require('node-firebird');
const config = require('./config.json');

let paljetPool = Firebird.pool(10, { host: config.firebird.host, database: config.firebird.database, user: config.firebird.user, password: config.firebird.password, port: config.firebird.port || 3050 });


const getFBTransac = (pool, isolation) => {
  return new Promise((res, rej) => {
    pool.get(function (err, db) {
      if (err)
        rej(err);
      else {
        db.transaction(isolation, function (err, transaction) {
          if (err)
            rej(err);
          else
            res({
              commit: () => {
                return new Promise((res, rej) => {
                  transaction.commit((err) => {
                    if (err)
                      rej(err);
                    else {
                      res();
                      db.detach();
                    }
                  });
                })

              },
              rollback: () => { transaction.rollback(); db.detach(); },
              query: (query, params) => {
                return new Promise((res, rej) => {
                  transaction.query(query, params, function (err, result) {
                    if (err)
                      rej(err);
                    else
                      res(result)
                  })
                })
              }
            });
        });
      }
    })
  })
}

module.exports = {


  getPaljetTransac: () => {
    return getFBTransac(paljetPool);
  },
}