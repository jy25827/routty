import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import Leaf from 'leaflet';
import { useEffect } from 'react';
import { useMarkers } from './MarkerContext';

const customIcon = new Leaf.Icon({
	iconSize: [18, 30],
	iconAnchor: [12, 30],
	shadowSize: [30, 30],
	popupAnchor: [0, -10],
	iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
	shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
	iconRetinaUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon-2x.png',
});

const Map = () => {
	const { markers } = useMarkers();

	useEffect(() => {
		delete Leaf.Icon.Default.prototype._getIconUrl;
		Leaf.Icon.Default.mergeOptions({
			iconRetinaUrl: customIcon.options.iconUrl,
			iconUrl: customIcon.options.iconUrl,
			shadowUrl: customIcon.options.shadowUrl,
		});
	}, []);

	return (
		<div className="map_container">
			<div style={{ width: '100%', height: '540px' }}>
				<MapContainer center={[35.2285, 128.8894]} zoom={15} minZoom={12} maxZoom={18} style={{ height: '100%', width: '100%', borderRadius: '5px' }}>
					<TileLayer
						url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					/>

					<Marker position={[35.2285, 128.8894]} icon={customIcon}></Marker>

					{markers.map(
						(marker) =>
							marker.positions &&
							marker.positions.map((pos) => {
								const divTextIcon = Leaf.divIcon({
									html: `<div>${marker.routeNo}</div>`,
									className: `custom_icon route_${marker.routeNo}`,
									iconSize: [32, 21],
									iconAnchor: [23, 0],
									popupAnchor: [-5, 10],
								});
								return (
									<Marker key={`${marker.cityCode}:${marker.routeNo}:${pos.num}`} position={[pos.lat, pos.lng]} icon={divTextIcon}>
										<Popup className="custom_popup">{`${pos.num}`}</Popup>
									</Marker>
								);
							})
					)}
				</MapContainer>
			</div>
		</div>
	);
};

export default Map;
