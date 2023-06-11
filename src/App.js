import './App.css';
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react';
import { FaMapMarker } from 'react-icons/fa';
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
const [isActive, setIsActive] = useState(false);

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
    // setLocations((prevState) => ([ ...prevState, [r.lat,r.lon] ]));

    // })
    setLocations(res.data)})
  }).catch((err)=>console.log(err))  
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
  iconUrl : 'https://thenounproject.com/api/private/icons/32369/edit/?backgroundShape=SQUARE&backgroundShapeColor=%23000000&backgroundShapeOpacity=0&exportSize=752&flipX=false&flipY=false&foregroundColor=%23000000&foregroundOpacity=1&imageFormat=png&rotation=0',
  iconSize :[50,50]
})

const userCustomIcon = new Icon({
  iconUrl : 'https://thenounproject.com/api/private/icons/1141824/edit/?backgroundShape=SQUARE&backgroundShapeColor=%23000000&backgroundShapeOpacity=0&exportSize=752&flipX=false&flipY=false&foregroundColor=%23000000&foregroundOpacity=1&imageFormat=png&rotation=0',
  iconSize : [50,50]  
})

const id = navigator.geolocation.watchPosition(successCallback, errorCallback);

const handleExpand = event => {
  // 👇️ toggle isActive state on click
  setIsActive(current => !current);
};


  return (
    <div  >
      Mini project <FaMapMarker/>
      <div  className={isActive ? 'map-cont' : 'exp-map-cont'}>
      <MapContainer center={coordinates} zoom={12} zoomControl={true} minZoom={6}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //url={`https://api.maptiler.com/maps/${MAP_ID}/256/{z}/{x}/{y}.png?key=${MAPTILER_ACCESS_TOKEN}`}
    url = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
  />

       
    {locations.map((l,i)=>(
      <Marker key={i} position={[l.lat,l.lon]} icon={customIcon}>
        <Popup className='pop'>
         {l.placeName}<br/>
         <button>view more</button> 
      </Popup>
    
  </Marker>

      ))}  

    <Marker position={coordinates} icon={userCustomIcon}>
    <Popup className='pop'>
        Your location
         <button>view more</button>
      </Popup>
    </Marker>
</MapContainer>
<div className='exp' onClick={handleExpand}>
        Expand
      </div>
    </div>
     
    </div>
  );
}

export default App;
