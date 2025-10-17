import { Surface, Title } from "react-native-paper";
import { useThemeColor } from "../../hooks/use-theme-color";
import { useThemeTypography } from "../../hooks/use-theme-typography";
import { useThemeSpacing } from "../../hooks/use-theme-spacing";
import { TextInput } from "react-native-paper";
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

interface GETRes{
    tasks?: [{}];
    msg?: string;
}

export default function StaticRecurringTaskRecords() {
    
    const [tasks, setTasks] = useState([{}])

    const  { user, token } = useAuth()

    const formBackgroundColor = useThemeColor({}, 'primary1')
    const formSpacing = useThemeSpacing('forms')
    
    const route = useRoute();
    const formTypography = TypeStyles(route.name);


    
  const animatedValues = useRef<Record<number, Animated.Value>>({}).current;

  const grabTasks = async () => {
    const data: GETRes = await apiFetch("srt/incomplete", "GET", token);
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
        const res = await apiFetch(`srt/mark-complete/${task.id}`, "POST", token);
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



    return(
        <ScreenPrimative edges={[]}>
            <ScrollableDataTable
                columns={columns}
                data={tasks}
                // rowStyle={{ borderWidth: 1 , borderColor: 'rgba(160,1,16,0.5)', backgroundColor: 'white' }}
                headerStyle={formTypography.dataTable.headerView}
                headerTextStyle={formTypography.dataTable.headerText}
            />


        </ScreenPrimative>
    )

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
