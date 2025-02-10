import express from 'express';
import http from 'http';
import axios from 'axios';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ES 모듈 환경에서 __dirname을 대신 생성
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.local';
dotenv.config({ path: envFile });

const app = express();

// 환경에 따른 CORS 설정
if (process.env.NODE_ENV === 'production') {
	app.use(
		cors({
			origin: 'https://routty.onrender.com', // 실제 배포 도메인으로 변경
		})
	);
} else {
	app.use(cors());
}

app.use(express.json());

if (process.env.NODE_ENV === 'production') {
	/*
	app.use(express.static(path.join(__dirname, 'client/build')));
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
	});
	*/

	app.get('*', (req, res) => {
		res.json({ status: 'Server is running' });
	});
}

const server = http.createServer(app);

// Socket.IO CORS 옵션 적용
const io = new Server(server, {
	cors: {
		origin: process.env.NODE_ENV === 'production' ? 'https://routty.onrender.com' : '*',
		methods: ['GET', 'POST'],
	},
});

// API URL 및 서비스 키 설정
const locationInfoUrl = 'http://apis.data.go.kr/1613000/BusLcInfoInqireService/getRouteAcctoBusLcList';
const routeInfoUrl = 'http://apis.data.go.kr/1613000/BusRouteInfoInqireService/getRouteNoList';
const serviceKey = decodeURIComponent(process.env.SERVICE_KEY);

io.on('connection', (socket) => {
	const { cityCode, routeNo } = socket.handshake.auth;
	console.log(`새로운 연결 - routeNo: ${routeNo}`);

	// API 호출 및 결과 전송을 담당
	const trackingSocket = async () => {
		let result = {
			cityCode: cityCode,
			routeNo: routeNo,
			data: null,
			status: '',
			message: '',
		};

		try {
			// 1. 노선 ID 조회
			const routeParams = {
				serviceKey,
				cityCode,
				routeNo,
				_type: 'json',
			};

			const routeResponse = await axios.get(routeInfoUrl, { params: routeParams });
			const routeData = routeResponse.data.response;

			if (routeData) {
				const items = routeData.body.items.item;
				const routeId = !Array.isArray(items) ? items.routeid : items.find((obj) => obj.routeno == routeNo)?.routeid;

				const locationParams = {
					serviceKey,
					cityCode,
					routeId,
					_type: 'json',
				};

				// 2. 버스 위치 정보 조회
				const locationResponse = await axios.get(locationInfoUrl, { params: locationParams });
				const locationData = locationResponse.data.response;
				result.data = locationData?.body?.items?.item;
			} else {
				result.status = 'search failed';
				result.message = '검색에 실패했습니다.';
				console.error(`error: ${result.message}`);
			}
		} catch (error) {
			result.status = 'error';
			result.message = 'API 호출 중 에러가 발생했습니다.';
			console.error(`error: ${result.message}`);
		} finally {
			// 3. 결과 데이터 전송
			if (result.data) {
				result.status = 'success';
				result.message = 'API 호출에 성공했습니다.';
			} else {
				result.status = 'no result';
				result.message = '해당 노선에 운행 중인 버스가 없습니다.';
			}
			console.log(result);
			socket.emit('tracking', result);
		}
	};

	// 10초마다 trackingSocket 함수 실행
	trackingSocket();

	const trackingInterval = setInterval(async () => {
		await trackingSocket();
	}, 10000);

	socket.on('disconnect', () => {
		console.log(`연결 종료 - routeNo: ${routeNo}`);
		clearInterval(trackingInterval);
	});
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
	console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
});
