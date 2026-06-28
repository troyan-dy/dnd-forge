# CLAUDE.md

Контекст для работы над **DnD Build Forge** — оффлайн-конструктор персонажей D&D 5e (SRD)
с обратным подбором по навыкам и шаблонным гайдом по отыгрышу. Подробности для
пользователя — в [README.md](README.md); этот файл — для разработки.

## Команды

```bash
npm run dev        # дев-сервер :5173
npm run build      # tsc -b && vite build -> dist/ (должно проходить без ошибок и TS-предупреждений)
npm run typecheck  # только типы
npm run preview    # предпросмотр прод-сборки

docker compose up --build           # прод за nginx :8080
docker compose --profile dev up     # Vite HMR в контейнере :5173
```

После любых изменений прогоняй `npm run build` — `tsconfig.app.json` включает
`strict`, `noUnusedLocals`, `noUnusedParameters`, так что мёртвый код роняет сборку.

## Окружение

- `.npmrc` пинит публичный `registry.npmjs.org` (корпоративный proxy недоступен). Не удаляй без причины.
- React 18, Vite 5, TS 5.6, Tailwind 3, zustand 4. **Не** обновляй мажоры без явной просьбы.
- Алиас `@/*` → `src/*` настроен в двух местах: `tsconfig.app.json` (paths) и `vite.config.ts` (resolve.alias). Менять — синхронно.

## Архитектура (поток данных)

```
data/ (размеченный тегами SRD-контент)
  │
  ▼
lib/calculations.ts  ← ЧИСТЫЕ функции (state -> производные значения). Никакого React.
lib/{leveling,recommend,guide,io}.ts
  │
  ▼
lib/store.ts (zustand)  ← единственный источник истины: CharacterState + текущий шаг
  │                        каждый мутатор сразу пишет в localStorage (storage.ts)
  ▼
components/  ← читают из useForge(selector), вызывают мутаторы. Без локального дублирования стейта билда.
```

Принцип: **вся игровая логика — в `lib/`, чистая и тестируемая**; компоненты только
рендерят и диспатчат. Живой лист реактивен, потому что `calculations.ts` — чистые
функции от `CharacterState`, а компоненты подписаны на стор.

## Ключевые файлы

| Файл | Зачем |
|------|-------|
| `src/types/index.ts` | Все типы и теги. `CharacterState` — сохраняемая модель билда. Здесь же `Ability`, `Role`, `Complexity`, `SkillId`, константы-лейблы. |
| `src/lib/store.ts` | zustand-стор, `createEmptyCharacter()`, порядок шагов `STEPS`, `visibleSteps()` (прячет «Заклинания» у некастеров), `SCHEMA_VERSION`, миграция импорта. |
| `src/lib/calculations.ts` | `finalAbilities`, `abilityModifier`, `proficiencyBonus`, `maxHp`, `armorClass`, `savingThrows`, `skillRows`, `spellcasting`, `proficientSkills`. |
| `src/lib/recommend.ts` | Обратный фильтр: скоринг связок класс×раса×предыстория, источники навыков, dedup по классу для топ-3. |
| `src/lib/guide.ts` | Движок гайда: блоки текста, выбираемые по тегам (`role`, `isCaster`, класс, теги заклинаний). Без ИИ. |
| `src/lib/leveling.ts` | Таблица ячеек заклинаний и дорожка уровней 1→5. |
| `src/data/*.ts` | Контент. Каждая сущность экспортирует массив + `*_BY_ID` карту. |
| `src/components/steps/` | 10 шагов визарда (по одному файлу). Диспетчер — `WizardStep.tsx`. |

## Соглашения и паттерны

- **Стор:** добавляешь поле в `CharacterState` → обнови `createEmptyCharacter()` и при необходимости мутатор в `store.ts`. Мутаторы по образцу существующих: собрать новый `character`, вызвать `persist(character)`, затем `set`.
- **Данные:** новая сущность = запись в массив `data/*.ts` + она автоматически попадает в `*_BY_ID`. **Размечай теги сразу** (`role`, `complexity`, `grantsSkills`, `skillChoices`, `spellTags`, `synergyRoles`) — на них держатся фильтр и гайд.
- **Расчёты:** любая новая производная величина — чистая функция в `lib/`, не считай в компоненте.
- **UI:** тёмно-фэнтези Tailwind-классы вынесены в `@layer components` в `index.css` (`.card`, `.card-hover`, `.btn-primary`, `.chip`, `.stat-box` …). Используй их, не плоди ad-hoc стили. Палитра — в `tailwind.config.js` (`ink`, `parchment`, `gold`, `blood`).
- **Печать:** класс `no-print` скрывает элемент при печати; `@media print` в `index.css` перекрашивает в светлый пергамент.
- **Текст интерфейса — на русском.** Контент — только SRD/CC-BY-4.0, платный контент не добавлять.

## Допущения (важно при доработке)

Уже реализованные упрощения — менять осознанно (полный список в README):

- HP — фиксированное среднее за уровень, не бросок.
- КД выводится из названий предметов в выбранном наборе (`ARMOR_TABLE` в `calculations.ts`) + спец-кейсы варвара и «Доспехов мага».
- Экспертиза плута — авто на первые два выбранных навыка класса.
- Уровни только 1–5, по одному подклассу на класс, заклинания — заговоры + 1 круг.
- Бросок 4d6 использует `Math.random()`; пул бросков ephemeral (в localStorage сохраняются итоговые значения, не сам пул).

## Расширение (типовые задачи)

- **Новый класс/раса/предыстория** → файл в `data/`, проставить теги. Шаги визарда подхватят автоматически.
- **Новое заклинание** → `data/spells.ts` с `classes` и `spellTags`; появится в шаге заклинаний и повлияет на гайд.
- **Новая черта** → `data/feats.ts` (+ `abilityBonus`/`synergyRoles`); попадёт в выбор на 4 уровне.
- **Новый блок гайда** → правило в `lib/guide.ts` (по существующим `ROLE_*` / `CLASS_*` картам).
- **Уровни 6+** → расширить `features` классов, `FULL_CASTER_SLOTS` в `leveling.ts`, диапазон в `LevelStep.tsx`.

## Проверка изменений

Браузера в окружении сборки может не быть. Логику `lib/` быстро проверяй так:
напиши временный `*.ts` с ассертами, собери и запусти —
`node_modules/.bin/esbuild scratch.ts --bundle --platform=node --format=esm --alias:@=./src --outfile=/tmp/v.mjs && node /tmp/v.mjs`,
затем удали файл. (Так уже проверялись AC/HP/спасброски/фильтр/гайд.)
