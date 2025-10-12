import { Text, View } from "react-native";
import { ScreenPrimative } from "../../../components/Screen";
import { Button, Surface } from "react-native-paper";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import TaskDisplayCard from "../../../components/TaskDisplayCard";

export interface Task{
    name: string;
    due_datetime: string;
    log_datetime: string;
}

export default function DynamicRecurringTask() {
    const [formType, setFormType] = useState("")


    const item: Task = {
        name: 'Do Laundry',
        due_datetime: new Date(2025,8,9),
        log_datetime: '2025-08-12T04:00:00.000Z'
    }

    useFocusEffect(
            useCallback(() => {
                // setFormType('') set all data to blank on focus
            }, [])
        )
    
    return(
        <ScreenPrimative edges={[]}>
            <View>
                <Text>
                    Hello World!
                </Text>
                <TaskDisplayCard item={item} />
            </View>
        </ScreenPrimative>
    )

}