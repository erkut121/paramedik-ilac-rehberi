// drugdatabase.js dosyanızın TAM İÇERİĞİ

const drugDatabase = {
    drugs: [], 
};

// Yedek olarak drugs.json dosyasından veri çekme fonksiyonu
async function fetchInitialDataFromJSON() {
    try {
        const response = await fetch('drugs.json');
        if (!response.ok) {
            throw new Error('drugs.json dosyası yüklenemedi.');
        }
        return await response.json();
    } catch (error) {
        console.error("drugs.json yüklenirken hata:", error);
        return [];
    }
}

// ⭐ KRİTİK DÜZELTME: Veri yükleme fonksiyonu (localStorage'ı önceliklendirir) ⭐
async function loadDrugs() {
    const storedDrugs = localStorage.getItem('drugDatabase');
    
    if (storedDrugs) {
        // 1. localStorage'da güncel veri varsa oradan yükle
        try {
            drugDatabase.drugs = JSON.parse(storedDrugs);
            console.log('İlaç verileri localStorage\'dan yüklendi.');
        } catch (e) {
            // localStorage verisi bozuksa, drugs.json'dan yüklemeye çalış
            console.error('localStorage verisi bozuk. drugs.json dosyasından yükleniyor.', e);
            drugDatabase.drugs = await fetchInitialDataFromJSON();
        }
    } else {
        // 2. localStorage boşsa, drugs.json'dan yükle
        drugDatabase.drugs = await fetchInitialDataFromJSON();
        console.log('İlaç verileri drugs.json dosyasından yüklendi.');
    }
}

// Uygulama başladığında verileri yükle
loadDrugs(); 


/**
 * İlaç listesi üzerinde verilen arama terimine göre filtreleme yapar.
 * @param {string} searchTerm Arama yapılacak metin (örn: "ADR"). 
 * @returns {Array} Filtrelenmiş ilaç nesneleri dizisi.
 */
function searchDrugsByName(searchTerm) {
    if (!searchTerm || searchTerm.length < 2) {
        return []; 
    }

    const normalizedSearchTerm = searchTerm.trim().toUpperCase();

    const filteredDrugs = drugDatabase.drugs.filter(drug => {
        const drugName = drug.name.toUpperCase();
        return drugName.startsWith(normalizedSearchTerm);
    });

    return filteredDrugs;
}

// drugdatabase objesini dışarıya açın (Eğer diğer sayfalarda bu objeye doğrudan erişim gerekiyorsa)
// window.drugDatabase = drugDatabase;