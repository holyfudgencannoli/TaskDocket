import React, { useEffect, useState, useRef, useLayoutEffect, useCallback } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Animated, Alert, ScrollView } from 'react-native';
import { useAuth } from "../../scripts/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
// import { scheduleNotification } from "../../scripts/NotificationScheduling";
import { ScreenPrimative } from "../../components/Screen";
import { apiFetch } from "../../scripts/FetchAPI";
import { Surface } from "react-native-paper";


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


export default function CompletedTasks() {
    const { user, token } = useAuth()
    const [tasksCompleted, setTasksCompleted] = useState([])
    const [tasksCompletedCount, setCompletedCount] = useState(0)


  const animatedValues = useRef<Record<number, Animated.Value>>({}).current;
    
  
    const grabData = async () => {

        const data: GETRes = await apiFetch('ct', 'GET', token)
        console.log(data.msg)
        setTasksCompleted(data.tasks)
        console.log(data.tasks)
    }

    useLayoutEffect(() => {
        grabData()
    }, [token])

    useFocusEffect(
        useCallback(() => {
            grabData()
        }, [token])
    );

    const data = tasksCompleted.map((task) => ({
        id: task.id,
        name: task.name,
        dueDatetime: new Date(task.due_datetime).toLocaleString("en-GB", {
            hour: '2-digit',
            minute: '2-digit',
            month: 'short',
            day: 'numeric',
            hour12: true
        }),
        
        completedTime: task.completed_datetime ? new Date(task.completed_datetime).toLocaleString("en-GB", {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }) : 'Not completed yet',
    }))

            


    return(
        <ScreenPrimative>
            {/* <View style={styles.container}> */}
            <Surface style={{ backgroundColor: 'rgba(255,255,0,0.5)', borderWidth: 2, borderColor: 'rgba(255, 1, 255, 1)' }}>
                <Text style = {styles.listTitle}>
                    Tasks Completed
                </Text>
                <View>
                    {/* <Button title="press" /> */}
                    <FlatList
                        style={styles.list}
                        data={tasksCompleted}
                        renderItem={({item}) => (
                            <View style={styles.taskRow}>
                                <Text style={styles.listItem}>{item.name}</Text>
                                <Text>Due: {new Date(item.due_datetime).toLocaleTimeString("en-GB", {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                })}</Text>
                                <Text>Completed: {new Date(item.completed_datetime).toLocaleString("en-GB", {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                })}</Text>
                            </View>
                        )}
                    >

                    </FlatList>
                </View>
            </Surface>
        {/* </View> */}

        </ScreenPrimative>      
    )
    
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },

  button:{
    color: 'black'
  },
  reactLogo: {
    height: 360,
    width: 420,
    bottom: 0,
    left: -10,
    position: 'absolute',
    alignItems: 'center'
  },
  listTitle:{
    textAlign:'center',
    fontWeight:'bold',
    fontSize: 28,
    // padding: 36,
    lineHeight: 42

    
  },
  list: {
    // padding:32
  },
  listItem: {
    fontSize: 24,

    margin: 8
  },
  taskRow: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
});
