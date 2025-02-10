import React, { createContext, useState, useContext, useCallback } from 'react';

const MarkerContext = createContext();

export const ContextProvider = ({ children }) => {
	const [markers, setMarkers] = useState([]);

	// newMarker = { cityCode, routeNo, positions: [ { lat, lng, num }, ... ] }
	const updateMarker = useCallback((newMarker) => {
		setMarkers((prevMarkers) => {
			const index = prevMarkers.findIndex((marker) => marker.cityCode === newMarker.cityCode && marker.routeNo === newMarker.routeNo);
			if (index !== -1) {
				const updatedMarkers = [...prevMarkers];
				updatedMarkers[index] = newMarker;
				return updatedMarkers;
			} else {
				return [...prevMarkers, newMarker];
			}
		});
	}, []);

	// 삭제할 마커의 cityCode와 routeNo에 해당하는 항목 제거
	const removeMarker = useCallback((cityCode, routeNo) => {
		setMarkers((prevMarkers) => prevMarkers.filter((marker) => !(marker.cityCode === cityCode && marker.routeNo === routeNo)));
	}, []);

	return <MarkerContext.Provider value={{ markers, updateMarker, removeMarker }}>{children}</MarkerContext.Provider>;
};

export const useMarkers = () => useContext(MarkerContext);
