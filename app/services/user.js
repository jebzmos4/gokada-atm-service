/**
 * Created by Morifeoluwa on 06/09/2018.
 * objective: building to scale
 */
const MongoDBHelper = require('../lib/mongoDBHelper');
const UserModel = require('../models/user.model');


class User {
  /**
     *
     * @param {*} logger Logger Object
     */
  constructor(logger, mongoClient) {
    this.logger = logger;
    this.mongo = new MongoDBHelper(mongoClient, UserModel);
  }

  login(data) {
    if (data.atmCard && data.pin) {
      return this.mongo.fetchOne({ cardDetails: data.atmCard });
    }
    return false;
  }

  validateWithdrawal(data) {
    this.mongo.fetchOne({ cardDetails: data.atmCard })
      .then((response) => {
        if (response[0].amount <= data.amount && data.pin) {
          this.logger.info('withdrawal approved');
          return true;
        }
        this.logger.info('not enough balance or invalid pin');
        return false;
      });
  }

  create(data) {
    this.logger.info('inserting record into DB');
    return this.mongo.save(data);
  }
}

module.exports = User;
