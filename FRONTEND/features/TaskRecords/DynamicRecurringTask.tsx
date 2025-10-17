import React, { useEffect, useState, useRef, useLayoutEffect, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Animated, Alert, ScrollView } from 'react-native';
import { ScreenPrimative } from "../../components/Screen";
import { Surface } from "react-native-paper";
import { useThemeColor } from "../../hooks/use-theme-color";
import { useThemeTypography } from "../../hooks/use-theme-typography";
import { useThemeSpacing } from "../../hooks/use-theme-spacing";
import { TextInput } from "react-native-paper";
import { ScrollableDataTable } from "../../components/DataListWrapper";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { apiFetch } from "../../scripts/FetchAPI";
import { useAuth } from "../../scripts/AuthContext";
import { TypeStyles } from '../../constants/typography';
import { DRTModal } from '../../components/DRTModal';


interface GETRes{
    tasks?: [{}];
    msg?: string;
}

interface Task {
  id: number;
  name: string;
  due_datetime: string;
  priority: string;
}

interface CompletedTask{
    id: number;
    name: string;
    due_datetime: string;
    created_at: string;
    completed_datetime: string;
    task_type: string;
    user_id: number;
}

export default function DynamicRecurringTaskRecords() {
    const route = useRoute();
    const formTypography = TypeStyles(route.name);

    const animatedValues = useRef<Record<number, Animated.Value>>({}).current;
    
    const [tasksCompleted, setTasksCompleted] = useState([])

    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const [tasks, setTasks] = useState([{}])

    const  { user, token } = useAuth()

    const formBackgroundColor = useThemeColor({}, 'primary1')
    const formSpacing = useThemeSpacing('forms')

    const grabTasks = async () => {
        const data: GETRes = await apiFetch("drt/incomplete", "GET", token);
        if (data.tasks) setTasks(data.tasks);
    };
    
    useFocusEffect(
        useCallback(() => {
            grabTasks();
        }, [token])
    );


    const handleComplete = (task: Task, newDueDate) => {
        if (!animatedValues[task.id]) animatedValues[task.id] = new Animated.Value(0);

        const payload = {'due_date': newDueDate.toISOString()}

        Animated.timing(animatedValues[task.id], {
        toValue: 1,
        duration: 700,
        useNativeDriver: false,
        }).start(async () => {
        try {
            const res = await apiFetch(`drt/mark-complete/${task.id}`, "POST", token, payload);
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
        // render: (row: Task) => <Button title="✓" onPress={(row) => {
        //         setSelectedTask(row)    
        //         setModalVisible(true);
        //     }} />,
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
                    onRowPress={(row) => {
                        setSelectedTask(row)
                        setModalVisible(true)
                    }}
                />

                <DRTModal
                    visible={modalVisible}
                    task={selectedTask}
                    onClose={() => setModalVisible(false)}
                    onSave={handleComplete}
                />
            

        </ScreenPrimative>
    )

}


const styles = StyleSheet.create({
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  taskText: {
    fontSize: 16,
    fontWeight: '500',
  },
  subText: {
    fontSize: 12,
    color: '#666',
  },
  strike: {
    height: 2,
    backgroundColor: 'red',
    marginTop: 2,
  },
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
});