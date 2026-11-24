#!/usr/bin/env python3
"""연도별 페이지 파일 만들기

주소를 /2027/, /2027/schedule/ 처럼 깔끔하게 쓰기 위해, 연도 · 메뉴마다
index.html 을 하나씩 둡니다. 내용은 모두 같은 껍데기이고 실제 화면은
assets/js/app.js 가 data 파일을 읽어 그립니다.

  python3 tools/pages.py

- assets/js/data/ 의 연도 파일(2025.js, 2026.js …)을 찾아 연도마다 만듭니다.
- 예전 주소(2027.html#schedule)로 들어와도 새 주소로 옮겨 주는 파일도 함께 만듭니다.
- ?v= 숫자는 index.html 에 적힌 값을 그대로 씁니다.
새 연도를 추가했거나 ?v= 숫자를 바꾼 뒤에 한 번 실행하세요.
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / 'assets' / 'js' / 'data'
ROUTES = ['schedule', 'abstract', 'registration', 'venue', 'gallery']
LABELS = {'schedule': '일정', 'abstract': '초록', 'registration': '참가 신청', 'venue': '장소 안내', 'gallery': '갤러리'}

years = sorted(int(p.stem) for p in DATA.glob('[0-9][0-9][0-9][0-9].js'))
ver = re.search(r'app\.js\?v=(\d+)', (ROOT / 'index.html').read_text()).group(1)
scripts = '\n'.join(
    [f'  <script src="assets/js/data/site.js?v={ver}"></script>']
    + [f'  <script src="assets/js/data/{y}.js?v={ver}"></script>' for y in years]
)


def page(year, route):
    base = '../' if route == 'home' else '../../'
    title = f'MCUS {year} · {year} 학부생을 위한 수학 학술회' if route == 'home' else f'{LABELS[route]} · MCUS {year}'
    return f'''<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <!-- 이 파일은 tools/pages.py 가 만듭니다. 내용 수정은 assets/js/data/{year}.js 에서 -->
  <base href="{base}">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <meta name="description" content="{year} 학부생을 위한 수학 학술회(MCUS {year}) — 개요, 연사, 일정">
  <link rel="icon" href="assets/img/favicon.svg?v=4" type="image/svg+xml">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.css">
  <link rel="stylesheet" href="assets/css/style.css?v={ver}">
</head>
<body data-page="year" data-year="{year}" data-route="{route}">
  <div class="site-header" id="site-header"></div>
  <main id="app"></main>
  <footer class="site-footer" id="site-footer"></footer>

{scripts}
  <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/katex.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.9/contrib/auto-render.min.js"></script>
  <script src="assets/js/app.js?v={ver}"></script>
</body>
</html>
'''


# 예전 주소 2027.html#abstract/d1-t2 → 2027/abstract/#d1-t2
def redirect(year):
    return f'''<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <!-- 예전 주소 호환용 (tools/pages.py 가 만듭니다) -->
  <title>MCUS {year}</title>
  <link rel="canonical" href="{year}/">
  <meta http-equiv="refresh" content="0; url={year}/">
  <script>
    (function () {{
      var h = decodeURIComponent(location.hash.slice(1)).split('/');
      var key = h[0], arg = h[1];
      if (/^d\\d+-(t|lt)\\d*$/.test(key || '')) {{ arg = key; key = 'abstract'; }}
      var routes = {ROUTES!r};
      var path = routes.indexOf(key) >= 0 ? key + '/' : '';
      location.replace('{year}/' + path + (arg ? '#' + arg : ''));
    }})();
  </script>
</head>
<body><a href="{year}/">MCUS {year} 페이지로 이동</a></body>
</html>
'''


for y in years:
    d = ROOT / str(y)
    d.mkdir(exist_ok=True)
    (d / 'index.html').write_text(page(y, 'home'))
    for r in ROUTES:
        (d / r).mkdir(exist_ok=True)
        (d / r / 'index.html').write_text(page(y, r))
    (ROOT / f'{y}.html').write_text(redirect(y))
    print(f'{y}: /{y}/ + {", ".join(ROUTES)}')
