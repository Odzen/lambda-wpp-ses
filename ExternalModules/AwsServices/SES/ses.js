require('dotenv').config();
const AWS = require('aws-sdk');
const ses = new AWS.SES();

// AWS template
const sendTemplateEmail = (params) => {
  return ses.sendTemplatedEmail(params).promise();
};

export default sendTemplateEmail;
