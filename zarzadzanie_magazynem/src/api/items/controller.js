const Item = require('./model');
let myItem;
let items;


//TWORZENIE NOWEGO ITEM
const create = async ({body}, res) => {
    try{
        //Zmienne do szukania duplikatów
        myItem = new Item(body).toJSON();
        items = await Item.find();


        //Weryfikacja ilosci
        if(myItem.quantity<0){
            return res.json({message:"Ilosc nie moze byc mniejsza niz 0!"}).status(409);
        }


        //Weryfikacja ceny
        let regexp = new RegExp('^([^0]((\\d*[,.]\\d{1,2})|(\\d+)))$');
        if(myItem.price === undefined){
            return res.json({message:"Cena nie moze byc pusta!"}).status(409);
        }
        if(!regexp.test(myItem.price)){
            return res.json({message:"Zly format ceny!"}).status(409);
        }


        //Szukanie duplikatów
        for(let itm of items) {
            if (compareItems(itm.toJSON(), myItem)) {
                //Jeśli item się powtarza (ma taką samą nazwę i producenta), nie dodaje do bazy.
                return res.json({message: "Przedmiot juz istnieje"}).status(409);
            }
        }


        //Dodanie nowego obiektu do bazy
        const result = await Item.create(myItem);
        return res.status(201).json(result);
    }catch(err){
        return res.json({message:"Uzupelnij wszystkie wymagane pola!"}).status(409);
    }
};


//ZWRACA WSZYSTKIE ELEMENTY ITEM
const show = async ({ query }, res) => {
    try{
        const items = await Item.find();
        return res.json(items).status(200);
    }catch(err){
        return res.json({message:err});
    }
};


//ZWRACA KONKRETNY ELEMENT ITEM
const search = async (req, res, next) => {
    let result;
    try{
        switch(req.params.badge){
            //Szukanie po ID
            case "id":
                result= await Item.find({id:req.params.handler});
                break;
            //Szukanie po nazwie
            case "name":
                result= await Item.find({name:req.params.handler});
                break;
            //Szukanie po producencie
            case "manufacturer":
                result= await Item.find({manufacturer:req.params.handler});
                break;
            //Szukanie po ilości
            case "quantity":
                result= await Item.find({quantity:req.params.handler});
                break;
            //Błędny parametr
            default:
                result = null;
                break;
        }
        if(result){
            res.json(result).status(200);
            return;
        }
        return res.json({message:"Przedmiot nie istnieje!"}).status(404);
    }catch(err){
        next(err);
    }
};


//AKTUALIZUJE KONKRETNY ELEMENT ITEM
const update = async ({body, params}, res, next) => {
    try {
        const item = await Item.findById(params.id);
        if (item) {

            //Zmienna pomocnicza
            myItem = new Item(body).toJSON();

            //Weryfikacja ilosci
            if(myItem.quantity<0){
                return res.json({message:"Ilosc nie moze byc mniejsza niz 0!"}).status(409);
            }


            //Weryfikacja ceny
            let regexp = new RegExp('^([^0]((\\d*[,.]\\d{1,2})|(\\d+)))$');
            if(myItem.price === undefined){
                return res.json({message:"Cena nie moze byc pusta!"}).status(409);
            }
            if(!regexp.test(myItem.price)){
                return res.json({message:"Zly format ceny!"}).status(409);
            }


            //Aktualizacja elementu
            const serverResponse = await Item.updateOne({_id:params.id},{$set: body});
            res.json([item,body,serverResponse]);
            return;
        }
        res.json({message: "Przedmiot nie istnieje!"}).status(404);
    } catch (err) {
        next(err);
    }
};


//USUWA KONKRETNY ITEM Z BAZY
const destroy = async ({params}, res, next) => {
    try {
        const item = await Item.findById(params.id);
        if(item){
            const serverResponse = await Item.remove({_id:params.id});
            res.json([serverResponse,item]).status(204);
        }
        res.json({message: "Przedmiot nie istnieje!"}).status(404);
    } catch (err) {
        next(err);
    }
};



module.exports = {
    create, search, show, update, destroy
};




//Metoda do własnego porównywania instancji obiektów Item
function compareItems(i1,i2){
    if(i1.name.toLowerCase()===i2.name.toLowerCase()) {
        if (i1.manufacturer.toLowerCase() === i2.manufacturer.toLowerCase()) {
            //Items są takie same jeśli mają taką samą nazwę i producenta
            return true;
        }
    }
    //Items są różne
    return false;
}
