# Oid Mortales

App de reloj para Android: alarmas (también con el celular bloqueado), tareas, timer, cronómetro y pomodoro.

Hecha con **Expo SDK 57** y un development client nativo (`expo-dev-client`). No uses Expo Go para las alarmas en segundo plano.

## Correrla

Celular USB, depuración USB (en Xiaomi también **Instalar vía USB**). En PowerShell, desde la raíz del repo:

```powershell
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:PATH = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:PATH"
$env:JAVA_TOOL_OPTIONS = "--enable-native-access=ALL-UNNAMED"
```

Primera vez o si cambiaste código nativo (`modules/`, plugins, `app.json`):

```powershell
npx expo run:android
```

Si la app ya está instalada y solo tocaste JS/TS:

```powershell
npx expo start --dev-client
```

Abrí **Oid Mortales** en el celu, no Expo Go.

## Qué hay adentro

| Tab | Contenido |
| --- | --- |
| Alarmas | Reloj, lista, alarma inteligente (mates), overlay a pantalla completa |
| Tareas | Lista y detalle |
| Funciones | Timer y cronómetro |
| Avanzado | Triggers y pomodoro |

Las alarmas en Android usan `AlarmManager` + full-screen intent (`modules/alarm-lock-screen`). La primera vez el sistema puede pedir **mostrar cuando el dispositivo esté bloqueado**.

