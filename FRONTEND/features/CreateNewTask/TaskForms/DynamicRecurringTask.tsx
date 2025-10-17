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
import { useRoute } from "@react-navigation/native";
import { TypeStyles } from "../../../constants/typography";

interface POSTRes{
    msg?: string;
}

export default function DynamicRecurringTask() {
    const route = useRoute();
    const formTypography = TypeStyles(route.name);

    const [formType, setFormType] = useState("")
    const [taskName, setTaskName] = useState("")
    const [months, setMonths] = useState(0)
    const [weeks, setWeeks] = useState(0)
    const [days, setDays] = useState(0)
    const [hours, setHours] = useState(0)
    const [dueDate, setDueDate] = useState(new Date())
    const [priority, setPriority] = useState("")

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
        const data: POSTRes = await apiFetch('drt', 'POST', token, payload)
        console.log(data.msg)
        Alert.alert(data.msg)

    }

    return(
        <ScreenPrimative scroll edges={[]}>
            <Surface style={{ backgroundColor: formBackgroundColor, ...formSpacing.metaContainer3 }}>
                <Surface style={{ ...formSpacing.container , backgroundColor: formTypography.form.background.BackgroundColor}}>
                    <Text style={{ ...formTypography.form.title }}>
                        New Dynamic Recurring Task
                    </Text>
                    <Text style={{ ...formTypography.form.subtitle }}>
                        These tasks repeat on flexible schedules. When you mark one as complete, you’ll choose the next due date, and a new task will be created automatically.
                    </Text>
                </Surface>
                <Surface >
                    <Surface style={{ ...formSpacing.inputFieldContainer, backgroundColor: formTypography.form.background.BackgroundColor }}>
                        <View style={{ ...formSpacing.inputFieldLabelContainer }}>
                            <Text style={{ ...formTypography.form.inputFieldLabel }}>
                                Task Name
                            </Text>
                        </View>
                        <TextInput
                            label={"Name"}
                            value={taskName}
                            onChangeText={setTaskName}
                            mode="outlined"

                        />
                        <CrossPlatformDateTimePicker 
                            datetime={dueDate}
                            onChangeDate={setDueDate}
                            label={"Due Date"}
                            labelStyle={formTypography.form.inputFieldLabel}
                            buttonColor={formBackgroundColor}
                        />

                        <View style={{ ...formSpacing.inputFieldLabelContainer }}>
                            <Text style={{ ...formTypography.form.inputFieldLabel }}>
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
                                    backgroundColor: priority === "Low" ? formTypography.form.button.color : "#E0E0E0",
                                }}
                            >
                                <Text style={{ color: priority === "Low" ? "#fff" : '#000' }}>Low</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setPriority("Normal")}
                                activeOpacity={0.6}
                                style={{
                                    padding: 10,
                                    borderRadius: 8,
                                    backgroundColor: priority === "Normal" ? formTypography.form.button.color : "#E0E0E0",
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
                                    backgroundColor: priority === "High" ? formTypography.form.button.color : "#E0E0E0",
                                }}
                            >
                                <Text style={{ color: priority === "High" ? "#fff" : "#000" }}>High</Text>
                            </TouchableOpacity>
                        </View>                        
                        <View style={{ ...formSpacing.inputFieldLabelContainer }}>
                            <Text style={{ ...formTypography.form.inputFieldLabel }}>
                                Prior Notice
                            </Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                            <View>
                                <Text style={formTypography.form.timeFieldLabel}>Months</Text>
                                <TextInput
                                    mode="outlined"
                                    keyboardType="numeric"
                                    style={{  }}
                                    value={months}
                                    onChangeText={setMonths}
                                />
                            </View>
                            <View>
                                <Text style={formTypography.form.timeFieldLabel}>Weeks</Text>
                                <TextInput
                                    mode="outlined"
                                    keyboardType="numeric"
                                    style={{  }}
                                    value={weeks}
                                    onChangeText={setWeeks}
                                />
                            </View>
                            <View>
                                <Text style={formTypography.form.timeFieldLabel}>Days</Text>
                                <TextInput
                                    mode="outlined"
                                    keyboardType="numeric"
                                    style={{  }}
                                    value={days}
                                    onChangeText={setDays}
                                />
                            </View>
                            <View>
                                <Text style={formTypography.form.timeFieldLabel}>Hours</Text>
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
            <Button color={formTypography.form.button.color} title="Submit" onPress={handleSubmit}/>

        </ScreenPrimative>
    )

}