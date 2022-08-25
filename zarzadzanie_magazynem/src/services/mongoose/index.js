const mongoose = require('mongoose');
const {mongo} = require('../../config');

//Kopiowanie ustawień z pliku config za pomocą pętli forEach
for(const[key,value] of Object.entries(mongo.options)){
    mongoose.set(key,value);
}

//Jeśli udało się połączyć z bazą
mongoose.connection.on('connected',(res)=>{
    console.log('Connected to MongoDB')
});

//Jeśli wystąpił błąd i nie udało się połączyć
mongoose.connection.on('error', (err) =>{
   console.log('Cannot connect to MongoDB \n Error: '+err);
   process.exit(-1) //Wyłączenie aplikacji
});

mongoose.connect(mongo.host)

module.exports = mongoose;