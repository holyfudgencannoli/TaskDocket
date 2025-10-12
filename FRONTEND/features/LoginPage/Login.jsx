import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, View } from 'react-native';
import { Surface, TextInput } from 'react-native-paper';
import * as React from "react";
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../scripts/AuthContext';
// import notifee from '@notifee/react-native';
import { ScreenPrimative } from '../../components/Screen';
// import { scheduleNotification } from '../../scripts/NotificationScheduling';

export default function Login() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const { login } = useAuth();    


    const navigation = useNavigation()

    const handleLogin = async () => {

        try {
            const res = await fetch("://react-tasks-online.onrender.com/api/auth/login", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (res.ok) {
                const token = data.access_token;
                const user = data.user;
                login(user, token)
                // scheduleNotification(new Date().getTime() + 3000, "Login Succesful!", `Welcome to your TaskDocket ${user.username}. Log some new tasks or peruse your To Do Lists to see what you have scheduled.`)
                navigation.navigate("Root");
            } else {
                alert(data.msg || "Login failed");
            }
        } catch (err) {
            console.error("Error caught in handleLogin:", {
                name: err?.name,
                message: err?.message,
                stack: err?.stack,
                full: JSON.stringify(err, Object.getOwnPropertyNames(err), 2),
            });

            alert(`Server error: ${err?.message || "Unknown error"}`);
        }
    };

    return (
        <ScreenPrimative>
            <Image
                source={require('../../assets/logo.png')}
                style={{ width: "100%", height: "35%"}}
                resizeMode='cover'
            />
            <Surface style={{ padding: 16 }}>
                <TextInput
                    style={{ marginTop: 16}}
                    label="Username"
                    value={username}
                    mode='outlined'
                    onChangeText={setUsername}
                    autoCapitalize='none'
                    autoComplete='username'
                    importantForAutofill='yes'
                />
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    mode="outlined"
                    autoCapitalize='none'
                    autoComplete='password'
                    importantForAutofill='yes'
                    secureTextEntry={!showPassword}  // hides text if false
                    right={
                    <TextInput.Icon
                        icon={showPassword ? "eye-off" : "eye"}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                    }
                    style={{ marginTop: 16, marginBottom: 12 }}
                />
                <Button onPress={() => navigation.navigate("Root")} color="#000080" style={styles.button} title='Log In'></Button>
                {/* <Button onPress={handleLogin} color="#000080" style={styles.button} title='Log In'></Button> */}
            </Surface>
            <View style={{ display:'flex', flexDirection: 'row', margin: 'auto', gap: 48 }}>
                <Button color="#000080" onPress={() => navigation.navigate('RegisterScreen')} title='Create Account'></Button>
                <Button color="#000080" title='Forgot Password' onPress={() => navigation.navigate('PasswordRecoveryScreen')}></Button>
            </View>
        </ScreenPrimative>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button:{
    color: 'black'
  },
  reactLogo: {
    height: 180,
    width: 420,
    bottom: -10,
    left: -10,
    position: 'absolute',
    alignItems: 'center'
  },
});
