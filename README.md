# Run postgres DB in docker
1. install docker
2. run `docker run --name postgres-iis -e POSTGRES_DB=food_delivery -e POSTGRES_USER=postgres_iis -e POSTGRES_PASSWORD=secret123 -d -p 5432:5432 postgres`

# How to build and run server
```
go build -o server .
./server serve
```

# run server in background
`nohup ./server serve &`
- logs are in nohup.out
- you can consume logs by `tailf -f nohup.out`
- check ports `lsof -iTCP -sTCP:LISTEN`

# How to create/drop tables
- check backend/ directory, run recreate_tables against your db 

#What is DONE:
####administrátor:

- spravuje uživatele ✓

- má rovněž práva všech následujících rolí ✓

####operátor:

- vkládá a spravuje provozovny a jejich nabídky ✓ 

- může vkládat obrázky k položkám nabídek ✓

- ukončuje objednávky pro daný den 

- sestavuje plán řidičů (přiřazení objednávek), kteří provedou vyzvednutí a rozvoz jídel ✓  

- má rovněž práva strávníka ✓

####řidič:

- vyřizuje objednávky (přebírá objednávky, vyzvedává a rozváží jídlo) ✓

- má rovněž práva strávníka ✓

####strávník:

- objednává 1 až n jídel (zvolte vhodné omezení - např. počet jídel, případně vyžadovaná úhrada do uzávěrky objednávek - kontroluje a případně schvaluje/ruší operátor)

- sleduje stav jeho objednávek (přijetí, potvrzení, rozvoz, ...) ✓

- má rovněž práva (a, b) neregistrovaného návštěvníka ✓

####neregistrovaný návštěvník:

- (a) má možnost procházet jídelní lístky jednotlivých provozoven a sledovat aktuální nabídky (položky denního menu mohou být vyprodané)  

- (b) má možnost filtrovat položky nabídek dle různých vlastností (např. bezlepkové, veganské apod.) ✓

- může provést objednání jídla bez registrace: vyžadujte vhodné údaje (má možnost dokončit registraci a stát se strávníkem) 

- Každý registrovaný uživatel má možnost editovat svůj profil. ✓  
 
#FRONTEND TODO
- rules ✓

Poznamky zo skusania frontendu
TODO
- pridat viac dat 
- operator vie zmenit is_soldout ✓
- nahratie fotky ✓
- logout pri 401
- dat forbidden 403 ked robis nejaky malicious request (nemalo by sa to stavat, ale ked to niekto bude hackovat tak sa moze stat)
- available pri menu - zmenil by som to na lepsi popis   
- ked je v tom filtry na jedla oznacene to tlacitko, tak lepsie ho vyznacit lebo teraz neviem ci je ten filter oznaceny alebo nie
- pridat do orders k tomu emailu aby bolo jasne ze su to kuriery, takisto k tomu stavu ze je to stav✓
- to klikanie na navbar, aby to tam nebolo v tom hnusnom stvorci
- klikanie na items restauracie (a nielen na to), aby sa nepodciarkoval ten text a aby sa nezvyraznovalo tou modrou farbou (mozno by to mohlo dobre vypadat s nejakou jemne jemne sivou)
- pridat k cene ze aka penazna mena
- pridat nahratie fotky pre menu ponuku ✓
- nemiesat anglictinu so slovencinou
- ked vymazem z permament menu tak tam ostane taky prazdny itemlist
- pridat viac info k tej order, takisto k users
- JANI: doriesit to imagePreviewUrl ✓
- Wrong username or password - upravit to
- upravit v menu tu hlasku ze ked tam nie je ziadne menu