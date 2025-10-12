import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenPrimative } from "../../components/Screen";

export default function PasswordRecoveryScreen() {
    return(
        <ScreenPrimative>
            <Image
                source={require('../../assets/logo.png')}
                style={{ width: "100%", height: "35%"}}
                resizeMode='cover'
            />
            <Text>
                Hello lost user!
            </Text>
        </ScreenPrimative>
    )
    
}