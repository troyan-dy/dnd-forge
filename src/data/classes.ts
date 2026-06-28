import type { CharClass } from '@/types'

// SRD 5.1 classes, levels 1–5, one canonical subclass each.
export const CLASSES: CharClass[] = [
  // --------------------------------------------------------------------------
  {
    id: 'fighter',
    name: 'Воин',
    blurb: 'Мастер оружия и брони. Лишние атаки, всплеск действия и стойкость — надёжный фронт.',
    hitDie: 10,
    primaryAbility: ['str', 'dex'],
    savingThrows: ['str', 'con'],
    armorProficiencies: ['Все доспехи', 'Щиты'],
    weaponProficiencies: ['Простое оружие', 'Воинское оружие'],
    isCaster: false,
    casterType: 'none',
    role: 'tank',
    secondaryRoles: ['melee-dps', 'ranged-dps'],
    complexity: 'simple',
    skillChoices: {
      count: 2,
      pool: ['acrobatics', 'animalHandling', 'athletics', 'history', 'insight', 'intimidation', 'perception', 'survival'],
    },
    equipmentPacks: [
      { id: 'fighter-melee', label: 'Латник', items: ['Кольчуга', 'Боевой меч', 'Щит', 'Лёгкий арбалет + 20 болтов', 'Набор путешественника'] },
      { id: 'fighter-archer', label: 'Лучник', items: ['Кожаный доспех', 'Длинный лук + 20 стрел', 'Два ручных топора', 'Набор путешественника'] },
    ],
    features: [
      { level: 1, name: 'Боевой стиль', description: 'Выберите боевой стиль (Оборона: +1 КД в доспехе; Дуэлянт: +2 урона одноручным; Стрельба: +2 к попаданиям дальнобойным).' },
      { level: 1, name: 'Второе дыхание', description: 'Бонусным действием восстановите 1d10 + уровень ОЗ. Перезарядка — короткий/долгий отдых.' },
      { level: 2, name: 'Всплеск действия', description: 'Совершите одно дополнительное действие в свой ход. Раз на отдых.' },
      { level: 3, name: 'Воинский архетип', description: 'Вы выбираете архетип (Чемпион).', isSubclassChoice: true },
      { level: 4, name: 'Повышение характеристик', description: '+2 к одной или +1 к двум характеристикам, либо черта.', isASI: true },
      { level: 5, name: 'Дополнительная атака', description: 'Действием Атака вы атакуете дважды.' },
    ],
    subclass: {
      id: 'champion',
      name: 'Чемпион',
      blurb: 'Чистая боевая мощь: критует чаще и бьёт надёжнее.',
      choiceLevel: 3,
      features: [
        { level: 3, name: 'Улучшенный критический удар', description: 'Критический удар срабатывает на выпадении 19 и 20.' },
        { level: 5, name: '— (следующее на 7 ур.)', description: 'Замечательный атлет: половина мастерства к проверкам Силы/Ловкости/Телосложения (с 7 ур.).' },
      ],
    },
  },

  // --------------------------------------------------------------------------
  {
    id: 'wizard',
    name: 'Волшебник',
    blurb: 'Учёный арканы. Огромный список заклинаний и контроль поля боя — но хрупок.',
    hitDie: 6,
    primaryAbility: ['int'],
    savingThrows: ['int', 'wis'],
    armorProficiencies: [],
    weaponProficiencies: ['Кинжалы', 'Дротики', 'Пращи', 'Боевые посохи', 'Лёгкие арбалеты'],
    isCaster: true,
    casterType: 'full',
    spellAbility: 'int',
    role: 'controller',
    secondaryRoles: ['ranged-dps'],
    complexity: 'complex',
    skillChoices: {
      count: 2,
      pool: ['arcana', 'history', 'insight', 'investigation', 'medicine', 'religion'],
    },
    cantripsKnown1: 3,
    spellsKnown1: 6,
    equipmentPacks: [
      { id: 'wizard-staff', label: 'Учёный', items: ['Боевой посох', 'Книга заклинаний', 'Сумка с компонентами', 'Набор учёного'] },
      { id: 'wizard-dagger', label: 'Странник', items: ['Кинжал', 'Книга заклинаний', 'Магическая фокусировка (хрустальный шар)', 'Набор исследователя'] },
    ],
    features: [
      { level: 1, name: 'Использование заклинаний', description: 'Вы читаете заклинания волшебника по книге. Интеллект — заклинательная характеристика.' },
      { level: 1, name: 'Магическое восстановление', description: 'В короткий отдух раз в день восстановите ячейки заклинаний (суммарно до половины уровня волшебника).' },
      { level: 2, name: 'Аркановая традиция', description: 'Вы выбираете школу магии (Воплощение).', isSubclassChoice: true },
      { level: 3, name: 'Ячейки 2 уровня', description: 'Доступны заклинания 2 уровня.' },
      { level: 4, name: 'Повышение характеристик', description: '+2 к одной или +1 к двум характеристикам, либо черта.', isASI: true },
      { level: 5, name: 'Ячейки 3 уровня', description: 'Доступны заклинания 3 уровня (огненный шар, полёт и т.д.).' },
    ],
    subclass: {
      id: 'evocation',
      name: 'Школа Воплощения',
      blurb: 'Повелитель разрушительной магии, который не задевает союзников.',
      choiceLevel: 2,
      features: [
        { level: 2, name: 'Знаток воплощения', description: 'Вдвое дешевле копировать заклинания Воплощения в книгу и быстрее их учить.' },
        { level: 2, name: 'Ваяние заклинаний', description: 'В заклинаниях по области выберите до (1+уровень заклинания) союзников — они автоматически избегают урона.' },
      ],
    },
  },

  // --------------------------------------------------------------------------
  {
    id: 'rogue',
    name: 'Плут',
    blurb: 'Скрытный универсал. Внезапная атака, хитрое действие и экспертиза — мастер на все руки.',
    hitDie: 8,
    primaryAbility: ['dex'],
    savingThrows: ['dex', 'int'],
    armorProficiencies: ['Лёгкие доспехи'],
    weaponProficiencies: ['Простое оружие', 'Ручные арбалеты', 'Длинные мечи', 'Рапиры', 'Короткие мечи'],
    toolProficiencies: ['Воровские инструменты'],
    isCaster: false,
    casterType: 'none',
    role: 'skill-monkey',
    secondaryRoles: ['melee-dps', 'ranged-dps'],
    complexity: 'medium',
    skillChoices: {
      count: 4,
      pool: ['acrobatics', 'athletics', 'deception', 'insight', 'intimidation', 'investigation', 'perception', 'performance', 'persuasion', 'sleightOfHand', 'stealth'],
    },
    equipmentPacks: [
      { id: 'rogue-blade', label: 'Дуэлянт', items: ['Рапира', 'Короткий лук + 20 стрел', 'Кожаный доспех', 'Воровские инструменты', 'Набор взломщика'] },
      { id: 'rogue-shadow', label: 'Тень', items: ['Два коротких меча', 'Кожаный доспех', 'Воровские инструменты', 'Набор взломщика', 'Тёмный плащ'] },
    ],
    features: [
      { level: 1, name: 'Экспертиза', description: 'Удвойте бонус мастерства для двух выбранных навыков (или одного навыка и воровских инструментов).' },
      { level: 1, name: 'Внезапная атака', description: '1d6 доп. урона при преимуществе или союзнике рядом с целью. Раз в ход.' },
      { level: 1, name: 'Воровской жаргон', description: 'Тайный язык воров для скрытых сообщений.' },
      { level: 2, name: 'Хитрое действие', description: 'Бонусным действием можете Засаду, Рывок или Отход каждый ход.' },
      { level: 3, name: 'Архетип плута', description: 'Вы выбираете архетип (Вор).', isSubclassChoice: true },
      { level: 4, name: 'Повышение характеристик', description: '+2 к одной или +1 к двум характеристикам, либо черта.', isASI: true },
      { level: 5, name: 'Невероятное уклонение', description: 'Реакцией уменьшаете вдвое урон от одной видимой атаки.' },
    ],
    subclass: {
      id: 'thief',
      name: 'Вор',
      blurb: 'Ловкач и акробат: мгновенные руки и лазание по стенам.',
      choiceLevel: 3,
      features: [
        { level: 3, name: 'Быстрые руки', description: 'Хитрым действием используйте предмет, Ловкость рук или обезвреживание ловушек.' },
        { level: 3, name: 'Работа верхолаза', description: 'Лазание не стоит лишнего движения; прыжок с разбега длиннее.' },
      ],
    },
  },

  // --------------------------------------------------------------------------
  {
    id: 'cleric',
    name: 'Клерик',
    blurb: 'Проводник божества. Лечение, баффы и нежить-крушитель — гибкая опора партии.',
    hitDie: 8,
    primaryAbility: ['wis'],
    savingThrows: ['wis', 'cha'],
    armorProficiencies: ['Лёгкие доспехи', 'Средние доспехи', 'Щиты', 'Тяжёлые доспехи (Домен Жизни)'],
    weaponProficiencies: ['Простое оружие'],
    isCaster: true,
    casterType: 'full',
    spellAbility: 'wis',
    role: 'support',
    secondaryRoles: ['tank', 'controller'],
    complexity: 'medium',
    skillChoices: {
      count: 2,
      pool: ['history', 'insight', 'medicine', 'persuasion', 'religion'],
    },
    cantripsKnown1: 3,
    spellsKnown1: 6,
    equipmentPacks: [
      { id: 'cleric-warpriest', label: 'Боевой жрец', items: ['Кольчужная рубаха', 'Булава', 'Щит', 'Священный символ', 'Набор священника'] },
      { id: 'cleric-pilgrim', label: 'Странствующий', items: ['Кожаный доспех', 'Боевой молот', 'Лёгкий арбалет + 20 болтов', 'Священный символ', 'Набор путешественника'] },
    ],
    features: [
      { level: 1, name: 'Использование заклинаний', description: 'Готовите заклинания клерика. Мудрость — заклинательная характеристика.' },
      { level: 1, name: 'Божественный домен (Жизнь)', description: 'Владение тяжёлой бронёй; «Ученик жизни»: лечение восстанавливает доп. 2 + уровень заклинания ОЗ.', isSubclassChoice: true },
      { level: 2, name: 'Божественный канал', description: 'Изгнание нежити или «Сохранение жизни»: распределите 5×уровень ОЗ между ранеными.' },
      { level: 3, name: 'Ячейки 2 уровня', description: 'Доступны заклинания 2 уровня.' },
      { level: 4, name: 'Повышение характеристик', description: '+2 к одной или +1 к двум характеристикам, либо черта.', isASI: true },
      { level: 5, name: 'Сокрушение нежити', description: 'Изгнанная нежить с ПО 1/2 и ниже уничтожается. Ячейки 3 уровня.' },
    ],
    subclass: {
      id: 'life-domain',
      name: 'Домен Жизни',
      blurb: 'Воплощение исцеления: усиленные лечилки и тяжёлая броня.',
      choiceLevel: 1,
      features: [
        { level: 1, name: 'Ученик жизни', description: 'Любое заклинание лечения восстанавливает дополнительно 2 + уровень ячейки ОЗ.' },
        { level: 2, name: 'Канал: сохранение жизни', description: 'Божественным каналом исцелите союзников суммарно на 5×уровень клерика ОЗ.' },
      ],
    },
  },

  // --------------------------------------------------------------------------
  {
    id: 'barbarian',
    name: 'Варвар',
    blurb: 'Ярость во плоти. Сопротивление урону, безрассудные атаки и гора ОЗ — таран партии.',
    hitDie: 12,
    primaryAbility: ['str'],
    savingThrows: ['str', 'con'],
    armorProficiencies: ['Лёгкие доспехи', 'Средние доспехи', 'Щиты'],
    weaponProficiencies: ['Простое оружие', 'Воинское оружие'],
    isCaster: false,
    casterType: 'none',
    role: 'melee-dps',
    secondaryRoles: ['tank'],
    complexity: 'simple',
    skillChoices: {
      count: 2,
      pool: ['animalHandling', 'athletics', 'intimidation', 'nature', 'perception', 'survival'],
    },
    equipmentPacks: [
      { id: 'barb-greataxe', label: 'Дробитель', items: ['Секира (большой топор)', 'Два ручных топора', 'Метательное копьё ×4', 'Набор путешественника'] },
      { id: 'barb-sword', label: 'Берсерк', items: ['Боевой меч', 'Два ручных топора', 'Метательное копьё ×4', 'Набор исследователя'] },
    ],
    features: [
      { level: 1, name: 'Ярость', description: 'Бонусным действием: +урон, преимущество на проверки/спасброски Силы и сопротивление дробящему/колющему/рубящему урону.' },
      { level: 1, name: 'Защита без доспехов', description: 'Без доспеха КД = 10 + мод. Ловкости + мод. Телосложения.' },
      { level: 2, name: 'Безрассудная атака', description: 'Преимущество на атаки Силой в ближнем бою, но атаки по вам тоже с преимуществом.' },
      { level: 2, name: 'Чувство опасности', description: 'Преимущество на спасброски Ловкости против эффектов, которые вы видите.' },
      { level: 3, name: 'Первобытный путь', description: 'Вы выбираете путь (Берсерк).', isSubclassChoice: true },
      { level: 4, name: 'Повышение характеристик', description: '+2 к одной или +1 к двум характеристикам, либо черта.', isASI: true },
      { level: 5, name: 'Дополнительная атака, Быстрое передвижение', description: 'Атакуете дважды; +10 футов скорости без тяжёлой брони.' },
    ],
    subclass: {
      id: 'berserker',
      name: 'Путь Берсерка',
      blurb: 'Безграничная жажда крови: лишняя атака в ярости ценой истощения.',
      choiceLevel: 3,
      features: [
        { level: 3, name: 'Неистовство', description: 'В ярости можете бонусным действием совершать доп. атаку оружием каждый ход (после — истощение).' },
      ],
    },
  },

  // --------------------------------------------------------------------------
  {
    id: 'bard',
    name: 'Бард',
    blurb: 'Маг-вдохновитель. Бафф-кости, контроль и горы навыков — клей и швейцарский нож партии.',
    hitDie: 8,
    primaryAbility: ['cha'],
    savingThrows: ['dex', 'cha'],
    armorProficiencies: ['Лёгкие доспехи'],
    weaponProficiencies: ['Простое оружие', 'Ручные арбалеты', 'Длинные мечи', 'Рапиры', 'Короткие мечи'],
    toolProficiencies: ['Три музыкальных инструмента'],
    isCaster: true,
    casterType: 'full',
    spellAbility: 'cha',
    role: 'support',
    secondaryRoles: ['controller', 'skill-monkey'],
    complexity: 'complex',
    skillChoices: {
      count: 3,
      pool: ['acrobatics', 'animalHandling', 'arcana', 'athletics', 'deception', 'history', 'insight', 'intimidation', 'investigation', 'medicine', 'nature', 'perception', 'performance', 'persuasion', 'religion', 'sleightOfHand', 'stealth', 'survival'],
    },
    cantripsKnown1: 2,
    spellsKnown1: 4,
    equipmentPacks: [
      { id: 'bard-lute', label: 'Менестрель', items: ['Рапира', 'Лютня', 'Кожаный доспех', 'Кинжал', 'Набор дипломата'] },
      { id: 'bard-flute', label: 'Бродяга', items: ['Короткий меч', 'Флейта', 'Кожаный доспех', 'Кинжал', 'Набор артиста'] },
    ],
    features: [
      { level: 1, name: 'Использование заклинаний', description: 'Читаете заклинания барда. Харизма — заклинательная характеристика.' },
      { level: 1, name: 'Вдохновение барда (d6)', description: 'Бонусным действием дайте союзнику кость d6 к проверке, атаке или спасброску.' },
      { level: 2, name: 'Мастер на все руки', description: 'Половина бонуса мастерства к любым проверкам, где вы им ещё не владеете.' },
      { level: 2, name: 'Песнь отдыха (d6)', description: 'В короткий отдых союзники восстанавливают доп. 1d6 ОЗ.' },
      { level: 3, name: 'Коллегия бардов', description: 'Вы выбираете коллегию (Знание).', isSubclassChoice: true },
      { level: 4, name: 'Повышение характеристик', description: '+2 к одной или +1 к двум характеристикам, либо черта.', isASI: true },
      { level: 5, name: 'Вдохновение (d8), Источник вдохновения', description: 'Кость вдохновения становится d8; восстанавливается в короткий отдых.' },
    ],
    subclass: {
      id: 'lore',
      name: 'Коллегия Знания',
      blurb: 'Эрудит и манипулятор: режущие слова и три лишних навыка.',
      choiceLevel: 3,
      features: [
        { level: 3, name: 'Дополнительные владения', description: 'Владение тремя навыками на ваш выбор.' },
        { level: 3, name: 'Острое словцо', description: 'Реакцией тратьте кость вдохновения, чтобы вычесть её из броска атаки/проверки/урона врага.' },
      ],
    },
  },
]

export const CLASS_BY_ID: Record<string, CharClass> = CLASSES.reduce(
  (acc, c) => {
    acc[c.id] = c
    return acc
  },
  {} as Record<string, CharClass>,
)
