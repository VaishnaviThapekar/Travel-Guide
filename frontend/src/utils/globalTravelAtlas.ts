/**
 * Global Travel Atlas & Intelligent Photo Engine
 * High-resolution curated photography and travel intelligence for 30+ destinations and global travel hubs.
 */

export type CountryMetadata = {
    name: string;
    region: string;
    currency: { code: string; symbol: string; rateToInr: number };
    emergency: { general: string; police: string; ambulance: string; fire?: string; tourist?: string };
    etiquette: {
        dress: string;
        tipping: string;
        commute: string;
        water: string;
        plugs: string;
    };
    suggestions: string[];
    heroImage: string;
    gallery: string[];
};

export const GLOBAL_TRAVEL_ATLAS: Record<string, CountryMetadata> = {
    "switzerland": {
        "name": "Switzerland",
        "region": "Central Europe",
        "currency": {
            "code": "CHF",
            "symbol": "CHF",
            "rateToInr": 97.5
        },
        "emergency": {
            "general": "112",
            "police": "117",
            "ambulance": "144",
            "fire": "118"
        },
        "etiquette": {
            "dress": "Smart casual; sturdy weather-proof layers and alpine walking shoes are essential.",
            "tipping": "Service is included in bills; rounding up to the nearest 5-10 CHF for good service is customary.",
            "commute": "SBB trains depart precisely on the minute; get a Swiss Travel Pass for seamless transfers.",
            "water": "Tap water from municipal taps and mountain fountains is pristine, clean Alpine drinking water.",
            "plugs": "230V, 50Hz, Type J (three round pins) and Type C."
        },
        "heroImage": "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Interlaken lakeshore and Harder Kulm panorama",
            "Jungfraujoch Top of Europe glacier expedition",
            "Lucerne Chapel Bridge and Old Town walk",
            "Lake Geneva promenade and Chillon Castle",
            "Zermatt village and Matterhorn viewpoint",
            "Zurich Altstadt cobblestone historic trail",
            "Grindelwald First cliff walk and alpine meadows",
            "Bern UNESCO medieval clock tower and river loop"
        ]
    },
    "japan": {
        "name": "Japan",
        "region": "East Asia",
        "currency": {
            "code": "JPY",
            "symbol": "¥",
            "rateToInr": 0.58
        },
        "emergency": {
            "general": "110",
            "police": "110",
            "ambulance": "119",
            "fire": "119"
        },
        "etiquette": {
            "dress": "Neat and modest; slip-on shoes recommended as shoes are removed at shrines and ryokans.",
            "tipping": "No tipping culture; exceptional service is standard and leaving tips can cause confusion.",
            "commute": "Queue in designated rail car lines; silence phone calls inside trains and subways.",
            "water": "Tap water is safe, high quality, and drinkable across all prefectures.",
            "plugs": "100V, 50/60Hz, Type A and Type B two-pin ungrounded plugs."
        },
        "heroImage": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Senso-ji Temple and historic Asakusa streets",
            "Shibuya Crossing and Meiji Shrine tranquil forest",
            "Fushimi Inari thousand vermillion torii gates",
            "Arashiyama Bamboo Grove and monkey park",
            "Tsukiji Outer Market morning street food trail",
            "Akihabara tech and Gion historic geisha district",
            "Dotonbori neon canal food walk in Osaka",
            "Nara deer park and Todai-ji Giant Buddha temple"
        ]
    },
    "france": {
        "name": "France",
        "region": "Western Europe",
        "currency": {
            "code": "EUR",
            "symbol": "€",
            "rateToInr": 92.5
        },
        "emergency": {
            "general": "112",
            "police": "17",
            "ambulance": "15",
            "fire": "18"
        },
        "etiquette": {
            "dress": "Chic, tailored everyday style; avoid sportswear outside fitness settings.",
            "tipping": "Service compris (included by law); leaving 1-2€ on coffee or 5-10% at fine dining is polite.",
            "commute": "Always greet shopkeepers and conductors with 'Bonjour'; validate metro tickets at turnstiles.",
            "water": "Tap water ('carafe d'eau') is safe, regulated, and provided free in all cafes and bistros.",
            "plugs": "230V, 50Hz, Type C and Type E."
        },
        "heroImage": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1471623817296-aa07ae5c9f47?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Eiffel Tower and Champ de Mars viewpoint",
            "Louvre Museum masterpieces and Tuileries garden",
            "Montmartre hilltop and Sacre-Coeur basilica",
            "Seine river sunset cruise past Notre-Dame",
            "Le Marais historic mansions and trendy boutiques",
            "Palace of Versailles royal gardens day trip",
            "Musee d'Orsay Impressionist collection",
            "Latin Quarter bookshops and Luxembourg Gardens"
        ]
    },
    "italy": {
        "name": "Italy",
        "region": "Southern Europe",
        "currency": {
            "code": "EUR",
            "symbol": "€",
            "rateToInr": 92.5
        },
        "emergency": {
            "general": "112",
            "police": "113",
            "ambulance": "118",
            "fire": "115"
        },
        "etiquette": {
            "dress": "Smart attire; shoulders and knees must be covered inside basilicas like St. Peter's.",
            "tipping": "'Coperto' (cover charge) is common on bills; extra tip of 5-10% is appreciated for good table service.",
            "commute": "Validate train & bus tickets in yellow stamp machines before boarding to avoid spot fines.",
            "water": "Safe tap water; historic street fountains ('nasoni') across Rome and Italian squares supply fresh drinking water.",
            "plugs": "230V, 50Hz, Type C, F, and L."
        },
        "heroImage": "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Colosseum and ancient Roman Forum exploration",
            "Vatican Museums and Sistine Chapel frescoes",
            "Trevi Fountain and Spanish Steps evening stroll",
            "Florence Duomo and Uffizi Gallery Renaissance tour",
            "Venice Grand Canal vaporetto ride and St. Mark's Square",
            "Trastevere cobblestone lanes and artisan food crawl",
            "Ponte Vecchio sunset and Piazzale Michelangelo viewpoint",
            "Amalfi Coast clifftop coastal walk day trip"
        ]
    },
    "united states": {
        "name": "United States",
        "region": "North America",
        "currency": {
            "code": "USD",
            "symbol": "$",
            "rateToInr": 86.8
        },
        "emergency": {
            "general": "911",
            "police": "911",
            "ambulance": "911",
            "fire": "911"
        },
        "etiquette": {
            "dress": "Casual to smart-casual depending on venue; layered clothing for variable climates.",
            "tipping": "Standard tipping is 18-22% at restaurants, $1-2 per drink at bars, and $2-5 per bag for porters.",
            "commute": "Subway and ride-shares (Uber/Lyft) dominate cities; renting a car is best for national parks.",
            "water": "Tap water is universally potable and safe in all standard hotels and cities.",
            "plugs": "120V, 60Hz, Type A and Type B plugs."
        },
        "heroImage": "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Central Park walking loop and Bethesda Terrace",
            "Statue of Liberty and Ellis Island ferry cruise",
            "Times Square neon lights and Broadway theatre district",
            "High Line elevated park and Chelsea Market food crawl",
            "Brooklyn Bridge crossing and DUMBO skyline photography",
            "Metropolitan Museum of Art (The Met) grand galleries",
            "Grand Canyon South Rim panoramic viewpoints",
            "Golden Gate Bridge and Fisherman's Wharf in San Francisco"
        ]
    },
    "united kingdom": {
        "name": "United Kingdom",
        "region": "Western Europe",
        "currency": {
            "code": "GBP",
            "symbol": "£",
            "rateToInr": 110.2
        },
        "emergency": {
            "general": "999",
            "police": "999",
            "ambulance": "999",
            "fire": "999"
        },
        "etiquette": {
            "dress": "Layered smart-casual; a sturdy compact umbrella or trench coat is indispensable.",
            "tipping": "10-12.5% at restaurants (often added as optional service charge); pub drinks do not require tipping.",
            "commute": "Always stand on the right on Tube escalators; tap contactless card for seamless travel caps.",
            "water": "Tap water is strictly regulated, clean, and delicious everywhere.",
            "plugs": "230V, 50Hz, Type G three-pin rectangular plugs."
        },
        "heroImage": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1526129318478-62ed807ebdf9?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Big Ben and Houses of Parliament historic walk",
            "Tower of London and Crown Jewels exhibition",
            "British Museum global antiquities galleries",
            "Hyde Park rose garden and Kensington Palace stroll",
            "Covent Garden street performers and market halls",
            "Borough Market gourmet street food tasting",
            "Edinburgh Castle clifftop royal fortress in Scotland",
            "Roman Baths and Georgian architecture tour in Bath"
        ]
    },
    "germany": {
        "name": "Germany",
        "region": "Central Europe",
        "currency": {
            "code": "EUR",
            "symbol": "€",
            "rateToInr": 92.5
        },
        "emergency": {
            "general": "112",
            "police": "110",
            "ambulance": "112",
            "fire": "112"
        },
        "etiquette": {
            "dress": "Practical, functional and understated; comfortable walking footwear is crucial.",
            "tipping": "Round up bills or add 5-10% directly when paying the server; say 'stimmt so' (keep the change).",
            "commute": "Never jaywalk across red signals; validate paper transit tickets before entering train platforms.",
            "water": "Tap water ('Leitungswasser') is extremely pure; sparkling water ('mit Gas') is the default at dining tables.",
            "plugs": "230V, 50Hz, Type C and Type F (Schuko)."
        },
        "heroImage": "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1599946347371-68eb71b16afc?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1587330979470-3595ac045ab0?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Brandenburg Gate and Reichstag glass dome tour in Berlin",
            "Museum Island UNESCO art and history complex",
            "Neuschwanstein fairytale castle alpine excursion in Bavaria",
            "Marienplatz glockenspiel and English Garden in Munich",
            "Cologne Gothic Cathedral and Rhine riverfront promenade",
            "Heidelberg castle ruins and philosopher's walk",
            "Black Forest scenic trail and traditional cuckoo clock village",
            "Hamburg Elbphilharmonie and historic warehouse district"
        ]
    },
    "spain": {
        "name": "Spain",
        "region": "Southern Europe",
        "currency": {
            "code": "EUR",
            "symbol": "€",
            "rateToInr": 92.5
        },
        "emergency": {
            "general": "112",
            "police": "091",
            "ambulance": "061",
            "fire": "080"
        },
        "etiquette": {
            "dress": "Polished casual; swimwear belongs strictly on beaches, not city boulevards.",
            "tipping": "Tipping is optional; leaving loose coins or 5-10% for full table dinner service is polite.",
            "commute": "Metro systems in Madrid and Barcelona are fast and modern; lunch is typically 2-4 PM, dinner after 9 PM.",
            "water": "Safe to drink in all metropolitan cities; bottled water preferred along some coastal resorts.",
            "plugs": "230V, 50Hz, Type C and Type F."
        },
        "heroImage": "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1509840841025-9088ba78a826?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Sagrada Familia and Gaudi architectural marvels in Barcelona",
            "Park Guell panoramic terrace and mosaic pavilions",
            "Prado Museum royal art masterpieces in Madrid",
            "Royal Palace and Plaza Mayor historic tapas walk",
            "Alhambra moorish palaces and Generalife gardens in Granada",
            "Seville Cathedral and Plaza de Espana flamenco evening",
            "Toledo medieval fortress city day trip",
            "Valencia City of Arts and Sciences futuristic complex"
        ]
    },
    "united arab emirates": {
        "name": "United Arab Emirates",
        "region": "Middle East",
        "currency": {
            "code": "AED",
            "symbol": "AED",
            "rateToInr": 23.6
        },
        "emergency": {
            "general": "999",
            "police": "999",
            "ambulance": "998",
            "fire": "997"
        },
        "etiquette": {
            "dress": "Modest attire in public malls and streets (shoulders and knees covered); beachwear allowed at pools/private beaches.",
            "tipping": "10-15% is customary in cafes and dining venues, though service fee is sometimes pre-added.",
            "commute": "Dubai Metro operates Gold and Silver cars; Nol contactless card works on all transit modes.",
            "water": "Tap water is desalinated and safe for brushing teeth; filtered or bottled water is favored for drinking.",
            "plugs": "230V, 50Hz, Type G three-pin plugs."
        },
        "heroImage": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1526495124232-a04e1849168c?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Burj Khalifa observation deck and Dubai fountain show",
            "Sheikh Zayed Grand Mosque architectural tour in Abu Dhabi",
            "Dubai Marina luxury yacht cruise and JBR beach walk",
            "Old Dubai gold & spice souks and traditional Abra boat ride",
            "Museum of the Future interactive exhibits",
            "Louvre Abu Dhabi domed sea museum and galleries",
            "Arabian desert dunes safari with sunset barbecue",
            "Palm Jumeirah scenic monorail and Atlantis aquaventure"
        ]
    },
    "thailand": {
        "name": "Thailand",
        "region": "Southeast Asia",
        "currency": {
            "code": "THB",
            "symbol": "฿",
            "rateToInr": 2.55
        },
        "emergency": {
            "general": "191",
            "police": "191",
            "ambulance": "1669",
            "tourist": "1155"
        },
        "etiquette": {
            "dress": "Cover shoulders and knees at all temples; remove shoes before entering sacred shrines and local homes.",
            "tipping": "Small tips of 20-50 THB at casual eateries or 10% in sit-down restaurants are welcomed.",
            "commute": "Use Bangkok BTS SkyTrain and MRT to bypass road traffic; negotiate tuk-tuks or use Grab app.",
            "water": "Do not drink untreated tap water; drink bottled water and ice made with purified cylinder water.",
            "plugs": "220V, 50Hz, Type A, B, and C."
        },
        "heroImage": "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Grand Palace and Emerald Buddha temple in Bangkok",
            "Wat Arun (Temple of Dawn) riverside golden prang",
            "Chatuchak weekend market craft and street food trail",
            "Chao Phraya river express boat and Asiatique night bazaar",
            "Chiang Mai Old City temples and ethical elephant sanctuary",
            "Phi Phi Islands and Maya Bay catamaran cruise",
            "Railay Beach limestone cliffs and sunset viewpoint in Krabi",
            "Ayutthaya ancient kingdom ruins and Buddha head in banyan tree"
        ]
    },
    "australia": {
        "name": "Australia",
        "region": "Oceania",
        "currency": {
            "code": "AUD",
            "symbol": "$",
            "rateToInr": 56.2
        },
        "emergency": {
            "general": "000",
            "police": "000",
            "ambulance": "000",
            "fire": "000"
        },
        "etiquette": {
            "dress": "Relaxed casual lifestyle; high-SPF sunscreen, sunglasses, and UV sunhats are mandatory year-round.",
            "tipping": "Tipping is not expected or required; leaving 5-10% at exceptional dining venues is optional.",
            "commute": "Always swim between red-and-yellow flags on surf beaches; tap Opal / Myki cards on city transit.",
            "water": "Tap water is of supreme cleanliness and safety throughout Australia.",
            "plugs": "230V, 50Hz, Type I three-pin angled plugs."
        },
        "heroImage": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1524293581917-878a6d017cba?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Sydney Opera House and Harbour Bridge walk",
            "Bondi to Coogee coastal clifftop scenic trail",
            "Great Barrier Reef catamaran snorkeling and diving in Cairns",
            "Melbourne laneways, street art, and third-wave coffee tour",
            "Great Ocean Road and Twelve Apostles limestone stacks",
            "Uluru sacred sandstone monolith and field of light",
            "Blue Mountains Echo Point and Three Sisters lookout",
            "Rottnest Island quokka wildlife safari in Western Australia"
        ]
    },
    "singapore": {
        "name": "Singapore",
        "region": "Southeast Asia",
        "currency": {
            "code": "SGD",
            "symbol": "S$",
            "rateToInr": 64.5
        },
        "emergency": {
            "general": "999",
            "police": "999",
            "ambulance": "995",
            "fire": "995"
        },
        "etiquette": {
            "dress": "Lightweight breathable fabrics for tropical humidity; neat casual indoors.",
            "tipping": "No tipping culture; 10% service charge and GST are pre-included on bills.",
            "commute": "Strict cleanliness laws (no eating or drinking on MRT subways); tap contactless cards at gantries.",
            "water": "Tap water exceeds all WHO drinking standards and is completely safe to drink.",
            "plugs": "230V, 50Hz, Type G three-pin plugs."
        },
        "heroImage": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1506351421178-63788970ee5b?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1498855926480-d98e83099315?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1508873696983-2df5703bc225?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Gardens by the Bay Supertree Grove and Cloud Forest dome",
            "Marina Bay Sands SkyPark panoramic observation deck",
            "Changi Airport Jewel rain vortex and canopy park",
            "Chinatown heritage shophouses and Buddha Tooth Relic temple",
            "Maxwell Food Centre Michelin-recommended chicken rice tasting",
            "Sentosa Island beaches and Cable Car ride",
            "Singapore Botanic Gardens UNESCO National Orchid Garden",
            "Kampong Glam Haji Lane boutique murals and Sultan Mosque"
        ]
    },
    "canada": {
        "name": "Canada",
        "region": "North America",
        "currency": {
            "code": "CAD",
            "symbol": "$",
            "rateToInr": 61.2
        },
        "emergency": {
            "general": "911",
            "police": "911",
            "ambulance": "911",
            "fire": "911"
        },
        "etiquette": {
            "dress": "Layered outdoor lifestyle clothing; heavy thermal insulation and traction snow boots in winter.",
            "tipping": "Standard tipping is 15-20% at full-service restaurants and cafes.",
            "commute": "VIA Rail connects eastern hubs; Parks Canada passes are required inside national parks.",
            "water": "Tap water is exceptionally clean, fresh, and safe across all provinces.",
            "plugs": "120V, 60Hz, Type A and Type B plugs."
        },
        "heroImage": "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1517935703635-2717090c2210?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1508873696983-2df5703bc225?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1498855926480-d98e83099315?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Banff National Park Lake Louise and Moraine Lake canoe excursion",
            "Niagara Falls panoramic boat cruise and Journey Behind the Falls",
            "CN Tower glass floor and Toronto waterfront harborfront",
            "Vancouver Stanley Park seawall cycling and Granville Island market",
            "Old Quebec City cobblestone fortification and Chateau Frontenac",
            "Jasper National Park Icefields Parkway glacier skywalk",
            "Montreal Mount Royal park and Notre-Dame Basilica light show",
            "Whistler Blackcomb alpine peak-to-peak gondola"
        ]
    },
    "egypt": {
        "name": "Egypt",
        "region": "North Africa",
        "currency": {
            "code": "EGP",
            "symbol": "E£",
            "rateToInr": 1.75
        },
        "emergency": {
            "general": "122",
            "police": "122",
            "ambulance": "123",
            "tourist": "126"
        },
        "etiquette": {
            "dress": "Modest clothing covering shoulders and knees; lightweight cottons for desert heat.",
            "tipping": "'Baksheesh' (small tips) is ubiquitous for drivers, temple guards, and helpers (20-50 EGP).",
            "commute": "Use Uber in Cairo to avoid taxi fare disputes; arrange licensed Egyptologist guides for monuments.",
            "water": "Drink bottled water only; avoid ice cubes from street vendors.",
            "plugs": "220V, 50Hz, Type C and Type F."
        },
        "heroImage": "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1566192091743-5966a6079984?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Great Pyramids of Giza and Sphinx plateau sunrise",
            "Grand Egyptian Museum (GEM) Tutankhamun golden treasures",
            "Karnak Temple hypostyle hall and Luxor Temple avenue of sphinxes",
            "Valley of the Kings royal pharaoh tombs exploration",
            "Nile river traditional felucca sailing boat cruise at sunset",
            "Abu Simbel colossal rock-cut temples of Ramses II",
            "Khan el-Khalili historic bazaar and El Fishawy traditional cafe",
            "Red Sea coral reef diving and snorkeling in Sharm El Sheikh"
        ]
    },
    "greece": {
        "name": "Greece",
        "region": "Southern Europe",
        "currency": {
            "code": "EUR",
            "symbol": "€",
            "rateToInr": 92.5
        },
        "emergency": {
            "general": "112",
            "police": "100",
            "ambulance": "166",
            "fire": "199",
            "tourist": "171"
        },
        "etiquette": {
            "dress": "Chic Mediterranean resort wear; knees and shoulders must be covered inside Meteora and Athos monasteries.",
            "tipping": "Rounding up or 5-10% in tavernas is customary and deeply appreciated by family owners.",
            "commute": "Book island ferries in advance during peak summer; Athens metro has archaeological artifact exhibits in stations.",
            "water": "Safe tap water in Athens; bottled water recommended on smaller Aegean islands.",
            "plugs": "230V, 50Hz, Type C and Type F."
        },
        "heroImage": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Acropolis of Athens and Parthenon ancient temple",
            "Santorini Oia clifftop sunset and blue-domed churches walk",
            "Acropolis Museum glass floor archaeological excavations",
            "Plaka and Anafiotika whitewashed neighborhood stroll in Athens",
            "Delphi sacred oracle sanctuary and mountain amphitheatre",
            "Meteora clifftop Byzantine monasteries day excursion",
            "Mykonos windmills, Little Venice, and seaside tavernas",
            "Crete Palace of Knossos Minoan labyrinth ruins"
        ]
    },
    "turkey": {
        "name": "Turkey",
        "region": "Eurasia",
        "currency": {
            "code": "TRY",
            "symbol": "₺",
            "rateToInr": 2.5
        },
        "emergency": {
            "general": "112",
            "police": "155",
            "ambulance": "112",
            "fire": "110"
        },
        "etiquette": {
            "dress": "Modest clothing at mosques; headscarf and covered arms/legs required inside Blue Mosque.",
            "tipping": "5-10% at casual dining, 10-15% at upscale restaurants; round up taxi meters.",
            "commute": "Get an Istanbulkart card for ferries, trams, and metro; take Bosphorus public ferries for scenic views.",
            "water": "Drink bottled water; tap water is used mainly for washing and boiling tea.",
            "plugs": "230V, 50Hz, Type C and Type F."
        },
        "heroImage": "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Hagia Sophia Grand Mosque and Sultanahmet historical square",
            "Cappadocia sunrise hot air balloon flight over fairy chimneys",
            "Topkapi Palace royal pavilions and Bosphorus views",
            "Grand Bazaar 4,000 historic artisan shops and spice bazaar",
            "Bosphorus strait sunset ferry cruise between Europe and Asia",
            "Ephesus ancient Roman library and grand theatre ruins",
            "Pamukkale thermal white travertine terraces and Hierapolis",
            "Galata Tower panoramic viewpoint and Karakoy cafes"
        ]
    },
    "netherlands": {
        "name": "Netherlands",
        "region": "Western Europe",
        "currency": {
            "code": "EUR",
            "symbol": "€",
            "rateToInr": 92.5
        },
        "emergency": {
            "general": "112",
            "police": "112",
            "ambulance": "112",
            "fire": "112"
        },
        "etiquette": {
            "dress": "Casual and bike-friendly; water-resistant rain jacket and flat shoes are essentials.",
            "tipping": "5-10% for good service is standard, though service is included in the bill.",
            "commute": "Never walk in designated reddish cycling lanes; rent an OV-chipkaart or tap contactless for transit.",
            "water": "Dutch tap water is of the purest quality in Europe, unfiltered straight from the tap.",
            "plugs": "230V, 50Hz, Type C and Type F."
        },
        "heroImage": "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1468779036391-52341f60b55d?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Amsterdam canal ring boat cruise and Jordaan historic bridges",
            "Rijksmuseum Dutch Masters and Rembrandt Night Watch gallery",
            "Van Gogh Museum largest collection of masterpieces",
            "Keukenhof tulip gardens floral pavilion (spring excursion)",
            "Zaanse Schans working windmills and traditional clog workshop",
            "Anne Frank House historic canal house and secret annex",
            "Vondelpark open-air cycling and terrace cafe afternoon",
            "Utrecht Dom Tower and bi-level wharf canals"
        ]
    },
    "portugal": {
        "name": "Portugal",
        "region": "Southern Europe",
        "currency": {
            "code": "EUR",
            "symbol": "€",
            "rateToInr": 92.5
        },
        "emergency": {
            "general": "112",
            "police": "112",
            "ambulance": "112",
            "fire": "112"
        },
        "etiquette": {
            "dress": "Smart-casual; sturdy rubber-soled shoes for steep cobblestone streets ('calcada').",
            "tipping": "5-10% at restaurants if satisfied; small coins at cafes.",
            "commute": "Tram 28 in Lisbon is historic; Viva Viagem card covers metro, funiculars, and ferries.",
            "water": "Tap water is strictly safe and drinkable everywhere in Portugal.",
            "plugs": "230V, 50Hz, Type C and Type F."
        },
        "heroImage": "https://images.unsplash.com/photo-1509840841025-9088ba78a826?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1509840841025-9088ba78a826?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1513682125134-774678123166?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Belem Tower and Jeronimos Monastery UNESCO heritage in Lisbon",
            "Sintra romantic Pena Palace and Quinta da Regaleira day trip",
            "Alfama neighborhood historic tram 28 ride and Fado evening",
            "Porto Ribeira riverfront and Dom Luis I iron bridge walk",
            "Douro Valley terraced vineyards and traditional rabelo boat cruise",
            "Algarve Ponta da Piedade sea caves and Benagil boat tour",
            "Cascais seaside promenade and Boca do Inferno cliffs",
            "Pastel de Nata warm custard tart tasting at original Belem bakery"
        ]
    },
    "austria": {
        "name": "Austria",
        "region": "Central Europe",
        "currency": {
            "code": "EUR",
            "symbol": "€",
            "rateToInr": 92.5
        },
        "emergency": {
            "general": "112",
            "police": "133",
            "ambulance": "144",
            "fire": "122"
        },
        "etiquette": {
            "dress": "Elegant smart casual; formal attire expected at evening classical concerts and opera.",
            "tipping": "5-10% standard; round up total directly when paying waiter.",
            "commute": "Vienna U-Bahn operates on an honor system; buy and validate ticket before boarding.",
            "water": "Tap water is pure spring water brought directly by aqueducts from the Styrian Alps.",
            "plugs": "230V, 50Hz, Type C and Type F."
        },
        "heroImage": "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1520503185799-d489373805e3?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Schonbrunn Palace royal imperial apartments and grand gardens in Vienna",
            "St. Stephen's Cathedral and historic Innere Stadt Ringstrasse walk",
            "Hallstatt lakeside alpine village and prehistoric salt mine",
            "Salzburg Hohensalzburg fortress and Mozart birthplace in Altstadt",
            "Belvedere Palace Gustav Klimt 'The Kiss' masterpiece collection",
            "Innsbruck Golden Roof and Nordkette alpine cable car",
            "Vienna State Opera or Musikverein golden hall classical concert",
            "Traditional Viennese coffee house Sachertorte tasting"
        ]
    },
    "new zealand": {
        "name": "New Zealand",
        "region": "Oceania",
        "currency": {
            "code": "NZD",
            "symbol": "NZ$",
            "rateToInr": 51.5
        },
        "emergency": {
            "general": "111",
            "police": "111",
            "ambulance": "111",
            "fire": "111"
        },
        "etiquette": {
            "dress": "Outdoor adventure layers; strong windbreaker and waterproof outerwear.",
            "tipping": "No tipping culture; bills are final, tips for exceptional service are appreciated.",
            "commute": "Drive on the left side of the road; rental campervans are the premier way to tour both islands.",
            "water": "Tap water is fresh, clean, and drinkable across all towns.",
            "plugs": "230V, 50Hz, Type I three-pin angled plugs."
        },
        "heroImage": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1524293581917-878a6d017cba?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Milford Sound fiord scenic boat cruise and glacier waterfalls",
            "Queenstown Lake Wakatipu TSS Earnslaw steamboat and Skyline gondola",
            "Hobbiton movie set guided tour in Matamata",
            "Rotorua Te Puia geothermal geysers and Maori cultural village",
            "Aoraki / Mount Cook Hooker Valley alpine suspension bridge trail",
            "Waiheke Island boutique vineyards and white sand beach day trip",
            "Tongariro Alpine Crossing volcanic emerald lakes trek",
            "Waitomo glowworm caves boat glide under starry glowworm roof"
        ]
    },
    "indonesia": {
        "name": "Indonesia",
        "region": "Southeast Asia",
        "currency": {
            "code": "IDR",
            "symbol": "Rp",
            "rateToInr": 0.0055
        },
        "emergency": {
            "general": "112",
            "police": "110",
            "ambulance": "118",
            "fire": "113",
            "tourist": "021-3838899"
        },
        "etiquette": {
            "dress": "Wear a sarong and sash when entering Balinese Hindu temples; modest clothing outside beaches.",
            "tipping": "5-10% at restaurants is customary; round up taxi fares.",
            "commute": "Rent a scooter with international license or use Grab/Gojek ride-hailing; hire a private driver for day tours.",
            "water": "Do not drink tap water; always drink sealed bottled or mineral water.",
            "plugs": "230V, 50Hz, Type C and Type F."
        },
        "heroImage": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Ubud Tegalalang emerald rice terraces and jungle swing",
            "Uluwatu clifftop sea temple and sunset Kecak fire dance",
            "Tanah Lot iconic offshore rock temple at sunset",
            "Nusa Penida Kelingking T-Rex cliff and Diamond Beach boat trip",
            "Mount Batur sunrise volcano trek and natural hot springs",
            "Sacred Monkey Forest sanctuary jungle walk in Ubud",
            "Seminyak beach clubs and artisan boutique sunset boulevard",
            "Borobudur UNESCO 9th-century Buddhist temple monument in Java"
        ]
    },
    "south korea": {
        "name": "South Korea",
        "region": "East Asia",
        "currency": {
            "code": "KRW",
            "symbol": "₩",
            "rateToInr": 0.062
        },
        "emergency": {
            "general": "112",
            "police": "112",
            "ambulance": "119",
            "fire": "119",
            "tourist": "1330"
        },
        "etiquette": {
            "dress": "Trendy and modern; renting a Hanbok provides free admission to royal palaces.",
            "tipping": "No tipping in Korea; service charge is not required and staff may decline tips.",
            "commute": "Get a T-Money card for subways, buses, and taxis; subways feature heated seats and English displays.",
            "water": "Tap water is strictly safe, though water purifiers ('Jeongsugi') are ubiquitous in all cafes and hotels.",
            "plugs": "220V, 60Hz, Type C and Type F."
        },
        "heroImage": "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Gyeongbokgung Palace royal guard changing ceremony in Seoul",
            "Bukchon Hanok traditional village timber architecture stroll",
            "N Seoul Tower cable car and panoramic sunset city observatory",
            "Myeongdong street food night market and skincare shopping",
            "Busan Haeundae beach and Gamcheon colorful culture village",
            "Hongdae indie youth music, art street, and cafe district",
            "DMZ Korean demilitarized zone and 3rd infiltration tunnel tour",
            "Jeju Island Seongsan Ilchulbong sunrise peak and lava tubes"
        ]
    },
    "maldives": {
        "name": "Maldives",
        "region": "South Asia",
        "currency": {
            "code": "MVR",
            "symbol": "Rf",
            "rateToInr": 5.6
        },
        "emergency": {
            "general": "119",
            "police": "119",
            "ambulance": "102",
            "fire": "118"
        },
        "etiquette": {
            "dress": "Resort islands are fully relaxed; on local inhabited islands, dress modestly covering shoulders and knees.",
            "tipping": "10% service charge is added to bills; extra $2-5 per day for room attendants and boat crew is customary.",
            "commute": "Transport between islands is exclusively by speedboat or picturesque de Havilland seaplane.",
            "water": "Desalinated tap water is standard in resorts; complimentary bottled water is replenished daily.",
            "plugs": "230V, 50Hz, Type G (British three-pin)."
        },
        "heroImage": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1498855926480-d98e83099315?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Overwater villa stay with direct lagoon glass staircase access",
            "Coral reef snorkeling safari with manta rays and sea turtles",
            "Sunset dolphin cruise on traditional Maldivian Dhoni wooden boat",
            "Private deserted sandbank picnic with turquoise water 360 view",
            "Underwater restaurant dining under transparent glass dome",
            "Male capital city fish market, Grand Friday Mosque, and National Museum",
            "Bioluminescent glowing phytoplankton beach night walk (Vaadhoo)",
            "Luxury overwater sunset spa pavilion and massage"
        ]
    },
    "norway": {
        "name": "Norway",
        "region": "Northern Europe",
        "currency": {
            "code": "NOK",
            "symbol": "kr",
            "rateToInr": 8.1
        },
        "emergency": {
            "general": "112",
            "police": "112",
            "ambulance": "113",
            "fire": "110"
        },
        "etiquette": {
            "dress": "Outdoor thermal layers and sturdy waterproof boots; follow 'allemannsretten' (right to roam responsibly).",
            "tipping": "Tipping is not required; rounding up to the nearest 10-20 NOK for good service is standard.",
            "commute": "Flåm Railway and electric fjord catamarans offer incredible views; contactless cards used everywhere (almost cashless).",
            "water": "Tap water is among the cleanest, sweetest, and most refreshing natural water on Earth.",
            "plugs": "230V, 50Hz, Type C and Type F."
        },
        "heroImage": "https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Geirangerfjord UNESCO dramatic cliffs and Seven Sisters waterfalls cruise",
            "Bergen Bryggen Hanseatic historic wooden wharf and Fløibanen funicular",
            "Lofoten Islands fishing villages and midnight sun panoramic hike",
            "Tromsø Aurora Borealis northern lights safari and dog sledding",
            "Flåm steep mountain railway and Aurlandsfjord electric boat",
            "Oslo Opera House marble roof walk and Munch Museum",
            "Preikestolen (Pulpit Rock) clifftop vista over Lysefjord",
            "Vigeland sculpture park in Frogner Park Oslo"
        ]
    },
    "iceland": {
        "name": "Iceland",
        "region": "Northern Europe",
        "currency": {
            "code": "ISK",
            "symbol": "kr",
            "rateToInr": 0.62
        },
        "emergency": {
            "general": "112",
            "police": "112",
            "ambulance": "112",
            "fire": "112"
        },
        "etiquette": {
            "dress": "Windproof and waterproof shell jackets; shower with soap without swimwear before entering thermal pools.",
            "tipping": "No tipping culture; service is included in all prices.",
            "commute": "Rent a 4x4 vehicle for Ring Road and F-roads; monitor vedur.is for sudden weather changes.",
            "water": "Tap water is pure glacier runoff; cold water is untouched, hot water has a natural sulfur scent.",
            "plugs": "230V, 50Hz, Type C and Type F."
        },
        "heroImage": "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1529963183134-61a90db47eaf?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Golden Circle route: Gullfoss golden waterfall and Geysir geothermal spouts",
            "Blue Lagoon geothermal volcanic mineral spa relaxing soak",
            "Skógafoss and Seljalandsfoss majestic south coast waterfalls",
            "Reynisfjara black sand beach and basalt sea stack columns in Vík",
            "Jökulsárlón glacier lagoon icebergs and Diamond Beach crystals",
            "Reykjavik Hallgrímskirkja church and Harpa concert hall waterfront",
            "Vatnajökull glacier ice cave expedition under crystal blue ceilings",
            "Snæfellsnes peninsula Kirkjufell arrowhead mountain and coastal seals"
        ]
    },
    "morocco": {
        "name": "Morocco",
        "region": "North Africa",
        "currency": {
            "code": "MAD",
            "symbol": "DH",
            "rateToInr": 8.7
        },
        "emergency": {
            "general": "19",
            "police": "19",
            "ambulance": "15",
            "fire": "15",
            "tourist": "0524384444"
        },
        "etiquette": {
            "dress": "Respectful modest dress covering shoulders and knees; avoid photographing locals without asking.",
            "tipping": "Tipping is customary; 10% in cafes and restaurants, 10-20 DH for luggage porters in medinas.",
            "commute": "Al Boraq high-speed train connects Tangier to Casablanca; negotiate 'petit taxi' fares or demand meter.",
            "water": "Drink bottled mineral water (Sidi Ali / Ain Saiss); avoid tap water.",
            "plugs": "220V, 50Hz, Type C and Type E."
        },
        "heroImage": "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Jemaa el-Fnaa bustling square and storyteller night food stalls in Marrakech",
            "Jardin Majorelle cobalt blue botanical garden and Yves Saint Laurent Museum",
            "Chefchaouen dreamlike blue-washed mountain medina walk",
            "Fes el-Bali ancient medina UNESCO labyrinth and Chouara tannery",
            "Sahara desert Erg Chebbi golden sand dunes camel trek and camp",
            "Ait Benhaddou earthen clay ksar fortress (Gladiator filming location)",
            "Hassan II Mosque oceanfront grand marble minaret in Casablanca",
            "Essaouira Atlantic coastal ramparts, seafood port, and windsurfing"
        ]
    },
    "brazil": {
        "name": "Brazil",
        "region": "South America",
        "currency": {
            "code": "BRL",
            "symbol": "R$",
            "rateToInr": 15.2
        },
        "emergency": {
            "general": "190",
            "police": "190",
            "ambulance": "192",
            "fire": "193"
        },
        "etiquette": {
            "dress": "Vibrant and casual; keep jewelry and high-end smartphones discreet on public city streets.",
            "tipping": "10% service fee ('dez por cento') is almost always included on restaurant bills.",
            "commute": "Use registered Uber or airport transfer booths; Rio Metro is air-conditioned and reliable.",
            "water": "Drink filtered or bottled water in all cities and accommodations.",
            "plugs": "127V/220V, 60Hz, Type N (three round pins) and Type C."
        },
        "heroImage": "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Christ the Redeemer statue atop Corcovado mountain in Rio de Janeiro",
            "Sugarloaf Mountain cable car with sunset Guanabara Bay panoramas",
            "Copacabana and Ipanema iconic beach promenade walk",
            "Iguazu Falls roaring thunder cataracts boat expedition",
            "Salvador da Bahia Pelourinho colorful colonial cobblestone streets",
            "Amazon rainforest river lodge wildlife excursion in Manaus",
            "Lapa Arches and Selarón brightly tiled mosaic steps in Rio",
            "São Paulo Paulista Avenue world-class art museums and dining"
        ]
    },
    "mexico": {
        "name": "Mexico",
        "region": "North America",
        "currency": {
            "code": "MXN",
            "symbol": "$",
            "rateToInr": 4.3
        },
        "emergency": {
            "general": "911",
            "police": "911",
            "ambulance": "911",
            "fire": "911",
            "tourist": "078"
        },
        "etiquette": {
            "dress": "Smart casual; linen and lightweight cottons for coastal areas.",
            "tipping": "10-15% ('propina') is standard and customary at restaurants and bars.",
            "commute": "Use Uber or authorized 'Sitio' taxis; ADO first-class buses are safe and luxurious across Yucatan.",
            "water": "Do not drink tap water; ask for 'agua purificada' everywhere.",
            "plugs": "127V, 60Hz, Type A and Type B."
        },
        "heroImage": "https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1512813195386-6cf811ad3542?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Chichen Itza Mayan pyramid El Castillo and sacred cenote in Yucatan",
            "Mexico City Zocalo grand plaza, Metropolitan Cathedral, and Templo Mayor",
            "Teotihuacan ancient Pyramids of the Sun and Moon climb",
            "Tulum clifftop Mayan ruins overlooking turquoise Caribbean waters",
            "Oaxaca historic center artisan mezcal and mole culinary tasting",
            "Frida Kahlo Blue House (Casa Azul) in Coyoacán",
            "Cenote Ik Kil natural limestone sinkhole swimming experience",
            "San Miguel de Allende colonial pastel streets and rose parish church"
        ]
    },
    "south africa": {
        "name": "South Africa",
        "region": "Southern Africa",
        "currency": {
            "code": "ZAR",
            "symbol": "R",
            "rateToInr": 4.8
        },
        "emergency": {
            "general": "112",
            "police": "10111",
            "ambulance": "10177",
            "fire": "10177"
        },
        "etiquette": {
            "dress": "Safari neutral khaki and olive for reserves; stylish smart-casual in Cape Town and Winelands.",
            "tipping": "10-15% is standard at restaurants; R10-20 for car guards and petrol station attendants.",
            "commute": "Use Uber in cities; rent a car for the Garden Route and Cape Peninsula scenic drives.",
            "water": "Tap water is of the highest international quality and completely safe to drink in major cities.",
            "plugs": "230V, 50Hz, Type M (three large round pins) and Type C/N."
        },
        "heroImage": "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Table Mountain aerial cableway and 360-degree Cape Town summit views",
            "Cape Peninsula drive: Chapman's Peak, Cape Point, and Boulders Beach penguins",
            "Kruger National Park Big Five wildlife game reserve safari",
            "Stellenbosch and Franschhoek Cape Dutch historic vineyards tour",
            "Robben Island historic ferry tour and Nelson Mandela prison cell",
            "Victoria & Alfred (V&A) Waterfront harbor dining and sunset catamaran",
            "Kirstenbosch National Botanical Garden treetop canopy walkway",
            "Garden Route coastal lagoons and Tsitsikamma suspension bridges"
        ]
    },
    "india": {
        "name": "India",
        "region": "South Asia",
        "currency": {
            "code": "INR",
            "symbol": "₹",
            "rateToInr": 1.0
        },
        "emergency": {
            "general": "112",
            "police": "100",
            "ambulance": "108",
            "fire": "101",
            "tourist": "1363"
        },
        "etiquette": {
            "dress": "Respectful dress covering shoulders and knees; slip-on footwear for frequent temple entry.",
            "tipping": "7-10% at restaurants if service charge is not applied; small tips for luggage assistance.",
            "commute": "Use UPI contactless or pre-paid taxi / Uber / Ola counters; Metro networks in Delhi and Mumbai are best.",
            "water": "Stick to sealed bottled or purified RO water; eat hot, freshly prepared local foods.",
            "plugs": "230V, 50Hz, Type C, D, and M."
        },
        "heroImage": "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=85",
        "gallery": [
            "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=85",
            "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=900&q=85"
        ],
        "suggestions": [
            "Taj Mahal sunrise marble spectacle and Agra Fort in Uttar Pradesh",
            "Amber Fort elephant ramparts and Hawa Mahal palace in Jaipur",
            "Old Delhi Chandni Chowk street food trail and Jama Masjid",
            "Kerala backwaters houseboat cruise through tranquil palm lagoons",
            "Varanasi Ganga evening Aarti ceremony on sacred Dashashwamedh Ghat",
            "Goa golden sandy beaches, Dudhsagar falls, and Portuguese heritage",
            "Udaipur City Palace and Lake Pichola sunset boat ride",
            "Mumbai Gateway of India and Marine Drive Queen's Necklace walk"
        ]
    }
};

export const GLOBAL_ALIASES: Record<string, string> = {
    "swiss": "switzerland",
    "zurich": "switzerland",
    "geneva": "switzerland",
    "interlaken": "switzerland",
    "lucerne": "switzerland",
    "zermatt": "switzerland",
    "bern": "switzerland",
    "basel": "switzerland",
    "alps": "switzerland",
    "tokyo": "japan",
    "kyoto": "japan",
    "osaka": "japan",
    "nara": "japan",
    "hiroshima": "japan",
    "sapporo": "japan",
    "fukuoka": "japan",
    "okinawa": "japan",
    "hakone": "japan",
    "fuji": "japan",
    "paris": "france",
    "nice": "france",
    "lyon": "france",
    "marseille": "france",
    "bordeaux": "france",
    "strasbourg": "france",
    "cannes": "france",
    "toulouse": "france",
    "versailles": "france",
    "rome": "italy",
    "florence": "italy",
    "venice": "italy",
    "milan": "italy",
    "naples": "italy",
    "amalfi": "italy",
    "sicily": "italy",
    "turin": "italy",
    "bologna": "italy",
    "pisa": "italy",
    "usa": "united states",
    "us": "united states",
    "america": "united states",
    "new york": "united states",
    "nyc": "united states",
    "los angeles": "united states",
    "san francisco": "united states",
    "chicago": "united states",
    "miami": "united states",
    "las vegas": "united states",
    "hawaii": "united states",
    "seattle": "united states",
    "uk": "united kingdom",
    "britain": "united kingdom",
    "england": "united kingdom",
    "london": "united kingdom",
    "scotland": "united kingdom",
    "edinburgh": "united kingdom",
    "manchester": "united kingdom",
    "liverpool": "united kingdom",
    "belfast": "united kingdom",
    "wales": "united kingdom",
    "berlin": "germany",
    "munich": "germany",
    "frankfurt": "germany",
    "hamburg": "germany",
    "cologne": "germany",
    "dresden": "germany",
    "heidelberg": "germany",
    "barcelona": "spain",
    "madrid": "spain",
    "seville": "spain",
    "granada": "spain",
    "valencia": "spain",
    "malaga": "spain",
    "ibiza": "spain",
    "mallorca": "spain",
    "uae": "united arab emirates",
    "dubai": "united arab emirates",
    "abu dhabi": "united arab emirates",
    "sharjah": "united arab emirates",
    "bangkok": "thailand",
    "phuket": "thailand",
    "chiang mai": "thailand",
    "krabi": "thailand",
    "pattaya": "thailand",
    "koh samui": "thailand",
    "phi phi": "thailand",
    "sydney": "australia",
    "melbourne": "australia",
    "brisbane": "australia",
    "perth": "australia",
    "gold coast": "australia",
    "cairns": "australia",
    "adelaide": "australia",
    "sentosa": "singapore",
    "changi": "singapore",
    "toronto": "canada",
    "vancouver": "canada",
    "montreal": "canada",
    "banff": "canada",
    "quebec": "canada",
    "calgary": "canada",
    "ottawa": "canada",
    "whistler": "canada",
    "cairo": "egypt",
    "luxor": "egypt",
    "aswan": "egypt",
    "alexandria": "egypt",
    "giza": "egypt",
    "sharm": "egypt",
    "athens": "greece",
    "santorini": "greece",
    "mykonos": "greece",
    "crete": "greece",
    "rhodes": "greece",
    "corfu": "greece",
    "türkiye": "turkey",
    "istanbul": "turkey",
    "cappadocia": "turkey",
    "antalya": "turkey",
    "bodrum": "turkey",
    "izmir": "turkey",
    "holland": "netherlands",
    "amsterdam": "netherlands",
    "rotterdam": "netherlands",
    "hague": "netherlands",
    "utrecht": "netherlands",
    "lisbon": "portugal",
    "porto": "portugal",
    "algarve": "portugal",
    "sintra": "portugal",
    "madeira": "portugal",
    "vienna": "austria",
    "salzburg": "austria",
    "innsbruck": "austria",
    "hallstatt": "austria",
    "graz": "austria",
    "nz": "new zealand",
    "auckland": "new zealand",
    "queenstown": "new zealand",
    "wellington": "new zealand",
    "christchurch": "new zealand",
    "bali": "indonesia",
    "jakarta": "indonesia",
    "ubud": "indonesia",
    "seminyak": "indonesia",
    "lombok": "indonesia",
    "korea": "south korea",
    "seoul": "south korea",
    "busan": "south korea",
    "incheon": "south korea",
    "jeju": "south korea",
    "male": "maldives",
    "atoll": "maldives",
    "oslo": "norway",
    "bergen": "norway",
    "tromso": "norway",
    "fjords": "norway",
    "flam": "norway",
    "reykjavik": "iceland",
    "vik": "iceland",
    "akureyri": "iceland",
    "marrakech": "morocco",
    "casablanca": "morocco",
    "fez": "morocco",
    "fes": "morocco",
    "tangier": "morocco",
    "chefchaouen": "morocco",
    "rio": "brazil",
    "rio de janeiro": "brazil",
    "sao paulo": "brazil",
    "salvador": "brazil",
    "brasilia": "brazil",
    "mexico city": "mexico",
    "cancun": "mexico",
    "tulum": "mexico",
    "oaxaca": "mexico",
    "playa del carmen": "mexico",
    "guadalajara": "mexico",
    "cape town": "south africa",
    "johannesburg": "south africa",
    "kruger": "south africa",
    "durban": "south africa",
    "bharat": "india",
    "jaipur": "india",
    "delhi": "india",
    "mumbai": "india",
    "goa": "india",
    "kerala": "india",
    "kochi": "india",
    "varanasi": "india",
    "udaipur": "india",
    "mysuru": "india",
    "bangalore": "india",
    "bengaluru": "india",
    "hyderabad": "india",
    "chennai": "india",
    "kolkata": "india",
    "rishikesh": "india",
    "darjeeling": "india",
    "manali": "india",
    "shimla": "india",
    "amritsar": "india",
    "agra": "india",
    "kashmir": "india",
    "ladakh": "india",
    "himachal": "india",
    "himachal pradesh": "india"
};

export const THEMATIC_FALLBACK_GALLERIES: string[] = [
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80"
];

export const FEATURED_GLOBAL_DESTINATIONS: string[] = [
    'Switzerland',
    'Japan',
    'France',
    'Italy',
    'United States',
    'United Kingdom',
    'Germany',
    'Spain',
    'United Arab Emirates',
    'Thailand',
    'Australia',
    'Singapore',
    'Canada',
    'Egypt',
    'Greece',
    'Turkey',
    'Netherlands',
    'Portugal',
    'Austria',
    'New Zealand',
    'Indonesia',
    'South Korea',
    'Maldives',
    'Norway',
    'Iceland',
    'Morocco',
    'Brazil',
    'Mexico',
    'South Africa',
    'India',
    'Jaipur',
    'Goa',
    'Kerala',
    'Delhi',
    'Mumbai',
];

export function resolveCountryKey(destination: string): string | null {
    const clean = (destination || '').trim().toLowerCase();
    if (!clean) return 'india';

    const parts = clean.replace(/-/g, ' ').split(',');
    const candidates = [clean, ...parts.map((p) => p.trim()), clean.split(' ')[0] || ''];

    for (const c of candidates) {
        if (c in GLOBAL_TRAVEL_ATLAS) return c;
        if (c in GLOBAL_ALIASES) return GLOBAL_ALIASES[c];
    }

    for (const [key, data] of Object.entries(GLOBAL_TRAVEL_ATLAS)) {
        if (clean.includes(key) || clean.includes(data.name.toLowerCase())) return key;
    }

    for (const [alias, key] of Object.entries(GLOBAL_ALIASES)) {
        if (clean.includes(alias)) return key;
    }

    return null;
}

export function getCountryMetadata(destination: string): CountryMetadata {
    const key = resolveCountryKey(destination);
    if (key && GLOBAL_TRAVEL_ATLAS[key]) {
        return GLOBAL_TRAVEL_ATLAS[key];
    }

    const title = destination.split(',')[0].trim().replace(/^\w/, (c) => c.toUpperCase()) || 'Destination';
    const hash = Math.abs(title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
    const fallbackPhoto = THEMATIC_FALLBACK_GALLERIES[hash % THEMATIC_FALLBACK_GALLERIES.length];

    return {
        name: title,
        region: 'Global Travel Hub',
        currency: { code: 'USD', symbol: '$', rateToInr: 86.8 },
        emergency: { general: '112 / 911', police: '112', ambulance: '112', fire: '112', tourist: '112' },
        etiquette: {
            dress: 'Smart casual attire; pack versatile layers for changing seasonal weather conditions.',
            tipping: 'Checking restaurant receipts is recommended; leaving 5-10% for attentive service is standard.',
            commute: 'Use official metered taxis, ride-hailing apps, and contactless city metro transit systems.',
            water: 'Drink filtered or bottled mineral water when traveling in unfamiliar regions.',
            plugs: 'Standard universal dual-voltage international plugs (Type C/G/A/B compatible).',
        },
        suggestions: [
            `${title} historic center and heritage architecture walk`,
            `${title} national museum and cultural galleries`,
            `${title} vibrant artisan market and local food crawl`,
            `${title} scenic riverbank or lakefront promenade`,
            `${title} panoramic sunset viewpoint and rooftop dining`,
            `${title} botanical gardens and green spaces exploration`,
            `${title} historic fortress or landmark palace visit`,
            `${title} traditional evening performing arts showcase`,
        ],
        heroImage: fallbackPhoto,
        gallery: [
            fallbackPhoto,
            THEMATIC_FALLBACK_GALLERIES[(hash + 1) % THEMATIC_FALLBACK_GALLERIES.length],
            THEMATIC_FALLBACK_GALLERIES[(hash + 2) % THEMATIC_FALLBACK_GALLERIES.length],
            THEMATIC_FALLBACK_GALLERIES[(hash + 3) % THEMATIC_FALLBACK_GALLERIES.length],
        ],
    };
}

export function getScenicImageForDay(destination: string, dayIndex: number): string {
    const meta = getCountryMetadata(destination);
    const gallery = meta.gallery && meta.gallery.length > 0 ? meta.gallery : THEMATIC_FALLBACK_GALLERIES;
    return gallery[Math.abs(dayIndex) % gallery.length];
}

export function getDestinationHeroImage(destination: string): string {
    const meta = getCountryMetadata(destination);
    return meta.heroImage || THEMATIC_FALLBACK_GALLERIES[0];
}
