import React, {Component} from 'react';
import {Input,FormGroup,Label,Modal, ModalHeader, ModalBody, ModalFooter, Table, Button} from 'reactstrap';
import axios from 'axios';


//Główna strona aplikacji
class App extends Component {

  //Zmienne opisujące aktualny stan programu
  state = {
      items: [],
      newItem:{
          name: "",
          manufacturer:"",
          quantity: 0,
          price: ""
      },
      editItem:{
          id:"",
          name: "",
          manufacturer:"",
          quantity: 0,
          price: ""
      },
      query: {
          search:"",
          field:"name"
      },
      newItemModal: false,
      editItemModal: false,
      searchItemModal:false
  }


  //Poczatkowe zaladowanie listy przedmiotów
  componentDidMount() {
    this.refreshList();
  }


  //Odsiwezenie listy
  refreshList(){
      //Pobranie listy przedmiotów z serwera
      axios.get(`http://localhost:3001/api/items`)
          .then(res => {
              //Zapisanie listy przedmiotów w stanie programu
              //i wyświetlenie ich w tabeli
              const items = res.data;
              this.setState({ items });
          })
  }

  //POKAZYWANIE OKIEN DIALOGOWYCH
  //Pokazywanie okna dodawania przedmiotu
  toggleAddItemModal(){
      this.setState({
          newItemModal:!this.state.newItemModal
      });
  }
  //Pokazywanie odna edycji przedmiotu
  toggleEditItemModal(){
      this.setState({
          editItemModal:!this.state.editItemModal
      });
  }
  //Pokazywanie okna wyszukiwarki
  toggleSearchItemModal(){
      this.setState({
          searchItemModal:!this.state.searchItemModal
      });
  }

  //FUNKCJONALNOSCI OKIEN DIALOGOWYCH
  //Wysłanie requestu o dodanie przedmiotu na serwer
  addItem(){
      axios.post('http://localhost:3001/api/items', this.state.newItem).then((res) => {
          //Brak błedow
          if(res.data.message == undefined){
              //Dodanie przedmiotu do listy przedmiotów
              let {items} = this.state;
              items.push(res.data);
              this.setState({items});

          //Wystąpił błąd
          }else{
              //Wypisanie błędu
              alert(res.data.message)
          }
      });
  }

  //Wyslanie requestu o zaktualizowanie przedmiotu na serwer
  updateItem(){
      //Zmienne pomocnicze przechowujące stan przedmiotu do modyfikacji
      let {name, manufacturer, quantity, price} = this.state.editItem;
      axios.put('http://localhost:3001/api/items/'+this.state.editItem.id, {name, manufacturer, quantity, price}).then((res)=>{
          //Brak błedow
          if(res.data.message == undefined){
              //Odświerzenie listy i zamknięcie okna dialogowego
              this.refreshList();
              this.setState({
                  //Reset zmiennych wskazujących który przdmiot jest edytowany
                  editItemModal:false,
                  editItem: {id: '', name:'', manufacturer: '', quantity: 0, price: ''}
              })
          //Wystąpił błąd
          }else{
              //Wypisanie błędu
              alert(res.data.message)
          }
      })
  }

  //Pobranie danych do formularza edycji
  editItem(id,name, manufacturer, quantity, price){
      //Ustawienie który przedmiot edytujemy
      this.setState({
          editItem: {id, name,manufacturer,quantity,price}
      })
      //Pokazanie okna dialogowego edycji
      this.toggleEditItemModal()
  }

  //Usuwanie przedmiotu
  deleteItem(id){
      axios.delete('http://localhost:3001/api/items/'+id).then((res)=>{
          //Odświerzenie listy po edycji
          this.refreshList();
      })
  }

  //Wyszukiwanie przedmiotu
  searchItem(){
      axios.get('http://localhost:3001/api/items/'+this.state.query.field+'/'+this.state.query.search).then((res)=>{
          //Brak błedow
          if(res.data.message == undefined){
              //Wyświetlenie znalezionych przedmiotów
              const items = res.data;
              this.setState({ items });
              this.toggleSearchItemModal();
          //Wystąpił błąd
          }else{
              //Wypisanie błędu
              alert(res.data.message)
          }
      })
  }


  //Kod JSX używany do generowania kodu strony
  render() {
      //Pojedyńczy przedmiot w tablicy
      let items = this.state.items.map((i) => {
          return (
              <tr>
                  <td>{i.name}</td>
                  <td>{i.manufacturer}</td>
                  <td>{i.quantity}</td>
                  <td>{i.price+" zł"}</td>
                  <td><Button color="warning" onClick={this.editItem.bind(this, i._id, i.name, i.manufacturer, i.quantity, i.price)}>Edytuj</Button></td>
                  <td><Button color="danger" onClick={this.deleteItem.bind(this, i._id)}>Usun</Button></td>
              </tr>
          )
      })

      //Główny kod strony
      return (
        <div className="App">

            {/*Okna dialogowe, domyslnie niewidoczne, pokazują się po wciśnięciu odpowiedniego przycisku*/}
            {/*DODAWANIE PRZEDMIOTU*/}
            <Modal isOpen={this.state.newItemModal} toggle={this.toggleAddItemModal.bind(this)}>
                <ModalHeader toggle={this.toggleAddItemModal.bind(this)}>Dodaj nowy przedmiot</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="name">Nazwa *</Label>
                        <Input id="name" onChange={(e) => {
                            let {newItem} = this.state;
                            newItem.name=e.target.value;
                            this.setState({
                                newItem
                            })
                        }}/>
                        <Label for="manufacturer">Producent *</Label>
                        <Input id="manufacturer" onChange={(e) => {
                            let {newItem} = this.state;
                            newItem.manufacturer=e.target.value;
                            this.setState({
                                newItem
                            })
                        }}/>
                        <Label for="quantity" >Ilosc</Label>
                        <Input id="quantity" onChange={(e) => {
                            let {newItem} = this.state;
                            newItem.quantity=e.target.value;
                            this.setState({
                                newItem
                            })
                        }}/>
                        <Label for="price">Cena *</Label>
                        <Input id="price" onChange={(e) => {
                            let {newItem} = this.state;
                            newItem.price=e.target.value;
                            this.setState({
                                newItem
                            })
                        }}/>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.addItem.bind(this)}>Dodaj</Button>{' '}
                    <Button color="secondary" onClick={this.toggleAddItemModal.bind(this)}>Anuluj</Button>
                </ModalFooter>
            </Modal>


            {/*EDYCJA PRZEDMIOTU*/}
            <Modal isOpen={this.state.editItemModal} toggle={this.toggleEditItemModal.bind(this)}>
                <ModalHeader toggle={this.toggleEditItemModal.bind(this)}>Edytuj przedmiot</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="name">Nazwa *</Label>
                        <Input id="name" value={this.state.editItem.name} onChange={(e) => {
                            let {editItem} = this.state;
                            editItem.name=e.target.value;
                            this.setState({
                                editItem
                            })
                        }}/>
                        <Label for="manufacturer">Producent *</Label>
                        <Input id="manufacturer" value={this.state.editItem.manufacturer} onChange={(e) => {
                            let {editItem} = this.state;
                            editItem.manufacturer=e.target.value;
                            this.setState({
                                editItem
                            })
                        }}/>
                        <Label for="quantity" >Ilosc</Label>
                        <Input id="quantity" value={this.state.editItem.quantity} onChange={(e) => {
                            let {editItem} = this.state;
                            editItem.quantity=e.target.value;
                            this.setState({
                                editItem
                            })
                        }}/>
                        <Label for="price">Cena *</Label>
                        <Input id="price" value={this.state.editItem.price} onChange={(e) => {
                            let {editItem} = this.state;
                            editItem.price=e.target.value;
                            this.setState({
                                editItem
                            })
                        }}/>
                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="warning" onClick={this.updateItem.bind(this)}>Edytuj</Button>{' '}
                    <Button color="secondary" onClick={this.toggleEditItemModal.bind(this)}>Anuluj</Button>
                </ModalFooter>
            </Modal>

            {/*WYSZUKIWANIE PRZEDMIOTU*/}
            <Modal isOpen={this.state.searchItemModal} toggle={this.toggleSearchItemModal.bind(this)}>
                <ModalHeader toggle={this.toggleSearchItemModal.bind(this)}>Wyszukiwarka</ModalHeader>
                <ModalBody>
                    <FormGroup>
                        <Label for="search">Szukaj:</Label>
                        <Input id="search" onChange={(e) => {
                            let {query} = this.state;
                            query.search=e.target.value;
                            this.setState({
                                query
                            })
                        }}/>
                        <Label>wyszukiwanie po:</Label>
                        <FormGroup style={{margin:"0 0 0 20px"}}>
                            <Label check>
                                <Input defaultChecked  type="radio" name="radio1" onChange={(e)=>{
                                    let {query} = this.state;
                                    query.field='name'
                                    this.setState({
                                        query
                                    })
                                }}/>
                                Nazwie
                            </Label>
                        </FormGroup>
                        <FormGroup style={{margin:"0 0 0 20px"}}>
                            <Label check>
                                <Input type="radio" name="radio1" onChange={(e)=>{
                                    let {query} = this.state;
                                    query.field='manufacturer'
                                    this.setState({
                                        query
                                    })
                                }}/>
                                Producencie
                            </Label>
                        </FormGroup>
                        <FormGroup style={{margin:"0 0 0 20px"}}>
                            <Label check>
                                <Input type="radio" name="radio1" onChange={(e)=>{
                                    let {query} = this.state;
                                    query.field='quantity'
                                    this.setState({
                                        query
                                    })
                                }}/>
                                Ilości
                            </Label>
                        </FormGroup>

                    </FormGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.searchItem.bind(this)}>Szukaj</Button>{' '}
                    <Button color="secondary" onClick={this.toggleSearchItemModal.bind(this)}>Anuluj</Button>
                </ModalFooter>
            </Modal>


            {/*PRZYCISKI DODAWANIA I WYSZUKIWANIA*/}
            <div className="buttons">
                <Button onClick={this.toggleAddItemModal.bind(this)} style={{margin:"10px"}} color="success" size="lg">Dodaj przedmiot</Button>
                <Button onClick={this.toggleSearchItemModal.bind(this)} style={{margin:"10px"}} color="primary" size="lg">Szukaj</Button>
            </div>


          <Table striped>
            {/*NAGLOWEK TABELI*/}
            <thead>
            <tr>
                <th>Nazwa:</th>
                <th>Producent:</th>
                <th>Ilosc:</th>
                <th>Cena:</th>
                <th>Edytuj</th>
                <th>Usun</th>
            </tr>
            </thead>

            {/*TRESC TABELI*/}
            <tbody>
                {
                    //Wypisanie wszystkich przedmiotów
                    items
                }
            </tbody>
          </Table>
        </div>
    );
  }
}
export default App;
