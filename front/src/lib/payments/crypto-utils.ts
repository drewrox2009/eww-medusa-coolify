/**
 * Cryptographic utilities for payment webhook verification
 */

import crypto from 'crypto';

/**
 * Verify HMAC SHA256 signature
 */
export function verifyHmacSha256(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');
    
    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('HMAC verification error:', error);
    return false;
  }
}

/**
 * Verify HMAC SHA256 signature with base64 encoding
 */
export function verifyHmacSha256Base64(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(payload);
    const expectedSignature = hmac.digest('base64');
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error('HMAC verification error:', error);
    return false;
  }
}

/**
 * Verify BTCPay Server webhook signature
 * BTCPay uses HMAC-SHA256 with the webhook secret
 */
export function verifyBTCPaySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  // BTCPay signature format: "sha256=<signature>"
  const signatureParts = signature.split('=');
  if (signatureParts.length !== 2 || signatureParts[0] !== 'sha256') {
    console.error('Invalid BTCPay signature format');
    return false;
  }
  
  return verifyHmacSha256(payload, signatureParts[1], secret);
}

/**
 * Verify Shkeeper webhook signature
 * Shkeeper uses HMAC-SHA256
 */
export function verifyShkeeperSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  return verifyHmacSha256(payload, signature, secret);
}

/**
 * Generate a secure random string for testing
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash a string using SHA256
 */
export function sha256Hash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}