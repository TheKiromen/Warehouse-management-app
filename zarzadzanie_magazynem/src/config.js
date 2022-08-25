
//Konfiguracja aplikacji
const config ={
    //Ustawiania serwera
    env:process.env.NODE_ENV || "development",
    port: 3001,
    ip: '127.0.0.1',
    apiRoot: '/api',

    //Konfiguracja bazy danych
    mongo:{
        host:'<<<YOUR CONNECTION STRING HERE>>>',
        options:{
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            debug: true
        }
    }
}


module.exports = config;