import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png';
import { useGoogleOneTapLogin } from 'react-google-one-tap-login';
import {client} from '../client';


const Login = () => {

	const [isSignedIn, setIsSignedIn] = useState(false);

	const navigate = useNavigate();

	useGoogleOneTapLogin({
		onError: error => console.log(error),
		onSuccess: googleUser => {
			const user = { 'id': googleUser.sub , 'name': googleUser.name, 'email': googleUser.email, 'picture': googleUser.picture, 'userLogin': true };
			localStorage.setItem('user', JSON.stringify(user));
			setIsSignedIn(true);
			const doc = {
				_id: googleUser.sub,
				_type: 'user',
				userName: googleUser.name,
				image: googleUser.picture,
			}

			client.createIfNotExists(doc).then(res => {
				navigate('/', {replace: true});
			})

		},
		googleAccountConfigs: {
			client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
			prompt_parent_id: 'google-one-tap-login',
			context: 'use',
		}
	});

	return <>
		<div className='flex justify-start items-center flex-col h-screen'>
			<div className="relative w-full h-full">
				<video
					src={shareVideo}
					typeof="video/mp4"
					autoPlay
					loop
					muted
					controls={false}
					className="w-full h-full object-cover"
				/>
				<div className='absolute flex flex-col justify-center items-center top-0 right-0 bottom-0 left-0 bg-black/[.65]'>
					<div className="p-5">
						<img src={logo} alt="logo" width="130px" />
					</div>
					<div className="shadow-2xl">
						<FcGoogle className='text-5xl text-red-600' />
						{
							!isSignedIn ? <div className='text-white'>
							Google ile Giriş Yapamanız Bekleniyor...
						</div> : <div className='text-white'>Giriş Başarılı... Yönlendiriliyorsunuz!</div>
						}
					</div>
				</div>
			</div>
		</div>
	</>
}

export default Login