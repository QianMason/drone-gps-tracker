
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

const libraries = ["places"];
const mapContainerStyle = {
  width: '50vw',
  height: '50vh',
};

const center = {
	lat: parseFloat(37.50580263609067),
	lng: parseFloat(-121.92406285266536)
};




const DroneTest = () => {

	const [marker, setMarker] = useState(center);
	const {isLoaded, loadError} = useLoadScript({
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
		libraries,
	});

	const fetchData = () => {
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
		.then(() => setMarker({lat: parseFloat(latLng.lat), lng: parseFloat(latLng.lng)}))
	}

	const updateMap = () => {
		console.log("update");
		fetchData();
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

	if (loadError) return "Error loading maps";
	if (!isLoaded) return "Loading Maps";

	return (
		<div>
		  <GoogleMap mapContainerStyle={mapContainerStyle} zoom={12} center={center}>
			  {
				(marker.lat && marker.lng) ? <Marker key={`${marker.lat}-${marker.lng}`} position={marker}></Marker> : console.log("no marker")
			  }
		  </GoogleMap>
		  <Button onClick={updateMap} primary>
			  <Button.Content>
				  Update Map
			  </Button.Content>
		  </Button>
		</div>

	  );
}

export default DroneTest;
