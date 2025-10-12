import { Text, View, Button } from "react-native";
import { ScreenPrimative } from "../../../components/Screen";
import { Surface } from "react-native-paper";
import { useState } from "react";
import { useThemeColor } from "../../../hooks/use-theme-color";
import { useThemeTypography } from "../../../hooks/use-theme-typography";
import { useThemeSpacing } from "../../../hooks/use-theme-spacing";
import { TextInput } from "react-native-paper";

export default function LimitedOpportunity() {
   const [formType, setFormType] = useState("")

    const formTypography = useThemeTypography('form')
    const formBackgroundColor = useThemeColor({}, 'primary')
    const formSpacing = useThemeSpacing('forms')
    return(
        <ScreenPrimative scroll edges={[]}>
            <Surface style={{ backgroundColor: formBackgroundColor, ...formSpacing.metaContainer }}>
                <Surface style={{ ...formSpacing.container }}>
                    <Text style={{ ...formTypography.title }}>
                        New Limited Opportunity Task
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