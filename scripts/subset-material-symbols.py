#!/usr/bin/env python3
"""
Сабсет Material Symbols Outlined под иконки, которые реально стоят на сайте.

Полный шрифт с Google Fonts весит 316 КБ ради ~30 иконок. Скрипт находит
имена иконок в исходниках, вырезает из вариативного шрифта только их глифы
вместе с лигатурами и фиксирует оси на значениях по умолчанию
(FILL 0, wght 400, GRAD 0, opsz 24 — то же, что отдаёт Google Fonts без осей).
Результат — public/fonts/material-symbols-outlined.woff2 на несколько КБ.

Иконки ищутся только в файлах, где встречается класс `material-symbols-outlined`:
  • значения `icon: 'имя'` в данных страницы;
  • текст внутри <span class="…icon…">имя</span> в шаблоне.
Имя, которого нет в шрифте, — ошибка: такая иконка отрисовалась бы текстом.

ПЕРЕЗАПУСКАТЬ ПОСЛЕ ДОБАВЛЕНИЯ ЛЮБОЙ НОВОЙ ИКОНКИ, иначе вместо неё будет слово.

    pip install fonttools brotli
    npm pack material-symbols && tar -xzf material-symbols-*.tgz
    python3 scripts/subset-material-symbols.py package/material-symbols-outlined.woff2
"""
import pathlib
import re
import sys

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'fonts' / 'material-symbols-outlined.woff2'
MARKER = 'material-symbols-outlined'


def used_icons() -> set[str]:
    names: set[str] = set()
    for path in (ROOT / 'app').rglob('*.vue'):
        src = path.read_text(encoding='utf-8')
        if MARKER not in src:
            continue
        names |= set(re.findall(r"icon:\s*'([a-z0-9_]+)'", src))
        tpl = src.split('<style', 1)[0]
        names |= set(re.findall(r'<(?:span|i)[^>]*class="[^"]*icon[^"]*"[^>]*>\s*([a-z0-9_]+)\s*<', tpl))
    return names


def ligature_map(font: TTFont) -> dict[str, str]:
    """Строка-лигатура → имя глифа. В Material Symbols это одно и то же, но проверяем по GSUB."""
    cmap = font.getBestCmap()
    char_of = {g: chr(c) for c, g in cmap.items()}
    result: dict[str, str] = {}
    for lookup in font['GSUB'].table.LookupList.Lookup:
        for st in lookup.SubTable:
            if st.LookupType == 7:
                st = st.ExtSubTable
            if st.LookupType != 4:
                continue
            for first, ligs in st.ligatures.items():
                for lig in ligs:
                    seq = [first, *lig.Component]
                    if all(g in char_of for g in seq):
                        result[''.join(char_of[g] for g in seq)] = lig.LigGlyph
    return result


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    icons = used_icons()
    font = TTFont(sys.argv[1])
    ligs = ligature_map(font)
    missing = sorted(i for i in icons if i not in ligs)
    if missing:
        sys.exit(f'Нет в шрифте: {", ".join(missing)}')

    opts = subset.Options()
    opts.layout_features = ['rlig', 'rclt', 'liga']
    opts.layout_closure = False  # иначе по буквам вытянутся все 4 000 лигатур
    opts.name_IDs = [1, 2, 3, 4, 6]
    sub = subset.Subsetter(opts)
    sub.populate(glyphs=[ligs[i] for i in icons], unicodes=[ord(c) for c in ''.join(icons)])
    sub.subset(font)

    defaults = {a.axisTag: a.defaultValue for a in font['fvar'].axes}
    font = instancer.instantiateVariableFont(font, defaults)
    font.flavor = 'woff2'
    OUT.parent.mkdir(parents=True, exist_ok=True)
    font.save(OUT)
    print(f'{len(icons)} иконок → {OUT.relative_to(ROOT)} ({OUT.stat().st_size / 1024:.1f} КБ)')
    print(', '.join(sorted(icons)))


if __name__ == '__main__':
    main()
