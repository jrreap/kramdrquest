import { StyleSheet, Dimensions } from 'react-native'
import Constants from 'expo-constants'

enum worldStats {
  
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight
  },
  popupcontainer: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5
  },
  popupinnercontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: Dimensions.get('window').width - 40,
    borderRadius: 10,
    backgroundColor: '#c4c4c4'
  },
  cardcontainer: {
    flex: 1,
    padding: 10
  },
  combatcontainer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  combatinnercontainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  panel: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative'
  },
  panelHeader: {
    height: 50,
    backgroundColor: '#b197fc',
    alignItems: 'center',
    justifyContent: 'center'
  },
  innercontainer: {
    flex: 10,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    alignItems: 'center'
  },
  carddeck: {
  },
  card: {
    width: 120,
    height: 170,
    backgroundColor: '#c1c1c1',
    borderRadius: 10,
    justifyContent: 'center',
    textAlign: 'center'
  },
  spacer: {
    width: 15
  },
  toolbar: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#c4c4c4',
    borderColor: 'black',
    flexDirection: 'row'
  },
  toolbarbutton: {
    justifyContent: 'center',
    padding: 10
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center'
  },
  header: {
    margin: 24,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  counter: {
    fontSize: 30
  },
  button: {
    width: 120,
    height: 45,
    backgroundColor: '#4286f4',
    padding: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center'
  }
})