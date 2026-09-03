/* ==========================================
   PORTFOLIO JAVASCRIPT
   ========================================== */

// ========== Typing Animation ==========
function initTypingAnimation() {
  const typingText = document.getElementById('typingText');
  const cursor = document.getElementById('cursor');
  
  const phrases = [
    'Senior UI/UX Designer',
    'Digital Product Designer',
    'Design Systems Specialist',
    'Creative Problem Solver'
  ];
  
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;
  const deleteSpeed = 50;
  const pauseTime = 2000;
  
  function type() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }
    
    typingText.textContent = currentPhrase.substring(0, charIndex);
    
    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typeSpeed = pauseTime;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 100;
    } else {
      typeSpeed = isDeleting ? deleteSpeed : 100;
    }
    
    setTimeout(type, typeSpeed);
  }
  
  type();
}

// ========== Mobile Menu Toggle ==========
function initMobileMenu() {
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');
  
  if (!mobileMenuToggle) return;
  
  mobileMenuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
  });
  
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
    });
  });
}

// ========== Scroll Animations ==========
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  const animateElements = document.querySelectorAll(
    '.case-study-card, .testimonial-card, .skill-category'
  );
  
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
  });
}

// ========== Smooth Scroll for Navigation ==========
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#' || href === '') {
        return;
      }
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ========== Navbar Background on Scroll ==========
function initNavbarScroll() {
  const header = document.querySelector('.header');
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 50) {
      header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
      header.style.backgroundColor = 'rgba(15, 23, 42, 0.98)';
    } else {
      header.style.boxShadow = 'none';
      header.style.backgroundColor = 'rgba(15, 23, 42, 0.95)';
    }
    
    lastScrollTop = scrollTop;
  });
}

// ========== Counter Animation ==========
function initCounterAnimation() {
  const counters = document.querySelectorAll('.impact-metric');
  const speed = 200;
  
  const observerOptions = {
    threshold: 0.5
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        const counter = entry.target;
        counter.dataset.counted = 'true';
        animateCounter(counter);
      }
    });
  }, observerOptions);
  
  counters.forEach(counter => {
    observer.observe(counter);
  });
  
  function animateCounter(counter) {
    const text = counter.textContent;
    const isPercentage = text.includes('%');
    const isTime = text.includes('s');
    const isRating = text.includes('★');
    
    if (isPercentage || isTime) {
      const num = parseInt(text);
      const increment = num / speed;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= num) {
          counter.textContent = text;
          clearInterval(timer);
        } else {
          counter.textContent = `+${Math.floor(current)}${isPercentage ? '%' : 's'}`;
        }
      }, 10);
    }
  }
}

// ========== Form Validation (if contact form exists) ==========
function initFormValidation() {
  const contactForm = document.querySelector('form[name="contact"]');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const isValid = validateForm(formData);
      
      if (isValid) {
        submitForm(formData);
      }
    });
  }
}

function validateForm(formData) {
  const email = formData.get('email');
  const message = formData.get('message');
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    showNotification('Please enter a valid email address', 'error');
    return false;
  }
  
  if (message.trim().length < 10) {
    showNotification('Message must be at least 10 characters long', 'error');
    return false;
  }
  
  return true;
}

function submitForm(formData) {
  // This would be replaced with actual form submission logic
  showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
}

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background-color: ${type === 'success' ? '#10B981' : '#EF4444'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ========== Parallax Effect ==========
function initParallax() {
  const parallaxElements = document.querySelectorAll('.hero::before');
  
  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        element.style.transform = `translateY(${scrollY * 0.5}px)`;
      });
    });
  }
}

// ========== Highlight Active Navigation ==========
function initActiveNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  
  const observerOptions = {
    threshold: 0.3
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);
  
  sections.forEach(section => observer.observe(section));
}

// ========== Performance Optimization - Lazy Loading ==========
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }
}

// ========== Initialize All Functions ==========
document.addEventListener('DOMContentLoaded', () => {
  initTypingAnimation();
  initMobileMenu();
  initScrollAnimations();
  initSmoothScroll();
  initNavbarScroll();
  initCounterAnimation();
  initFormValidation();
  initParallax();
  initActiveNavigation();
  initLazyLoading();
  
  // Log initialization complete
  console.log('Portfolio initialized successfully');
});

// ========== Add CSS for Animations ==========
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .nav-links a.active {
    color: #4F46E5;
  }
  
  .notification {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
`;
document.head.appendChild(style);
