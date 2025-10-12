import { View,  } from "react-native";
import { ScreenPrimative } from "../../components/Screen";
import { Button, Surface } from "react-native-paper";
import { useCallback, useState } from "react";
import OneTimeTask from "./TaskForms/OneTimeTask";
import StaticRecurringTask from "./TaskForms/StaticRecurringTask";
import DynamicRecurringTask from "./TaskForms/DynamicRecurringTask";
import LimitedOpportunity from "./TaskForms/LimitedOpportunityTask";
import { useFocusEffect } from "@react-navigation/native";

export default function NewTask() {
    const [formType, setFormType] = useState("")

    useFocusEffect(
        useCallback(() => {
            setFormType('')
        }, [])
    )

    return (
        <ScreenPrimative edges={[]}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', padding: 16 }}>
                <Button
                    buttonColor='green'
                    mode="contained"
                    onPress={() => setFormType('oneTime')}
                    rippleColor="rgba(0,0,0,0.32)"
                    contentStyle={{ flexWrap: 'wrap' }}
                >
                    One Time Task
                </Button>
                <Button
                    buttonColor='green'
                    mode="contained"
                    onPress={() => setFormType('staticR')}
                    rippleColor="rgba(0,0,0,0.32)"
                >
                    Static Recurring
                </Button>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                <Button
                    buttonColor='green'
                    mode="contained"
                    onPress={() => setFormType('dynamicR')}
                    rippleColor="rgba(0,0,0,0.32)"
                >
                    Dynamic Recurring
                </Button>
                <Button
                    buttonColor='green'
                    mode="contained"
                    onPress={() => setFormType('limitedO')}
                    rippleColor="rgba(0,0,0,0.32)"
                >
                    Limited Opportunity
                </Button>
            </View>

            {formType === 'oneTime' ? (
                <OneTimeTask />
            ) : formType === 'staticR' ? (
                <StaticRecurringTask />
            
            ) : formType === 'dynamicR' ? (
                <DynamicRecurringTask/>
                
            ) : formType === 'limitedO' ? (
                <LimitedOpportunity/>
            ) : (
                <></>
            )}
        </ScreenPrimative>
    );
}
