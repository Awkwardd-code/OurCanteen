import React, { useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(60, 80, 224, ${opacity})`, // #3C50E0
  strokeWidth: 2,
  decimalPlaces: 0,
  propsForDots: {
    r: '4',
    strokeWidth: '3',
    stroke: '#3056D3',
  },
};

const ChartOne: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'Day' | 'Week' | 'Month'>('Day');

  // Sample data for products (could be dynamic based on selectedPeriod)
  const data = {
    labels: [
      'Sep',
      'Oct',
      'Nov',
      'Dec',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
    ],
    datasets: [
      {
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 45],
        color: () => 'rgba(60, 80, 224, 1)', // Product One - blue
        strokeWidth: 2,
      },
      {
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 51],
        color: () => 'rgba(128, 202, 238, 1)', // Product Two - light blue
        strokeWidth: 2,
      },
    ],
    legend: ['Total Revenue', 'Total Sales'],
  };

  return (
    <View style={styles.container}>
      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#3C50E0' }]} />
          <View>
            <Text style={[styles.legendTitle, { color: '#3C50E0' }]}>Total Revenue</Text>
            <Text style={styles.legendSubtitle}>12.04.2022 - 12.05.2022</Text>
          </View>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#80CAEE' }]} />
          <View>
            <Text style={[styles.legendTitle, { color: '#80CAEE' }]}>Total Sales</Text>
            <Text style={styles.legendSubtitle}>12.04.2022 - 12.05.2022</Text>
          </View>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {['Day', 'Week', 'Month'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period as 'Day' | 'Week' | 'Month')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive,
                ]}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Chart */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginLeft: -20 }}>
        <LineChart
          data={data}
          width={Math.max(screenWidth, 1000)} // scrollable wide chart
          height={350}
          chartConfig={chartConfig}
          bezier={false}
          style={{ marginVertical: 8, borderRadius: 8 }}
          withShadow={true}
          withDots={true}
          withInnerLines={true}
          withOuterLines={true}
          yAxisSuffix=""
          yAxisInterval={1}
          fromZero
          segments={5}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB', // gray-300
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 24,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '40%',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    marginRight: 10,
  },
  legendTitle: {
    fontWeight: '600',
    fontSize: 14,
  },
  legendSubtitle: {
    fontSize: 12,
    color: '#6B7280', // gray-500
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
    backgroundColor: '#F3F4F6', // gray-100
  },
  periodButtonActive: {
    backgroundColor: '#3C50E0',
  },
  periodButtonText: {
    fontSize: 12,
    color: '#000',
  },
  periodButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ChartOne;
