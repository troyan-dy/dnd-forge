import type { Spell } from '@/types'

// A working SRD 5.1 spell subset: cantrips + level-1 spells for the three
// caster classes in this app (wizard / cleric / bard). Simplified descriptions.
export const SPELLS: Spell[] = [
  // ---- Cantrips (level 0) ------------------------------------------------
  {
    id: 'fire-bolt', name: 'Огненный снаряд', level: 0, school: 'Воплощение',
    castingTime: '1 действие', range: '120 фт', duration: 'Мгновенная', concentration: false,
    description: 'Метательный снаряд огня: 1d10 урона огнём. Урон растёт с уровнем.',
    classes: ['wizard'], spellTags: ['damage'],
  },
  {
    id: 'ray-of-frost', name: 'Луч холода', level: 0, school: 'Воплощение',
    castingTime: '1 действие', range: '60 фт', duration: 'Мгновенная', concentration: false,
    description: '1d8 урона холодом и −10 футов к скорости цели до начала вашего следующего хода.',
    classes: ['wizard'], spellTags: ['damage', 'control'],
  },
  {
    id: 'mage-hand', name: 'Волшебная рука', level: 0, school: 'Вызов',
    castingTime: '1 действие', range: '30 фт', duration: '1 минута', concentration: false,
    description: 'Призрачная рука переносит, толкает или использует предметы до 5 кг.',
    classes: ['wizard', 'bard'], spellTags: ['utility'],
  },
  {
    id: 'prestidigitation', name: 'Фокусы', level: 0, school: 'Преобразование',
    castingTime: '1 действие', range: '10 фт', duration: 'до 1 часа', concentration: false,
    description: 'Мелкие магические трюки: искры, запахи, чистка, мгновенные безделушки.',
    classes: ['wizard', 'bard'], spellTags: ['utility'],
  },
  {
    id: 'minor-illusion', name: 'Малая иллюзия', level: 0, school: 'Иллюзия',
    castingTime: '1 действие', range: '30 фт', duration: '1 минута', concentration: false,
    description: 'Создаёте звук или образ предмета для отвлечения или обмана.',
    classes: ['wizard', 'bard'], spellTags: ['control', 'utility'],
  },
  {
    id: 'sacred-flame', name: 'Священное пламя', level: 0, school: 'Воплощение',
    castingTime: '1 действие', range: '60 фт', duration: 'Мгновенная', concentration: false,
    description: '1d8 урона излучением; спасбросок Ловкости, укрытие не помогает.',
    classes: ['cleric'], spellTags: ['damage'],
  },
  {
    id: 'guidance', name: 'Указание', level: 0, school: 'Прорицание',
    castingTime: '1 действие', range: 'Касание', duration: 'Концентрация, 1 мин', concentration: true,
    description: 'Цель добавляет 1d4 к одной проверке характеристики на выбор.',
    classes: ['cleric'], spellTags: ['buff', 'utility'],
  },
  {
    id: 'thaumaturgy', name: 'Чудотворство', level: 0, school: 'Преобразование',
    castingTime: '1 действие', range: '30 фт', duration: 'до 1 минуты', concentration: false,
    description: 'Усиление голоса, дрожь земли, мерцание огня — демонстрация божественной силы.',
    classes: ['cleric'], spellTags: ['utility'],
  },
  {
    id: 'vicious-mockery', name: 'Едкая насмешка', level: 0, school: 'Очарование',
    castingTime: '1 действие', range: '60 фт', duration: 'Мгновенная', concentration: false,
    description: '1d4 психического урона и помеха на следующую атаку цели (спасбросок Мудрости).',
    classes: ['bard'], spellTags: ['damage', 'control'],
  },
  {
    id: 'dancing-lights', name: 'Пляшущие огоньки', level: 0, school: 'Воплощение',
    castingTime: '1 действие', range: '120 фт', duration: 'Концентрация, 1 мин', concentration: true,
    description: 'До четырёх парящих огоньков освещают местность.',
    classes: ['wizard', 'bard'], spellTags: ['utility'],
  },

  // ---- Level 1 spells ----------------------------------------------------
  {
    id: 'magic-missile', name: 'Волшебная стрела', level: 1, school: 'Воплощение',
    castingTime: '1 действие', range: '120 фт', duration: 'Мгновенная', concentration: false,
    description: 'Три дротика по 1d4+1 урона силовым полем — автоматическое попадание.',
    classes: ['wizard'], spellTags: ['damage'],
  },
  {
    id: 'shield', name: 'Щит', level: 1, school: 'Ограждение',
    castingTime: '1 реакция', range: 'На себя', duration: '1 раунд', concentration: false,
    description: 'Реакцией +5 КД до начала след. хода и иммунитет к Волшебной стреле.',
    classes: ['wizard'], spellTags: ['defense'],
  },
  {
    id: 'sleep', name: 'Сон', level: 1, school: 'Очарование',
    castingTime: '1 действие', range: '90 фт', duration: '1 минута', concentration: false,
    description: '5d8 ОЗ существ в области погружаются в магический сон (от слабых к сильным).',
    classes: ['wizard', 'bard'], spellTags: ['control'],
  },
  {
    id: 'mage-armor', name: 'Доспехи мага', level: 1, school: 'Ограждение',
    castingTime: '1 действие', range: 'Касание', duration: '8 часов', concentration: false,
    description: 'КД цели без доспеха становится 13 + мод. Ловкости.',
    classes: ['wizard'], spellTags: ['defense', 'buff'],
  },
  {
    id: 'burning-hands', name: 'Горящие руки', level: 1, school: 'Воплощение',
    castingTime: '1 действие', range: 'Конус 15 фт', duration: 'Мгновенная', concentration: false,
    description: 'Конус огня: 3d6 урона, спасбросок Ловкости вдвое снижает.',
    classes: ['wizard'], spellTags: ['damage'],
  },
  {
    id: 'detect-magic', name: 'Обнаружение магии', level: 1, school: 'Прорицание',
    castingTime: '1 действие', range: 'На себя (30 фт)', duration: 'Концентрация, 10 мин', concentration: true,
    description: 'Чувствуете присутствие и школу магии в радиусе 30 футов.',
    classes: ['wizard', 'cleric', 'bard'], spellTags: ['utility'],
  },
  {
    id: 'cure-wounds', name: 'Лечение ран', level: 1, school: 'Воплощение',
    castingTime: '1 действие', range: 'Касание', duration: 'Мгновенная', concentration: false,
    description: 'Касанием восстанавливаете 1d8 + мод. заклинательной характеристики ОЗ.',
    classes: ['cleric', 'bard'], spellTags: ['healing'],
  },
  {
    id: 'healing-word', name: 'Лечащее слово', level: 1, school: 'Воплощение',
    castingTime: '1 бонусное действие', range: '60 фт', duration: 'Мгновенная', concentration: false,
    description: 'Бонусным действием на расстоянии лечите 1d4 + мод. — поднимает павших.',
    classes: ['cleric', 'bard'], spellTags: ['healing'],
  },
  {
    id: 'bless', name: 'Благословение', level: 1, school: 'Очарование',
    castingTime: '1 действие', range: '30 фт', duration: 'Концентрация, 1 мин', concentration: true,
    description: 'До трёх союзников добавляют 1d4 к атакам и спасброскам.',
    classes: ['cleric'], spellTags: ['buff'],
  },
  {
    id: 'guiding-bolt', name: 'Направляющий снаряд', level: 1, school: 'Воплощение',
    castingTime: '1 действие', range: '120 фт', duration: '1 раунд', concentration: false,
    description: '4d6 урона излучением; следующая атака по цели получает преимущество.',
    classes: ['cleric'], spellTags: ['damage', 'buff'],
  },
  {
    id: 'shield-of-faith', name: 'Щит веры', level: 1, school: 'Ограждение',
    castingTime: '1 бонусное действие', range: '60 фт', duration: 'Концентрация, 10 мин', concentration: true,
    description: '+2 КД выбранной цели на время концентрации.',
    classes: ['cleric'], spellTags: ['defense', 'buff'],
  },
  {
    id: 'faerie-fire', name: 'Огонь фей', level: 1, school: 'Воплощение',
    castingTime: '1 действие', range: '60 фт', duration: 'Концентрация, 1 мин', concentration: true,
    description: 'Цели в области светятся: атаки по ним с преимуществом (спасбросок Ловкости).',
    classes: ['bard'], spellTags: ['control', 'buff'],
  },
  {
    id: 'charm-person', name: 'Очарование личности', level: 1, school: 'Очарование',
    castingTime: '1 действие', range: '30 фт', duration: '1 час', concentration: false,
    description: 'Гуманоид считает вас другом (спасбросок Мудрости).',
    classes: ['wizard', 'bard'], spellTags: ['control', 'utility'],
  },
  {
    id: 'thunderwave', name: 'Волна грома', level: 1, school: 'Воплощение',
    castingTime: '1 действие', range: 'Куб 15 фт', duration: 'Мгновенная', concentration: false,
    description: '2d8 урона звуком и отбрасывание на 10 футов (спасбросок Телосложения).',
    classes: ['wizard', 'bard'], spellTags: ['damage', 'control'],
  },
]

export const SPELL_BY_ID: Record<string, Spell> = SPELLS.reduce(
  (acc, s) => {
    acc[s.id] = s
    return acc
  },
  {} as Record<string, Spell>,
)

export const spellsForClass = (classId: string, level: number): Spell[] =>
  SPELLS.filter((s) => s.classes.includes(classId) && s.level === level)
