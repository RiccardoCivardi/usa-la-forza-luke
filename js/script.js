/*

Problema 1: Usa la forza luke (solo vanilla JS, no framework!!!)

SWAPI è un API online che ci permette di ottenere informazioni 
sull'universo di Star Wars

Step 1:
Crea un button che quando premuto recuperi i dati da https://swapi.dev/api/people 
e stampi in HTML i nomi contenuti in lista

Step 2:
Aggiungi 2 button, "avanti" e "indietro", che quando premuti ci permettano di 
fetchare le pagine precedenti o successive e stampare in html i risultati

ex. 
https://swapi.dev/api/people?page=1
https://swapi.dev/api/people?page=2
https://swapi.dev/api/people?page=3

Step 3:
Ogni personaggio fetchato con le api https://swapi.dev/api/people 
ha associato un pianeta di origine

ex.
{
  ...
  "homeworld": "https://swapi.dev/api/planets/1/"
}


per ogni personaggio stampato in pagina, vogliamo accanto 
il nome del pianeta di origine 

*/


// prendo gli elementi del dom
const fetchButton = document.getElementById('fetch-button');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const peopleList = document.getElementById('people-list');

// dichiaro le variabili
const apiUrl = 'https://swapi.dev/api/people';
// all'inizio i bottoni next prev e fetch chiameranno lo stesso url
let previousUrl = apiUrl;
let nextUrl = apiUrl;

// funzione di fetch che chiama l'API (uso async await perchè asincrona al posto di .then)
// Passo un url e mi ritorna un data
const fetchMyData = async (url) => {
  const response = await fetch(url);
  // traduco il json (anche qui uso await perchè ci mette un pò di tempo quindi è asincrona)
  const dataJson = await response.json();
  return dataJson;
}

// funzione a cui passo un array, lo cicla, e per ogni elemento genera un <li> che stampa in pagina
const renderPeopleList = (list) => {
  // prima di ciclare e stampare svuoto la lista dagli elementi che ci sono gia
  peopleList.innerHTML = '';

  list.forEach(name => {
    const li = document.createElement('li');
    li.innerText = name;
    peopleList.append(li);
  });
}


// funzione asincrona che grazie alle promise fa partire una chiamata per ogni personaggio della lista e abbina il giusto pianeta al giusto personaggio 
const getListContent = async (results) => {
  return Promise.all(
    results.map( async (person) => {
      const homeworld = await fetchMyData(person.homeworld);
      return `${person.name} - pianeta: ${homeworld.name}`;
    })
  );
};

// funzione che setta gli url per la paginazione
const setNextPrevUrls = (data) => {
  previousUrl = data.previous;
  nextUrl = data.next;
} 

// funzione di paginazione (funzione che rachiude tutte le azioni)
const pagination = async (url) => {
  // creo il data con la funzione fetchMyData()
  const data = await fetchMyData(url);
  // setto gli url di xet e prev con setNextPrevUrls()
  setNextPrevUrls(data);
  // creo la lista completa con getListContent()
  const list =  await getListContent(data.results);
  // solo dopo aver generato la lista completa allora stampo in pagina 
  renderPeopleList(list);
}


// eventi click sui bottoni che scatenano tutti la funzione di paginazione 
// al primo click tutti e 3 i bottoni chiamano l'url di base
// next e prev funzionano solo se il valore dell'url non è null
prevButton.addEventListener('click', () => {
  if(prevButton){
    pagination(previousUrl);
  } 
});

// il click su fetch riporta sempre alla prima pagina
fetchButton.addEventListener('click', () => {
  pagination(apiUrl);
});

nextButton.addEventListener('click', () => {
  if(prevButton){
    pagination(nextUrl);
  }
});

