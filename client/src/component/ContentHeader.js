import React from 'react';
import './ContentHeader.css';

const ContentHeader = () => {
	return (
		<header className="content_header">
			<img src="/logo.svg" alt="logo.svg"></img>
			<h2>Routty | 실시간 버스 위치 정보</h2>
		</header>
	);
};

export default ContentHeader;
