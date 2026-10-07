const STUDENT_ID = process.env.STUDENT_ID;
const STUDENT_NAME = process.env.STUDENT_NAME;

const CODE_PREFIX = STUDENT_ID.slice(-3);                 // "035"
const LAST_DIGIT = parseInt(STUDENT_ID.slice(-1), 10);    // 5
const VAT_PERCENT = LAST_DIGIT + 4;                       // 9  

module.exports = { STUDENT_ID, STUDENT_NAME, CODE_PREFIX, VAT_PERCENT };