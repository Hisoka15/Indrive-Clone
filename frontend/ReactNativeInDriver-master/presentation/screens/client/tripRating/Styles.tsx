import { StyleSheet } from "react-native";

const styles = StyleSheet.create({

    container: {
        flex: 1
    },
    rowContainer: {
        flexDirection: 'row',
        marginTop: 15,
        marginLeft: 25,
        marginRight: 25,
        alignItems: 'center'
    },
    iconContainer: {
        flexDirection: 'row',
         alignItems: 'center',
         marginLeft: 30,
         marginBottom: 40
     },
     iconBox: {
        width: 45,
        height: 45,
        borderRadius: 50,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textAction: {
        fontWeight: 'bold',
        fontSize: 17,
        marginLeft: 10
    },
    iconCheck: {
        alignSelf: 'center',
        marginTop: 50      
    },
    textTripFinished: {
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 25,
        marginBottom: 50    
    },
    textDescription: {
        marginLeft: 10
    },
    bold: {
        fontWeight: 'bold',
    },
    textFare: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 50
    },
    textFareValue: {
        alignSelf: 'center',
        color: 'green',
        fontSize: 25,
        fontWeight: 'bold'
    },
    textRating: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 20
    },
    starRating: {
        alignSelf: 'center',
        marginTop: 5
    }

});

export default styles;