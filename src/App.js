import './App.css';
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react';

import { CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import axios from 'axios';
import { Icon } from 'leaflet';

function App() {
  const MAPTILER_ACCESS_TOKEN = 'OZ4HFDYGoEnutXVI68gC'
  const MAP_ID = 'streets'


function mapTiler (x, y, z, dpr) {
  return `https://api.maptiler.com/maps/${MAP_ID}/256/${z}/${x}/${y}${dpr >= 2 ? '@2x' : ''}.png?key=${MAPTILER_ACCESS_TOKEN}`
}

const [coordinates,setCoordinates] = useState([8.5241,76.9366])
const [locations,setLocations] = useState([])
const screenWidth = window.innerWidth
const successCallback = (position) => {
  console.log(position);
  console.log(`coords are : ${position.coords.latitude}, ${position.coords.longitude}`)
  setCoordinates([position.coords.latitude,position.coords.longitude])
  
};


const errorCallback = (error) => {
  console.log(error);
};

useEffect(()=>{
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  axios.get('http://localhost:5000/').then((res)=>{
    res.data.map((r)=>{
    //setLocations(locations.concat([[r.lat,r.lon]]))
    //setLocations([...locations,[r.lat,r.lon]])
    setLocations((prevState) => ([ ...prevState, [r.lat,r.lon] ]));

    })
  })    
},[])

const geoCode = () => {
  axios.get(`http://api.openweathermap.org/geo/1.0/reverse?lat=${coordinates[0]}&lon=${coordinates[1]}&limit=5&appid=5f10c8113950900a1e86a3a4b4d2b909`).then(
    (res)=>{
      console.log(res.data[0].name)
      alert(`your location is : ${res.data[0].name}`)
    }
  )
}

const getcoord = () => {
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}

const getChurches = () =>{
axios.get(`https://api.opentripmap.com/0.1/en/places/radius?radius=1000&lon=76.9917&lat=8.5041&kinds=foods&apikey=5ae2e3f221c38a28845f05b66fa2dcdd5a3b6a76aa69a030769545cd`)
.then((res)=>{console.log(res)})
axios.get('')
}

const customIcon = new Icon({
  iconUrl : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG0nPxWBZvlHgwMJRpq9cGtjemavxpi3doJ_t53IzWVA&s',
  iconSize :[38,38]
})

const userCustomIcon = new Icon({
  iconUrl : 'https://images.gamebanana.com/img/ico/sprays/617466274d5c8.png',
  iconSize : [50,50]  
})

const id = navigator.geolocation.watchPosition(successCallback, errorCallback);


  return (
    <div className="App">
      Mini project
      <div className='map-cont'>
      <MapContainer center={coordinates} zoom={12} zoomControl={false}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //url={`https://api.maptiler.com/maps/${MAP_ID}/256/{z}/{x}/{y}.png?key=${MAPTILER_ACCESS_TOKEN}`}
    url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
  />

       
  {/* {locations.map((l,i)=>(
      <Marker key={i} position={l} icon={customIcon}>
        <Popup className='pop'>
        Never gonna give you up. <br /> Never gonna let you down.<br/>
         <button>view more</button>
      </Popup>
  </Marker>
      ))}   */}

    <Marker position={coordinates} icon={userCustomIcon}>

    </Marker>
</MapContainer>
    </div>
    </div>
  );
}

export default App;
