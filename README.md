# Oid Alarma

App de reloj para Android: alarmas (también con el celular bloqueado), tareas, timer, cronómetro y pomodoro.

| | Valor |
| --- | --- |
| Nombre visible | **Oid Alarma** |
| Id interno | `OidAlarma` |
| Package Android | `com.oidalarma.app` |
| Slug / scheme | `oidalarma` |

Hecha con **Expo SDK 57** y un development client nativo. No uses Expo Go para las alarmas en segundo plano.

## Correrla

Celular USB, depuración USB (en Xiaomi también **Instalar vía USB**). Desde la raíz del repo:

```powershell
npm run android
```

Ese script setea `JAVA_HOME` y `ANDROID_HOME`. Si la app ya está instalada y solo tocaste JS/TS:

```powershell
npx expo start --dev-client
```

Abrí **Oid Alarma** en el celu, no Expo Go. La primera instalación con este package es una app nueva: la anterior `clock-ai` puede quedar al lado; desinstalala si no la querés.

## Qué hay adentro

| Tab | Contenido |
| --- | --- |
| Alarmas | Reloj, lista, alarma inteligente (mates), overlay a pantalla completa |
| Tareas | Lista y detalle |
| Funciones | Timer y cronómetro |
| Avanzado | Triggers y pomodoro |

Las alarmas en Android usan `AlarmManager` + full-screen intent (`modules/alarm-lock-screen`). La primera vez el sistema puede pedir **mostrar cuando el dispositivo esté bloqueado**.
