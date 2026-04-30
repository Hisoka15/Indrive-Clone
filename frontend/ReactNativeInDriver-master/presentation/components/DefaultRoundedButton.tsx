import { StyleSheet, Text, TouchableOpacity } from "react-native"

interface Props {
    text: string,
    onPress: () => void,
    backgroundColor?: string,
    width?: any, 
    height?: any,
    marginTop?: number,
    marginBottom?: number,
    marginRight?: number,
    marginLeft?: number,
}

const DefaultRoundedButton = ({ text, onPress, backgroundColor, width = '100%', height = 55, marginTop = 25, marginBottom = 0, marginLeft = 0, marginRight = 0 }: Props) => {
    return (
        <TouchableOpacity 
            style={[styles.roundedButton, { backgroundColor: backgroundColor || 'red', width: width, height: height, marginTop: marginTop, marginBottom: marginBottom, marginLeft: marginLeft, marginRight: marginRight  }]}
            onPress={ () => onPress() }    
        >
            <Text style={styles.textButton}>{ text }</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    roundedButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        
    },
    textButton: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold'
    },
})

export default DefaultRoundedButton;