import { StyleSheet, View, Image, TextInput, KeyboardType } from 'react-native';

interface Props {
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void,
    keyboardType?: KeyboardType,
    icon: any,
    secureTextEntry?: boolean,
    textColor?: string,
    placeholderTextColor?: string,
    borderBottomColor?: string,
    marginHorizontal?: number,
    fontSize?: number
}

const DefaultTextInput = ({
    placeholder,
    value,
    onChangeText,
    keyboardType = 'default',
    icon,
    secureTextEntry = false,
    textColor = 'white',
    placeholderTextColor = 'white',
    borderBottomColor = 'white',
    marginHorizontal = 0,
    fontSize = 18
}: Props) => {
    return (
        <View style={{ ...styles.containerTextInput, marginHorizontal: marginHorizontal }}>

            <Image
                style={styles.textInputIcon}
                source={icon}
            />

            <TextInput
                style={{ ...styles.textInput, color: textColor, borderBottomColor: borderBottomColor, fontSize: fontSize }}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                value={value}
                onChangeText={text => onChangeText(text)}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    containerTextInput: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: '#E8E8E8',
        borderTopLeftRadius: 15,
        borderBottomRightRadius: 15,
        paddingHorizontal: 15
    },
    textInput: {
        width: '90%',
        height: 50,
        // borderBottomWidth: 1,
    },
    textInputIcon: {
        width: 25,
        height: 25,
        marginRight: 15,
    },
})

export default DefaultTextInput;