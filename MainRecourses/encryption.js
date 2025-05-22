// AES Encryption Utilities
const ENCRYPTION_KEY = 'dK8Lp#mN2$vX9&jY4hF7@qW3nZ5tA6*E'; // 32-byte key for AES-256
const IV_LENGTH = 16; // For AES, this is always 16

function encrypt(text) {
    try {
        const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
        const encoder = new TextEncoder();
        const encodedText = encoder.encode(text);
        
        // Import key
        return crypto.subtle.importKey(
            'raw',
            encoder.encode(ENCRYPTION_KEY),
            { name: 'AES-CBC' },
            false,
            ['encrypt']
        ).then(key => {
            // Encrypt
            return crypto.subtle.encrypt(
                {
                    name: 'AES-CBC',
                    iv: iv
                },
                key,
                encodedText
            );
        }).then(encrypted => {
            // Combine IV and encrypted data
            const encryptedArray = new Uint8Array(encrypted);
            const result = new Uint8Array(iv.length + encryptedArray.length);
            result.set(iv);
            result.set(encryptedArray, iv.length);
            
            // Convert to base64
            return btoa(String.fromCharCode(...result));
        });
    } catch (error) {
        console.error('Encryption error:', error);
        return null;
    }
}

function decrypt(encryptedData) {
    try {
        // Convert from base64
        const data = new Uint8Array(atob(encryptedData).split('').map(char => char.charCodeAt(0)));
        
        // Extract IV and encrypted content
        const iv = data.slice(0, IV_LENGTH);
        const content = data.slice(IV_LENGTH);
        
        const encoder = new TextEncoder();
        
        // Import key
        return crypto.subtle.importKey(
            'raw',
            encoder.encode(ENCRYPTION_KEY),
            { name: 'AES-CBC' },
            false,
            ['decrypt']
        ).then(key => {
            // Decrypt
            return crypto.subtle.decrypt(
                {
                    name: 'AES-CBC',
                    iv: iv
                },
                key,
                content
            );
        }).then(decrypted => {
            // Convert to string
            return new TextDecoder().decode(decrypted);
        });
    } catch (error) {
        console.error('Decryption error:', error);
        return null;
    }
}

// Check if encryption is working
async function testEncryption() {
    const testText = 'test123';
    const encrypted = await encrypt(testText);
    const decrypted = await decrypt(encrypted);
    return testText === decrypted;
}
