/**
 * @format
 */
import {Buffer} from 'buffer';
import 'react-native-get-random-values'

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

window.Buffer = Buffer;

AppRegistry.registerComponent(appName, () => App);
