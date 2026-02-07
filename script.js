// Updated JavaScript with forced position updates
document.addEventListener('DOMContentLoaded', () => {
  const yesBtn = document.querySelector('.yes');
  const noBtn = document.querySelector('.no');
  const container = document.querySelector('.button-container');

  if (!yesBtn || !noBtn || !container) {
    console.error('Buttons not found!');
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

  // Separate hover handler
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