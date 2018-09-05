import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { OpenMapDirections } from '../Components/OpenDirections/';

//import RetroMapStyles from './RetroMapStyles.json';
import icon from '../../assets/icon2.png'
import coordenadas from '../../assets/coordenadas';

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class MapScreen  extends Component {
  constructor() {
    super();
    this.state = {
      local: {
        latitude: -21.7631857,
        longitude: -43.3479309,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },

      coordinates: coordenadas.coordenadas,
      destino: null,
      region: null,
    };
    this.mapView = null;
  }



  componentDidMount() {

    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
        });
      },
      (error) => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
    this.watchID = navigator.geolocation.watchPosition(
      position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
        });
      }
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }


  show() {
    this.myLocation.showCallout();
  }

  hide() {
    this.myLocation.hideCallout();
  }

  _callShowDirections = (coordenada) => {
   // console.log(coordenada)
    const startPoint = {
      longitude: this.state.region.longitude,
      latitude: this.state.region.latitude
    }

    const endPoint = {
      longitude: this.state.destino.longitude,
      latitude: this.state.destino.latitude
    }

    const transportPlan = 'd';

    OpenMapDirections(startPoint, endPoint, transportPlan).then(res => {
      console.log(res)
    });
  }

  render() {
    const { destino, region } = this.state;
    return (
      <View>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.container}
          //customMapStyle={RetroMapStyles}
          //showsUserLocation={true}
          loadingEnabled={true}
          initialRegion={this.state.local}
          ref={c => this.mapView = c}
        >
          {
            this.state.region != null
              &&
              <MapView.Marker
                ref={ref => { this.myLocation = ref; }}
                key={'local'}
                coordinate={this.state.region}
                pinColor={'#01C89E'}
                title="Localização"
                description="Você está aqui!"
              />
          }
          {coordenadas.coordenadas.map((coordenada, index) =>
            <MapView.Marker
              key={`coordinate_${index}`}
              identifier={index.toString()}
              coordinate={coordenada}
              image={icon}            
              onPress={() => {
                this.setState({ destino: coordenada }),
                  Alert.alert('Navegação', "Deseja ativar a rota até a vaga?",
                    [{ text: 'Ir para Vaga', onPress: () => this._callShowDirections(coordenada) },
                    { text: 'Cancelar', style: 'cancel', onPress: () => false }, { cancelable: true }]);
              }}
              title="Vaga"
            //description="!"
            />
          )}

          {
            destino
              && <MapView.Marker
                key={destino}
                coordinate={destino}
                image={icon} />              
          }


        </MapView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
});
