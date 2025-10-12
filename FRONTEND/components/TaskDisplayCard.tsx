import { View, Text } from "react-native";
// import { useAuth } from "../../scripts/AuthContext";
import { StyleSheet } from "react-native";
// import { ScreenPrimative } from "../../components/Screen";
import { Task } from "../features/CreateNewTask/TaskForms/DynamicRecurringTask";



export default function TaskDisplayCard({item}: {item: Task}) {
    
    return(
        <View style={styles.taskRow}>
            <Text style={styles.listItem}>{item.name}</Text>
            <Text>Due: {new Date(item.due_datetime).toLocaleTimeString("en-GB", {
                month: 'short',
                day: 'numeric',
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


    )
    
}



const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
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
