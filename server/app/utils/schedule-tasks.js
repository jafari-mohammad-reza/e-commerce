const {default: mongoose} = require('mongoose');
const {UserModel} = require('../models/User');
const {generateOneCode} = require('./Security');
const {SendEmail, SendSms} = require('./Senders');

/**
 * put a random discount for 30 products of database
 * */
async function dailyDiscount() {
  const randomSkipNumber = Math.floor(await mongoose.model('product').count().exec().then((count) => {
    return count / 4;
  }));

  mongoose.model('product').aggregate([
    {
      $match: {
        discount: {$exists: true},
        updatedAt: {$lt: new Date() - 1000 * 60 * 60 * 12},

      },
    },
    {
      $project: {
        _id: 1,
        discount: 1,
        price: 1,
      },
    },
    {
      $skip: randomSkipNumber,
    },
    {
      $limit: 30,
    },


  ]).exec(async (err, products) => {
    if (err) {
      console.log(err);
    } else {
      for (const product of products) {
        product.discount = Math.floor(Math.random() * 75).toString();
        await mongoose.model('product').updateOne({_id: product._id}, product, (_err, _result) => {
        });
      }
      console.log('Daily discounts applied');
    }
  });
}

/**
 * active a 30% discount code for all users that their birthday is today
 * */
async function userBirthDayDiscount() {
  const date = new Date();
  const users = await UserModel.find({birthdate: {$ne: undefined}});
  for (const user of users) {
    if (new Date(user.birthdate).getMonth() === date.getMonth() && new Date(user.birthdate).getDay() === date.getDay()) {
      const code = generateOneCode(6);
      UserModel.updateOne({_id: user._id}, {
        $push: {
          'discounts': {
            code,
            percentage: 30,
            expiresIn: date.getDate() + 7,
          },
        },
      }).then((result) => {
        if (result.modifiedCount > 0) {
          user.email !== undefined ?
              SendEmail(user.email, `Happy birthday we activate a 30% discount code for you and it will be available until next week, Code : ${code}`) :
              SendSms(user.mobileNumber, `Happy birthday we activate a 30% discount code for you and it will be available until next week, Code : ${code}`);
        }
      });
    }
  }
}


module.exports = {
  DailyDiscount: dailyDiscount,
  UserBirthDayDiscount: userBirthDayDiscount,
};
