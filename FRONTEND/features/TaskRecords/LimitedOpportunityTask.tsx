import { Text, View, Button } from "react-native";
import { ScreenPrimative } from "../../components/Screen";
import { Surface, Title } from "react-native-paper";
import { useCallback, useState } from "react";
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

export default function LimitedOpportunityRecords() {
    const [tasks, setTasks] = useState([{}])

    const  { user, token } = useAuth()

    const formTypography = useThemeTypography('form')
    const formBackgroundColor = useThemeColor({}, 'primary1')
    const formSpacing = useThemeSpacing('forms')

    const columns = [
        {key: 'name', title:'Task Name'},
        {key: 'open_datetime', title:'Open Date', render: (row) => (
            <Text style={{ textAlign: 'center' }}>
            {row.open_datetime
                ? new Date(
                    row.open_datetime.endsWith('Z')
                    ? row.open_datetime
                    : row.open_datetime + 'Z'
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
        {key: 'close_datetime', title:'Close Date', render: (row) => (
            <Text style={{ textAlign: 'center' }}>
            {row.close_datetime
                ? new Date(
                    row.close_datetime.endsWith('Z')
                    ? row.close_datetime
                    : row.close_datetime + 'Z'
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

    useFocusEffect(
        useCallback(() => {
            const getTasks = async() =>{
                const data: GETRes = await apiFetch('lot', 'GET', token)
                console.log(data.msg)
                setTasks(data.tasks)
                console.log(data.tasks)

            }
            getTasks()
        }, [token])
    )
    return(
        <ScreenPrimative edges={[]}>
               <ScrollableDataTable
                    columns={columns}
                    data={tasks}
                    // rowStyle={{ borderWidth: 1 , borderColor: 'rgba(160,1,16,0.5)', backgroundColor: 'white' }}
                    headerStyle={{ backgroundColor: 'rgba(122,16,255,0.5)', borderColor: 'rgba(160,1,16,0.5)', borderWidth: 2 }}
                    headerTextStyle={{  }}
                />

        </ScreenPrimative>
    )

}