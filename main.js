document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  // Form validation
  const validateForm = () => {
    let isValid = true;
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Reset error messages
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    
    // Validate name
    if (name.length < 2) {
      document.getElementById('nameError').textContent = 'Name must be at least 2 characters long';
      isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      document.getElementById('emailError').textContent = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Validate subject
    if (subject.length < 5) {
      document.getElementById('subjectError').textContent = 'Subject must be at least 5 characters long';
      isValid = false;
    }
    
    // Validate message
    if (message.length < 10) {
      document.getElementById('messageError').textContent = 'Message must be at least 10 characters long';
      isValid = false;
    }
    
    return isValid;
  };

  // Form submission
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      subject: document.getElementById('subject').value.trim(),
      message: document.getElementById('message').value.trim(),
      date: new Date().toISOString()
    };
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    try {
      // Show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      
      const response = await fetch('/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Show success message
        const messageDiv = document.getElementById('formMessage');
        messageDiv.textContent = 'Message sent successfully! I\'ll get back to you soon.';
        messageDiv.className = 'form-message success';
        
        // Reset form
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          messageDiv.className = 'form-message';
        }, 5000);
      } else {
        throw new Error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error:', error);
      const messageDiv = document.getElementById('formMessage');
      messageDiv.textContent = error.message || 'An error occurred. Please try again later.';
      messageDiv.className = 'form-message error';
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
  
  // Real-time validation
  const validateOnInput = (inputId, validateFn) => {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    input.addEventListener('input', () => {
      const errorElement = document.getElementById(`${inputId}Error`);
      if (validateFn(input.value.trim())) {
        errorElement.textContent = '';
      } else {
        // Only show error if the field has been interacted with
        if (input.value.trim() !== '') {
          if (inputId === 'email') {
            errorElement.textContent = 'Please enter a valid email address';
          } else if (inputId === 'name' && input.value.trim().length > 0) {
            errorElement.textContent = 'Name must be at least 2 characters long';
          } else if (inputId === 'subject' && input.value.trim().length > 0) {
            errorElement.textContent = 'Subject must be at least 5 characters long';
          } else if (inputId === 'message' && input.value.trim().length > 0) {
            errorElement.textContent = 'Message must be at least 10 characters long';
          }
        }
      }
    });
  };
  
  // Set up validation for each field
  validateOnInput('name', value => value.length >= 2);
  validateOnInput('email', value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
  validateOnInput('subject', value => value.length >= 5);
  validateOnInput('message', value => value.length >= 10);
});
