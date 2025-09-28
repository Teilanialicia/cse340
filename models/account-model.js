const pool = require("../database/index")
const account = {}
/* *****************************
*   Register new account
* *************************** */
account.registerAccount = async function(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
account.checkExistingEmail = async function(account_email){
  try {
    const sql = "SELECT 1 FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

account.loginAccount = async function(account_email, account_password) {
  try {
    const sql = "SELECT 1 FROM account WHERE account_email = $1 AND account_password = $2"
    const email = await pool.query(sql, [account_email, account_password]);
    // If an email exists with the matching password, there should be more than 1 row
    console.log(email.rowCount);
    return email.rowCount;
  } 
  catch (error) {
    return error.message;
  }
}

module.exports = account;