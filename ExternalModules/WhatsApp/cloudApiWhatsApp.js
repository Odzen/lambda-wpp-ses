require('dotenv').config();
const template_evaluator = process.env.TEMPLATE_EVALUATOR;
const phone_number_id = process.env.PHONE_NUMBER_ID;
const token = process.env.WHATSAPP_TOKEN;
const axios = require('axios').default;

const formatPhone = (phoneNumber) => {
    console.log(phoneNumber);
    return phoneNumber.replace(/[+|-| ]/g, '');
  };

const dataThirdTemplate = (
    fullNameCandidate,
    fullNameEvaluator,
    phoneNumberEvaluator,
    customUrl,
    templateNameFacebook
  ) => {
    return {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: phoneNumberEvaluator,
      type: 'template',
      template: {
        name: templateNameFacebook,
        language: { code: 'en_US' }, // LANGUAGE_AND_LOCALE_CODE because of how I created the templates
        components: [
//           {
//             type: 'header',
//             parameters: [
//               {
//                 type: 'text',
//                 text: fullNameEvaluator,
//               },
//             ],
//           },
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: fullNameCandidate,
              },
              {
                type: 'text',
                text: customUrl,
              },
            ],
          },
        ],
      },
    };
  };

  export const sendMessageWithLinkCandidateEvaluator = async ({
    fullNameCandidate,
    fullNameEvaluator,
    phoneNumberEvaluator,
    customUrl,
  }) => {
    try {
        const { data } = await axios({
          method: 'POST',
          url: `https://graph.facebook.com/v12.0/${phone_number_id}/messages?access_token=${token}`,
          data: dataThirdTemplate(
            fullNameCandidate,
            fullNameEvaluator,
            formatPhone(phoneNumberEvaluator),
            customUrl,
            template_evaluator
          ),
          headers: { 'Content-Type': 'application/json' },
        });
        return data;
    } catch (e){
      throw e;
    }
  };
