import { Text, View, TouchableOpacity } from "react-native";
import styles from './Styles';
import { useAuth } from "../../../hooks/useAuth";
import { CommonActions } from "@react-navigation/native";

export default function DriverHomeScreen({ navigation }: any) {
    const { removeAuthSession } = useAuth();

    const handleLogout = async () => {
        await removeAuthSession();
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'LoginScreen' }],
            })
        );
    };

    return (
        <View style={styles.container}>
            <Text style={{ color: 'white', fontSize: 18, marginBottom: 20 }}>Panel del Conductor</Text>
            <TouchableOpacity
                style={{
                    backgroundColor: '#EA4C4C',
                    padding: 15,
                    borderRadius: 10,
                    marginTop: 20,
                }}
                onPress={handleLogout}
            >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>CERRAR SESION</Text>
            </TouchableOpacity>
        </View>
    );
}