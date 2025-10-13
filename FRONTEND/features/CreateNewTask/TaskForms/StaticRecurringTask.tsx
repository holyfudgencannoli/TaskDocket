import { Alert, Button, Text, TouchableOpacity, View } from "react-native";
import { ScreenPrimative } from "../../../components/Screen";
import { Surface, TextInput } from "react-native-paper";
import { useState } from "react";
import { useThemeSpacing } from "../../../hooks/use-theme-spacing";
import { useThemeTypography } from "../../../hooks/use-theme-typography";
import { useThemeColor } from "../../../hooks/use-theme-color";
import { apiFetch } from "../../../scripts/FetchAPI";
import { useAuth } from "../../../scripts/AuthContext";


interface POSTRes{
    msg?: string;
}

export default function StaticRecurringTask() {
    const { user, token } = useAuth()
    const [formType, setFormType] = useState("")
    const [taskName, setTaskName] = useState("")
    const [months, setMonths] = useState(0)
    const [weeks, setWeeks] = useState(0)
    const [days, setDays] = useState(0)
    const [hours, setHours] = useState(0)
    const [months1, setMonths1] = useState(0)
    const [weeks2, setWeeks2] = useState(0)
    const [days3, setDays3] = useState(0)
    const [hours4, setHours4] = useState(0)
    const [dueDate, setDueDate] = useState(new Date())
    const [priority, setPriority] = useState("")


    const formTypography = useThemeTypography('form')
    const formBackgroundColor = useThemeColor({}, 'primary1')
    const formSpacing = useThemeSpacing('forms')

    
    const handleSubmit = async () => {
        const payload = {
            name: taskName,
            dueDate: dueDate.toISOString(),
            priority: priority,
            priorNoticeMonths: months,
            priorNoticeWeeks: weeks,
            priorNoticeDays: days,
            priorNoticeHours: hours,
            monthsDelta: months1,
            weeksDelta: weeks2,
            daysDelta: days3,
            hoursDelta: hours4,
        }

        console.log("Payload: ", payload)
        const data: POSTRes = await apiFetch('srt', 'POST', token, payload)
        console.log(data.msg)
        Alert.alert(data.msg)

    }


    return(
        <ScreenPrimative scroll edges={[]}>
            <Surface style={{ ...formSpacing.metaContainer1}}>
                <Surface style={{ ...formSpacing.container }}>
                    <Text style={{ ...formTypography.title }}>
                        New Static Recurring Task
                    </Text>
                </Surface>
                <Surface >
                    <Surface style={{ ...formSpacing.inputFieldContainer }}>
                        <View style={{ ...formSpacing.inputFieldLabelContainer }}>
                            <Text style={{ ...formTypography.inputFieldLabel }}>
                                Task Name
                            </Text>
                        </View>
                        <TextInput
                            label={"Name"}
                        />
                        <View style={{ ...formSpacing.inputFieldLabelContainer }}>
                            <Text style={{ ...formTypography.inputFieldLabel }}>
                                Due Date
                            </Text>
                        </View>
                        <TextInput
                            label={"Datetime"}
                        />
                        <View style={{ ...formSpacing.inputFieldLabelContainer }}>
                            <Text style={{ ...formTypography.inputFieldLabel }}>
                                Priority
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                                                    
                            <TouchableOpacity
                                onPress={() => setPriority("Low")}
                                activeOpacity={0.6}
                                style={{
                                    padding: 10,
                                    borderRadius: 8,
                                    backgroundColor: priority === "Low" ? "#007BFF" : "#E0E0E0",
                                }}
                            >
                                <Text style={{ color: priority === "Low" ? "#fff" : "#000" }}>Low</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setPriority("Normal")}
                                activeOpacity={0.6}
                                style={{
                                    padding: 10,
                                    borderRadius: 8,
                                    backgroundColor: priority === "Normal" ? "#007BFF" : "#E0E0E0",
                                }}
                            >
                                <Text style={{ color: priority === "Normal" ? "#fff" : "#000" }}>Normal</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setPriority("High")}
                                activeOpacity={0.6}
                                style={{
                                    padding: 10,
                                    borderRadius: 8,
                                    backgroundColor: priority === "High" ? "#007BFF" : "#E0E0E0",
                                }}
                            >
                                <Text style={{ color: priority === "High" ? "#fff" : "#000" }}>High</Text>
                            </TouchableOpacity>
                        </View>
                        
                    <View style={{ ...formSpacing.inputFieldLabelContainer }}>
                        <Text style={{ ...formTypography.inputFieldLabel }}>
                            Prior Notice
                        </Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <View>
                            <Text style={{ textAlign: 'center' }}>Months</Text>
                            <TextInput
                                mode="outlined"
                                keyboardType="numeric"
                                style={{  }}
                                value={months}
                                onChangeText={setMonths}
                            />
                        </View>
                        <View>
                            <Text style={{ textAlign: 'center' }}>Weeks</Text>
                            <TextInput
                                mode="outlined"
                                keyboardType="numeric"
                                style={{  }}
                                value={weeks}
                                onChangeText={setWeeks}
                            />
                        </View>
                        <View>
                            <Text style={{ textAlign: 'center' }}>Days</Text>
                            <TextInput
                                mode="outlined"
                                keyboardType="numeric"
                                style={{  }}
                                value={days}
                                onChangeText={setDays}
                            />
                        </View>
                        <View>
                            <Text style={{ textAlign: 'center' }}>Hours</Text>
                            <TextInput
                                mode="outlined"
                                style={{  }}
                                keyboardType="numeric"
                                value={hours}
                                onChangeText={setHours}
                            />
                        </View>
                    </View>
                    <View style={{ ...formSpacing.inputFieldLabelContainer }}>
                        <Text style={{ ...formTypography.inputFieldLabel }}>
                            How Often?
                        </Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <View>
                            <Text style={{ textAlign: 'center' }}>Months</Text>
                            <TextInput
                                mode="outlined"
                                keyboardType="numeric"
                                style={{  }}
                                value={months1}
                                onChangeText={setMonths1}
                            />
                        </View>
                        <View>
                            <Text style={{ textAlign: 'center' }}>Weeks</Text>
                            <TextInput
                                mode="outlined"
                                keyboardType="numeric"
                                style={{  }}
                                value={weeks2}
                                onChangeText={setWeeks2}
                            />
                        </View>
                        <View>
                            <Text style={{ textAlign: 'center' }}>Days</Text>
                            <TextInput
                                mode="outlined"
                                keyboardType="numeric"
                                style={{  }}
                                value={days3}
                                onChangeText={setDays3}
                            />
                        </View>
                        <View>
                            <Text style={{ textAlign: 'center' }}>Hours</Text>
                            <TextInput
                                mode="outlined"
                                style={{  }}
                                keyboardType="numeric"
                                value={hours4}
                                onChangeText={setHours4}
                            />
                        </View>
                    </View>
                    </Surface>


                </Surface>
            </Surface>
            <Button title="Submit" onPress={handleSubmit}/>

        </ScreenPrimative>
    )

}