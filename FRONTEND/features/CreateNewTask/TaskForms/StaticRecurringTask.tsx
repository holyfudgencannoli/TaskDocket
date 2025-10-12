import { Button, Text, View } from "react-native";
import { ScreenPrimative } from "../../../components/Screen";
import { Surface, TextInput } from "react-native-paper";
import { useState } from "react";
import { useThemeSpacing } from "../../../hooks/use-theme-spacing";
import { useThemeTypography } from "../../../hooks/use-theme-typography";
import { useThemeColor } from "../../../hooks/use-theme-color";

export default function StaticRecurringTask() {
    const [formType, setFormType] = useState("")

    const formTypography = useThemeTypography('form')
    const formBackgroundColor = useThemeColor({}, 'primary')
    const formSpacing = useThemeSpacing('forms')
    return(
        <ScreenPrimative scroll edges={[]}>
                <Surface style={{ backgroundColor: formBackgroundColor, ...formSpacing.metaContainer }}>
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
                            <TextInput
                                label={"Priority"}
                            />
                            <View style={{ ...formSpacing.inputFieldLabelContainer }}>
                                <Text style={{ ...formTypography.inputFieldLabel }}>
                                    Due Date
                                </Text>
                            </View>
                            <TextInput
                                label={"Prior Notice"}
                                keyboardType="numeric"
                            />
                        </Surface>


                    </Surface>
                </Surface>
            <Button title="Submit" onPress={() => console.log('Pressed!')}/>

        </ScreenPrimative>
    )

}