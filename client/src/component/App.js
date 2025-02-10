import React from 'react';
import Sidebar from './Sidebar';
import ContentHeader from './ContentHeader';
import Map from './Map';
import { ContextProvider } from './MarkerContext';

function App() {
	return (
		<ContextProvider>
			<div className="app" style={{ display: 'flex', height: '100vh' }}>
				<Sidebar />
				<div className="content" style={{ width: '100%', overflowY: 'scroll' }}>
					<ContentHeader />
					<Map />
				</div>
			</div>
		</ContextProvider>
	);
}

export default App;
