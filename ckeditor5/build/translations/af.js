;(function (e) {
  const o = (e['af'] = e['af'] || {})
  o.dictionary = Object.assign(o.dictionary || {}, {
    '%0 of %1': '%0 van %1',
    'Block quote': 'Verwysingsaanhaling',
    Bold: 'Vet',
    Cancel: 'Kanselleer',
    'Cannot upload file:': 'Lêer nie opgelaai nie:',
    Code: 'Bronkode',
    'Insert code block': 'Voeg bronkodeblok in',
    Italic: 'Kursief',
    'Plain text': 'Gewone skrif',
    Save: 'Stoor',
    'Show more items': 'Wys meer items',
  })
  o.getPluralForm = function (e) {
    return e != 1
  }
})(window.CKEDITOR_TRANSLATIONS || (window.CKEDITOR_TRANSLATIONS = {}))
