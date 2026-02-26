export const CATEGORIES = [
  { id: 'energy', label: 'Energy', color: 'var(--color-energy)', textClass: 'text-energy', bgClass: 'bg-energy' },
  { id: 'work', label: 'Work', color: 'var(--color-work)', textClass: 'text-work', bgClass: 'bg-work' },
  { id: 'love', label: 'Love', color: 'var(--color-love)', textClass: 'text-love', bgClass: 'bg-love' },
]

export const MAX_HABITS_PER_CATEGORY = 5

export const STOIC_QUOTES = [
  { text: "We suffer more often in imagination than in reality.", author: "Seneca" },
  { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
  { text: "No man is free who is not master of himself.", author: "Epictetus" },
  { text: "First say to yourself what you would be; and then do what you have to do.", author: "Epictetus" },
  { text: "He who has a why to live can bear almost any how.", author: "Nietzsche" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
  { text: "You have power over your mind — not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "It is not that we have a short time to live, but that we waste a great deal of it.", author: "Seneca" },
  { text: "Man conquers the world by conquering himself.", author: "Zeno of Citium" },
  { text: "The best revenge is not to be like your enemy.", author: "Marcus Aurelius" },
]

export const HABIT_PRESETS = {
  beginner: {
    label: 'Beginning',
    subtitle: 'I am starting to build my habits',
    description: 'Simple foundations. The journey of a thousand miles begins with a single step.',
    energy: [
      'Sleep 7+ hours',
      'Drink water upon waking',
      'Take a 10-minute walk',
    ],
    work: [
      'Write a daily to-do list',
      'Read for 15 minutes',
      'Avoid phone for first 30 min',
    ],
    love: [
      'Send a kind message to someone',
      'Practice gratitude (name 3 things)',
      'Listen fully in one conversation',
    ],
  },
  intermediate: {
    label: 'Intermediate',
    subtitle: 'I have some discipline already',
    description: 'Strengthen the foundation. What we do repeatedly becomes who we are.',
    energy: [
      'Exercise for 30 minutes',
      'Cold shower or cold exposure',
      'No processed food today',
    ],
    work: [
      'Deep work block (1 hour min)',
      'Journal reflections for 10 min',
      'Learn something new today',
    ],
    love: [
      'Perform one act of service',
      'Spend quality time without screens',
      'Forgive one thing (big or small)',
    ],
  },
  advanced: {
    label: 'Advanced',
    subtitle: 'I am ready to master myself',
    description: 'The forge burns hottest. He who conquers himself is the mightiest warrior.',
    energy: [
      'Train intensely (45+ min)',
      'Practice breathwork or meditation',
      'Fast for 16 hours',
    ],
    work: [
      'Deep work block (2+ hours)',
      'Write 500+ words (journal/project)',
      'Eliminate one bad habit today',
    ],
    love: [
      'Have a vulnerable conversation',
      'Mentor or teach someone',
      'Practice radical empathy with a stranger',
    ],
  },
}

export const COMPLETION_MESSAGES = [
  "One step closer to who you're meant to be.",
  "The fire grows stronger with every action.",
  "Small wins forge great discipline.",
  "You chose progress over comfort. Respect.",
  "Another brick laid on the path to mastery.",
  "Discipline is choosing what you want most over what you want now.",
  "The obstacle has become the way.",
  "Victory belongs to the persistent.",
  "You didn't feel like it. You did it anyway. That's power.",
  "A warrior is forged in the battles they choose to fight daily.",
  "This is what separates the many from the few.",
  "Your future self just thanked you.",
  "Consistency is the language of champions.",
  "One more rep for the soul.",
  "The chains of habit are too light to be felt until they are too heavy to be broken.",
]
