document.addEventListener('DOMContentLoaded', () => {
    const addFoodBtn = document.getElementById('add-food-btn');
    const modal = document.getElementById('food-form-modal');
    const closeModal = document.getElementById('close-form');
  
    addFoodBtn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.style.display = 'flex';
    });
  
    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });
  