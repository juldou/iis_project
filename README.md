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

# How to create/drop tables
- check backend/ directory, run recreate_tables against your db 

#What is DONE:
####administrátor:

- spravuje uživatele ✓

- má rovněž práva všech následujících rolí ✓

####operátor:

- vkládá a spravuje provozovny a jejich nabídky ✓ 

- může vkládat obrázky k položkám nabídek 

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
 
#Backend TODO
- rules ✓
