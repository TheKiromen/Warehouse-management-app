const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const ItemSchema = new Schema({
    //Nazwa produktu
    name:{
        type: String,
        required: [true, "Item name cannot be empty!"]
    },
    //Producent produktu
    manufacturer:{
        type: String,
        required: [true, "Manufacturer field cannot be empty!"]
    },
    //Ilość sztuk na stanie, jeśli nie podana przyjmuuje wartość 0
    quantity:{
        type: Number,
        default: 0
    },
    //Cena za pojedyńczą sztukę przedmiotu
    price:{
        type: String,
        required: [true, "Price cannot be empty!"]

    }
},  //Usuwa niepotrzebne dodatkowe dane dodawane automatycznie przez bazę.
    {
    toJSON: {
        transform: (obj, ret) => {
            delete ret['__v']
        }
    }
});


module.exports = Mongoose.model('items',ItemSchema);