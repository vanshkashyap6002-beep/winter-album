export type Photograph = { id: string; src: string; alt: string; caption: string; date: string; memory: string; rotation: number; detail?: 'snowflake' | 'tape' | 'none' };
export type ChapterKind = 'beginning'|'warmth'|'little'|'letter'|'christmas'|'newyear'|'winter'|'collection'|'receipt';
export type Chapter = { id: string; kind: ChapterKind; title: string; eyebrow: string; prose: string; note: string; photos: string[] };
export type WinterAlbum = { id: string; title: string; subtitle: string; people: string; season: string; specialPhoto: string; photographs: Photograph[]; chapters: Chapter[]; letter: { greeting: string; body: string; signature: string }; newYearMessage: string };
const records: Omit<Photograph,'id'|'src'>[] = [
 {alt:'A wooden cabin beneath snow-covered mountains',caption:'The first quiet morning',date:'06 DEC 2026',memory:'We arrived with cold hands and a bag full of things we never unpacked. Outside, everything had gone quiet.',rotation:-3,detail:'snowflake'},
 {alt:'A warm cup of coffee beside a winter window',caption:'Yours went cold again',date:'09 DEC 2026',memory:'We kept talking until the coffee went cold. Neither of us minded enough to get up.',rotation:-5,detail:'tape'},
 {alt:'Two people holding hands and walking across the snow',caption:'The long way, together',date:'12 DEC 2026',memory:'You said the shortcut would be quicker. I said we had nowhere else to be.',rotation:4,detail:'snowflake'},
 {alt:'A trail of footprints crossing fresh snow',caption:'No particular destination',date:'14 DEC 2026',memory:'We followed our own footprints home. Your scarf was still in my pocket.',rotation:-4,detail:'none'},
 {alt:'Books and a candle on a wooden windowsill',caption:'One more chapter',date:'18 DEC 2026',memory:'The candle burned lower. You read one page twice because I kept interrupting you.',rotation:3,detail:'tape'},
 {alt:'Hands carefully tying a parcel with natural paper and string',caption:'Things made by hand',date:'21 DEC 2026',memory:'A little paper, some string, and more time than it looked like. That was the whole point.',rotation:5,detail:'none'},
 {alt:'Small presents wrapped in brown paper and ribbon',caption:'The small one was my favourite',date:'25 DEC 2026',memory:'The wrapping was crooked. The note inside was perfect. I kept both.',rotation:-3,detail:'snowflake'},
 {alt:'Two hands holding glowing sparklers after dark',caption:'A light for the year ahead',date:'31 DEC 2026 · 11:59 PM',memory:'We stepped outside before midnight. For a minute, we forgot to count down.',rotation:3,detail:'none'},
 {alt:'A delicate pine branch resting beneath fresh snow',caption:'Winter, in the details',date:'04 JAN 2027',memory:'You stopped to show me the snow on this branch. I would have walked straight past it.',rotation:-3,detail:'snowflake'},
 {alt:'A couple standing hand in hand in a snowy landscape',caption:'This one. Always this one.',date:'07 JAN 2027',memory:'Nothing extraordinary happened. We were simply there, together. I think that is why this is the one I keep coming back to.',rotation:2,detail:'snowflake'},
];
export const winterAlbum: WinterAlbum = {
 id:'winter-2026-27',title:'Beautiful Album',subtitle:'A little collection of us.',people:'Ella & Oliver',season:'WINTER 2026 — 2027',specialPhoto:'photo-10',
 photographs: records.map((p,i)=>({...p,id:`photo-${String(i+1).padStart(2,'0')}`,src:`images/photo-${String(i+1).padStart(2,'0')}.jpg`})),
 chapters:[
 {id:'winter-begins',kind:'beginning',title:'Winter\nbegins.',eyebrow:'THE FIRST COLD DAYS',prose:'The world grew quieter.\nWe found a little more time for each other.',note:'I remember how the air felt.',photos:['photo-01']},
 {id:'warm-moments',kind:'warmth',title:'Cold days.\nWarm moments.',eyebrow:'A LITTLE CLOSER',prose:'The weather was cold.\nThe moments weren’t.',note:'Your hand was always the warmer one.',photos:['photo-02','photo-03']},
 {id:'little-things',kind:'little',title:'Little things.\nEverything.',eyebrow:'THE ORDINARY DAYS',prose:'The things that felt small at the time\nturned out to be the things we kept.',note:'Nothing planned. Nothing missing.',photos:['photo-04','photo-05']},
 {id:'the-letter',kind:'letter',title:'Something\nfor you.',eyebrow:'WORDS, KEPT ON PAPER',prose:'Some things are easier to say\nwhen there is a little paper between us.',note:'Folded twice. Meant forever.',photos:['photo-06']},
 {id:'christmas',kind:'christmas',title:'Christmas,\nwith you.',eyebrow:'CHRISTMAS 2026',prose:'Not the perfect wrapping.\nNot the things inside.\nThe time we made for one another.',note:'Keep the note. Keep the ribbon.',photos:['photo-07']},
 {id:'new-year',kind:'newyear',title:'Another year.\nStill us.',eyebrow:'31 DEC 2026 → 01 JAN 2027',prose:'A new number on the calendar.\nThe same hand to reach for.',note:'Here’s to all the ordinary days ahead.',photos:['photo-08']},
 {id:'winter-we-keep',kind:'winter',title:'The winter\nwe keep.',eyebrow:'AFTER THE CELEBRATIONS',prose:'The lights came down.\nThe good part stayed.',note:'You taught me to notice.',photos:['photo-09']},
 {id:'what-we-keep',kind:'collection',title:'What\nwe keep.',eyebrow:'A FEW THINGS THAT STAY',prose:'Some photographs. A bit of ribbon.\nA hundred small ways of saying:\nI was here with you.',note:'All of it belongs here.',photos:['photo-10','photo-07','photo-02']},
 {id:'receipt',kind:'receipt',title:'The receipt\nof us.',eyebrow:'MADE TOGETHER',prose:'Before we close this book,\none photograph to come back to.',note:'This one was never just mine.',photos:['photo-10']},
 ],
 letter:{greeting:'My favourite person,',body:'I thought I would remember the big things from this winter. The celebrations. The snow. The way the year changed.\n\nBut it is the smaller things that keep finding me. The cup you left by my side. Your coat over the back of my chair. The way you waited when I fell a few steps behind.\n\nThank you for making room for me in your ordinary days. For showing up, even when there was nothing to celebrate.\n\nIf we keep anything from this winter, let it be that. The quiet, everyday choosing of each other.',signature:'Always, Ella'},
 newYearMessage:'More walks without a destination. More late breakfasts. More listening. Not a different life — just a little more of this one, together.',
};
