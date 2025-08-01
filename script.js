function showSection(id) {
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');

  const links = document.querySelectorAll('nav a');
  links.forEach(link => {
    link.classList.remove('active-link');
  });

  const activeLink = Array.from(links).find(link =>
    link.getAttribute('onclick').includes(id)
  );
  if (activeLink) {
    activeLink.classList.add('active-link');
  }
}
