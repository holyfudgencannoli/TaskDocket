import { FlatList, View, Text } from "react-native";
import { useAuth } from "../../scripts/AuthContext";
import { StyleSheet } from "react-native";
import { useCallback, useLayoutEffect, useState } from "react";
import { useFocusEffect, useRoute } from "@react-navigation/native";
// import { scheduleNotification } from "../../scripts/NotificationScheduling";
import { ScreenPrimative } from "../../components/Screen";
import { apiFetch } from "../../scripts/FetchAPI";
import { Surface } from "react-native-paper";
import { TypeStyles } from "../../constants/typography";




export default function DueThisWeek() {
    const route = useRoute();
    const formTypography = TypeStyles(route.name);
    
    
    const { user, token } = useAuth()
    const [tasksToday, setTasksToday] = useState([])


    const fetchTodaysTasks = async () => {
        const ottData:any = await apiFetch('ott/due-this-week', 'GET', token)
        const drtData:any = await apiFetch('drt/due-this-week', 'GET', token)
        // const srtData = await apiFetch('srt/due-this-week', 'GET', token)
        // const lotData = await apiFetch('lot/due-this-week', 'GET', token)
        // setTasksToday(ottData.tasks, drtData.tasks)
    } 
    

    useLayoutEffect(() => {
        fetchTodaysTasks();
    }, [])

    useFocusEffect(
        useCallback(() => {
            fetchTodaysTasks();
        }, [])
    );

    const data = tasksToday.map((task) => ({
        id: task.id,
        name: task.name,
        dueDatetime: new Date(task.due_datetime).toLocaleString("en-GB", {
            hour: '2-digit',
            minute: '2-digit',
            month: 'short',
            day: 'numeric',
            hour12: true
        }),
        
        priority: task.priority
    }))



    return(
        <ScreenPrimative scroll style={{ marginBottom: 24 }} edges={[]}>
            {/* <View style={styles.container}> */}
            <Surface style={{ backgroundColor: 'rgba(0,255,255,0.5)', padding: 16 }}>
            
                <Text style = {formTypography.list.title}>
                    Tasks Due This Week
                </Text>
                <View>
                    {/* <Button title="press" /> */}
                    <FlatList
                        style={styles.list}
                        data={data}
                        renderItem={({item}) => (
                            <View style={styles.taskRow}>
                                <Text style={styles.listItem}>{item.name}</Text>
                                <Text>Due: {item.dueDatetime}</Text>
                                <Text>Priority: {item.priority}</Text>
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
    padding: 16,
    lineHeight: 42,
    textShadowColor: 'white',
    textShadowRadius: 4

    
  },
  list: {
    // padding:32
  },
  listItem: {
    fontSize: 24,
    textShadowColor: 'white',
    textShadowRadius: 4,
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
