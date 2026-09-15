const { withAndroidManifest, withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

/** Deben coincidir con `fileName` en src/modules/alarms/utils/ringtones.ts. */
const RINGTONES = ['ring_rock.mp3', 'hip_hop_news.mp3'];

/**
 * El ring vive en AlarmRingActivity, que ya declara showWhenLocked en el
 * manifiesto del modulo. MainActivity vuelve a ser una activity normal: no
 * queremos que toda la app se dibuje sobre el bloqueo.
 */
function withRingManifest(config) {
  return withAndroidManifest(config, (mod) => {
    const application = mod.modResults.manifest.application?.[0];
    const main = (application?.activity ?? []).find(
      (activity) => activity.$?.['android:name'] === '.MainActivity',
    );

    if (main?.$) {
      delete main.$['android:showWhenLocked'];
      delete main.$['android:turnScreenOn'];
      delete main.$['android:showForAllUsers'];
    }

    return mod;
  });
}

/**
 * Kotlin necesita los tonos como recurso `res/raw` para poder sonar sin JS.
 * En vez de duplicar los mp3 en el repo, se copian desde assets/ en el
 * prebuild: la carpeta android/ es generada y no se versiona.
 */
function withRingtoneResources(config) {
  return withDangerousMod(config, [
    'android',
    (mod) => {
      const source = path.join(mod.modRequest.projectRoot, 'assets', 'ringtones');
      const target = path.join(mod.modRequest.platformProjectRoot, 'app', 'src', 'main', 'res', 'raw');

      fs.mkdirSync(target, { recursive: true });
      RINGTONES.forEach((fileName) => {
        fs.copyFileSync(path.join(source, fileName), path.join(target, fileName));
      });

      return mod;
    },
  ]);
}

module.exports = (config) => withRingtoneResources(withRingManifest(config));
