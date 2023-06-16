const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const chalk = require('chalk');
require('dotenv').config();

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
   user: process.env.EMAIL_USER,
   pass: process.env.EMAIL_PASS
  }
});

async function checkTickets() {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto('https://www.allaccess.com.ar/event/taylor-swift-the-eras-tour');

  const element = await page.$('.coming_soon_picker div[type="button"]');
  const text = await page.evaluate(element => element.textContent, element);

  if (text !== 'Agotado') {
    console.log(chalk.green('YA HAY ENTRADAS DISPONIBLES'));
    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: '¡Entradas disponibles!',
      text: 'Las entradas para el tour de Taylor Swift ya están disponibles. Ingresa a ' + URL
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  } else {
    console.log(chalk.red('Todavía no hay entradas disponibles'));
  }

  await browser.close();
}

let mailOptions = {
  from: 'quirogaserastour@gmail.com',
  to: 'quirogaserastour@gmail.com',
  subject: 'El robot inicio correctamente',
  text: '¡El robot está funcionando correctamente!'
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(chalk.red('Error:', error));
  } else {
    console.log(chalk.green('Email de prueba enviado:', info.response));
  }
});

// Comprueba las entradas cada 2 minutos
setInterval(checkTickets, 2 * 60 * 1000);
