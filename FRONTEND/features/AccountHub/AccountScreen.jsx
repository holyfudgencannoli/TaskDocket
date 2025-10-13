import LogoutButton from "../../components/LogoutButton";
// import { ThemedText } from "../../components/ThemedText";
import { useAuth } from "../../scripts/AuthContext";
import { StyleSheet, Text } from "react-native";
import { Image } from "expo-image";
import { ScreenPrimative } from "../../components/Screen";

export default function AccountScreen() {
    const { user, token } = useAuth()
    

    return(
        <ScreenPrimative>
            <Image
                source={require('../../assets/inline-logo.png')}
                style={{ width: '100%', height: 120, position: 'relative', top: 24, backgroundColor: '#fff' }}
                resizeMode="cover"
            />
            <Text style={styles.greeting}>
                Hello {user ? user.username : "User"}!
            </Text>

            <LogoutButton/>
        </ScreenPrimative>
    )
    
}

const styles = StyleSheet.create({
    greeting: {
        fontSize:21,
        padding:24,
        textAlign:'center'
    },
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

