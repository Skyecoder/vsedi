#!/usr/bin/env node
/**
 * Prepares a sector package for the hidden VSEDI "BETA" install channel.
 *
 * Encrypts a .zip with AES-256-GCM under a password, in the exact binary
 * layout that src/main/installHandler.ts (decryptBetaPackage) expects when
 * it decrypts it on the user's machine:
 *
 *   [16-byte salt][12-byte IV][16-byte GCM auth tag][ciphertext]
 *
 * The password itself is never written into the output file or into the
 * app's source — only someone who has it (shared out of band, e.g. Discord)
 * can decrypt. To rotate the password for a new AIRAC cycle, just re-run
 * this script with a new password and re-upload the asset; no app changes
 * needed.
 *
 * Usage:
 *   node scripts/encrypt-beta-package.js <input.zip> <output.zip.enc> <password>
 *
 * Then upload <output.zip.enc> as an extra asset named exactly
 * "beta_install.zip.enc" on the SAME "vsedi" release that already has
 * data_install.zip / data_update.zip — no separate tag/release needed. The
 * app fetches that one release either way and just looks for a different
 * asset name depending on the channel. (The BETA channel is always a full
 * install, no separate "update" variant.)
 */
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const [, , inputPath, outputPath, password] = process.argv;

if (!inputPath || !outputPath || !password) {
  console.error(
    'Uso: node scripts/encrypt-beta-package.js <input.zip> <output.zip.enc> <password>',
  );
  process.exit(1);
}

if (!fs.existsSync(inputPath)) {
  console.error(`No se encuentra el archivo de entrada: ${inputPath}`);
  process.exit(1);
}

const salt = crypto.randomBytes(16);
const iv = crypto.randomBytes(12);
const key = crypto.scryptSync(password, salt, 32);

const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
const plaintext = fs.readFileSync(inputPath);
const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
const authTag = cipher.getAuthTag();

const out = Buffer.concat([salt, iv, authTag, ciphertext]);
fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
fs.writeFileSync(outputPath, out);

console.log(`✔ Escrito ${outputPath} (${out.length} bytes).`);
console.log('');
console.log('Siguiente paso:');
console.log(
  '  1. Sube este archivo como asset del release "vsedi" existente (el mismo que ya',
);
console.log(
  '     tiene data_install.zip / data_update.zip), con el nombre exacto "beta_install.zip.enc".',
);
console.log(
  '  2. Comparte la contraseña con los testers por un canal aparte (Discord, etc.), nunca en el repo.',
);
