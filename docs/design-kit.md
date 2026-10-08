# MAX design kit

Reusable look-and-feel for the MAX messenger, extracted from the MAX web
production build (`web.max.ru`). Drop-in SCSS, standalone and **not imported**
into the app yet.

> **Adopted:** the interactive UI now uses the official
> [`@maxhub/max-ui`](https://www.npmjs.com/package/@maxhub/max-ui) component
> library (Input, Button, Textarea, IconButton, CellList/CellAction, Counter,
> Typography, Avatar) wrapped in its `<MaxUI platform="ios" colorScheme="light">`
> provider. This kit's SCSS stays the reference for the layout, the auth
> gradient/pattern and the message bubbles (MaxUI has no chat-bubble component).

- Source of truth: `/tmp/max-design-spec.md` (reverse-engineered design system).
- Default theme: `data-color-theme=space`, `data-color-scheme=light`.
- Accent: `#007aff` (`--button-primary`).
- Auth reference: `/tmp/max-web.png` (`Sign in to MAX via QR code`).
- Pattern asset: `src/assets/max-pattern.svg`, downloaded from
  `https://web.max.ru/_app/immutable/assets/pattern_space.aFb4MW9l.svg`
  (280x280 SVG, single-color `currentColor` doodle, ~101 KB). MAX serves this
  as the `space` theme's masked background (`Bn2ajrGW.js`).

## Files

| file | purpose |
|---|---|
| `src/styles/max/_tokens.scss` | Plain SCSS variables (colors, radii, sizes, fonts, type scale). No CSS output. |
| `src/styles/max/_mixins.scss` | `bubble($side)`, `truncate`, `chat-column`, `pill-input`. |
| `src/styles/max/_kit.scss` | `mx-*` component classes. |
| `src/assets/max-pattern.svg` | Space doodle pattern. |

Nothing imports these files, so they are inert for the current build. Adopt
them file by file during the rebuild.

---

## Token table

All values are the MAX `space`/`light` values. The originating MAX custom
property is in the right column.

### Colors

| SCSS variable | value | MAX token |
|---|---|---|
| `$color-bg-primary` | `#fff` | `--background-primary` |
| `$color-bg-secondary` | `#f5f7fa` | `--background-secondary` |
| `$color-bg-surface` | `#edeef2` | `--background-surface` |
| `$color-bg-card` | `#fff` | `--background-card` |
| `$color-bg-tertiary` | `#0909090d` | `--background-tertiary` |
| `$color-bg-overlay` | `#0c0d0e52` | `--background-overlay` |
| `$color-text-primary` | `#060708` | `--text-primary` |
| `$color-text-secondary` | `#060708ad` | `--text-secondary` |
| `$color-text-mute` | `#06070866` | `--text-mute` |
| `$color-text-link` | `#007aff` | `--text-themed` (no `--text-link` exists) |
| `$color-icon-primary` | `#060708d6` | `--icon-primary` |
| `$color-icon-secondary` | `#060708a3` | `--icon-secondary` |
| `$color-icon-mute` | `#06070847` | `--icon-mute` |
| `$color-divider-primary` | `#0c0d0e29` | `--divider-primary` |
| `$color-divider-secondary` | `#0c0d0e0f` | `--divider-secondary` |
| `$color-accent` | `#007aff` | `--button-primary` |
| `$color-accent-contrast` | `#fff` | `--button-primary-contrast` |
| `$color-accent-hover` | `#479fff` | `--states-button-primary-hover` |
| `$color-accent-pressed` | `#006ee5` | `--states-button-primary-pressed` |
| `$color-accent-disabled` | `#007aff7a` | `--states-button-primary-disabled` |
| `$color-secondary` | `#e9ebf1` | `--button-secondary` |
| `$color-positive` | `#1abe43` | `--text-positive` |
| `$color-negative` | `#ff303c` | `--text-negative` |
| `$color-bubble-in` | `#fff` | `--bubbles-background-bubble` [incoming] |
| `$color-bubble-out` | `#e9fdff` | `--bubbles-background-bubble` [outgoing] |
| `$color-bubble-action` | `#0f8ec2` | `--bubbles-background-action` |
| `$color-bubble-action-text` | `#0784b8` | `--bubbles-text-action` |
| `$color-bubble-link` | `#0784b8` | `--bubbles-text-link` |
| `$color-bubble-in-text` | `#060708` | `--bubbles-text-body` [incoming] |
| `$color-bubble-out-text` | `#011c29` | `--bubbles-text-body` [outgoing] |
| `$color-bubble-in-time` | `#06070885` | `--bubbles-text-time` [incoming] |
| `$color-bubble-out-time` | `#0784b8` | `--bubbles-text-time` [outgoing] |
| `$color-bubble-reaction` | `#0f8ec214` | `--bubbles-background-reaction-inside-others` |

### Radii

| SCSS variable | value | MAX token |
|---|---|---|
| `$radius-bubble-regular` | `16px` | `--border-radius-local-bubble-regular` |
| `$radius-bubble-stack-corner` | `6px` | `--border-radius-local-bubble-stack-corner` |
| `$radius-capsule` | `10px` | `--border-radius-local-capsule` |
| `$radius-cell-chat` | `16px` | `--border-radius-local-cell-chat` |
| `$radius-common-s` | `8px` | `--border-radius-common-s` |
| `$radius-common-m` | `12px` | `--border-radius-common-m` |
| `$radius-common-l` | `16px` | `--border-radius-common-l` |
| `$radius-common-xl` | `20px` | `--border-radius-common-xl` |
| `$radius-auth-card` | `28px` | `--size-28` (auth card) |

### Sizes

Full `--size-*` scale: `$size-0: 0px`, `$size-1: 1px`, `$size-2: 2px`,
`$size-4`, `$size-6`, `$size-8`, `$size-10`, `$size-12`, `$size-14`, `$size-16`,
`$size-18`, `$size-20`, `$size-24`, `$size-28`, `$size-32`, `$size-36`,
`$size-40`, `$size-44`, `$size-48`, `$size-52`, `$size-56`, `$size-60`,
`$size-64`, `$size-72`, `$size-80`, `$size-88`, `$size-96`.

| SCSS variable | value | source |
|---|---|---|
| `$size-chat-column` | `732px` | `--max-content-width` |
| `$size-composer-max` | `740px` | `.composer` max-width |
| `$size-rail` | `77px` | `.navigation` width |
| `$size-panel-min` | `260px` | `--size-local-panel-size-secondary-min` |
| `$size-panel-base` | `393px` | `--size-local-panel-size-secondary-base` |
| `$size-panel-max` | `592px` | `--size-local-panel-size-secondary-max` |
| `$size-bubble-max` | `480px` | `--size-local-bubbles-text-bubble-width-max` |

### Font & type scale

`$font-family: -apple-system, BlinkMacSystemFont, "Roboto", system-ui, Avenir, Helvetica, Arial, sans-serif` (`--font`), base `Roboto`.
Roboto is also self-hosted (`src/assets/fonts/`, 400/500/600, subsets cyrillic +
cyrillic-ext + latin) with the exact woff2 files MAX serves, so the fallback on
platforms without a system Roboto (Windows, Android) matches MAX instead of
dropping to Segoe UI.

| role | SCSS prefix | size / line-height | weight | letter-spacing | MAX token |
|---|---|---|---|---|---|
| title | `$font-title-*` | `24px / 28px` | 600 | 0 | `--font-header-*` |
| message | `$font-message-*` | `16px / 20px` | 400 | 0 | `--font-markdown-message-base-*` |
| meta/timestamp | `$font-meta-*` | `11px / 14px` | 400 | `.3px` | `--font-bubble-tag-*` |
| small | `$font-small-*` | `13px / 16px` | 400 | `.2px` | `--font-description-*` |
| list title | `$font-list-title-*` | `15px / 20px` | 500 | `.15px` | `--font-detail-*` |

---

## Component spec

| class | role | key values |
|---|---|---|
| `.mx-app` | 3-column shell | grid `77px \| minmax(260px,393px) \| 1fr`, height 100%, bg `#f5f7fa` |
| `.mx-rail` | left nav rail | width/min-width `77px`, bg `#fff`, border-right `--divider-secondary` |
| `.mx-list` | chat list column | white bg, padding `24px 8px 16px`, scrolls |
| `.mx-list-item` | chat row | radius `16px`, padding `9px 11px`, hover `#f5f7fa`, active `#007aff14`; slots `__title`, `__preview` (2-line clamp), `__meta`, `__time`, `__unread` |
| `.mx-avatar` | circular avatar | default `40px`; modifiers `--56` (list), `--40`, `--32` (message author) |
| `.mx-chat` | conversation column | flex column, bg `#f5f7fa` |
| `.mx-chat-header` | header | min-height `60px`, padding `0 16px`, white bg; `__title` 600/24/28 in `#0784b8`, `__subtitle` 11px `#06070866` |
| `.mx-messages` | message stream | centered `max-width: 732px`, `gap: 1px`, padding `4px 16px` (4px group edges), scrolls |
| `.mx-bubble` | message bubble | max-width `min(480px,100%)`, radius `16px` + `6px` reply corner; `--in` (bg `#fff`), `--out` (bg `#e9fdff`); `__text`, `__meta` (11px, bottom 4 / right 10) |
| `.mx-composer` | write bar | `max-width: 740px`, centered, padding `0 16px 16px`; `__input` pill (`--size-12`/capsule surface) `min-height 40px`; `__send` 44px circle `#007aff` |
| `.mx-auth` | auth screen | `linear-gradient(28deg,#99d5d7 8.03%,#80bcff 91.51%)`; `::before` = `#007aff4d` masked by `max-pattern.svg`; `__card` white, radius `28px`, `max-width: 580px`, `min-height: 696px`, blur(25px); `__form` width `360px` |

Bubble grouping (from MAX `messageWrapper`): consecutive messages are spaced
**1px**; the first/last message of a group get **4px** (`.mx-messages` padding).

---

## Mapping: current app -> MAX kit

Mechanical rename for the rebuild. Keep DOM/behavior, swap the class + read
tokens from `_tokens.scss`.

| current class | MAX kit class | notes |
|---|---|---|
| `.app-shell` | `.mx-app` | becomes CSS grid; add `.mx-rail` as the new first column |
| `.sidebar` | `.mx-list` (region) | sidebar header/search move into the rail + list; width `393px` base |
| `.chat-list` | `.mx-list` | white bg, `24px 8px 16px` padding |
| `.chat-item` | `.mx-list-item` | radius `16px`, active `#007aff14`; active text stays dark (not white-on-accent) |
| `.avatar` | `.mx-avatar` | `46px` -> `56px` (`--56`) in the list, `32px` (`--32`) by messages |
| `.chat-window` | `.mx-chat` | bg `#f5f7fa` |
| `.chat-window__header` | `.mx-chat-header` | title 600/24/28 color `#0784b8` |
| `.chat-window__messages` | `.mx-messages` | centered `732px`, `1px` gaps |
| `.bubble--in` / `.bubble--out` | `.mx-bubble--in` / `.mx-bubble--out` | bg `#fff` / `#e9fdff`; drop the CSS tail, use the `6px` stack corner; text colors `#060708` / `#011c29` |
| `.bubble__meta` | `.mx-bubble__meta` | 11px/14px; incoming `#06070885`, outgoing `#0784b8` |
| `.composer` | `.mx-composer` | max-width `740px`, pill input, round send |
| `.composer__input` | `.mx-composer__input` | surface pill, radius capsule `10px` (MAX writebar `12px`) |
| `.composer__send` | `.mx-composer__send` | 44px circle `#007aff` |
| `.connect-screen` | `.mx-auth` | gradient + pattern overlay |
| `.connect-card` | `.mx-auth__card` | white, radius `28px`, `max-width 580px`, `min-height 696px` |
| `.connect-card__title` | `.mx-auth__title` | 600/24/28 |
| `.connect-card__subtitle` | `.mx-auth__subtitle` | 13px/16px secondary |
| `.connect-card__hint` | `.mx-auth__link` | accent `#007aff` |

### Not carried over

- The `.bubble--in/out` `::after` tails are replaced by the `6px` stack corner
  (MAX has no tails).
- Telegram green outgoing (`--outgoing #e6f9d9`) -> MAX `#e9fdff`.
- Accent `#3390ec` -> MAX `#007aff`.
- Avatars: MAX uses gradient fills / squircle clip paths; this kit ships a plain
  circle gradient as a starting point.
