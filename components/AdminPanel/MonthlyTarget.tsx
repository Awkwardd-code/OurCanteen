/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const SIZE = 180;
const STROKE_WIDTH = 18;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function MonthlyTarget() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const progress = 75.55; // in percentage

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Monthly Target</Text>
          <Text style={styles.subtitle}>Target you’ve set for each month</Text>
        </View>
        <TouchableOpacity onPress={toggleDropdown} style={styles.moreButton}>
          <MaterialIcons name="more-vert" size={24} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Dropdown */}
      <Modal transparent visible={isDropdownOpen} animationType="fade" onRequestClose={closeDropdown}>
        <TouchableOpacity style={styles.modalOverlay} onPress={closeDropdown}>
          <View style={styles.dropdown}>
            <TouchableOpacity onPress={closeDropdown} style={styles.dropdownItem}>
              <Text style={styles.dropdownItemText}>View More</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={closeDropdown} style={styles.dropdownItem}>
              <Text style={styles.dropdownItemText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Radial Progress Chart */}
      <View style={styles.chartWrapper}>
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <G rotation="-85" origin={`${SIZE / 2}, ${SIZE / 2}`}>
            {/* Track Circle */}
            <Circle
              stroke="#E4E7EC"
              fill="none"
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
            />
            {/* Progress Circle */}
            <Circle
              stroke="#465FFF"
              fill="none"
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeDasharray={`${(progress / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
              strokeDashoffset={CIRCUMFERENCE * 0.15} // slight offset to start from bottom-left approx
            />
          </G>
        </Svg>

        {/* Progress Text */}
        <View style={styles.progressTextWrapper}>
          <Text style={styles.progressValue}>{progress.toFixed(2)}%</Text>
        </View>

        {/* Percentage Change Badge */}
        <View style={styles.percentageBadge}>
          <Text style={styles.percentageBadgeText}>+10%</Text>
        </View>
      </View>

      {/* Description Text */}
      <Text style={styles.description}>
        You earn $3287 today, it's higher than last month. Keep up your good work!
      </Text>

      {/* Footer Info */}
      <View style={styles.footer}>
        {[
          { label: 'Target', amount: '$20K', color: '#D92D20' },
          { label: 'Revenue', amount: '$20K', color: '#039855' },
          { label: 'Today', amount: '$20K', color: '#039855' },
        ].map(({ label, amount, color }, i) => (
          <React.Fragment key={label}>
            {i !== 0 && <View style={styles.divider} />}
            <View style={styles.footerItem}>
              <Text style={styles.footerLabel}>{label}</Text>
              <View style={styles.footerAmountWrapper}>
                <Text style={styles.footerAmount}>{amount}</Text>
                <MaterialIcons
                  name="arrow-drop-up"
                  size={20}
                  color={color}
                  style={{ marginLeft: 2 }}
                />
              </View>
            </View>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: '700', color: '#222' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  moreButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 40,
    marginRight: 12,
    paddingVertical: 8,
    width: 140,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  chartWrapper: {
    marginTop: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTextWrapper: {
    position: 'absolute',
    top: SIZE / 2 - 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 36,
    fontWeight: '600',
    color: '#1D2939',
  },
  percentageBadge: {
    position: 'absolute',
    top: SIZE - 25,
    left: '50%',
    marginLeft: -30,
    backgroundColor: '#DEF7EC',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  percentageBadgeText: {
    color: '#027A48',
    fontWeight: '600',
    fontSize: 12,
  },
  description: {
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    maxWidth: screenWidth * 0.9,
    alignSelf: 'center',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerItem: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  footerLabel: {
    fontSize: 12,
    color: '#666',
  },
  footerAmountWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  footerAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: '#ddd',
    marginHorizontal: 8,
  },
});
