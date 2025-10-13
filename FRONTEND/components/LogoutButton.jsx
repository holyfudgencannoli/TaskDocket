import { useAuth } from "../scripts/AuthContext";
import { Button } from "react-native";
import { useNavigation, CommonActions } from "@react-navigation/native";
// import { scheduleNotification } from "../scripts/NotificationScheduling";

export default function LogoutButton() {
    const navigation = useNavigation();
    const { token, logout } = useAuth();

    const handleLogout = async () => {
        if (!token) return;
        

        try {
            const res = await fetch("https://react-tasks-online.onrender.com/api/auth/logout", {
                method: "POST",
                headers : {
                    Authorization: `Bearer ${token}`
                },                
                credentials: "include"
            });
            if (!res.ok) throw new Error("Logout failed");
            
            logout()
            // scheduleNotification(new Date().getTime() + 4000, "Logout Succesful!", "This is a good security choice, but don't worry! TaskDocket will notify you about your upcoming deadlines even if you're logged out.")
        } catch (err) {
            console.error(err);
            alert("Error logging out");
        }
    };

    return (
        
        <Button id="logout-button" onPress={handleLogout} title="Logout" />
    );
}
