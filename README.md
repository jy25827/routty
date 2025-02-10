# Routty

공공데이터 API를 활용한 실시간 버스 위치 조회 테스트

## 개발 환경
- vscode
- node.js
- react
- axios
- socket.io (소켓 구현)
- leaflet.js (지도 라이브러리)

  ## 기능 설명

  1. 공공데이터 포탈 API를 활용해 leaflet 지도에 실시간으로 위치 표시
     1-1. 버스 노선 번호로 노선 ID 조회
     1-2. 노선 ID로 해당 노선에 운행 중인 버스의 위치 정보 조회
  2. 조회한 위치 정보는 React Context로 전역 상태로 관리
  3. socket.io를 사용하여 동시에 여러개의 연결 유지 가능
 
  ## 배포
  - render

  https://routty.onrender.com/
