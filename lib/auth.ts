// Utility to convert ArrayBuffer to Base64
export const bufferToBase64 = (buffer: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
};

// Utility to convert Base64 to ArrayBuffer
export const base64ToBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// Hashes a PIN using SHA-256
export const hashPin = async (pin: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return bufferToBase64(hashBuffer);
};

// Check if WebAuthn is supported for biometrics
export const isBiometricSupported = async (): Promise<boolean> => {
    return (
        window.PublicKeyCredential &&
        PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable &&
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    );
};

// Register a new biometric credential
export const registerBiometric = async (): Promise<{ id: string; rawId: string; } | null> => {
  try {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const credential = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: 'UKURAGA', id: window.location.hostname },
        user: {
          id: new Uint8Array(16),
          name: 'user@ukuraga',
          displayName: 'Pengguna UKURAGA',
        },
        pubKeyCredParams: [{ type: 'public-key', alg: -7 }], // ES256
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
        },
        timeout: 60000,
      },
    });

    if (credential && 'rawId' in credential) {
        return {
            id: bufferToBase64((credential as any).id),
            rawId: bufferToBase64((credential as any).rawId)
        };
    }
    return null;
  } catch (err) {
    console.error('Biometric registration failed:', err);
    return null;
  }
};

// Verify an existing biometric credential
export const verifyBiometric = async (credentialId: string): Promise<boolean> => {
  try {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const credential = await navigator.credentials.get({
      publicKey: {
        challenge,
        allowCredentials: [{
          type: 'public-key',
          id: base64ToBuffer(credentialId),
        }],
        userVerification: 'required',
        timeout: 60000,
      },
    });

    return !!credential;
  } catch (err) {
    console.error('Biometric verification failed:', err);
    return false;
  }
};