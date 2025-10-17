import React, { useEffect, useState, useRef, useLayoutEffect, useCallback,  } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Animated, Alert, ScrollView } from 'react-native';
import { apiFetch } from './FetchAPI';
import OneTImeTask from '../features/CreateNewTask/TaskForms/OneTimeTask';

const animatedValues = useRef<Record<number, Animated.Value>>({}).current;



interface GETRes{
    tasks?: [{}];
    msg?: string;
}
 interface OneTimeTask{
    id: number;
    name: string;
    due_datetime: string;
    priority: string;
    prior_notice_months: number;
    prior_notice_weeks: number;
    prior_notice_days: number;
    prior_notice_hours: number;
    created_at: string;
    completed: boolean;
    user_id: number;
}


export const markComplete = async (task: OneTimeTask, token: string) => {
    if (!task) return;    

    // Animate strikethrough
    if (!animatedValues[task.id]) animatedValues[task.id] = new Animated.Value(0);
    Animated.timing(animatedValues[task.id], {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
    }).start();
    
    // scheduleNotification(new Date().getTime() + 5000, "Task Completed!", `You have completed "${task.name}". Great job!`)

    setTimeout(async() => {
        const res: GETRes = await apiFetch(`mark-complete/${task.id}`, 'POST', token, {task_id: task.id})
        console.log(res.msg)

    }, 2000);
};

