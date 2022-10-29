import React, { useState, useRef, useEffect } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { Sidebar, UserProfile } from '../components';
import { client } from '../client';
import logo from '../assets/logo.png';
import Pins from './Pins';
import { userQuery } from '../utils/data';


const Home = () => {
	const scrollRef = useRef(null);
	const navigate = useNavigate();

	const [toggleSidebar, setToggleSidebar] = useState(false);
	const [user, setUser] = useState(null);


	useEffect(() => {
		scrollRef.current.scrollTo(0, 0);
	}, []);


	const userInfo = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();

	useEffect(() => {
		const query = userQuery(userInfo?.id);

		client.fetch(query)
			.then((data) => {
				setUser(data[0]);
			})
		if (!userInfo) {
			navigate('/login');
		}
	}, [userInfo, navigate]);

	return <>
		<div className="flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-75 ease-out">
			<div className='hidden md:flex h-screen flex-initial'>
				<Sidebar usr={user && user} />
			</div>
			<div className="flex md:hidden flex-row">
				<div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
					<HiMenu
						fontSize={40}
						className='cursor-pointer'
						onClick={() => setToggleSidebar(true)}
					/>
					<Link to='/'>
						<img src={logo} alt="logo" className='w-28' />
					</Link>
					<Link to={`user/${userInfo?.id}`}>
						<img src={userInfo?.picture} alt="user" className='w-16 h-16 rounded-full' />
					</Link>
				</div>
				{toggleSidebar && (
					<div className="fixed w-3/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
						<div className="absolute w-full flex justify-end items-center p-2">
							<AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={() => setToggleSidebar(false)} />
						</div>
						<Sidebar closeToggle={setToggleSidebar} user={user && user} />
					</div>
				)}
			</div>
			<div className='pb-2 flex-1 h-screen overflow-y-scroll' ref={scrollRef}>
				<Routes>
					<Route path='user/:userId' element={<UserProfile />} />
					<Route path='/*' element={<Pins user={user && user} />} />
				</Routes>
			</div>
		</div>
	</>
}

export default Home