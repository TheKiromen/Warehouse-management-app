
//Glowny plik aplikacji
const {port, ip, apiRoot} = require('./config') //Wyciagamy ustawienia serwera z pliku konfiguracyjnego
const api = require('./api') //CRUD dla naszej bazy
const express = require('./services/express') //Wyciągamy konfiugrację express'a
const mongoose = require('./services/mongoose') //Wyciągamy konfigurację mongoose'a

//Utworzenie serwera express
const app = express(apiRoot,api)



//Wyłączenie serwera
app.listen(port, ip, ()=>{
    console.log(`Express server is started on ${ip}:${port}`)
});

module.exports = app