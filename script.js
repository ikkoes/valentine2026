// Updated JavaScript with paragraph display functionality (without celebration message)
document.addEventListener('DOMContentLoaded', () => {
  const yesBtn = document.querySelector('.yes');
  const noBtn = document.querySelector('.no');
  const container = document.querySelector('.button-container');
  const paragraphElement = document.querySelector('p'); // Select the paragraph

  if (!yesBtn || !noBtn || !container || !paragraphElement) {
    console.error('Required elements not found!');
    return;
  }

  let scale = 1;
  let hasEscaped = false;
  let storedPosition = null;

  // Function to calculate safe position
  function getSafePosition() {
    document.body.offsetHeight; // Force reflow
    
    const computedStyle = window.getComputedStyle(noBtn);
    const buttonWidth = parseFloat(computedStyle.width) || noBtn.offsetWidth;
    const buttonHeight = parseFloat(computedStyle.height) || noBtn.offsetHeight;
    
    // Calculate maximum allowed coordinates
    const maxX = window.innerWidth - buttonWidth - 10;
    const maxY = window.innerHeight - buttonHeight - 10;
    
    // Ensure positive values and within bounds
    const newX = Math.max(10, Math.min(maxX, 10 + Math.random() * maxX));
    const newY = Math.max(10, Math.min(maxY, 10 + Math.random() * maxY));
    
    return { x: newX, y: newY };
  }

  // Handle "No" button click
  noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. GROW THE "YES" BUTTON
    scale += 0.25;
    yesBtn.style.transform = `scale(${scale})`;
    
    // Dynamic font size adjustment
    const fontSize = Math.min(40, 22 + scale * 8);
    yesBtn.style.fontSize = `${fontSize}px`;
    
    // Adjust max-width for text wrapping as button grows
    yesBtn.style.maxWidth = `${Math.min(300, 200 + scale * 30)}px`;

    // 2. GROW CONTAINER TO AVOID LAYOUT JUMPS
    container.style.minHeight = `${Math.max(220, 140 + scale * 100)}px`;

    // 3. UPDATE "YES" TEXT FOR FUN
    if (scale > 1.5 && yesBtn.textContent === "Yes") yesBtn.textContent = "Are you sure??";
    if (scale > 2.5) yesBtn.textContent = "PLEASE";
    if (scale > 3.5) yesBtn.textContent = "THINK ABOUT IT";

    // 4. MAKE "NO" ESCAPE TO RANDOM SCREEN POSITION
    if (!hasEscaped) {
      // Add escape mode class first
      noBtn.classList.add('escape-mode');
      hasEscaped = true;
    }

    // Calculate and store new position
    const { x, y } = getSafePosition();
    storedPosition = { x, y };
    
    // Force immediate position update
    noBtn.style.setProperty('left', `${x}px`, 'important');
    noBtn.style.setProperty('top', `${y}px`, 'important');
    noBtn.style.setProperty('transform', 'none', 'important');

    // Maintain animations
    noBtn.style.animation = 'none';
    requestAnimationFrame(() => {
      noBtn.style.animation = 'pulse 1.8s infinite, shake 0.5s';
    });
  });

  // Handle "Yes" button click
  yesBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Show the paragraph content
    paragraphElement.style.display = 'block';
    paragraphElement.style.opacity = '0';
    paragraphElement.style.transition = 'opacity 1s ease-in-out';
    
    // Fade in the paragraph
    setTimeout(() => {
      paragraphElement.style.opacity = '1';
    }, 10);

    // Add a highlight effect
    paragraphElement.style.animation = 'highlight 2s ease-in-out';

    // Celebration effect
    yesBtn.textContent = "YAYYYY!";
    yesBtn.style.transform = 'scale(1.5)';
    yesBtn.style.backgroundColor = '#ff6b6b';
    yesBtn.style.boxShadow = '0 0 30px #ff6b6b, 0 0 60px #ff6b6b';
    
    // Add confetti effect
    createConfetti();
    
    // Disable buttons after yes click
    yesBtn.disabled = true;
    noBtn.disabled = true;
  });

  // Function to create confetti effect
  function createConfetti() {
    const colors = ['#9dc183', '#e74c3c', '#3498db', '#f1c40f', '#9b59b6'];
    const container = document.body;
    
    for (let i = 0; i < 150; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = '50%';
      confetti.style.left = `${Math.random() * 100}vw`;
      confetti.style.top = '-10px';
      confetti.style.zIndex = '9999';
      confetti.style.opacity = '0.8';
      confetti.style.pointerEvents = 'none';
      
      container.appendChild(confetti);
      
      // Animate confetti
      const animation = confetti.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 0.8 },
        { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
      ], {
        duration: Math.random() * 3000 + 2000,
        easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
      });
      
      // Remove confetti after animation
      animation.onfinish = () => confetti.remove();
    }
  }

  // Separate hover handler for No button
  noBtn.addEventListener('mouseover', (e) => {
    if (hasEscaped && Math.random() > 0.7) {
      const { x, y } = getSafePosition();
      storedPosition = { x, y };
      noBtn.style.setProperty('left', `${x}px`, 'important');
      noBtn.style.setProperty('top', `${y}px`, 'important');
    }
  });

  // Handle window resize
  window.addEventListener('resize', () => {
    if (hasEscaped && storedPosition) {
      const { x, y } = getSafePosition();
      storedPosition = { x, y };
      noBtn.style.setProperty('left', `${x}px`, 'important');
      noBtn.style.setProperty('top', `${y}px`, 'important');
    }
  });

  // Scroll handler to maintain fixed position
  window.addEventListener('scroll', () => {
    if (hasEscaped && storedPosition) {
      // Reapply the stored position to maintain fixed placement
      noBtn.style.setProperty('left', `${storedPosition.x}px`, 'important');
      noBtn.style.setProperty('top', `${storedPosition.y}px`, 'important');
    }
  });
});

// Add animation keyframes to CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
    20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
  }
  
  @keyframes highlight {
    0% { background-color: transparent; }
    50% { background-color: rgba(157, 193, 131, 0.3); }
    100% { background-color: transparent; }
  }
`;
document.head.appendChild(style);