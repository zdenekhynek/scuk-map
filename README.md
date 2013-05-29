zdenek
======

ScukMapa

tridy:
  
ScukMap.App - hlavni trida Scuk mapy
  
view 
-  ScukMap.view.View  - stara se o mapu, autocomplete, selectbox
-  ScukMap.view.Map  - spravuje instanci google mapy a jejich eventu
-  ScukMap.view.Marker - wrapper kolem markeru typu google.maps.Marker
-  ScukMap.view.MarkerManager  - na zaklade dodavanych dat zobrazuje a schovava markery
-  ScukMap.view.MarkersImages  - staticka trida pro vsechny ikonky markeru
-  ScukMap.view.AutoComplete - wrapper kolem places api pluginu ( http://ubilabs.github.com/geocomplete/ )
-  ScukMap.view.InfoWindow - wrapper infowindow typu google.maps.InfoWindow 
-  ScukMap.view.CustomInfoWindow - wrapper infoboxu z externi knihovny libs/infobox.js 
-  ScukMap.view.TypeSelector - wrapper selectu pro vyber typu
-  ScukMap.view.HashNavigator - navigace pomoci hash a bbq pluginu
-  ScukMap.view.MarkerGridOverlay - pomocny overlay pro urceni a kontrolu viditelnych dlazdic
-  ScukMap.view.UserLocationControl  - wrapper controlu pro navrat na zamerenou pozici

model
-  ScukMap.model.Model - ulozeni stavu aplikaci, ziskavani dat
-  ScukMap.model.DataProxy - wrapper pro ziskavani dat z backendu, nebo z cache
-  ScukMap.model.SimpleDataProxy - jednoducha proxy pro vraceni testovaciho vzorku dat
-  ScukMap.model.DataCache - cache pro ziskavani dat z local storage nebo polyfillu
-  ScukMap.model.DataLocalStorage - wrapper kolem html5 localstorage

controller
-  ScukMap.controller.Controller - vyuziva view pro komunikaci s controllerem

utils
-  ScukMap.utils.GeoUtil - staticka pomocna trida pro geokodovani, html5 geolocation apod.
-  ScukMap.utils.DataUtil - staticka pomocna trida pro parsovani data
-  ScukMap.utils.TextUtil - staticka pomocna trida pro upravy textu

libs - externi knihovny
- infobox.js - pridany callbacky pro autopanovani mapy

  