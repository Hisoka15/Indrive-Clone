import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    toogleContainer: {
        position: 'absolute',
        bottom: 50,
        zIndex: 100,
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 25,
        paddingHorizontal: 30,
        paddingVertical: 10,
        elevation: 2
    },
    containerModal: {
        width: '100%',
        height: '80%',
        position: 'absolute',
        bottom: 0,
        zIndex: 150,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: 'white',

    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
    },
});

export default styles;