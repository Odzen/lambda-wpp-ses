const Responses = require('../../ApiResponses/apiResponses').default;
const SES = require('../../ExternalModules/AwsServices/SES/ses');
const WhatsApp = require('../../ExternalModules/WhatsApp/cloudApiWhatsApp');

export const sendRemainders = async function (pendingSurveys) {
  for  (let survey of pendingSurveys) {
    const encodeId = Buffer.from(survey._id).toString('base64');
    const {references, candidate} = survey;
    for await (let reference of references) {
        const {evaluator} =  reference;
        console.log("PENDING EVALUATOR EMAIL", evaluator.email);
        const encodeEmail = Buffer.from(evaluator.email).toString(
        'base64'
        );
        const customlink = `www.camila.build/survey?survey=${encodeId}&evaluator=${encodeEmail}`;

      const msg = {
      Destination: {
        ToAddresses: [evaluator.email]
      },
      ReplyToAddresses: ['team@camila.build'],
      Source: 'team@camila.build',
      Template:
        survey.surveyTemplate._id == '6294c4db037b2c370f2b5198'
          ? 'PivotEmailReferences'
          : 'Email_for_references_to_evaluate',
      TemplateData: JSON.stringify({
        candidateName: `${candidate.firstName} ${candidate.lastName}`,
        referenceName: evaluator.firstName,
        linkReference: customlink,
        }),
      };
      try {
        await SES.default(msg);
        await WhatsApp.sendMessageWithLinkCandidateEvaluator({
          fullNameCandidate: `${candidate.firstName} ${candidate.lastName}`,
          fullNameEvaluator: `${evaluator.firstName} ${evaluator.lastName}`,
          phoneNumberEvaluator: evaluator.phoneNumber,
          customUrl: customlink,
      });
      } catch (error) {
        console.error('error sending remainders', error);
        return Responses._400({ message: 'The remainders failed to send' });
      }
    }
  }
  return Responses._200({message: "Success sending the remainder(s)"});
};


