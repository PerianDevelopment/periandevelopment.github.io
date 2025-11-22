// loadFeatured.js
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('projects/projects.json');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: File not found. Check the path.`);
    }

    const data = await response.json();
    const projects = data.projects;

    // Create featured slots array (0-6)
    const featuredSlots = new Array(7).fill(null);
    projects.forEach(project => {
      if (project.featured >= 0 && project.featured <= 6) {
        featuredSlots[project.featured] = project;
      }
    });

    // Get card elements
    const topCards = document.querySelectorAll('.cards-top .card-top');
    const bottomCards = document.querySelectorAll('.cards-bottom .card-bottom');

    // Update top row (slots 0-2)
    topCards.forEach((card, index) => {
      const project = featuredSlots[index];
      if (!project) return; // Leave placeholder blank

      card.href = `projects/${project.folder}`;
      card.querySelector('.card-top__image').style.backgroundImage = `url('projects/${project.folder}/cover.png')`;
      card.querySelector('.card-top__text h3').textContent = project.title;
      card.querySelector('.card-top__text p').textContent = project.description;
    });

    // Update bottom row (slots 3-6)
    bottomCards.forEach((card, index) => {
      const project = featuredSlots[index + 3];
      if (!project) return; // Leave placeholder blank

      card.href = `projects/${project.folder}`;
      card.querySelector('.card-bottom__image').style.backgroundImage = `url('projects/${project.folder}/cover.png')`;
      card.querySelector('.card-bottom__title').textContent = project.title;
    });

  } catch (error) {
    console.error('loadFeatured.js Error:', error.message);
  }
});
