const Survey = require("../../Controllers/survey");
const Remainder = require("./sendRemainders");
const Responses = require('../../ApiResponses/apiResponses').default;

 export const handler = async function ()  {
    try {
      console.log('Running Handler!!');
      const pendingSurveys = await Survey.getAllPendingSurveys();
      await Remainder.sendRemainders(pendingSurveys);
      console.log("AFTER SENDING REMAINDERS");
    }
    catch (error) {
      console.error(error);
      return Responses._400({
        message: 'Problem setting up messages for sending the remainders',
      });
    }
  };