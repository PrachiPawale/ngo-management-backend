const otpStore = new Map();

function saveOTP(email, otp) {
  otpStore.set(email, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000
  });
}

function verifyOTP(email, otp) {
  const data = otpStore.get(email);

  if (!data) {
    return false;
  }

  if (Date.now() > data.expiresAt) {
    otpStore.delete(email);
    return false;
  }

  if (data.otp !== otp) {
    return false;
  }

  otpStore.delete(email);

  return true;
}

module.exports = {
  saveOTP,
  verifyOTP
};