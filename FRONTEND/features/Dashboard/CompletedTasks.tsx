import { FlatList, View, Text } from "react-native";
import { useAuth } from "../../scripts/AuthContext";
import { StyleSheet } from "react-native";
import { useCallback, useLayoutEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
// import { scheduleNotification } from "../../scripts/NotificationScheduling";
import { ScreenPrimative } from "../../components/Screen";
import { apiFetch } from "../../scripts/FetchAPI";



export default function CompletedTasks() {
    const { user, token } = useAuth()
    const [tasksToday, setTasksToday] = useState([])


    

    useLayoutEffect(() => {
        const grabData = async () => {
            const lotData = await apiFetch('lot', 'GET', token)
            const ottData = await apiFetch('ott', 'GET', token)
            const srtData = await apiFetch('srt', 'GET', token)
            const drtData = await apiFetch('drt', 'GET', token)
        }
    }, [])

    useFocusEffect(
        useCallback(() => {
            fetchTodaysTasks();
        }, [])
    );

    // const data = tasksToday.map((task) => ({
    //     id: task.id,
    //     name: task.name,
    //     dueDatetime: new Date(task.due_datetime).toLocaleString("en-GB", {
    //         hour: '2-digit',
    //         minute: '2-digit',
    //         month: 'short',
    //         day: 'numeric',
    //         hour12: true
    //     }),
        
    //     logTime: task.log_datetime ? new Date(task.log_datetime).toLocaleString("en-GB", {
    //         month: 'short',
    //         day: 'numeric',
    //         hour: '2-digit',
    //         minute: '2-digit',
    //         hour12: true,
    //     }) : 'Not completed yet',
    // }))



    return(
        <ScreenPrimative>
            {/* <View style={styles.container}> */}
                <Text style = {styles.listTitle}>
                    Tasks Completed
                </Text>
            <View>
                {/* <Button title="press" /> */}
                <FlatList
                    style={styles.list}
                    data={tasksToday}
                    renderItem={({item}) => (
                        <View style={styles.taskRow}>
                            <Text style={styles.listItem}>{item.name}</Text>
                            <Text>Due: {new Date(item.due_datetime).toLocaleTimeString("en-GB", {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                            })}</Text>
                            <Text>Logged: {new Date(item.log_datetime).toLocaleString("en-GB", {
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
