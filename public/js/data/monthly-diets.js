// ---------------------------------------------------------------------------
// Diete mensili: sei impostazioni alimentari complete.
//
// Ognuna definisce una settimana tipo che si ripete per il mese, più la
// ripartizione dei macronutrienti consigliata. Gli alimenti citano i nomi
// ESATTI di foods-base.js: le macro non sono duplicate, si calcolano da lì.
// Un test verifica che ogni riferimento sia risolvibile.
//
// Applicandola, la dieta scrive il piano settimanale e, se vuoi, i target.
// ---------------------------------------------------------------------------

/** pasti: { giorno 1-7: [[slot, nomeAlimento, grammi], ...] } */
export const MONTHLY_DIETS = [
  {
    id: 'mediterranea',
    name: 'Mediterranea',
    claim: 'Verdura, cereali integrali, pesce e olio d’oliva',
    description:
      'L’impostazione più studiata al mondo. Carboidrati integrali come base, pesce ' +
      'due o tre volte a settimana, legumi al posto della carne rossa, olio ' +
      'extravergine come unico grasso da condimento e verdura a ogni pasto.',
    color: ['#3d8bcd', '#2b5f91'],
    icon: '🫒',
    // Ripartizione calorica indicativa: 50% carboidrati, 20% proteine, 30% grassi
    split: { carbs: 50, protein: 20, fat: 30 },
    highlights: ['Pesce 3 volte a settimana', 'Legumi 3 volte', 'Carne rossa una volta'],
    meals: {
      1: [
        ['colazione', 'Fiocchi d’avena', 60], ['colazione', 'Latte parzialmente scremato', 200],
        ['colazione', 'Mela', 150],
        ['pranzo', 'Pasta integrale (c)', 80], ['pranzo', 'Passata di pomodoro', 120],
        ['pranzo', 'Olio extravergine d’oliva', 15], ['pranzo', 'Insalata mista', 100],
        ['cena', 'Merluzzo (c)', 200], ['cena', 'Patate', 200], ['cena', 'Broccoli', 200],
        ['cena', 'Olio extravergine d’oliva', 10], ['spuntino2', 'Mandorle', 25]
      ],
      2: [
        ['colazione', 'Pane integrale', 80], ['colazione', 'Ricotta vaccina', 80],
        ['colazione', 'Miele', 15],
        ['pranzo', 'Farro perlato (c)', 80], ['pranzo', 'Ceci in scatola', 150],
        ['pranzo', 'Pomodorini', 150], ['pranzo', 'Olio extravergine d’oliva', 15],
        ['cena', 'Petto di pollo (c)', 180], ['cena', 'Zucchine', 250],
        ['cena', 'Pane integrale', 50], ['spuntino2', 'Yogurt bianco intero', 125]
      ],
      3: [
        ['colazione', 'Fiocchi d’avena', 60], ['colazione', 'Yogurt greco 0%', 150],
        ['colazione', 'Mirtilli', 80],
        ['pranzo', 'Riso integrale (c)', 80], ['pranzo', 'Gamberi (c)', 150],
        ['pranzo', 'Zucchine', 200], ['pranzo', 'Olio extravergine d’oliva', 15],
        ['cena', 'Lenticchie (c)', 80], ['cena', 'Carote', 150], ['cena', 'Pane integrale', 50],
        ['spuntino2', 'Noci', 25]
      ],
      4: [
        ['colazione', 'Pane integrale', 80], ['colazione', 'Uovo intero', 110],
        ['colazione', 'Arancia', 180],
        ['pranzo', 'Pasta di semola (c)', 80], ['pranzo', 'Pesto', 25],
        ['pranzo', 'Fagiolini', 150],
        ['cena', 'Orata (c)', 220], ['cena', 'Patate', 200], ['cena', 'Spinaci', 200],
        ['cena', 'Olio extravergine d’oliva', 12], ['spuntino2', 'Mela', 150]
      ],
      5: [
        ['colazione', 'Fiocchi d’avena', 60], ['colazione', 'Latte parzialmente scremato', 200],
        ['colazione', 'Banana', 120],
        ['pranzo', 'Cous cous (c)', 80], ['pranzo', 'Tonno in scatola al naturale', 120],
        ['pranzo', 'Peperoni', 150], ['pranzo', 'Olio extravergine d’oliva', 15],
        ['cena', 'Fagioli in scatola', 200], ['cena', 'Verza', 200], ['cena', 'Pane integrale', 60],
        ['spuntino2', 'Yogurt greco 0%', 150]
      ],
      6: [
        ['colazione', 'Pane integrale', 80], ['colazione', 'Ricotta vaccina', 80],
        ['colazione', 'Marmellata', 20],
        ['pranzo', 'Riso bianco (c)', 80], ['pranzo', 'Cozze (c)', 200],
        ['pranzo', 'Pomodorini', 150], ['pranzo', 'Olio extravergine d’oliva', 15],
        ['cena', 'Manzo magro (c)', 150], ['cena', 'Insalata mista', 150],
        ['cena', 'Patate', 200], ['spuntino2', 'Nocciole', 25]
      ],
      7: [
        ['colazione', 'Cornetto', 60], ['colazione', 'Caffè con latte', 150],
        ['pranzo', 'Pasta al ragù', 300], ['pranzo', 'Insalata mista', 100],
        ['cena', 'Frittata di zucchine', 200], ['cena', 'Pane integrale', 60],
        ['spuntino2', 'Uva', 150]
      ]
    }
  },

  {
    id: 'vegetariana',
    name: 'Vegetariana',
    claim: 'Legumi, uova e latticini al posto di carne e pesce',
    description:
      'Nessuna carne né pesce. Le proteine arrivano da legumi, uova, latticini, ' +
      'tofu e tempeh, abbinati a cereali per completare gli aminoacidi. Attenzione ' +
      'a ferro e vitamina B12: la vitamina C dei vegetali aiuta ad assorbire il ferro.',
    color: ['#4faa63', '#2f7845'],
    split: { carbs: 50, protein: 20, fat: 30 },
    icon: '🥬',
    highlights: ['Legumi ogni giorno', 'Uova 4 a settimana', 'Cereali integrali'],
    meals: {
      1: [
        ['colazione', 'Fiocchi d’avena', 60], ['colazione', 'Latte parzialmente scremato', 200],
        ['colazione', 'Banana', 120],
        ['pranzo', 'Pasta di legumi (c)', 80], ['pranzo', 'Passata di pomodoro', 120],
        ['pranzo', 'Olio extravergine d’oliva', 15], ['pranzo', 'Rucola', 50],
        ['cena', 'Tofu', 200], ['cena', 'Broccoli', 250], ['cena', 'Pane integrale', 60],
        ['spuntino2', 'Mandorle', 25]
      ],
      2: [
        ['colazione', 'Yogurt greco 0%', 200], ['colazione', 'Fiocchi d’avena', 40],
        ['colazione', 'Fragole', 120],
        ['pranzo', 'Quinoa (c)', 80], ['pranzo', 'Ceci in scatola', 200],
        ['pranzo', 'Spinaci', 150], ['pranzo', 'Olio extravergine d’oliva', 15],
        ['cena', 'Uovo intero', 165], ['cena', 'Patate', 200], ['cena', 'Asparagi', 150],
        ['spuntino2', 'Noci', 25]
      ],
      3: [
        ['colazione', 'Pane integrale', 80], ['colazione', 'Formaggio spalmabile', 40],
        ['colazione', 'Kiwi', 90],
        ['pranzo', 'Riso integrale (c)', 80], ['pranzo', 'Lenticchie (c)', 60],
        ['pranzo', 'Carote', 150], ['pranzo', 'Olio extravergine d’oliva', 15],
        ['cena', 'Mozzarella light', 125], ['cena', 'Pomodoro', 200],
        ['cena', 'Pane integrale', 60], ['spuntino2', 'Yogurt bianco intero', 125]
      ],
      4: [
        ['colazione', 'Fiocchi d’avena', 60], ['colazione', 'Latte di soia non zuccherato', 200],
        ['colazione', 'Mela', 150],
        ['pranzo', 'Farro perlato (c)', 80], ['pranzo', 'Fagioli in scatola', 200],
        ['pranzo', 'Zucchine', 200], ['pranzo', 'Olio extravergine d’oliva', 15],
        ['cena', 'Tempeh', 150], ['cena', 'Cavolfiore', 250], ['cena', 'Patate dolci', 150],
        ['spuntino2', 'Semi di zucca', 25]
      ],
      5: [
        ['colazione', 'Pane integrale', 80], ['colazione', 'Ricotta vaccina', 100],
        ['colazione', 'Miele', 15],
        ['pranzo', 'Pasta integrale (c)', 80], ['pranzo', 'Piselli freschi', 150],
        ['pranzo', 'Parmigiano Reggiano', 20], ['pranzo', 'Olio extravergine d’oliva', 15],
        ['cena', 'Uovo intero', 110], ['cena', 'Spinaci', 250], ['cena', 'Pane integrale', 60],
        ['spuntino2', 'Mandorle', 25]
      ],
      6: [
        ['colazione', 'Yogurt greco 0%', 200], ['colazione', 'Muesli', 50],
        ['colazione', 'Mirtilli', 80],
        ['pranzo', 'Riso bianco (c)', 80], ['pranzo', 'Edamame', 150],
        ['pranzo', 'Carote', 150], ['pranzo', 'Olio di semi', 12],
        ['cena', 'Parmigiana di melanzane', 250], ['cena', 'Insalata mista', 100],
        ['spuntino2', 'Nocciole', 25]
      ],
      7: [
        ['colazione', 'Pancake classici', 150], ['colazione', 'Caffè con latte', 150],
        ['pranzo', 'Risotto ai funghi', 300], ['pranzo', 'Insalata mista', 100],
        ['cena', 'Sformato di verdure', 250], ['cena', 'Ricotta vaccina', 60],
        ['cena', 'Pane integrale', 60],
        ['spuntino2', 'Pera', 150]
      ]
    }
  },

  {
    id: 'proteica',
    name: 'Proteica',
    claim: 'Proteine alte per mantenere la massa magra in deficit',
    description:
      'Pensata per chi si allena o è in deficit calorico: circa 2 g di proteine per ' +
      'chilo di peso, carboidrati concentrati attorno all’allenamento, grassi ' +
      'moderati. In deficit le proteine alte proteggono la massa magra e saziano di più.',
    color: ['#c9543f', '#9a3a2a'],
    split: { carbs: 35, protein: 35, fat: 30 },
    icon: '🍗',
    highlights: ['~2 g proteine per kg', 'Fonti magre', 'Carboidrati sui pasti principali'],
    meals: {
      1: [
        ['colazione', 'Albume', 200], ['colazione', 'Uovo intero', 55],
        ['colazione', 'Fiocchi d’avena', 60], ['colazione', 'Mirtilli', 80],
        ['pranzo', 'Petto di pollo (c)', 200], ['pranzo', 'Riso basmati (c)', 80],
        ['pranzo', 'Broccoli', 200], ['pranzo', 'Olio extravergine d’oliva', 12],
        ['cena', 'Merluzzo (c)', 250], ['cena', 'Patate dolci', 200], ['cena', 'Spinaci', 200],
        ['spuntino2', 'Yogurt greco 0%', 200]
      ],
      2: [
        ['colazione', 'Yogurt greco 0%', 250], ['colazione', 'Proteine whey in polvere', 20],
        ['colazione', 'Fiocchi d’avena', 50],
        ['pranzo', 'Manzo magro (c)', 180], ['pranzo', 'Pasta integrale (c)', 80],
        ['pranzo', 'Zucchine', 200], ['pranzo', 'Olio extravergine d’oliva', 12],
        ['cena', 'Salmone (c)', 180], ['cena', 'Quinoa (c)', 60], ['cena', 'Asparagi', 200],
        ['spuntino2', 'Fiocchi di latte', 150]
      ],
      3: [
        ['colazione', 'Uovo intero', 165], ['colazione', 'Pane integrale', 80],
        ['colazione', 'Avocado', 50],
        ['pranzo', 'Petto di tacchino (c)', 200], ['pranzo', 'Riso integrale (c)', 80],
        ['pranzo', 'Peperoni', 200],
        ['cena', 'Gamberi (c)', 250], ['cena', 'Patate', 200], ['cena', 'Insalata mista', 150],
        ['cena', 'Olio extravergine d’oliva', 12], ['spuntino2', 'Skyr', 150]
      ],
      4: [
        ['colazione', 'Albume', 200], ['colazione', 'Fiocchi d’avena', 60],
        ['colazione', 'Banana', 120],
        ['pranzo', 'Petto di pollo (c)', 200], ['pranzo', 'Cous cous (c)', 80],
        ['pranzo', 'Verdure grigliate miste', 200],
        ['cena', 'Tonno fresco (c)', 200], ['cena', 'Fagioli in scatola', 150],
        ['cena', 'Rucola', 60], ['cena', 'Olio extravergine d’oliva', 12],
        ['spuntino2', 'Yogurt greco 0%', 200]
      ],
      5: [
        ['colazione', 'Yogurt greco 0%', 250], ['colazione', 'Semi di chia', 15],
        ['colazione', 'Fragole', 120],
        ['pranzo', 'Manzo magro (c)', 180], ['pranzo', 'Patate', 300],
        ['pranzo', 'Fagiolini', 200], ['pranzo', 'Olio extravergine d’oliva', 12],
        ['cena', 'Merluzzo (c)', 250], ['cena', 'Riso basmati (c)', 60],
        ['cena', 'Broccoli', 200], ['spuntino2', 'Proteine whey in polvere', 30]
      ],
      6: [
        ['colazione', 'Uovo intero', 165], ['colazione', 'Bresaola', 50],
        ['colazione', 'Pane integrale', 80],
        ['pranzo', 'Petto di pollo (c)', 200], ['pranzo', 'Pasta di legumi (c)', 80],
        ['pranzo', 'Pomodorini', 150], ['pranzo', 'Olio extravergine d’oliva', 12],
        ['cena', 'Salmone (c)', 180], ['cena', 'Patate dolci', 200], ['cena', 'Spinaci', 200],
        ['spuntino2', 'Fiocchi di latte', 150]
      ],
      7: [
        ['colazione', 'Pancake proteici', 150], ['colazione', 'Caffè espresso', 30],
        ['pranzo', 'Tagliata di manzo', 200], ['pranzo', 'Patate al forno', 200],
        ['pranzo', 'Insalata mista', 150],
        ['cena', 'Omelette al formaggio', 200], ['cena', 'Pane integrale', 60],
        ['spuntino2', 'Yogurt greco 0%', 200]
      ]
    }
  },

  {
    id: 'vegana',
    name: 'Vegana',
    claim: 'Solo vegetali: legumi, cereali, frutta secca e semi',
    description:
      'Nessun prodotto di origine animale. Le proteine arrivano da legumi, tofu, ' +
      'tempeh e seitan, abbinati ai cereali per completare gli aminoacidi. ' +
      'La vitamina B12 va integrata: non esiste in forma affidabile nei vegetali. ' +
      'Semi di lino e noci coprono gli omega-3.',
    color: ['#3fae86', '#26775a'],
    icon: '🌱',
    split: { carbs: 50, protein: 18, fat: 32 },
    highlights: ['Legumi ogni giorno', 'B12 da integrare', 'Semi e frutta secca'],
    meals: {
      1: [
        ['colazione', 'Fiocchi d’avena', 70], ['colazione', 'Latte di soia non zuccherato', 250],
        ['colazione', 'Banana', 120], ['colazione', 'Semi di chia', 15],
        ['pranzo', 'Pasta di legumi (c)', 90], ['pranzo', 'Passata di pomodoro', 150],
        ['pranzo', 'Olio extravergine d’oliva', 15], ['pranzo', 'Rucola', 50],
        ['cena', 'Tofu', 200], ['cena', 'Broccoli', 250], ['cena', 'Patate', 200],
        ['cena', 'Olio extravergine d’oliva', 12], ['spuntino2', 'Mandorle', 30]
      ],
      2: [
        ['colazione', 'Pane integrale', 90], ['colazione', 'Burro di arachidi', 25],
        ['colazione', 'Mela', 150],
        ['pranzo', 'Quinoa (c)', 90], ['pranzo', 'Ceci in scatola', 200],
        ['pranzo', 'Spinaci', 150], ['pranzo', 'Olio extravergine d’oliva', 15],
        ['cena', 'Tempeh', 180], ['cena', 'Cavolfiore', 250], ['cena', 'Patate dolci', 200],
        ['cena', 'Olio extravergine d’oliva', 12], ['spuntino2', 'Noci', 30]
      ],
      3: [
        ['colazione', 'Fiocchi d’avena', 70], ['colazione', 'Latte di avena', 250],
        ['colazione', 'Mirtilli', 100], ['colazione', 'Semi di lino', 15],
        ['pranzo', 'Riso integrale (c)', 90], ['pranzo', 'Lenticchie (c)', 70],
        ['pranzo', 'Carote', 150], ['pranzo', 'Olio extravergine d’oliva', 15],
        ['cena', 'Seitan', 180], ['cena', 'Peperoni', 250], ['cena', 'Pane integrale', 60],
        ['cena', 'Olio extravergine d’oliva', 12],
        ['spuntino2', 'Hummus', 60], ['spuntino2', 'Cetriolo', 150]
      ],
      4: [
        ['colazione', 'Pane integrale', 90], ['colazione', 'Hummus', 60],
        ['colazione', 'Pomodorini', 120],
        ['pranzo', 'Farro perlato (c)', 90], ['pranzo', 'Fagioli in scatola', 200],
        ['pranzo', 'Zucchine', 200], ['pranzo', 'Olio extravergine d’oliva', 15],
        ['cena', 'Tofu affumicato', 180], ['cena', 'Spinaci', 250], ['cena', 'Patate', 200],
        ['cena', 'Olio extravergine d’oliva', 12], ['spuntino2', 'Nocciole', 30]
      ],
      5: [
        ['colazione', 'Fiocchi d’avena', 70], ['colazione', 'Latte di soia non zuccherato', 250],
        ['colazione', 'Fragole', 120], ['colazione', 'Semi di zucca', 20],
        ['pranzo', 'Cous cous (c)', 90], ['pranzo', 'Edamame', 150],
        ['pranzo', 'Peperoni', 150], ['pranzo', 'Olio extravergine d’oliva', 15],
        ['cena', 'Lenticchie (c)', 90], ['cena', 'Cavolo nero', 200],
        ['cena', 'Pane integrale', 60], ['cena', 'Olio extravergine d’oliva', 12],
        ['spuntino2', 'Mandorle', 30]
      ],
      6: [
        ['colazione', 'Pane integrale', 90], ['colazione', 'Burro di arachidi', 25],
        ['colazione', 'Banana', 120],
        ['pranzo', 'Pasta integrale (c)', 90], ['pranzo', 'Funghi champignon', 200],
        ['pranzo', 'Lievito alimentare', 10], ['pranzo', 'Olio extravergine d’oliva', 15],
        ['cena', 'Tempeh', 180], ['cena', 'Zucca', 250], ['cena', 'Quinoa (c)', 60],
        ['cena', 'Olio extravergine d’oliva', 12], ['spuntino2', 'Noci', 30]
      ],
      7: [
        ['colazione', 'Fiocchi d’avena', 70], ['colazione', 'Latte di mandorla non zuccherato', 250],
        ['colazione', 'Mela', 150], ['colazione', 'Semi di chia', 15],
        ['pranzo', 'Riso integrale (c)', 90], ['pranzo', 'Fagioli borlotti (c)', 70],
        ['pranzo', 'Insalata mista', 100], ['pranzo', 'Olio extravergine d’oliva', 15],
        ['cena', 'Tofu', 200], ['cena', 'Melanzane', 250], ['cena', 'Patate', 200],
        ['cena', 'Olio extravergine d’oliva', 12],
        ['spuntino2', 'Cioccolato fondente 70%', 25]
      ]
    }
  },

  {
    id: 'chetogenica',
    name: 'Chetogenica',
    claim: 'Carboidrati quasi azzerati, grassi come fonte principale',
    description:
      'Carboidrati sotto il 10% delle calorie: niente pane, pasta, riso, patate, ' +
      'legumi e frutta zuccherina. L’energia viene dai grassi, le proteine restano ' +
      'moderate. È un’impostazione impegnativa e non adatta a tutti: parlane con ' +
      'un medico prima di seguirla a lungo, specie se assumi farmaci.',
    color: ['#8a5cd6', '#5f3ea3'],
    icon: '🥑',
    split: { carbs: 8, protein: 22, fat: 70 },
    highlights: ['Sotto i 50 g di carboidrati', 'Verdure a foglia', 'Niente cereali né legumi'],
    meals: {
      1: [
        ['colazione', 'Uovo intero', 165], ['colazione', 'Avocado', 100], ['colazione', 'Burro', 10],
        ['pranzo', 'Petto di pollo (c)', 200], ['pranzo', 'Spinaci', 200],
        ['pranzo', 'Olio extravergine d’oliva', 25], ['pranzo', 'Parmigiano Reggiano', 25],
        ['cena', 'Salmone (c)', 200], ['cena', 'Broccoli', 200],
        ['cena', 'Olio extravergine d’oliva', 20], ['spuntino2', 'Noci', 40]
      ],
      2: [
        ['colazione', 'Uovo intero', 110], ['colazione', 'Pancetta', 40],
        ['colazione', 'Avocado', 80],
        ['pranzo', 'Manzo magro (c)', 180], ['pranzo', 'Zucchine', 200],
        ['pranzo', 'Olio extravergine d’oliva', 25],
        ['cena', 'Sgombro (c)', 180], ['cena', 'Cavolfiore', 250], ['cena', 'Burro', 15],
        ['spuntino2', 'Mandorle', 40]
      ],
      3: [
        ['colazione', 'Yogurt greco intero', 170], ['colazione', 'Semi di chia', 20],
        ['colazione', 'Noci', 25],
        ['pranzo', 'Petto di pollo (c)', 200], ['pranzo', 'Insalata mista', 100],
        ['pranzo', 'Olive nere', 50], ['pranzo', 'Olio extravergine d’oliva', 25],
        ['cena', 'Uovo intero', 165], ['cena', 'Spinaci', 250],
        ['cena', 'Parmigiano Reggiano', 30], ['cena', 'Burro', 12],
        ['spuntino2', 'Cioccolato fondente 85%', 30]
      ],
      4: [
        ['colazione', 'Uovo intero', 165], ['colazione', 'Formaggio spalmabile', 40],
        ['colazione', 'Avocado', 80],
        ['pranzo', 'Tonno in scatola sott’olio', 160], ['pranzo', 'Rucola', 60],
        ['pranzo', 'Mozzarella di bufala', 100], ['pranzo', 'Olio extravergine d’oliva', 20],
        ['cena', 'Salsiccia', 150], ['cena', 'Cavolo nero', 200],
        ['cena', 'Olio extravergine d’oliva', 20], ['spuntino2', 'Noci macadamia', 35]
      ],
      5: [
        ['colazione', 'Uovo intero', 110], ['colazione', 'Bresaola', 60],
        ['colazione', 'Burro', 10], ['colazione', 'Avocado', 80],
        ['pranzo', 'Salmone (c)', 200], ['pranzo', 'Zucchine', 200],
        ['pranzo', 'Olio extravergine d’oliva', 25],
        ['cena', 'Manzo magro (c)', 180], ['cena', 'Broccoli', 200],
        ['cena', 'Gorgonzola', 40], ['cena', 'Olio extravergine d’oliva', 15],
        ['spuntino2', 'Mandorle', 40]
      ],
      6: [
        ['colazione', 'Uovo intero', 165], ['colazione', 'Pancetta', 40],
        ['colazione', 'Funghi champignon', 150], ['colazione', 'Burro', 12],
        ['pranzo', 'Petto di tacchino (c)', 200], ['pranzo', 'Cetriolo', 150],
        ['pranzo', 'Feta', 80], ['pranzo', 'Olio extravergine d’oliva', 25],
        ['cena', 'Orata (c)', 220], ['cena', 'Melanzane', 200],
        ['cena', 'Olio extravergine d’oliva', 25], ['spuntino2', 'Noci', 40]
      ],
      7: [
        ['colazione', 'Uovo intero', 165], ['colazione', 'Avocado', 100],
        ['colazione', 'Salmone affumicato', 60],
        ['pranzo', 'Costine di maiale', 180], ['pranzo', 'Cavolfiore', 250],
        ['pranzo', 'Burro', 15],
        ['cena', 'Gamberi (c)', 200], ['cena', 'Zucchine', 200],
        ['cena', 'Olio extravergine d’oliva', 25], ['cena', 'Parmigiano Reggiano', 25],
        ['spuntino2', 'Mascarpone', 50], ['spuntino2', 'Mirtilli', 50]
      ]
    }
  },

  {
    id: 'low-carb',
    name: 'Low carb',
    claim: 'Meno carboidrati, più proteine: senza gli estremi della chetogenica',
    description:
      'Carboidrati ridotti a circa un quarto delle calorie, non azzerati: restano ' +
      'una porzione di frutta, qualche legume e piccole quantità di cereali integrali. ' +
      'Proteine alte per la sazietà e la massa magra. Più sostenibile della ' +
      'chetogenica e adatta a chi si allena.',
    color: ['#e0913a', '#b06a20'],
    icon: '🥩',
    split: { carbs: 22, protein: 32, fat: 46 },
    highlights: ['Carboidrati ~20%', 'Proteine a ogni pasto', 'Frutta una volta al giorno'],
    meals: {
      1: [
        ['colazione', 'Uovo intero', 165], ['colazione', 'Pane integrale', 40],
        ['colazione', 'Avocado', 60],
        ['pranzo', 'Petto di pollo (c)', 200], ['pranzo', 'Insalata mista', 150],
        ['pranzo', 'Pomodorini', 150], ['pranzo', 'Olio extravergine d’oliva', 20],
        ['cena', 'Merluzzo (c)', 220], ['cena', 'Broccoli', 250], ['cena', 'Patate', 100],
        ['cena', 'Olio extravergine d’oliva', 15],
        ['spuntino1', 'Mela', 150],
        ['spuntino2', 'Yogurt greco 0%', 170], ['spuntino2', 'Mandorle', 20]
      ],
      2: [
        ['colazione', 'Yogurt greco 0%', 200], ['colazione', 'Semi di chia', 15],
        ['colazione', 'Mirtilli', 80],
        ['pranzo', 'Manzo magro (c)', 180], ['pranzo', 'Zucchine', 250],
        ['pranzo', 'Olio extravergine d’oliva', 20],
        ['pranzo', 'Pane integrale', 50],
        ['cena', 'Salmone (c)', 180], ['cena', 'Cavolfiore', 250],
        ['cena', 'Olio extravergine d’oliva', 15],
        ['spuntino1', 'Arancia', 180], ['spuntino2', 'Noci', 25]
      ],
      3: [
        ['colazione', 'Uovo intero', 110], ['colazione', 'Albume', 100],
        ['colazione', 'Pane integrale', 40], ['colazione', 'Pomodoro', 100],
        ['pranzo', 'Petto di tacchino (c)', 200], ['pranzo', 'Ceci in scatola', 120],
        ['pranzo', 'Spinaci', 150], ['pranzo', 'Olio extravergine d’oliva', 20],
        ['cena', 'Gamberi (c)', 220], ['cena', 'Zucchine', 250], ['cena', 'Patate', 150],
        ['cena', 'Olio extravergine d’oliva', 15], ['spuntino2', 'Fiocchi di latte', 150]
      ],
      4: [
        ['colazione', 'Yogurt greco 0%', 200], ['colazione', 'Burro di arachidi', 20],
        ['colazione', 'Mela', 120],
        ['pranzo', 'Petto di pollo (c)', 200], ['pranzo', 'Melanzane', 250],
        ['pranzo', 'Pane integrale', 50], ['pranzo', 'Olio extravergine d’oliva', 20],
        ['cena', 'Uovo intero', 165], ['cena', 'Spinaci', 250], ['cena', 'Feta', 60],
        ['cena', 'Olio extravergine d’oliva', 12], ['spuntino2', 'Mandorle', 25]
      ],
      5: [
        ['colazione', 'Uovo intero', 165], ['colazione', 'Avocado', 70],
        ['colazione', 'Pane integrale', 40],
        ['pranzo', 'Tonno in scatola al naturale', 160], ['pranzo', 'Fagioli in scatola', 120],
        ['pranzo', 'Rucola', 60], ['pranzo', 'Olio extravergine d’oliva', 20],
        ['cena', 'Orata (c)', 220], ['cena', 'Cavolo nero', 200], ['cena', 'Patate', 100],
        ['cena', 'Olio extravergine d’oliva', 15],
        ['spuntino1', 'Banana', 100], ['spuntino2', 'Yogurt greco 0%', 170]
      ],
      6: [
        ['colazione', 'Yogurt greco intero', 170], ['colazione', 'Noci', 25],
        ['colazione', 'Fragole', 100],
        ['pranzo', 'Manzo magro (c)', 180], ['pranzo', 'Insalata mista', 150],
        ['pranzo', 'Olive nere', 40], ['pranzo', 'Pane integrale', 50],
        ['pranzo', 'Olio extravergine d’oliva', 20],
        ['cena', 'Merluzzo (c)', 220], ['cena', 'Zucchine', 250],
        ['cena', 'Olio extravergine d’oliva', 15], ['spuntino2', 'Bresaola', 50]
      ],
      7: [
        ['colazione', 'Uovo intero', 165], ['colazione', 'Bresaola', 50],
        ['colazione', 'Pomodorini', 120],
        ['pranzo', 'Petto di pollo (c)', 200], ['pranzo', 'Quinoa (c)', 50],
        ['pranzo', 'Broccoli', 200], ['pranzo', 'Olio extravergine d’oliva', 20],
        ['cena', 'Salmone (c)', 180], ['cena', 'Insalata mista', 150],
        ['cena', 'Avocado', 70], ['cena', 'Patate dolci', 150],
        ['cena', 'Olio extravergine d’oliva', 12], ['spuntino2', 'Mandorle', 25]
      ]
    }
  }
];

/**
 * Foto delle diete: risolte con scripts/fetch-pexels.mjs, come per le idee.
 *   { id: { url, credit } }
 */
export const DIET_PHOTOS = {
  'chetogenica': { url: 'https://images.pexels.com/photos/1305063/pexels-photo-1305063.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Jenna Hamra / Pexels" },
  'low-carb': { url: 'https://images.pexels.com/photos/20272476/pexels-photo-20272476.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Aida Shukuhi / Pexels" },
  'mediterranea': { url: 'https://images.pexels.com/photos/27177296/pexels-photo-27177296.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Helena Lopes / Pexels" },
  'proteica': { url: 'https://images.pexels.com/photos/4488336/pexels-photo-4488336.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Mateusz Dach / Pexels" },
  'vegana': { url: 'https://images.pexels.com/photos/6805782/pexels-photo-6805782.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "cottonbro studio / Pexels" },
  'vegetariana': { url: 'https://images.pexels.com/photos/37787857/pexels-photo-37787857.jpeg?auto=compress&cs=tinysrgb&h=350', credit: "Valentin Ivantsov / Pexels" }
};

export const DIET_COUNT = MONTHLY_DIETS.length;
