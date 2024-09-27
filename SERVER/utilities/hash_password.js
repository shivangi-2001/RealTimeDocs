const CryptoJS = require('crypto-js');

// Function to hash the password using PBKDF2
function hashPassword(password) {
  const salt = CryptoJS.lib.WordArray.random(128 / 8); // Generate a random salt (128 bits)
  const iterations = 10000; // Number of iterations
  const keySize = 512 / 32; // Key size in words (512 bits / 32 bits per word)

  // Hash the password using PBKDF2
  const hash = CryptoJS.PBKDF2(password, salt, {
    keySize: keySize,
    iterations: iterations
  });

  // Convert to string for storage (e.g., hex encoding)
  return {
    salt: salt.toString(),
    hash: hash.toString()
  };
}

// Function to verify the password
function verifyPassword(password, hash, salt) {
  const iterations = 10000;
  const keySize = 512 / 32;

  // Hash the password with the same salt
  const hashToVerify = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), {
    keySize: keySize,
    iterations: iterations
  });

  // Compare the hashes
  return hash === hashToVerify.toString();
}

// Example usage:
const password = 'mySecretPassword';
const { salt, hash } = hashPassword(password);
console.log('Hashed Password:', hash);
console.log('Salt:', salt);

// Verification
const isPasswordCorrect = verifyPassword('mySecretPassword', hash, salt);
console.log('Password is correct:', isPasswordCorrect);
