;(function (o) {
  const a = (o['sl'] = o['sl'] || {})
  a.dictionary = Object.assign(a.dictionary || {}, {
    '%0 of %1': '',
    Aquamarine: 'Akvamarin',
    Black: 'Črna',
    'Block quote': 'Blokiraj citat',
    Blue: 'Modra',
    Bold: 'Krepko',
    Cancel: 'Prekliči',
    'Cannot upload file:': 'Ni možno naložiti datoteke:',
    'Choose heading': 'Izberi naslov',
    Code: 'Koda',
    'Dim grey': 'Temno siva',
    'Dropdown toolbar': '',
    'Edit block': '',
    'Editor block content toolbar': '',
    'Editor contextual toolbar': '',
    'Editor editing area: %0': '',
    'Editor toolbar': '',
    Green: 'Zelena',
    Grey: 'Siva',
    Heading: 'Naslov',
    'Heading 1': 'Naslov 1',
    'Heading 2': 'Naslov 2',
    'Heading 3': 'Naslov 3',
    'Heading 4': 'Naslov 4',
    'Heading 5': 'Naslov 5',
    'Heading 6': 'Naslov 6',
    Italic: 'Poševno',
    'Light blue': 'Svetlo modra',
    'Light green': 'Svetlo zelena',
    'Light grey': 'Svetlo siva',
    Next: '',
    Orange: 'Oranžna',
    Paragraph: 'Odstavek',
    Previous: '',
    Purple: 'Vijolična',
    Red: 'Rdeča',
    'Rich Text Editor': '',
    Save: 'Shrani',
    'Show more items': '',
    Turquoise: 'Turkizna',
    White: 'Bela',
    Yellow: 'Rumena',
  })
  a.getPluralForm = function (o) {
    return o % 100 == 1
      ? 0
      : o % 100 == 2
      ? 1
      : o % 100 == 3 || o % 100 == 4
      ? 2
      : 3
  }
})(window.CKEDITOR_TRANSLATIONS || (window.CKEDITOR_TRANSLATIONS = {}))
