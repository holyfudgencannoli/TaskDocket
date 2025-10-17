import React from "react";
import { FlatList, View, Text, ViewStyle, TextStyle, TouchableOpacity } from "react-native";

export interface Column {
  key: string;
  title: string;
  render?: (item: any) => React.ReactElement;
}

export interface ScrollableDataTableProps {
  data: any[];
  columns: Column[];
  headerStyle?: ViewStyle;
  rowStyle?: ViewStyle;
  headerTextStyle?: TextStyle;
  cellTextStyle?: TextStyle;
  onRowPress?: (item: any) => void;
}

export const ScrollableDataTable: React.FC<ScrollableDataTableProps> = ({
  data,
  columns,
  headerStyle,
  rowStyle,
  headerTextStyle,
  cellTextStyle,
  onRowPress,
}) => {
  const renderHeader = () => (
    <View style={[{ flexDirection: "row", backgroundColor: "#eee", paddingVertical: 8 }, headerStyle]}>
      {columns.map((col) => (
        <View key={col.key} style={{ flex: 1 }}>
          <Text style={[{ fontWeight: "bold", textAlign: "center" }, headerTextStyle]}>
            {col.title}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderRow = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => onRowPress?.(item)} activeOpacity={0.7}>
      <View style={[{ flexDirection: "row", paddingVertical: 8 }, rowStyle]}>
        {columns.map((col) => (
          <View key={col.key} style={{ flex: 1 }}>
            {col.render ? col.render(item) : <Text style={cellTextStyle}>{item[col.key]}</Text>}
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  return <FlatList data={data} renderItem={renderRow} keyExtractor={(item, index) => index.toString()} ListHeaderComponent={renderHeader} stickyHeaderIndices={[0]} />;
};
