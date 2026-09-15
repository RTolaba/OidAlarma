// AsyncStorage es una libreria nativa: en Node no existe. Este mock la
// reemplaza por una version en memoria para poder testear los stores.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
