import { View, Text, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import ChartTab from "./ChartTab";

const screenWidth = Dimensions.get("window").width;

export default function StatisticsChart() {
  const data = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ],
    datasets: [
      {
        data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
        color: () => "#465FFF", // Blue line
        strokeWidth: 2,
      },
      {
        data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140],
        color: () => "#9CB9FF", // Light blue line
        strokeWidth: 2,
      },
    ],
    legend: ["Sales", "Revenue"],
  };

  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(70, 95, 255, ${opacity})`, // Default color fallback
    labelColor: (opacity = 0.6) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
      r: "0", // No markers
    },
    propsForVerticalLabels: {
      fontSize: 12,
    },
    propsForHorizontalLabels: {
      fontSize: 12,
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: "#e0e0e0",
    },
  };

  return (
    <View style={{ backgroundColor: "#fff", borderRadius: 16, padding: 16, margin: 16 }}>
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: "600", color: "#1f2937" }}>
          Statistics
        </Text>
        <Text style={{ color: "#6b7280", fontSize: 14 }}>
          Target you’ve set for each month
        </Text>
      </View>

      <ChartTab />

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={data}
          width={Math.max(1000, screenWidth)} // Allow scrolling if content wider
          height={310}
          chartConfig={chartConfig}
          bezier={false}
          withInnerLines
          withOuterLines={false}
          withVerticalLabels
          withHorizontalLabels
          withDots={false}
          fromZero
          style={{ marginTop: 24 }}
        />
      </ScrollView>
    </View>
  );
}
