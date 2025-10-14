import { useEffect, useState, useRef, useLayoutEffect, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Animated, Alert, ScrollView } from 'react-native';
import React from "react";
import {
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native";

export interface Column {
  key: string;
  title: string;
  render?: (item: any) => React.ReactNode;
}

export interface ScrollableDataTableProps {
  markComplete?: (task) => void;

  data: any[];
  columns: Column[];
  headerStyle?: ViewStyle;
  rowStyle?: ViewStyle;
  headerTextStyle?: TextStyle;
  cellTextStyle?: TextStyle;
  onRowPress?: (item: any) => void; // new prop for row click
}

export const ScrollableDataTable: React.FC<ScrollableDataTableProps> = ({
  data,
  columns,
  headerStyle,
  rowStyle,
  headerTextStyle,
  cellTextStyle,
  onRowPress,
  markComplete
}) => {
  const renderRow = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => onRowPress && onRowPress(item)}
      activeOpacity={0.7}
    >
      <View style={[{ flexDirection: "row", paddingVertical: 8 }, rowStyle]}>
        {columns.map((col) => (
          <View key={col.key} style={{ flex: 1 }}>
            {col.render ? col.render(item) : <Text style={cellTextStyle}>{item[col.key]}</Text>}
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
    
  
  
    const animatedValues = useRef<Record<number, Animated.Value>>({}).current;
        
    const [modalVisible, setModalVisible] = useState(false);
    const [completedTask, setCompletedTask] = useState(null);

    const handleDonePress = (task) => {
        if (!animatedValues[task.id]) animatedValues[task.id] = new Animated.Value(0);

        // Animate strikethrough
        Animated.timing(animatedValues[task.id], {
            toValue: 1,
            duration: 5000,
            useNativeDriver: false, // width animation
        }).start(() => {
        // Animation finished -> mark task complete & show modal
            markComplete(task);
            setCompletedTask(task);
            setModalVisible(true);
        });
    };




    const renderTask = ({ item }: { item }) => {
        if (!animatedValues[item.id]) animatedValues[item.id] = new Animated.Value(item.completed ? 1 : 0);

        const strikeWidth = animatedValues[item.id].interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
        });

        return (
        <View style={styles.taskRow}>
            <View style={{ flex: 1 }}>
            <Text style={[styles.taskText, item.completed && { color: '#888' }]}>{item.name}</Text>
            <Text style={styles.subText}>Due: {new Date(item.due_datetime).toLocaleString()}</Text>
            <Text style={styles.subText}>
                Completed: {item.fin_datetime ? new Date(item.fin_datetime).toLocaleString() : 'Not completed yet'}
            </Text>
            <Animated.View style={[styles.strike, { width: strikeWidth }]} />
            </View>
            {!item.completed && <Button title="Done" onPress={() => handleDonePress(item)} />}
        </View>
        );
    };


  const renderHeader = () => (
    <View
      style={[{ flexDirection: "row", backgroundColor: "#eee", paddingVertical: 8 }, headerStyle]}
    >
      {columns.map((col) => (
        <View key={col.key} style={{ flex: 1 }}>
          <Text style={[{ fontWeight: "bold", textAlign: 'center', padding: 8 }, headerTextStyle]}>{col.title}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderTask}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={renderHeader}
      stickyHeaderIndices={[0]}
    />
  );
};




const styles = StyleSheet.create({
//   taskRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     borderBottomWidth: 1,
//     borderColor: '#ccc',
//   },
//   taskText: {
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   subText: {
//     fontSize: 12,
//     color: '#666',
//   },
//   strike: {
//     height: 2,
//     backgroundColor: 'red',
//     marginTop: 2,
//   },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 8,
    minWidth: 250,
    alignItems: 'center',
  },
  container: { flex: 1, padding: 4, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', margin: 16, textAlign: 'center', textAlignVertical: 'center', color: 'white', textShadowColor: 'green', textShadowRadius: 12 },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  taskText: { fontSize: 18 },
  subText: { fontSize: 14, color: '#555' },
  strike: {
    height: 2,
    backgroundColor: 'black',
    position: 'absolute',
    top: '50%',
    left: 0,
    zIndex: 9999
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
});
