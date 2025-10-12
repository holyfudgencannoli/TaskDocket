import { Alert, Text, View } from "react-native";
import { ScreenPrimative } from "../../components/Screen";
import { Image } from 'react-native';
import { Surface, TextInput } from "react-native-paper";
import { useThemeColor } from "../../hooks/use-theme-color";
import { useThemedTextStyle } from "../../hooks/use-theme-typography";
import { useEffect, useState } from "react";


export default function RegisterScreen() {
    
    const formColor = useThemeColor({}, 'formBackground')
    const formTitle = useThemedTextStyle('form', 'formLabelText', 'title');



    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true)
    const [passwordOutlineColor, setPasswordOutlineColor] = useState("black")


    const checkPasswordMatch = () => {
        if (password !== passwordConfirm && passwordConfirm !=="") {
            setPasswordMatch(false)
            Alert.alert("Passwords do not match");
            
        } else {
            setPasswordMatch(true)
        }
    }

    // useEffect(() => {
    //     if (!passwordMatch && password !== "" && passwordConfirm !== "")


    // }, [passwordMatch])
    

    return(
        <ScreenPrimative scroll>
            <Image
                source={require('../../assets/logo.png')}
                style={{ width: "100%", height: "35%"}}
                resizeMode='cover'
            />
            <Surface style={{ padding: 16, backgroundColor: formColor }}>
                <Text style={formTitle}>
                    User Registration
                </Text>
                <TextInput
                    style={{ marginTop: 16, marginBottom: 12 }}
                    value={username}
                    onChangeText={setUsername}
                    mode='outlined'
                    label="Username"
                    autoCapitalize='none'
                    autoComplete='username-new'
                    outlineStyle={{ borderRadius: 80 }}
                />
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    mode="outlined"
                    secureTextEntry={!showPassword}  // hides text if false
                    textContentType='password'
                    autoComplete='password-new'
                    outlineStyle={{ borderRadius: 80 }}
                    outlineColor={passwordOutlineColor}
                    onBlur={checkPasswordMatch}
                    right={
                    <TextInput.Icon
                        icon={showPassword ? "eye-off" : "eye"}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                    }
                    style={{ marginTop: 16, marginBottom: 12 }}
                />
                <TextInput
                    label="Confirrm Password"
                    value={passwordConfirm}
                    onChangeText={setPasswordConfirm}
                    mode="outlined"
                    autoComplete='password-new'
                    outlineColor={passwordOutlineColor}
                    outlineStyle={{ borderRadius: 80 }}
                    secureTextEntry={!showPasswordConfirm}  // hides text if false
                    right={
                    <TextInput.Icon
                        icon={showPasswordConfirm ? "eye-off" : "eye"}
                        onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    />
                    }
                    onBlur={checkPasswordMatch}
                    style={{ marginTop: 16, marginBottom: 12 }}
                />
                {passwordConfirm !== "" && password !== "" && 
                    (!passwordMatch ? (
                        <View>
                            <Text style={{ fontSize:16, color:'red' }}>
                                Passwords Do Not Match
                            </Text>
                        </View>
                    ) : (
                        <View>
                            <Text style={{ fontSize:16, color:'green' }}>
                                Good To Go!
                            </Text>
                        </View>
                    )
                )}
            </Surface>

        </ScreenPrimative>
    )
}