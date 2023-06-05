require('dotenv').config();
const mongoose = require('mongoose');
const Survey = require('../Database/Models/surveyModel');
const moment = require('moment');

async function connect() {
  try{
      const db=await mongoose.connect(process.env.MONGOBD_CNN);
      console.log(`Mongo Connection Open in host:${db.connection.host}-Wait a few seconds more please!! Data is Comming...`);
  }
  catch(err){
      console.error("ERROR TRYING TO CONNECT to MONGODB Atlas :(");
      console.error(err);
  }
}

connect();

export const getAllPendingSurveys = async function() {
  // Query to get references pending to answer
    try{
      let initialDate = moment().subtract(5, "d");
      let finalDate = moment();
      // Query to get references pending to answer
      let surveys = await Survey.default.aggregate([
        // Join references
        {
          $lookup: {
            from: "references",
            localField: "references",
            foreignField: "_id",
            pipeline: [
              //Join evaluator
              {
                $lookup: {
                  from: "users",
                  localField: "evaluator",
                  foreignField: "_id",
                  as: "evaluator",
                },
              },
              {
                $unwind: "$evaluator",
              },
              // Remove answered references
              {
                $match: {
                  status: "Pending",
                },
              },
            ],
            as: "references",
          },
        },
        // Join Users to get candidate
        {
          $lookup: {
            from: "users",
            localField: "candidate",
            foreignField: "_id",
            as: "candidate",
          },
        },
        {
          $unwind: "$candidate",
        },
        // Join to get survey template
        {
          $lookup: {
            from: "surveytemplates",
            localField: "surveyTemplate",
            foreignField: "_id",
            as: "surveyTemplate",
          },
        },
        {
          $unwind: "$surveyTemplate",
        },
        {
          $match: {
            references: { $elemMatch: { status: "Pending" } },
            createdAt: { $gte: new Date(initialDate), $lt: new Date(finalDate) },
          },
        },
      ]);

        return surveys;
    }
    catch(e){
        throw { status: e?.status || 500, message: e?.message || e };
    }
};
