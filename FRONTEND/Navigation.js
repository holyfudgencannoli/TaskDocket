import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { Image  } from 'expo-image';
import { View } from 'react-native';
// import { StyleSheet } from 'react-native';

import Login from './features/LoginPage/Login';
import PasswordRecoveryScreen from './features/PasswordRecovery/PasswordRecovery';
import RegisterScreen from './features/CreateNewAccount/Register';
import AccountScreen from './features/AccountHub/AccountScreen';
import Dashboard from './features/Dashboard/Dashboard';
// import TaskInput from './screens/HomeStack/TaskInput';
// import TaskRecords from './screens/TasksStack/TaskRecords';
// import ToDoList from './screens/TasksStack/ToDoList';
// import RepeatingTaskRecords from './screens/TasksStack/RepeatingTaskRecords';
// import RepeatingTaskInput from './screens/HomeStack/RepeatingTaskInput';
import { useAuth } from './scripts/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useThemeColor } from './hooks/use-theme-color';
import NewTask from './features/CreateNewTask/NewTask';
import OneTimeTask from './features/CreateNewTask/TaskForms/OneTimeTask';
import StaticRecurringTask from './features/CreateNewTask/TaskForms/StaticRecurringTask';
import DynamicRecurringTask from './features/CreateNewTask/TaskForms/DynamicRecurringTask';
import LimitedOpportunity from './features/CreateNewTask/TaskForms/LimitedOpportunityTask';
import DueThisWeek from './features/Dashboard/DueThisWeek';
import CompletedTasks from './features/Dashboard/CompletedTasks';
import OneTimeTaskRecords from './features/TaskRecords/OneTimeTask';
import StaticRecurringTaskRecords from './features/TaskRecords/StaticRecurringTask';
import DynamicRecurringTaskRecords from './features/TaskRecords/DynamicRecurringTask';
import LimitedOpportunityRecords from './features/TaskRecords/LimitedOpportunityTask';
import { useIsFocused } from '@react-navigation/native';





const AuthStack = createNativeStackNavigator();

function AuthStackGroup() {
    return(
        <AuthStack.Navigator>
            <AuthStack.Screen component={Login} name='Login' options={{ headerShown: false }}/>
            <AuthStack.Screen component={RegisterScreen} name='RegisterScreen' options={{ headerShown: false }}/>
            <AuthStack.Screen component={PasswordRecoveryScreen} name='PasswordRecoveryScreen' />
            <AuthStack.Screen component={RootBottomTabGroup} name='Root' options={{ headerShown: false }} />
        </AuthStack.Navigator>
    )
    
}

export default function Navigation() {
    return(
        <NavigationContainer>
            <AuthStackGroup />
        </NavigationContainer>
    )
}


const RootBottomTabs = createBottomTabNavigator();

function RootBottomTabGroup() {

    const { user } = useAuth();

    // return user ? (
    return(
        <RootBottomTabs.Navigator
            screenOptions={({route}) => ({
                tabBarActiveTintColor:'black'
                tabBarIcon:({ focused, color, size }) =>{
                    let iconName;

                    if (route.name === 'Home'){
                        iconName = focused ? 'home' : 'home-outline' ;
                    } else if (route.name === 'Tasks'){
                        iconName = focused ? 'list-circle' : 'list-circle-outline' ;
                    } else if (route.name === 'Records'){
                        iconName = focused ? 'clipboard' : 'clipboard-outline' ;
                    } else if (route.name === 'Account'){
                        iconName = focused ? 'person' : 'person-outline' ;
                    }
                    return <Ionicons name={iconName} size={size} color={'rgba(147,212,255,1)'} />;
                },
            })}
        >
            <RootBottomTabs.Screen component={HomeStackGroup} name='Home' options={{ headerShown: false, unmountOnBlur: true}} screenOptions={{  }}/>
            <RootBottomTabs.Screen component={TaskStackGroup} name='Tasks' options={{ headerShown: false }}/>
            <RootBottomTabs.Screen component={RecordStackGroup} name='Records' options={{ headerShown: false }}/>
            <RootBottomTabs.Screen component={AccountStackGroup} name='Account' options={{ headerShown: false }}/>
        </RootBottomTabs.Navigator>
    )
    // ) : (
        // <AuthStackGroup />
    // )
    
}

const HomeNav = createMaterialTopTabNavigator()

function HomeNavGroup({navigation}) {
    const isFocused = useIsFocused();
    return isFocused ? (
        <HomeNav.Navigator>
            <HomeNav.Screen component={Dashboard} name="Due Today" />
            <HomeNav.Screen component={DueThisWeek} name="Due This Week" />
            <HomeNav.Screen component={CompletedTasks} name="Completed Tasks" />
        </HomeNav.Navigator>
    ) : null;
}


function HomeWithHeader() {
    const backgroundColor = useThemeColor({}, 'background')

  return (
    <View style={{ flex: 1 }}>
      {/* Header image above tabs */}
      <Image
        source={require('./assets/inline-logo.png')}
        style={{ width: '100%', height: 120, position: 'relative', top: 24, backgroundColor: backgroundColor }}
        resizeMode="cover"
      />

      {/* Tabs below image */}
      <HomeNavGroup />
    </View>
  );
}

const HomeStack = createNativeStackNavigator();

function HomeStackGroup() {
    return(
        <HomeStack.Navigator>
            <HomeStack.Screen component={HomeWithHeader} name='HomeNav' options={{ headerShown: false }} />
        </HomeStack.Navigator>        
    )
}

const TaskNav = createMaterialTopTabNavigator()

function TaskNavGroup({naviagtion}) {
    const isFocused = useIsFocused();
    return isFocused ? (
        <TaskNav.Navigator>
            <TaskNav.Screen  component={OneTimeTask} name='One-Time Tasks'  />
            <TaskNav.Screen  component={StaticRecurringTask} name='Static Recurring Tasks' />
            <TaskNav.Screen  component={DynamicRecurringTask} name='Dynamic Recurring Tasks' />
            <TaskNav.Screen  component={LimitedOpportunity} name='Limited Opportun. Tasks' />
        </TaskNav.Navigator>
    ) : null;
}


function TasksWithHeader() {
  return (
    <View style={{ flex: 1 }}>
      {/* Header image above tabs */}
      <Image
        source={require('./assets/inline-logo.png')}
        style={{ width: '100%', height: 120, position: 'relative', top: 24, backgroundColor: '#fff' }}
        resizeMode="cover"
      />

      {/* Tabs below image */}
      <TaskNavGroup />
    </View>
  );
}

const TaskStack = createNativeStackNavigator();

function TaskStackGroup() {
    return(
        <TaskStack.Navigator>
            <TaskStack.Screen component={TasksWithHeader} name='TaskNav' options={{ headerShown: false }} />
        </TaskStack.Navigator>        
    )
}

const RecordNav = createMaterialTopTabNavigator()

function RecordNavGroup({navigation}) {
    const isFocused = useIsFocused();
    return isFocused ? (
        <RecordNav.Navigator>
            <RecordNav.Screen  component={OneTimeTaskRecords} name='One-Time Tasks' />
            <RecordNav.Screen  component={StaticRecurringTaskRecords} name='Static Recurring Tasks' />
            <RecordNav.Screen  component={DynamicRecurringTaskRecords} name='Dynamic Recurring Tasks' />
            <RecordNav.Screen  component={LimitedOpportunityRecords} name='Limited Opportun. Tasks' />
        </RecordNav.Navigator>
    ) : null;
}


function RecordsWithHeader() {
  return (
    <View style={{ flex: 1 }}>
      {/* Header image above tabs */}
      <Image
        source={require('./assets/inline-logo.png')}
        style={{ width: '100%', height: 120, position: 'relative', top: 24, backgroundColor: '#fff' }}
        resizeMode="cover"
      />

      {/* Tabs below image */}
      <RecordNavGroup />
    </View>
  );
}

const RecordStack = createNativeStackNavigator();

function RecordStackGroup() {
    return(
        <RecordStack.Navigator>
            <RecordStack.Screen component={RecordsWithHeader} name='RecordNav' options={{ headerShown: false }} />
        </RecordStack.Navigator>        
    )
}


const AccountStack = createNativeStackNavigator();

function AccountStackGroup() {
    return(
        <AccountStack.Navigator>
            <AccountStack.Screen component={AccountScreen} name='AccountNav' options={{ headerShown: false }} />
        </AccountStack.Navigator>
    )
}