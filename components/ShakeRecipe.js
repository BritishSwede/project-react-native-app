import React, { useState, useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';
import { View, Text, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

import { API_RANDOM } from '../utils/urls';

const ShakeRecipe = () => {
	const [data, setData] = useState({
		x: 0,
		y: 0,
		z: 0,
	});
	const [recipe, setRecipe] = useState({});
	const [loading, setLoading] = useState(false);
	// Difficult to describe, but like the communication between code and sensor.
	const [subscription, setSubscription] = useState(null);

	useEffect(() => {
		randomRecipe();
	}, []);

	useEffect(() => {
		Accelerometer.setUpdateInterval(1000);
		subscribe();
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		if (isShakingEnough(data)) {
			randomRecipe();
		}
	}, [data]);

	const subscribe = () => {
		setSubscription(
			Accelerometer.addListener((accelerometerData) => {
				setData(accelerometerData);
			})
		);
	};

	const unsubscribe = () => {
		subscription && subscription.remove();
		setSubscription(null);
	};

	const randomRecipe = () => {
		setLoading(true);
		fetch(API_RANDOM)
			.then((res) => res.json())
			// .then((data) => console.log(data.recipes[0].title)) NOT WORKING...
			.then((data) => setRecipe(data))
			.finally(() => setLoading(false));
	};

	const isShakingEnough = (data) => {
		// x,y,z CAN be negative, force is directional
		// We take the absolute value and add them together
		// This gives us the total combined force on the device
		const totalForce = Math.abs(data.x) + Math.abs(data.y) + Math.abs(data.z);

		// If this force exceeds some threshold, return true, otherwise false
		// Increase this threshold if you need your user to shake harder
		return totalForce > 1.78;
	};

	if (loading) {
		return <ActivityIndicator />;
	}

	return (
		<>
			<View>
				{/* <Text>{recipe.recipes[0].title}</Text> */}
				{/* NOT WORKING... */}
			</View>
		</>
	);
};

export default ShakeRecipe;
