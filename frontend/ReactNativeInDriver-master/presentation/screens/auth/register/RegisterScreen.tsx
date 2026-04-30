import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import styles from "./Styles";
import DefaultTextInput from "../../../components/DefaultTextInput";
import DefaultRoundedButton from "../../../components/DefaultRoundedButton";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../../../navigator/MainStackNavigator";
import { useState } from "react";
import EmailValidator from "../../../utils/EmailValidator";
import { container } from "../../../../di/container";
import { RegisterViewModel } from "./RegisterViewModel";
import { User } from '../../../../domain/models/User';
import { Shadow } from "react-native-shadow-2";
import LottieView from "lottie-react-native";


interface Props extends StackScreenProps<RootStackParamList, 'RegisterScreen'>{};
export default function RegisterScreen({navigation, route}: Props) {

    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const registerViewModel: RegisterViewModel = container.resolve('registerViewModel');

    const handleRegister = async () => {
        if (name === "") {
            Alert.alert("Error", "El nombre no puede estar vacio")
            return;
        }
        if (lastname === "") {
            Alert.alert("Error", "El apellido no puede estar vacio")
            return;
        }
        if (email === "") {
            Alert.alert("Error", "El correo no puede estar vacio")
            return;
        }
        if (phone === "") {
            Alert.alert("Error", "El telefono no puede estar vacio")
            return;
        }
        if (password === "") {
            Alert.alert("Error", "El password no puede estar vacio")
            return;
        }
        if (confirmPassword === "") {
            Alert.alert("Error", "La confirmacion de contraseña no puede estar vacia")
            return;
        }
        if (!EmailValidator(email)) {
            Alert.alert("Error", "El email no es valido")
            return;
        }
        if (confirmPassword !== password) {
            Alert.alert("Error", "Las contraseñas no coinciden")
            return;
        }
        const response = await registerViewModel.register({
            name: name,
            lastname: lastname,
            email: email,
            phone: phone,
            password: password
        });
        console.log('Response:', response);
    }

    return (
        <View style={styles.container}>

            
            <Image 
                source={ require('../../../../assets/car_background.jpg') }
                style={styles.imageBackground}
            />
            
            <Image
                    source={require('../../../../assets/city_night2.jpg')}
                    style={styles.topImage}
            />
                
            <TouchableOpacity
                style={styles.containerBack}
                onPress={() => navigation.pop()}
            >
                <Image 
                    style={styles.back}
                    source={require('../../../../assets/left_arrow.png')}
                />
            </TouchableOpacity>
            <Shadow containerStyle={styles.shadowForm} startColor={'#717171'} distance={15}>
                <View style={styles.form}>
                <LottieView style={styles.lottie} source={require('../../../../assets/sign_in.json')} autoPlay loop />

                
                <DefaultTextInput 
                    placeholder="Nombre"
                    value={name}
                    onChangeText={setName}
                    icon={require('../../../../assets/user_gray.png')}
                    placeholderTextColor='gray'
                    marginHorizontal={20}
                    fontSize={16}
                    textColor="black"
                />

                <DefaultTextInput 
                    placeholder="Apellido"
                    value={lastname}
                    onChangeText={setLastname}
                    icon={require('../../../../assets/user2_gray.png')}
                    placeholderTextColor='gray'
                    marginHorizontal={20}
                    fontSize={16}
                    textColor="black"
                />

                <DefaultTextInput 
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    icon={require('../../../../assets/mail_gray.png')}
                    placeholderTextColor='gray'
                    marginHorizontal={20}
                    fontSize={16}
                    textColor="black"

                />

                <DefaultTextInput 
                    placeholder="Telefono"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="numeric"
                    icon={require('../../../../assets/phone_gray.png')}
                    placeholderTextColor='gray'
                    marginHorizontal={20}
                    fontSize={16}
                    textColor="black"

                />

                <DefaultTextInput 
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    icon={require('../../../../assets/password_gray.png')}
                    secureTextEntry={true}
                    placeholderTextColor='gray'
                    marginHorizontal={20}
                    fontSize={16}
                    textColor="black"

                />
                <DefaultTextInput 
                    placeholder="Confirmar Contraseña"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    icon={require('../../../../assets/password_gray.png')}
                    secureTextEntry={true}
                    placeholderTextColor='gray'
                    marginHorizontal={20}
                    fontSize={16}
                    textColor="black"

                />

                <DefaultRoundedButton
                    text='INICIAR SESION'
                    backgroundColor="#EA4C4C"
                    onPress={() => handleRegister()}
                    marginTop={20}
                    height={50}
                    marginLeft={15}
                    // marginRight={15}
                    width={250}
                />
             

                </View>

            </Shadow>
            
            
        </View>
    );
}