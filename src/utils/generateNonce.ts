const generateNonce = async () => {
  const crypto = await import('crypto');
  const nonce = crypto.randomBytes(24).toString('hex');
  return nonce;
};

export { generateNonce };
