import filter from 'leo-profanity';

const initLeoProfanity = () => {
  filter.loadDictionary('en');
  const englishWords = filter.list();

  filter.loadDictionary('ru');
  filter.add(englishWords);
}

export default initLeoProfanity