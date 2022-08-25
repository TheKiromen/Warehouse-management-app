const express = require('express');
const cors = require('cors');

//Konfiguracja express'a
const expressConfig = (apiRoot, routes) => {
    const app = express();

    app.use(cors());
    app.use(express.json()); //Ustawienie aby serwer mógł obsługiwać pliki JSON
    app.use(apiRoot,routes);

    //Co zrobić przy błędzie 404
    app.use((req,res) => res.status(404).send({
        error:'Bad routing.'
    }));

    //Obsługa błędów
    app.use((err,req,res)=>{
        console.error(err.message);
        if(err.name === 'CastError')
            return res.status(400).end();
        if(res.name === 'ValidationError')
            return res.status(400).json({error: err.message});
        //Inne błędy tu

        //Zwracamy bląd serwera
        return res.status(500).end();
    })

    return app
};

module.exports = expressConfig;