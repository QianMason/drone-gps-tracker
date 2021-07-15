
import {useState, useRef, useEffect} from 'react';
import {
  useGoogleMap,
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  Polyline
} from "@react-google-maps/api"
import { Icon, List, Header, Container, Table, Button, Form } from 'semantic-ui-react'
import useWillMount from './willMount';

const libraries = ["places"];
const mapContainerStyle = {
  width: '50vw',
  height: '50vh',
};



const center = {
  lat: 37.50580263609067,
  lng: -121.92406285266536
};
// var path = [
//   { lat: 18.566516, lng: -68.435996 },
//   { lat: 18.5644, lng: -68.423036 },
//   { lat: 18.563586, lng: -68.418744 },
//   { lat: 18.562339, lng: -68.410725 },
//   { lat: 18.560927, lng: -68.402459 },
//   { lat: 18.559605, lng: -68.394354 },
//   { lat: 18.559028, lng: -68.391003 },
//   { lat: 18.558841, lng: -68.390594 },
//   { lat: 18.558795, lng: -68.390387 },
//   { lat: 18.558767, lng: -68.390312 },
//   { lat: 18.558744, lng: -68.390256 },
//   { lat: 18.558726, lng: -68.390202 },
//   { lat: 18.55867, lng: -68.390124 },
//   { lat: 18.558663, lng: -68.390111 },
//   { lat: 18.558602, lng: -68.389995 },
//   { lat: 18.5585, lng: -68.389867 },
//   { lat: 18.558462, lng: -68.389837 },
//   { lat: 18.558396, lng: -68.389781 },
//   { lat: 18.55828, lng: -68.389641 },
//   { lat: 18.558234, lng: -68.389557 },
//   { lat: 18.558143, lng: -68.389469 },
//   { lat: 18.558089, lng: -68.389362 },
//   { lat: 18.558062, lng: -68.389265 },
//   { lat: 18.558011, lng: -68.389069 },
//   { lat: 18.557985, lng: -68.388965 },
//   { lat: 18.557988, lng: -68.38879 },
//   { lat: 18.558032, lng: -68.388603 },
//   { lat: 18.55806, lng: -68.388525 },
//   { lat: 18.558113, lng: -68.388425 },
//   { lat: 18.558192, lng: -68.388297 },
//   { lat: 18.558301, lng: -68.388181 },
//   { lat: 18.558497, lng: -68.388045 },
//   { lat: 18.558571, lng: -68.388002 },
//   { lat: 18.558701, lng: -68.387927 },
//   { lat: 18.558863, lng: -68.387895 },
//   { lat: 18.559046, lng: -68.387887 },
//   { lat: 18.559308, lng: -68.387922 },
//   { lat: 18.559677, lng: -68.388185 },
//   { lat: 18.559824, lng: -68.388314 },
//   { lat: 18.559929, lng: -68.388397 },
//   { lat: 18.560018, lng: -68.388512 },
//   { lat: 18.560203, lng: -68.388607 },
//   { lat: 18.560472, lng: -68.388615 },
//   { lat: 18.560655, lng: -68.388613 },
//   { lat: 18.560957, lng: -68.388572 },
//   { lat: 18.561206, lng: -68.388521 }
// ];

const markerPositions = [
    {
      lat: 37.50580263609067,
      lng: -121.92406285266536
    },
    {
      lat: 37.50595873039177,
      lng: -121.92124804422737
    },
    {
      lat: 37.50824118482287,
      lng: -121.92144643455713
    },
    {
      lat: 37.50758157399667,
      lng: -121.92419316591251
    },
    {
      lat: 37.50856521250252,
      lng: -121.92692202454388
    },
    {
      lat: 37.50856521250252,
      lng: -121.92692202454388
    },
    {
      lat: 37.50666781166385,
      lng: -121.93168587776873
    },
    {
      lat: 37.50618197875418,
      lng: -121.92757756098177
    }
]
// const markerPositions = [
//   [
//     {
//       lat: 37.50580263609067,
//       lng: -121.92406285266536
//     },
//     {
//       lat: 37.50595873039177,
//       lng: -121.92124804422737
//     },
//     {
//       lat: 37.50824118482287,
//       lng: -121.92144643455713
//     },
//     {
//       lat: 37.50758157399667,
//       lng: -121.92419316591251
//     },
//     {
//       lat: 37.50856521250252,
//       lng: -121.92692202454388
//     },
//     {
//       lat: 37.50856521250252,
//       lng: -121.92692202454388
//     },
//     {
//       lat: 37.50666781166385,
//       lng: -121.93168587776873
//     },
//     {
//       lat: 37.50618197875418,
//       lng: -121.92757756098177
//     }
//   ],
//   [
//     { lat: 18.560203, lng: -68.388607 },
//     { lat: 18.560472, lng: -68.388615 },
//     { lat: 18.560655, lng: -68.388613 },
//     { lat: 18.560957, lng: -68.388572 }
//   ],
//   [
//     { lat:37.3928244611585, lng: -121.93516096782575},
//     { lat:37.364129039263766, lng: -121.93500975057319},
//     { lat:37.3478052196416, lng: -121.96081100844773},
//     { lat:37.391319603828634, lng: -121.98265607329974 }
//   ]
// ]



const velocity = 100;
const initialDate = new Date();


const DroneMap = () => {
  const [marker, setMarker] = useState(null);
  const [count, setCount] = useState(0);
  const [path, setPath] = useState([]);

  const {isLoaded, loadError} = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const getNewPosition = () => {
    /*
      fetch from thingspeak API
      const postOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(device)
    }
      fetch('http://localhost:8182/devices', postOptions)
        .then(response => response.text())
        .then(data => {console.log(data); setDevices([...devices, device])})
    */
    // otherwise, default code
    return marker
  }

  const grabLat = (data, latLng) => {
    const obj = JSON.parse(data)
    console.log(obj.feeds[0].field1);
    latLng.lat = parseFloat(obj.feeds[0].field1);
  }

  const grabLong = (data, latLng) => {
    const obj = JSON.parse(data)
    console.log(obj.feeds[0].field1);
    latLng.lng = parseFloat(obj.feeds[0].field1);
  }


  useEffect(() => {
    var latLng = {}
    const postOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    fetch('https://api.thingspeak.com/channels/1443033/feeds.json?results=1', postOptions)
    .then(response => response.text())
    .then(data => {console.log(data); grabLat(data, latLng)})
    fetch('https://api.thingspeak.com/channels/1443157/feeds.json?results=1', postOptions)
    .then(response => response.text())
    .then(data => {console.log(data); grabLong(data, latLng)})
    .then(() => setMarker(latLng));
  }, []);

  const updateMap = () => {
    console.log("update")
    console.log("path:", path)
    if (count == 8) {
      setCount(0)
    } else {
      setCount(count + 1)
    }
    setMarker(marker);
    var pos = getNewPosition();

    setPath([...path, pos]);
  }


  // useEffect(() => {
  //   this.interval = window.setInterval(moveObject, 1000);
  //   return () => {
  //     window.clearInterval(this.interval);
  //   }
  // }, [])

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";


  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={center}
      >
        <Marker position={marker}></Marker>
        {/* {markers.map((marker) => (
          <Marker
            key={`${marker.lat}-${marker.lng}`}
            position={{ lat: marker.lat, lng: marker.lng }}
          />
        ))} */}

          <Polyline path={path}/>

      </GoogleMap>
      <Button onClick={updateMap} primary>
          <Button.Content>
              Update Map
          </Button.Content>
      </Button>
    </div>

  );
}

export default DroneMap;

/*
    var map = undefined;
    var marker = undefined;
    var position = [43, -89];

    function initialize() {

        var latlng = new google.maps.LatLng(position[0], position[1]);
        var myOptions = {
            zoom: 8,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

        marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: "Your current location!"
        });

        google.maps.event.addListener(map, 'click', function(me) {
            var result = [me.latLng.lat(), me.latLng.lng()];
            transition(result);
        });
    }

    var numDeltas = 100;
    var delay = 10; //milliseconds
    var i = 0;
    var deltaLat;
    var deltaLng;
    function transition(result){
        i = 0;
        deltaLat = (result[0] - position[0])/numDeltas;
        deltaLng = (result[1] - position[1])/numDeltas;
        moveMarker();
    }

    function moveMarker(){
        position[0] += deltaLat;
        position[1] += deltaLng;
        var latlng = new google.maps.LatLng(position[0], position[1]);
        marker.setPosition(latlng);
        if(i!=numDeltas){
            i++;
            setTimeout(moveMarker, delay);
        }
    }


*/
