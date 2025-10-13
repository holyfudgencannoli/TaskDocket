import { Text, View, Button, Alert, TouchableOpacity } from "react-native";
import { ScreenPrimative } from "../../../components/Screen";
import { Surface } from "react-native-paper";
import { useState } from "react";
import { useThemeColor } from "../../../hooks/use-theme-color";
import { useThemeTypography } from "../../../hooks/use-theme-typography";
import { useThemeSpacing } from "../../../hooks/use-theme-spacing";
import { TextInput } from "react-native-paper";
import CrossPlatformDateTimePicker from "../../../components/CrossPlatformDateTimePicker";
import { apiFetch } from "../../../scripts/FetchAPI";
import { useAuth } from "../../../scripts/AuthContext";

interface POSTRes{
    msg?: string;
}

export default function OneTImeTask() {
    const [formType, setFormType] = useState("")
    const [taskName, setTaskName] = useState("")
    const [months, setMonths] = useState(0)
    const [weeks, setWeeks] = useState(0)
    const [days, setDays] = useState(0)
    const [hours, setHours] = useState(0)
    const [dueDate, setDueDate] = useState(new Date())
    const [priority, setPriority] = useState("")

    const formTypography = useThemeTypography('form')
    const formBackgroundColor = useThemeColor({}, 'primary3')
    const formSpacing = useThemeSpacing('forms')

    const { token, user } = useAuth()

    const handleSubmit = async () => {
        const payload = {
            name: taskName,
            dueDate: dueDate.toISOString(),
            priority: priority,
            priorNoticeMonths: months,
            priorNoticeWeeks: weeks,
            priorNoticeDays: days,
            priorNoticeHours: hours
        }

        console.log("Payload: ", payload)
        const data: POSTRes = await apiFetch('ott', 'POST', token, payload)
        console.log(data.msg)
        Alert.alert(data.msg)

    }

    return(
        <ScreenPrimative scroll edges={[]}>
            <Surface style={{ backgroundColor: formBackgroundColor, ...formSpacing.metaContainer2 }}>
                <Surface style={{ ...formSpacing.container }}>
                    <Text style={{ ...formTypography.title }}>
                        New One-Time Task
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
                            value={taskName}
                            onChangeText={setTaskName}

                        />
                        <CrossPlatformDateTimePicker 
                            datetime={dueDate}
                            onChangeDate={setDueDate}
                            label={"Due Date"}
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
                    </Surface>


                </Surface>
            </Surface>
            <Button title="Submit" onPress={handleSubmit}/>

        </ScreenPrimative>
    )

}