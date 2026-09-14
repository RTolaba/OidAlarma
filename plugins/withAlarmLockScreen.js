const { withAndroidManifest } = require('expo/config-plugins');

/**
 * La activity principal se muestra sobre la pantalla de bloqueo y enciende
 * la pantalla cuando entra una alarma por full-screen intent.
 */
function withAlarmLockScreen(config) {
  return withAndroidManifest(config, (mod) => {
    const application = mod.modResults.manifest.application?.[0];
    const activities = application?.activity ?? [];
    const main = activities.find(
      (activity) => activity.$?.['android:name'] === '.MainActivity',
    );

    if (main?.$) {
      main.$['android:showWhenLocked'] = 'true';
      main.$['android:turnScreenOn'] = 'true';
    }

    return mod;
  });
}

module.exports = withAlarmLockScreen;
