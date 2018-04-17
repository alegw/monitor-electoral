const Bot = require('./lib/Bot')
const SOFA = require('sofa-js')
const Fiat = require('./lib/Fiat')

let bot = new Bot()

// REPORT CLASSIFICATIONS
// A - Ventajismo: Uso de recursos públicos /funcionarios públicos beneficiando a Maduro
// B - obstrucción de la campaña electoral de la oposición / violencia contra candidato o su comando
// C - Coacción a electores. Se amenaza o electores o se ofrecen recompensas a cambio del voto por un candidato.
// D - Operación morrocoy para la formación y acreditación de ciudadanos sorteados como miembros de mesa.
//
// MACHINE STATES
// Intro
// Reporting
// Classifying
// Locating
// Identifying user

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
  let mode = session.get('mode');
  switch (mode) {
      case 'Intro':
          var message = `Recibimos tu primer mensaje y abrimos un nuevo reporte. Por favor, envía más fotos o mensajes que describan el incidente. Cuando termines, presiona "Terminar reporte".`;
          var controls = [
              {type: 'button', label: 'Terminar reporte', value: 'cerrar_descripcion'}
          ]
          session.reply(SOFA.Message({body: message, controls: controls}));;
          break
      case 'Reporting':
          var message = `Recibimos tu mensaje. Envía fotos o más mensajes que describan el incidente. Cuando termines, presiona "Terminar reporte".`;
          var controls = [
              {type: 'button', label: 'Terminar reporte', value: 'cerrar_descripcion'}
          ]
          session.reply(SOFA.Message({body: message, controls: controls}));;
          break
      case 'Classifying':
          var message = `Por favor, ayúdanos a clasificar el último reporte que escribiste utilizando los botones debajo.`;
          var controls = [
              {type: 'button', label: 'Ventajismo', value: 'pedir_confirmacion_ventajismo'},
              {type: 'button', label: 'Obstrucción', value: 'pedir_confirmacion_obstruccion'},
              {type: 'button', label: 'Coacción', value: 'pedir_confirmacion_coaccion'},
              {type: 'button', label: 'Lentitud', value: 'pedir_confirmacion_lentitud'},
          ]
          session.reply(SOFA.Message({body: message, controls: controls}));;
          break
      case 'Locating':
          var message = `Cuando termines presiona "Confirmar dirección".`;
          var controls = [
              {type: 'button', label: 'Confirmar dirección', value: 'confirmar_direccion'}
          ];
          session.reply(SOFA.Message({body: message, controls: controls, showKeyboard: true}));
          break
      case 'Identifying':
          var message = `Cuando termines presiona "Confirmar datos".`;
          var controls = [
              {type: 'button', label: 'Confirmar datos', value: 'confirmar_datos'}
          ];
          session.reply(SOFA.Message({body: message, controls: controls, showKeyboard: true}));
          break
  }
}

function onCommand(session, command) {
  switch (command.content.value) {
    case 'nuevo_reporte':
      session.set('mode', 'Reporting');
      var message = `Por favor, describe en pocas palabras lo que observaste.`;
      var controls = [
          {type: 'button', label: 'Nuevo reporte', value: 'nuevo_reporte'}
      ];
      session.reply(SOFA.Message({body: message, controls: controls}));;
      break
    case 'cerrar_descripcion':
      session.set('mode', 'Classifying');
      var message = `Listo, el incidente quedó registrado. ¿Qué tipo de incidente es?`;
      var controls = [
          {type: 'button', label: 'Ventajismo', value: 'pedir_confirmacion_ventajismo'},
          {type: 'button', label: 'Obstrucción', value: 'pedir_confirmacion_obstruccion'},
          {type: 'button', label: 'Coacción', value: 'pedir_confirmacion_coaccion'},
          {type: 'button', label: 'Lentitud', value: 'pedir_confirmacion_lentitud'}
      ];
      session.reply(SOFA.Message({body: message, controls: controls}));;
      break
    case 'pedir_confirmacion_ventajismo':
      var message = `Ventajismo es el uso de recursos o funcionarios para beneficiar a un candidato.\n\n¿Quieres clasificar tu último reporte en esta categoría?`;
      var controls = [
          {type: 'button', label: 'Sí', value: 'confirmar_clasificacion'},
          {type: 'button', label: 'Otras opciones', value: 'cerrar_descripcion'}
      ];
      session.reply(SOFA.Message({body: message, controls: controls}));;
      break
    case 'pedir_confirmacion_obstruccion':
      var message = `Obstrucción es impedir o sabotear la campaña electoral de alguno de los bandos.\n\n¿Quieres clasificar tu último reporte en esta categoría?`;
      var controls = [
          {type: 'button', label: 'Sí', value: 'confirmar_clasificacion'},
          {type: 'button', label: 'Otras opciones', value: 'cerrar_descripcion'}
      ];
      session.reply(SOFA.Message({body: message, controls: controls}));;
      break
    case 'pedir_confirmacion_coaccion':
      var message = `Coacción es amenazar a los electores u ofrecerles recompensas por votar por un candidato.\n\n¿Quieres clasificar tu último reporte en esta categoría?`;
      var controls = [
          {type: 'button', label: 'Sí', value: 'confirmar_clasificacion'},
          {type: 'button', label: 'Otras opciones', value: 'cerrar_descripcion'}
      ];
      session.reply(SOFA.Message({body: message, controls: controls}));;
      break
    case 'pedir_confirmacion_lentitud':
      var message = `Lentitud es aplicar "operación morrocoy" para formar o acreditar ciudadanos sorteados como miembros de mesa.\n\n¿Quieres clasificar tu último reporte en esta categoría?`;
      var controls = [
          {type: 'button', label: 'Sí', value: 'confirmar_clasificacion'},
          {type: 'button', label: 'Otras opciones', value: 'cerrar_descripcion'}
      ];
      session.reply(SOFA.Message({body: message, controls: controls}));;
      break
    case 'confirmar_clasificacion':
      session.set('mode', 'Locating');
      var message = `Gracias. Ahora escribe dónde ocurrió este hecho (si los sabes, especifica dirección, parroquia, municipio y estado). \n\nCuando termines presiona "Confirmar dirección".`;
      var controls = [
          {type: 'button', label: 'Confirmar dirección', value: 'confirmar_direccion'}
      ];
      session.reply(SOFA.Message({body: message, controls: controls, showKeyboard: true}));
      break
    case 'confirmar_direccion':
      session.set('mode', 'Identifying');
      if (session.get('userHasBeenAskedForId') == undefined) {
        session.set('userHasBeenAskedForId', true);
        var message = `¡Casi listos! Ahora, ¿puedes darnos algún dato personal, como tu cédula o número de teléfono, para localizarte en caso de que necesitemos más información?\n\nNo compartiremos tus datos con nadie. Cuando termines, presiona "Confirmar datos".`;
        var controls = [
            {type: 'button', label: 'Confirmar datos', value: 'confirmar_datos'},
            {type: 'button', label: 'Prefiero no compartir datos', value: 'confirmar_datos'}
        ];
        session.reply(SOFA.Message({body: message, controls: controls, showKeyboard: true}));
      }
      else {
        session.set('mode', 'Reporting');
        var message = "Muchas gracias por tu reporte. Inicia uno nuevo usando el botón debajo.";
        var controls = [
            {type: 'button', label: 'Nuevo reporte', value: 'nuevo_reporte'}
        ];
        session.reply(SOFA.Message({body: message, controls: controls}));;
      }
      break
    case 'confirmar_datos':
          session.set('mode', 'Reporting');
          var message = "Muchas gracias por tu reporte. Inicia uno nuevo usando el botón debajo.";
          var controls = [
              {type: 'button', label: 'Nuevo reporte', value: 'nuevo_reporte'}
          ];
          session.reply(SOFA.Message({body: message, controls: controls}));;
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

function welcome(session) {
  session.set('mode', 'Intro');
  let controls = [
    {type: 'button', label: 'Nuevo reporte', value: 'nuevo_reporte'}
  ];
  let message = `¡Hola! Somos el equipo de observación electoral en Venezuela. Puedes reportar un incidente relacionado a la campaña presionando el botón "Nuevo reporte" que ves abajo.`;
  session.reply(SOFA.Message({body: message, controls: controls}));;
}

function donate(session) {
  // request $1 USD at current exchange rates
  Fiat.fetch().then((toEth) => {
    session.requestEth(toEth.USD(1))
  })
}
