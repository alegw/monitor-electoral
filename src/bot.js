const Bot = require('./lib/Bot')
const SOFA = require('sofa-js')
const Fiat = require('./lib/Fiat')

let bot = new Bot()

// ROUTING

bot.onEvent = function(session, message) {
  switch (message.type) {
    case 'Init':
      welcome(session)
      break
    case 'Message':
      onMessage(session, message)
      break
    case 'Command':
      onCommand(session, message)
      break
    case 'Payment':
      onPayment(session, message)
      break
    case 'PaymentRequest':
      //welcome(session)
      break
  }
}

function onMessage(session, message) {
  sendMessage(session, `Recibimos tu mensaje o foto. Por favor, síguenos enviando más detalles y fotos sobre este incidente. Cuando quieras hablar sobre otro incidente, presiona el botón "Nuevo incidente".`)
}

function onCommand(session, command) {
  switch (command.content.value) {
    case 'nuevo_incidente':
      nuevo_incidente(session)
      break
    case 'count':
      count(session)
      break
    case 'donate':
      donate(session)
      break
    }
}

function onPayment(session, message) {
  if (message.fromAddress == session.config.paymentAddress) {
    // handle payments sent by the bot
    if (message.status == 'confirmed') {
      // perform special action once the payment has been confirmed
      // on the network
    } else if (message.status == 'error') {
      // oops, something went wrong with a payment we tried to send!
    }
  } else {
    // handle payments sent to the bot
    if (message.status == 'unconfirmed') {
      // payment has been sent to the ethereum network, but is not yet confirmed
      sendMessage(session, `Thanks for the payment! 🙏`);
    } else if (message.status == 'confirmed') {
      // handle when the payment is actually confirmed!
    } else if (message.status == 'error') {
      sendMessage(session, `There was an error with your payment!🚫`);
    }
  }
}

// STATES

function welcome(session) {
  sendMessage(session, `¡Hola! Somos el equipo de observación electoral para la jornada del 20 de mayo de 2018. Puedes reportar un incidente presionando el botón "Nuevo incidente" que ves abajo.\n\nApreciamos que nos envíes fotos de lo que está ocurriendo y tantos mensajes de texto como quieras detallando la situación.\n\nCuando quieras reportar otro incidente distinto, vuelve a presionar el botón "Nuevo incidente".`)
}

function nuevo_incidente(session) {
  sendMessage(session, `Estás reportando un incidente. Mándanos fotos y relata lo que ocurre. Cuando quieras enviarnos detalles sobre otra ocurrencia distinta (incluso otra de la que ya hayas hablado antes), presiona el botón "Nuevo incidente".`)
}

// example of how to store state on each user
function count(session) {
  let count = (session.get('count') || 0) + 1
  session.set('count', count)
  sendMessage(session, `${count}`)
}

function donate(session) {
  // request $1 USD at current exchange rates
  Fiat.fetch().then((toEth) => {
    session.requestEth(toEth.USD(1))
  })
}

// HELPERS

function sendMessage(session, message) {
  let controls = [
    {type: 'button', label: 'Nuevo incidente', value: 'nuevo_incidente'}
    //,{type: 'button', label: 'Count', value: 'count'},
    //{type: 'button', label: 'Donate', value: 'donate'}
  ]
  session.reply(SOFA.Message({
    body: message,
    controls: controls,
    showKeyboard: false,
  }))
}
