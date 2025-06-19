import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { BarChart } from 'react-native-chart-kit';
import { Entypo } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const menuOptions = ['View More', 'Delete'];

export default function MonthlySalesChart() {
  const data = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ],
    datasets: [
      {
        data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    fillShadowGradient: '#465fff',
    fillShadowGradientOpacity: 1,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(70, 95, 255, ${opacity})`,
    labelColor: (opacity = 0.6) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 24,
    },
    propsForBackgroundLines: {
      strokeDasharray: '', // solid lines
      stroke: '#e0e0e0',
    },
  };

  const onSelect = (index: string, value: string) => {
    const idx = parseInt(index, 10); // convert string index to number if needed
    console.log(`Selected index: ${idx}, value: ${value}`);
    // Your logic here
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Monthly Sales</Text>

        <ModalDropdown
          options={menuOptions}
          dropdownStyle={styles.dropdownStyle}
          dropdownTextStyle={styles.dropdownTextStyle}
          onSelect={onSelect}
          renderSeparator={() => <View style={styles.separator} />}
          renderRightComponent={() => (
            <Entypo name="dots-three-vertical" size={20} color="#888" />
          )}
          style={styles.dropdownButton}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <BarChart
          data={data}
          width={screenWidth * 1.5} // wider than screen to allow horizontal scroll
          height={180}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={chartConfig}
          verticalLabelRotation={0}
          style={styles.chart}
          fromZero
          showValuesOnTopOfBars
          withInnerLines
          withHorizontalLabels
          segments={4}
          flatColor

        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderRadius: 24,
    backgroundColor: '#fff',
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  dropdownButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  dropdownStyle: {
    width: 140,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  dropdownTextStyle: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
  chart: {
    borderRadius: 24,
  },
});
