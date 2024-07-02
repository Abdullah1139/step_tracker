import { Image, StyleSheet, TouchableOpacity, Text, View, SafeAreaView } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';
import Constants from 'expo-constants';
import LottieView from 'lottie-react-native';
import Running from '../../assets/running.json';
import Sitting from '../../assets/sitting.json';

const CALORIES_PER_STEP = 0.05;

export default function HomeScreen() {
  const [steps, setSteps] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [lastTimeTamp, setLastTimeTamp] = useState(0);

  const animationRefRunning = useRef<LottieView>(null);
  const animationRefSitting = useRef<LottieView>(null);

  useEffect(() => {
    let subscription: any;
    Accelerometer.isAvailableAsync().then((result) => {
      if (result) {
        subscription = Accelerometer.addListener((accelerometerData) => {
          const { y } = accelerometerData;
          const threshold = 0.1;
          const timestamp = new Date().getTime();

          if (
            Math.abs(y - lastY) > threshold &&
            !isCounting &&
            (timestamp - lastTimeTamp > 800)
          ) {
            setIsCounting(true);
            setLastY(y);
            setLastTimeTamp(timestamp);

            setSteps((prevSteps) => prevSteps + 1);

            setTimeout(() => {
              setIsCounting(false);
            }, 1200);
          }
        });
      } else {
        console.log('Accelerometer not available on this device');
      }
    });

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isCounting, lastY, lastTimeTamp]);

  const resetSteps = () => {
    setSteps(0);
  };

  const estimatedCaloriesBurned = steps * CALORIES_PER_STEP;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Step Tracker</Text>
      <View style={styles.infoContainer}>
        <View style={styles.stepsContainer}>
          <Text style={styles.stepsText}>{steps}</Text>
          <Text style={styles.stepsLabel}>Steps</Text>
        </View>
        <View style={styles.caloriesContainer}>
          <Text style={styles.caloriesLabel}>Estimated Calories Burned:</Text>
          <Text style={styles.caloriesText}>{estimatedCaloriesBurned.toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.animationContainer}>
        {isCounting ? (
          <LottieView
            autoPlay
            loop
            ref={animationRefRunning}
            style={styles.animation}
            source={Running}
          />
        ) : (
          <LottieView
            autoPlay
            loop
            ref={animationRefSitting}
            style={styles.animation}
            source={Sitting}
          />
        )}
      </View>
      <TouchableOpacity onPress={resetSteps}>
        <Text style={styles.resetButton}>Reset Steps</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#123456',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    backgroundColor: '#fff',
    padding: 16,
  },
  stepsText: {
    fontSize: 36,
    color: '#379544',
    fontWeight: 'bold',
    marginRight: 8,
  },
  stepsLabel: {
    fontSize: 24,
    color: '#555',
  },
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  caloriesLabel: {
    fontSize: 20,
    color: '#fff',
    marginRight: 9,
  },
  caloriesText: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#123456',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
  },
  animation: {
    width: 400,
    height: 400,
    backgroundColor: 'transparent',
  },
  resetButton: {
    fontSize: 18,
    backgroundColor:'blue',
    color: '#fff',
  },
});
