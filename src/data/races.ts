import type { Race } from '@/types'

// SRD 5.1 races. Subraces are simplified into the base entry where the SRD
// only documents one canonical variant (documented in README).
export const RACES: Race[] = [
  {
    id: 'human',
    name: 'Человек',
    blurb: 'Гибкие и амбициозные. +1 ко всем характеристикам — ровный фундамент под любой билд.',
    abilityBonuses: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
    speed: 30,
    size: 'Medium',
    darkvision: 0,
    traits: [
      {
        name: 'Универсальность',
        description: 'Бонус +1 ко всем шести характеристикам. Подходит абсолютно любому классу.',
      },
    ],
    languages: ['Общий', '+1 язык на выбор'],
  },
  {
    id: 'elf',
    name: 'Эльф (Высший)',
    blurb: 'Грациозные и зоркие. Тёмное зрение, транс вместо сна и фокстрот с заговором волшебника.',
    abilityBonuses: { dex: 2, int: 1 },
    speed: 30,
    size: 'Medium',
    darkvision: 60,
    traits: [
      { name: 'Тёмное зрение', description: 'Видите в темноте на 60 футов как при тусклом свете.' },
      {
        name: 'Обострённые чувства',
        description: 'Владение навыком Внимательность.',
      },
      {
        name: 'Наследие фей',
        description: 'Преимущество на спасброски против очарования; вас нельзя усыпить магией.',
      },
      { name: 'Транс', description: 'Не спите: 4 часа медитации заменяют 8 часов сна.' },
      {
        name: 'Заговор Высшего эльфа',
        description: 'Знаете один заговор из списка волшебника (Интеллект — заклинательная характеристика).',
      },
    ],
    languages: ['Общий', 'Эльфийский'],
    grantsSkills: ['perception'],
  },
  {
    id: 'dwarf',
    name: 'Дварф (Горный)',
    blurb: 'Крепкие и стойкие. Сопротивление яду, владение оружием и +2 ОЗ-выносливость на старте.',
    abilityBonuses: { con: 2, str: 2 },
    speed: 25,
    size: 'Medium',
    darkvision: 60,
    traits: [
      { name: 'Тёмное зрение', description: 'Видите в темноте на 60 футов.' },
      {
        name: 'Дварфская стойкость',
        description: 'Преимущество на спасброски против яда и сопротивление урону ядом.',
      },
      {
        name: 'Дварфская боевая подготовка',
        description: 'Владение боевым топором, ручным топором, лёгким и боевым молотом.',
      },
      {
        name: 'Дварфская броневая подготовка',
        description: 'Владение лёгкими и средними доспехами (Горный дварф).',
      },
      { name: 'Скорость без штрафа', description: 'Скорость 25 футов и не снижается тяжёлой бронёй.' },
    ],
    languages: ['Общий', 'Дварфский'],
    resistances: ['Урон ядом'],
  },
  {
    id: 'halfling',
    name: 'Полурослик (Ловкий)',
    blurb: 'Маленькие, удачливые и шустрые. Идеальны для скрытных ловкачей и лучников.',
    abilityBonuses: { dex: 2, cha: 1 },
    speed: 25,
    size: 'Small',
    darkvision: 0,
    traits: [
      { name: 'Везучий', description: 'Перебрасываете выпавшую «1» на d20 атак, проверок и спасбросков.' },
      { name: 'Храбрость', description: 'Преимущество на спасброски против испуга.' },
      {
        name: 'Проворство полурослика',
        description: 'Можете проходить сквозь пространство существ крупнее вас.',
      },
      {
        name: 'Природная скрытность',
        description: 'Можете прятаться за существами как минимум на размер крупнее (Ловкий полурослик).',
      },
    ],
    languages: ['Общий', 'Полуросликов'],
  },
  {
    id: 'tiefling',
    name: 'Тифлинг',
    blurb: 'Потомки инфернального пакта. Сопротивление огню и врождённая магия — отличный харизматичный кастер.',
    abilityBonuses: { cha: 2, int: 1 },
    speed: 30,
    size: 'Medium',
    darkvision: 60,
    traits: [
      { name: 'Тёмное зрение', description: 'Видите в темноте на 60 футов.' },
      { name: 'Адское сопротивление', description: 'Сопротивление урону огнём.' },
      {
        name: 'Инфернальное наследие',
        description: 'Знаете заговор Чудотворство; с 3 ур. — Адское возмездие, с 5 ур. — Тьма (Харизма).',
      },
    ],
    languages: ['Общий', 'Инфернальный'],
    resistances: ['Урон огнём'],
  },
  {
    id: 'half-elf',
    name: 'Полуэльф',
    blurb: 'Между двух миров: харизма, тёмное зрение и ДВА навыка на выбор — ходячий универсал.',
    abilityBonuses: { cha: 2 },
    flexibleAbilityBonus: { count: 2, amount: 1, exclude: ['cha'] },
    speed: 30,
    size: 'Medium',
    darkvision: 60,
    traits: [
      { name: 'Тёмное зрение', description: 'Видите в темноте на 60 футов.' },
      {
        name: 'Наследие фей',
        description: 'Преимущество на спасброски против очарования; вас нельзя усыпить магией.',
      },
      {
        name: 'Универсальность навыков',
        description: 'Владение двумя навыками на ваш выбор.',
      },
      {
        name: 'Гибкие характеристики',
        description: '+2 к Харизме и +1 к двум другим характеристикам на выбор.',
      },
    ],
    languages: ['Общий', 'Эльфийский', '+1 язык на выбор'],
    // Half-elf chooses any two skills.
    skillChoices: {
      count: 2,
      pool: [
        'acrobatics', 'animalHandling', 'arcana', 'athletics', 'deception',
        'history', 'insight', 'intimidation', 'investigation', 'medicine',
        'nature', 'perception', 'performance', 'persuasion', 'religion',
        'sleightOfHand', 'stealth', 'survival',
      ],
    },
  },
]

export const RACE_BY_ID: Record<string, Race> = RACES.reduce(
  (acc, r) => {
    acc[r.id] = r
    return acc
  },
  {} as Record<string, Race>,
)
