import { Image, View, Text, TouchableOpacity } from "react-native";
import { Role } from "../../../domain/models/Role";
import styles from './Styles';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../navigator/MainStackNavigator";

const roleImages: Record<string, any> = {
    'icon_taxi': require('../../../assets/icon_taxi.png'),
    'user': require('../../../assets/user.png'),
    'controller': require('../../../assets/controller.png'),
    'DRIVER': require('../../../assets/icon_taxi.png'),
    'CLIENT': require('../../../assets/user.png'),
    'ADMIN': require('../../../assets/controller.png'),
};

interface Props {
    navigation: StackNavigationProp<RootStackParamList, 'RolesScreen', undefined>
    role: Role
}

export default function RolesItem({ navigation, role }: Props) {

    const getImageSource = () => {
        if (role.image.startsWith('http')) {
            return { uri: role.image };
        }
        return roleImages[role.image] || roleImages[role.id] || require('../../../assets/user.png');
    };

    return (
        <TouchableOpacity
            onPress={() => {
                if (role.id == 'CLIENT') {
                    navigation.replace('ClientHomeScreen');
                }
                else if (role.id == 'DRIVER') {
                    navigation.replace('DriverHomeScreen');
                }
            }}
        >
            <View>
                <Image
                    style={styles.image}
                    source={getImageSource()}
                />
                <Text style={styles.textItem}>{role.name}</Text>
            </View>
        </TouchableOpacity>

    );
}