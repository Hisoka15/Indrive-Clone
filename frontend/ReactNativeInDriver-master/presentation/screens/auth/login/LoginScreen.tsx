import { Text, View, Image, Alert, TouchableOpacity } from 'react-native';
import DefaultTextInput from '../../../components/DefaultTextInput';
import DefaultRoundedButton from '../../../components/DefaultRoundedButton';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigator/MainStackNavigator';
import styles from './Styles';
import { useEffect, useState } from 'react';
import EmailValidator from '../../../utils/EmailValidator';
import { LoginViewModel } from './LoginViewModel';
import { container } from '../../../../di/container';
import { useAuth } from '../../../hooks/useAuth';
import { Shadow } from 'react-native-shadow-2';
import LottieView from 'lottie-react-native';


interface Props extends StackScreenProps<RootStackParamList, 'LoginScreen'> { };
export default function LoginScreen({ navigation, route }: Props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const loginViewModel: LoginViewModel = container.resolve('loginViewModel');
    const { authResponse, saveAuthSession } = useAuth();

    useEffect(() => {
        // console.log('Auth Response', authResponse);
        
        if (authResponse !== null && authResponse !== undefined) {
            
            if (authResponse.user.roles!.length > 1) {
                navigation.replace('RolesScreen');
            }
            else {
                navigation.replace('ClientHomeScreen');
            } 
        }
    }, [authResponse])
    

    const handleLogin = async () => {
        if (email === '' || password === '') {
            Alert.alert('Error', 'El email y el password no pueden estar vacios')
            return;
        }
        if (!EmailValidator(email)) {
            Alert.alert('Error', 'El email no es valido')
            return;
        }
        const response = await loginViewModel.login(email, password);
        if ('token' in response) { // LOGIN EXITOSO
            saveAuthSession(response);
            console.log('Response', 'Login exitoso');
        }
        // console.log('Response', response);
    }

    return (
        <View style={styles.container}>

            <Image
                style={styles.imageBackground}
                source={require('../../../../assets/city_black.jpg')}
            />

            <Image
                    source={require('../../../../assets/city_night2.jpg')}
                    style={styles.topImage}
            />
            <Shadow containerStyle={styles.shadowForm} startColor={'#717171'} distance={15}>
                <View style={styles.form}>
                <LottieView style={styles.lottie} source={require('../../../../assets/car.json')} autoPlay loop />

                <DefaultTextInput
                    icon={require('../../../../assets/mail_gray.png')}
                    placeholder='Correo electronico'
                    onChangeText={setEmail}
                    value={email}
                    keyboardType='email-address'
                    placeholderTextColor='gray'
                    textColor="black"
                />

                <DefaultTextInput
                    icon={require('../../../../assets/password_gray.png')}
                    placeholder='Contraseña'
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry={true}
                    placeholderTextColor='gray'
                    textColor="black"
                />

                <DefaultRoundedButton
                    text='INICIAR SESION'
                    backgroundColor='#EA4C4C'
                    onPress={() => {
                        handleLogin();
                    }}
                    
                />
                {/* <Image
                    source={require('../../../../assets/user.png')}
                    style={styles.imageUser}
                />
                <Text style={styles.textLogin}>LOGIN</Text>

                

                <DefaultRoundedButton
                    text='REGISTRATE'
                    onPress={() => navigation.navigate('RegisterScreen')}
                    backgroundColor='black'
                /> */}

                </View>

            </Shadow>
            
            <Text style={styles.textLogin}>¿Olvidaste tu Contraseña?</Text>

            <View style={styles.containerDivider}>
                <View style={styles.divider}></View>
                <Text style={styles.textDontHaveAccount}>O</Text>
                <View style={styles.divider}></View>
            </View>

            <View style={styles.containerTextDontHaveAccount}>
                
                <Text style={styles.textDontHaveAccount}>No tienes cuenta?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
                    <Text style={styles.textRegister}>Registrate</Text>
                </TouchableOpacity>
                
            </View>

        </View>
    )
}