export const trackInteraction = (genres) => {
  if (!genres || !genres.length) return;

  const userProfile = JSON.parse(localStorage.getItem('user_preferences')) || {};

  genres.forEach(genreId => {
    userProfile[genreId] = (userProfile[genreId] || 0) + 1;
  });

  localStorage.setItem('user_preferences', JSON.stringify(userProfile));
};

export const getPersonalizedGenres = (allGenres) => {
  const userProfile = JSON.parse(localStorage.getItem('user_preferences')) || {};

  return [...allGenres].sort((a, b) => {
    const scoreA = userProfile[a.id] || 0;
    const scoreB = userProfile[b.id] || 0;
    
    const randomFactor = Math.random() - 0.5; 
    
    return (scoreB - scoreA) + randomFactor;
  });
};