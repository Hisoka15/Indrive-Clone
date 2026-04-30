import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    itemContainer: {
        height: 220,
        // width: '100%',
        backgroundColor: 'white',
        elevation: 2,
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        padding: 15,
        borderRadius: 15
    },
    mainInfoContainer: {
        flexDirection: 'row'
    },
    mainTextContainer: {
        width: '85%',
    },
    textMainInfo: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    imageClient: {
        width: 50,
        height: 50,
        borderRadius: 50
    },
    textDataTrip: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 16,
        marginTop: 10
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
    },
    modalContent: {
        height: '27%',
        backgroundColor: 'white',
        borderRadius: 20,
        marginLeft: 20,
        marginRight: 20
    },
    viewDecoration: {
        backgroundColor: 'black',
        width: '100%',
        height: 50,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        justifyContent: 'center',
        paddingLeft: 20
    },
    textDecoration: {
        color: 'white',
        fontSize: 18
    },
});

export default styles;