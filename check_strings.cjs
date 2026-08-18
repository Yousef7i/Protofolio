const fs = require('fs');

const file = fs.readFileSync('F:/portfolio_web/flutter_web_build/main.dart.js', 'utf8');

const regexes = [
  /Mohamed Ghanem/gi,
  /Mohamed/gi,
  /Ghanem/gi,
  /Flutter Developer \| Mobile App Engineer/gi,
  /I build scalable/gi
];

for (let r of regexes) {
  const matches = file.match(r);
  console.log(`${r.toString()}: ${matches ? matches.length : 0} matches`);
}
