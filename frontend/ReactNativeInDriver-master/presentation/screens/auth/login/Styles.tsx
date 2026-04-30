import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    opacity: 0.2
  },
  shadowForm: {
    width: '73%',
    height: '75%',
    position: 'absolute',
    top: '35%',
  },
  form: {
    width: 300,
    height: 430,
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 40,
    paddingHorizontal: 25,
  },
  lottie: {
    width: 210,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20
  },
  topImage: {
    width: '100%',
    height: 280,
    position: 'absolute',
    top: 0,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  textLogin: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 95
  },
  containerDivider: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    alignSelf: 'center',
    bottom: 55
  },
  containerTextDontHaveAccount: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    alignSelf: 'center',
    bottom: 20
  },
  textDontHaveAccount: {
    color: 'white',
    fontSize: 14
  },
  textRegister: {
    color: '#EA4C4C',
    marginLeft: 5,
    fontSize: 14
  },
  divider: {
    height: 1,
    width: '40%',
    backgroundColor: 'white',
    marginHorizontal: 5
  }
});

export default styles;