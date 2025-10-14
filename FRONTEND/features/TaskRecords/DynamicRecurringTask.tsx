import React, { useEffect, useState, useRef, useLayoutEffect, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Animated, Alert, ScrollView } from 'react-native';
import { ScreenPrimative } from "../../components/Screen";
import { Surface } from "react-native-paper";
import { useThemeColor } from "../../hooks/use-theme-color";
import { useThemeTypography } from "../../hooks/use-theme-typography";
import { useThemeSpacing } from "../../hooks/use-theme-spacing";
import { TextInput } from "react-native-paper";
import { ScrollableDataTable } from "../../components/DataListWrapper";
import { useFocusEffect } from "@react-navigation/native";
import { apiFetch } from "../../scripts/FetchAPI";
import { useAuth } from "../../scripts/AuthContext";


interface GETRes{
    tasks?: [{}];
    msg?: string;
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

    const animatedValues = useRef<Record<number, Animated.Value>>({}).current;
    
    const [tasksCompleted, setTasksCompleted] = useState([])

    const [tasks, setTasks] = useState([{}])

    const  { user, token } = useAuth()

    const formTypography = useThemeTypography('form')
    const formBackgroundColor = useThemeColor({}, 'primary1')
    const formSpacing = useThemeSpacing('forms')

    const columns = [
        {key: 'name', title:'Task Name'},
        {key: 'due_datetime', title:'Coming Due Date', render: (row) => (
            <Text style={{ textAlign: 'center' }}>
            {row.due_datetime
                ? new Date(
                    row.due_datetime.endsWith('Z')
                    ? row.due_datetime
                    : row.due_datetime + 'Z'
                ).toLocaleString("en-GB", {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour12: true,
                    hour:'numeric',
                    minute: 'numeric'
                })
                : ''}
            </Text>
        )},
        {key: 'priority', title:'Priority'},
        
    ]


    const grabData = async () => {

        const data: GETRes = await apiFetch('ct', 'GET', token)
        console.log(data.msg)
        setTasksCompleted(data.tasks)
        console.log(data.tasks)
    }

    useFocusEffect(
        useCallback(() => {
            const getTasks = async() =>{
                const data: GETRes = await apiFetch('drt', 'GET', token)
                console.log(data.msg)
                setTasks(data.tasks)
                console.log(data.tasks)

            }
            getTasks()
        }, [token])
    )

    
    const markComplete = async (task: CompletedTask) => {
        if (!task) return;

        // Animate strikethrough
        if (!animatedValues[task.id]) animatedValues[task.id] = new Animated.Value(0);
        Animated.timing(animatedValues[task.id], {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
        }).start();

        setTasksCompleted((prev) =>
            prev.map((t) => (t.id === task.id ? { ...t, completed: true } : t))
        );

        
        // scheduleNotification(new Date().getTime() + 5000, "Task Completed!", `You have completed "${task.name}". Great job!`)

        setTimeout(async() => {
            await fetch('https://react-tasks-online.onrender.com/api/mark-complete', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify({ task_id: task.id }),
            }); 
            grabData()

        }, 2000);
    };






    return(
        <ScreenPrimative edges={[]}>
               <ScrollableDataTable
                    columns={columns}
                    data={tasks}
                    // rowStyle={{ borderWidth: 1 , borderColor: 'rgba(160,1,16,0.5)', backgroundColor: 'white' }}
                    headerStyle={{ backgroundColor: 'rgba(160,1,16,0.5)', borderColor: 'rgba(122,16,255,0.5)', borderWidth: 2 }}
                    headerTextStyle={{  }}
                    markComplete={markComplete}
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