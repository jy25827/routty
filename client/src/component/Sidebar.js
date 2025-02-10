import React, { useState } from 'react';
import './Sidebar.css';
import PanelHeader from './PanelHeader';
import SocketControlPanel from './SocketConnector';

function Sidebar() {
	const [isOpen, setIsOpen] = useState(true);

	const toggleSidebar = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className="sidebar">
			<div className={`sidebar_content ${isOpen ? 'open' : 'closed'}`}>
				<PanelHeader />
				<SocketControlPanel />
			</div>
			<button className="sidebar_toggle" onClick={toggleSidebar}>
				{isOpen ? '<' : '>'}
			</button>
		</div>
	);
}

export default Sidebar;
