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
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Unicode characters for Zodiac symbols with \uFE0E variation selector to force monochrome text rendering
const ZODIAC_SYMBOLS = [
  { char: '\u2653\uFE0E', name: 'Pisces' },
  { char: '\u2648\uFE0E', name: 'Aries' },
  { char: '\u2649\uFE0E', name: 'Taurus' },
  { char: '\u264a\uFE0E', name: 'Gemini' },
  { char: '\u264b\uFE0E', name: 'Cancer' },
  { char: '\u264c\uFE0E', name: 'Leo' },
  { char: '\u264d\uFE0E', name: 'Virgo' },
  { char: '\u264e\uFE0E', name: 'Libra' },
  { char: '\u264f\uFE0E', name: 'Scorpio' },
  { char: '\u2650\uFE0E', name: 'Sagittarius' },
  { char: '\u2651\uFE0E', name: 'Capricorn' },
  { char: '\u2652\uFE0E', name: 'Aquarius' },
];

export default function App() {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [timeLeft, setTimeLeft] = useState(2);

  // Rotate animation for the custom glowing vector Zodiac Wheel
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 90000, // 90 seconds for an elegant, slow rotation
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

  // Center and Radii for the custom SVG Zodiac Wheel
  const cx = 150;
  const cy = 150;
  const outerRadius = 126;
  const innerRadius = 92;
  const textRadius = 109;

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
              
              {/* Spinning Custom Glowing Zodiac Wheel */}
              <Animated.View style={[styles.wheelContainer, { transform: [{ rotate: rotation }] }]}>
                <Svg width={300} height={300} viewBox="0 0 300 300">
                  {/* Broad Ambient Glow Rings in Background */}
                  <Circle cx={cx} cy={cy} r={outerRadius} fill="none" stroke="rgba(168, 85, 247, 0.15)" strokeWidth={10} />
                  <Circle cx={cx} cy={cy} r={innerRadius} fill="none" stroke="rgba(168, 85, 247, 0.1)" strokeWidth={8} />

                  {/* Concentric rings with sharp core + glowing edges */}
                  <Circle cx={cx} cy={cy} r={132} stroke="rgba(216, 180, 254, 0.05)" strokeWidth={1} fill="none" />
                  
                  {/* Outer Ring Glow + Sharp Line */}
                  <Circle cx={cx} cy={cy} r={outerRadius} stroke="rgba(168, 85, 247, 0.4)" strokeWidth={3} fill="none" />
                  <Circle cx={cx} cy={cy} r={outerRadius} stroke="#ffffff" strokeWidth={1} fill="none" />
                  
                  {/* Inner Ring Glow + Sharp Line */}
                  <Circle cx={cx} cy={cy} r={innerRadius} stroke="rgba(168, 85, 247, 0.4)" strokeWidth={2.5} fill="none" />
                  <Circle cx={cx} cy={cy} r={innerRadius} stroke="#ffffff" strokeWidth={0.8} fill="none" />
                  
                  <Circle cx={cx} cy={cy} r={86} stroke="rgba(216, 180, 254, 0.05)" strokeWidth={1} fill="none" />

                  {/* 12 radial dividers and Zodiac Symbols with custom glow */}
                  {ZODIAC_SYMBOLS.map((symbol, idx) => {
                    const lineAngle = -90 - idx * 30;
                    const lineRad = (lineAngle * Math.PI) / 180;
                    const x1 = cx + innerRadius * Math.cos(lineRad);
                    const y1 = cy + innerRadius * Math.sin(lineRad);
                    const x2 = cx + outerRadius * Math.cos(lineRad);
                    const y2 = cy + outerRadius * Math.sin(lineRad);

                    const textAngle = -75 - idx * 30;
                    const textRad = (textAngle * Math.PI) / 180;
                    const tx = cx + textRadius * Math.cos(textRad);
                    const ty = cy + textRadius * Math.sin(textRad);

                    return (
                      <React.Fragment key={symbol.name}>
                        {/* Sector Dividers */}
                        <Line
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke="rgba(216, 180, 254, 0.15)"
                          strokeWidth={0.8}
                        />
                        {/* Glowing shadow text overlay */}
                        <SvgText
                          x={tx}
                          y={ty + 4}
                          fill="rgba(168, 85, 247, 0.8)"
                          fontSize={15}
                          fontWeight="bold"
                          textAnchor="middle"
                          opacity={0.65}
                        >
                          {symbol.char}
                        </SvgText>
                        {/* Sharp white core text */}
                        <SvgText
                          x={tx}
                          y={ty + 4}
                          fill="#ffffff"
                          fontSize={14}
                          fontWeight="300"
                          textAnchor="middle"
                        >
                          {symbol.char}
                        </SvgText>
                      </React.Fragment>
                    );
                  })}
                </Svg>
              </Animated.View>

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
    marginTop: -SCREEN_HEIGHT * 0.06,
  },
  wheelContainer: {
    position: 'absolute',
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
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
