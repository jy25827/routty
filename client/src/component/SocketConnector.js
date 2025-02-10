import React, { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { useMarkers } from './MarkerContext';
import './SocketConnector.css';

function SocketButton({ cityCode, routeNo }) {
	const [active, setActive] = useState(false);
	const [message, setMessage] = useState('');
	const socketRef = useRef(null);
	const { updateMarker, removeMarker } = useMarkers();

	const toggleConnection = useCallback(() => {
		setActive((prev) => !prev);
	}, []);

	// 소켓 연결 종료 및 마커 삭제 함수
	const closeSocket = useCallback(() => {
		setMessage('종료');
		if (socketRef.current) {
			socketRef.current.disconnect();
			socketRef.current = null;
		}
		// 소켓 연결 종료 시 MarkerContext에서 해당 데이터를 삭제
		removeMarker(cityCode, routeNo);
	}, [cityCode, routeNo, removeMarker]);

	useEffect(() => {
		if (active) {
			// active 상태일 때 소켓 연결 생성
			socketRef.current = io('https://routty-server.onrender.com', {
				auth: { cityCode, routeNo },
			});

			// 서버에서 'tracking' 이벤트 수신 시 처리
			socketRef.current.on('tracking', (response) => {
				console.log(response);
				// 예시 응답: { status: 'success', data: [{ gpslati, gpslong, num, ... }, ...] }
				if (response.data && response.status === 'success') {
					const positions = Array.isArray(response.data)
						? response.data.map((bus) => ({
								lat: bus.gpslati,
								lng: bus.gpslong,
								num: bus.vehicleno,
						  }))
						: [
								{
									lat: response.data.gpslati,
									lng: response.data.gpslong,
									num: response.data.vehicleno,
								},
						  ];

					// 동일한 cityCode와 routeNo에 해당하는 마커 데이터가 있으면 업데이트, 없으면 추가
					updateMarker({
						cityCode,
						routeNo,
						positions,
					});
					setMessage('연결');
				} else {
					closeSocket();
				}
			});
		} else {
			closeSocket();
		}

		return () => {
			closeSocket();
		};
	}, [active, cityCode, routeNo, updateMarker, closeSocket]);

	return (
		<div className="btn_wrapper">
			<div>노선번호 :</div>
			<button className={`custom_btn ${active ? 'active' : ''}`} onClick={toggleConnection}>
				{routeNo}
			</button>
			<div>/ 상태 : {message}</div>
		</div>
	);
}

function SocketControlPanel() {
	const buttonData = [
		{ cityCode: '38070', routeNo: '1' },
		{ cityCode: '38070', routeNo: '1-1' },
		{ cityCode: '38070', routeNo: '3-1' },
		{ cityCode: '38070', routeNo: '5-1' },
		{ cityCode: '38070', routeNo: '8' },
		{ cityCode: '38070', routeNo: '14-1' },
		{ cityCode: '38070', routeNo: '21' },
		{ cityCode: '38070', routeNo: '21-1' },
		{ cityCode: '38070', routeNo: '30' },
	];

	return (
		<div className="btn_panel">
			{buttonData.map((btn) => (
				<SocketButton key={`${btn.cityCode}:${btn.routeNo}`} cityCode={btn.cityCode} routeNo={btn.routeNo} />
			))}
		</div>
	);
}

export default SocketControlPanel;
