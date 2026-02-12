// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 6 characters, 1 uppercase, 1 lowercase, 1 number
  return password.length >= 6 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const validateBugForm = (formData) => {
  const errors = {};

  if (!formData.title?.trim()) {
    errors.title = 'Title is required';
  } else if (formData.title.length < 5) {
    errors.title = 'Title must be at least 5 characters';
  } else if (formData.title.length > 100) {
    errors.title = 'Title must not exceed 100 characters';
  }

  if (!formData.description?.trim()) {
    errors.description = 'Description is required';
  } else if (formData.description.length < 20) {
    errors.description = 'Description must be at least 20 characters';
  }

  if (!formData.bountyAmount || formData.bountyAmount <= 0) {
    errors.bountyAmount = 'Bounty amount must be greater than 0';
  }

  return errors;
};

export const validateSubmissionForm = (formData) => {
  const errors = {};

  if (!formData.description?.trim()) {
    errors.description = 'Description is required';
  } else if (formData.description.length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }

  if (!formData.proofLink || formData.proofLink.trim() === '') {
    errors.proofLink = 'Proof link is required';
  }

  return errors;
};

export const validateUserRegistration = (formData) => {
  const errors = {};

  if (!formData.username?.trim()) {
    errors.username = 'Username is required';
  } else if (formData.username.length < 2) {
    errors.username = 'Username must be at least 2 characters';
  } else if (formData.username.length > 20) {
    errors.username = 'Username must not exceed 20 characters';
  }

  if (!formData.fullName?.trim()) {
    errors.fullName = 'Full name is required';
  } else if (formData.fullName.length < 2) {
    errors.fullName = 'Full name must be at least 2 characters';
  }

  if (!validateEmail(formData.email)) {
    errors.email = 'Valid email is required';
  }

  if (!validatePassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters with uppercase, lowercase, and number';
  }

  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};
