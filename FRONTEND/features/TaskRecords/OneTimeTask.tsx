import React, { useState, useRef, useCallback } from "react";
import { View, Text, Button, Animated, StyleSheet } from "react-native";
import { ScrollableDataTable } from "../../components/DataListWrapper";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useAuth } from "../../scripts/AuthContext";
import { apiFetch } from "../../scripts/FetchAPI";
import { ScreenPrimative } from "../../components/Screen";
import { TypeStyles } from "../../constants/typography";

interface Task {
  id: number;
  name: string;
  due_datetime: string;
  priority: string;
}

interface GETRes {
  tasks?: Task[];
  msg?: string;
}

export default function OneTimeTaskRecords() {
    const route = useRoute();
    const formTypography = TypeStyles(route.name);

  const [tasks, setTasks] = useState<Task[]>([]);
  const { token } = useAuth();

  const animatedValues = useRef<Record<number, Animated.Value>>({}).current;

  const grabTasks = async () => {
    const data: GETRes = await apiFetch("ott/incomplete", "GET", token);
    if (data.tasks) setTasks(data.tasks);
  };

  useFocusEffect(
    useCallback(() => {
      grabTasks();
    }, [token])
  );
 
  const handleComplete = (task: Task) => {
    if (!animatedValues[task.id]) animatedValues[task.id] = new Animated.Value(0);

    Animated.timing(animatedValues[task.id], {
      toValue: 1,
      duration: 700,
      useNativeDriver: false,
    }).start(async () => {
      try {
        const res = await apiFetch(`ott/mark-complete/${task.id}`, "POST", token);
        console.log(res.msg);
        grabTasks();
      } catch (err) {
        console.error(err);
      }
    });
  };

  const renderTaskRow = (task: Task) => {
    if (!animatedValues[task.id]) animatedValues[task.id] = new Animated.Value(0);

    const strikeWidth = animatedValues[task.id].interpolate({
      inputRange: [0, 1],
      outputRange: ["0%", "100%"],
    });

    return (
      <View style={{ position: "relative", paddingVertical: 4 }}>
        <Text style={{ fontSize: 16 }}>{task.name}</Text>
        <Animated.View style={[styles.strike, { width: strikeWidth, opacity: animatedValues[task.id] }]} />
      </View>
    );
  };

  const columns = [
    { key: "name", title: "Task Name", render: renderTaskRow },
    {
      key: "due_datetime",
      title: "Due Date",
      render: (row: Task) => (
        <Text style={{ textAlign: "center" }}>
          {row.due_datetime ? new Date(row.due_datetime).toLocaleString() : ""}
        </Text>
      ),
    },
    { key: "priority", title: "Priority" },
    {
      key: "done",
      title: "Done",
      render: (row: Task) => <Button title="✓" onPress={() => handleComplete(row)} />,
    },
  ];

  return (
    <ScreenPrimative edges={[]}>
      <ScrollableDataTable
        columns={columns}
        data={tasks}
        headerStyle={formTypography.dataTable.headerView}
        headerTextStyle={formTypography.dataTable.headerText}
      />
    </ScreenPrimative>
  );
}

const styles = StyleSheet.create({
  strike: {
    position: "absolute",
    height: 2,
    backgroundColor: "red",
    top: "50%",
    left: 0,
  },
});
