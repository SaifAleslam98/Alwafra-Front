var express = require('express');
var router = express.Router();
const fs = require('fs');
const puppeteer = require('puppeteer');
const path = require('path');

const { isAuthorized } = require('../utils/authentication');
const { title } = require('process');
const { default: axios } = require('axios');

const {formatDate, formatNumber} = require('../utils/helpers');

router.use(isAuthorized);


/* GET Finance. */
router.get('/', function (req, res, next) {
  res.render('finance/financial', {
    title: 'الحسابات',
    userName: res.locals.userName,
    userLoggedIn: res.locals.userLoggedIn,
  });
});

/* GET Payments. */
router.get('/payments', function (req, res, next) {
  res.render('finance/payments', {
    title: 'الإيرادات',
    userName: res.locals.userName,
    userLoggedIn: res.locals.userLoggedIn,
  });
});

/* GET Deposits. */
router.get('/deposit', function (req, res, next) {
  res.render('finance/deposit', {
    title: 'التأمينات',
    userName: res.locals.userName,
    userLoggedIn: res.locals.userLoggedIn,
  });
});

/* GET Refund. */
router.get('/refund', function (req, res, next) {
  res.render('finance/refund', {
    title: 'التأمينات المستردة',
    userName: res.locals.userName,
    userLoggedIn: res.locals.userLoggedIn,
  });
});

/* GET Expense. */
router.get('/expense', function (req, res, next) {
  res.render('finance/expense', {
    title: 'المنصرفات',
    userName: res.locals.userName,
    userLoggedIn: res.locals.userLoggedIn,
  });
});

/* GET Refund Back. */
router.get('/depositBack', function (req, res, next) {
  res.render('finance/depositBack', {
    title: 'استرداد التأمين',
    userName: res.locals.userName,
    userLoggedIn: res.locals.userLoggedIn,
  });
});

// View print page
router.get('/invoice/:id', async function (req, res, next) {
  try {
    const myHeader = {
      'Authorization' : `Bearer ${req.cookies.token}`
    }
    const id = req.params.id
    const responseData = await axios.get(`https://alwafra-api.onrender.com/api/v1/payment/${id}`,{
      headers: myHeader
    });
    const myData = responseData.data.data
    let date = formatDate(myData.createdAt)
    let invoiceType = '';
    switch(myData.serviceType){
      case 'deposit': invoiceType = 'تأمين'
      case 'visa': invoiceType = 'تأشيرة'
      
    }
    let amount = formatNumber(myData.amount)
    const data ={
      id:myData._id,
      serial:myData.serialNumber,
      name:myData.serviceId.slug_ar,
      date,
      invoiceType,
      content:myData.serviceId.visa_type,
      price:amount,
      total:amount
    };
    res.render("finance/invoice",{title:'Print', data})
  } catch (error) {
    console.log(error)
  }
});

// Print the document
router.get('/invoice/:id/pdf', async (req,res)=>{
  const browser = await puppeteer.launch({
    headless:true,
    args:["--no-sandbox",
      "--disable-setuid-sandbox"
    ]
  });
  const page = await browser.newPage();
  await page.setCookie({
    name:"token",
    value:req.cookies.token,
    domain:"alwafra-front.onrender.com",
    path:"/",
    httpOnly:true
  });
  const url = `https://alwafra-front.onrender.com/finance/invoice/${req.params.id}`;
  await page.goto(url, {waitUntil: "networkidle0"});
  const pdf = await page.pdf({
    format:"A4",
    printBackground:true
  });
  await browser.close();

  res.contentType("application/pdf");
  res.setHeader(
    "content-Disposition",
    `attachment; filename=${req.params.id}_invoice.pdf`
  );
  res.send(pdf);
})
module.exports = router;
