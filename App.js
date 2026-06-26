import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Easing,
  StatusBar,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function App() {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [timeLeft, setTimeLeft] = useState(2);

  // Rotate animation for the transparent Zodiac Wheel
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 90000, // 90 seconds for slow elegant rotation
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateAnim]);

  // Countdown timer for "In 2 secs"
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.outerContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground
        source={require('./assets/cosmic_bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Main content container */}
          <View style={styles.mainContent}>
            
            {/* Center Logo & Animated Zodiac Wheel Container */}
            <View style={styles.identityContainer}>
              
              {/* Spinning Zodiac Wheel Overlay */}
              <Animated.Image
                source={require('./assets/zodiac_wheel.png')}
                style={[
                  styles.wheelImage,
                  {
                    transform: [{ rotate: rotation }],
                  },
                ]}
                resizeMode="contain"
              />

              {/* Static Center Brand Logo Image */}
              <View style={styles.logoContainer}>
                <Image
                  source={require('./assets/logo.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>

            </View>

            {/* Brand Text Details */}
            <View style={styles.brandTextContainer}>
              <Text style={styles.brandName}>astro date</Text>
              
              {/* Star Divider: ———— ✦ ———— */}
              <View style={styles.dividerContainer}>
                <Svg width={180} height={20} viewBox="0 0 240 20">
                  <Line x1={10} y1={10} x2={105} y2={10} stroke="rgba(255, 255, 255, 0.3)" strokeWidth={0.8} />
                  <Path
                    d="M 120 4 Q 120 10 114 10 Q 120 10 120 16 Q 120 10 126 10 Q 120 10 120 4 Z"
                    fill="rgba(255, 255, 255, 0.85)"
                  />
                  <Line x1={135} y1={10} x2={230} y2={10} stroke="rgba(255, 255, 255, 0.3)" strokeWidth={0.8} />
                </Svg>
              </View>

              <Text style={styles.tagline}>LOVE, WRITTEN IN THE STARS</Text>
            </View>

          </View>

          {/* Bottom Area: Action Button & Countdown */}
          <View style={styles.bottomAreaContainer}>
            
            {/* Get Started Button Wrapper with soft, premium layered glow */}
            <View style={styles.buttonWrapper}>
              {/* Layered translucent background overlays to create a smooth blurred shadow effect */}
              <View style={[styles.buttonGlow, { top: -3, left: -3, right: -3, bottom: -3, opacity: 0.18, borderRadius: 33 }]} />
              <View style={[styles.buttonGlow, { top: -7, left: -7, right: -7, bottom: -7, opacity: 0.08, borderRadius: 37 }]} />
              <View style={[styles.buttonGlow, { top: -12, left: -12, right: -12, bottom: -12, opacity: 0.03, borderRadius: 42 }]} />
              
              <TouchableOpacity style={styles.button} activeOpacity={0.92}>
                <Text style={styles.buttonText}>Get Started</Text>
              </TouchableOpacity>
            </View>

            {/* Countdown Text */}
            <Text style={styles.countdownText}>
              {timeLeft > 0 ? `In ${timeLeft} sec${timeLeft > 1 ? 's' : ''}` : 'Ready'}
            </Text>

          </View>

        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0a051b', // dark deep space fallback background
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SCREEN_HEIGHT * 0.04,
  },
  identityContainer: {
    width: 300,
    height: 300,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    // Positioned slightly higher to align with the background image's original Zodiac Wheel position
    marginTop: -SCREEN_HEIGHT * 0.06,
  },
  wheelImage: {
    position: 'absolute',
    width: 290,
    height: 290,
    zIndex: 1,
  },
  logoContainer: {
    position: 'absolute',
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  brandTextContainer: {
    alignItems: 'center',
    marginTop: 22,
  },
  brandName: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 45,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  dividerContainer: {
    height: 20,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagline: {
    fontFamily: 'System',
    fontSize: 12,
    color: '#ebd9fc', // light lavender
    fontWeight: '600',
    letterSpacing: 3.5, // wider spacing to match reference
    textAlign: 'center',
  },
  bottomAreaContainer: {
    height: SCREEN_HEIGHT * 0.25,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 42,
  },
  buttonWrapper: {
    width: SCREEN_WIDTH * 0.78,
    position: 'relative',
    zIndex: 10,
    marginBottom: 18,
  },
  buttonGlow: {
    position: 'absolute',
    backgroundColor: '#a855f7', // purple glow color
  },
  button: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    // iOS standard soft shadow
    shadowColor: '#a855f7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonText: {
    fontFamily: 'System',
    color: '#2e0854', // deep violet text inside white button
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  countdownText: {
    fontFamily: 'System',
    fontSize: 14,
    color: 'rgba(233, 213, 255, 0.65)', // faded light purple
    letterSpacing: 0.5,
    zIndex: 10,
  },
});
