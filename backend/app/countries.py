"""
Comprehensive Global Country Intelligence & Destination Registry
Provides authentic travel metadata, currencies, emergency contacts,
cultural etiquette, hotels, transit, and curated highlights for 30+ destinations.
"""
from typing import Any

GLOBAL_COUNTRIES: dict[str, dict[str, Any]] = {
    "switzerland": {
        "name": "Switzerland",
        "region": "Central Europe",
        "currency": {
            "code": "CHF",
            "symbol": "CHF",
            "rate_to_inr": 97.5
        },
        "emergency": {
            "general": "112",
            "police": "117",
            "ambulance": "144",
            "fire": "118"
        },
        "best_season": "June to September (Hiking) or December to March (Skiing)",
        "hotels": [
            {
                "name": "Alpine Panoramic Resort",
                "area": "Interlaken / Grindelwald",
                "nightly_inr": 18000,
                "rating": 4.8
            },
            {
                "name": "Old Town Heritage Boutique",
                "area": "Zurich Altstadt / Lucerne",
                "nightly_inr": 14000,
                "rating": 4.5
            }
        ],
        "transport": [
            {
                "mode": "SBB Swiss Federal Railways",
                "note": "Get a Swiss Travel Pass for unlimited trains, boats & panoramic routes",
                "estimated_inr": 6500
            },
            {
                "mode": "Mountain Cable Cars & Funiculars",
                "note": "Best for Jungfraujoch, Matterhorn Glacier & Titlis peaks",
                "estimated_inr": 4200
            }
        ],
        "restaurants": [
            {
                "name": "Traditional Swiss Fondue & Raclette Stübli",
                "cuisine": "Swiss Alpine",
                "price_band": "€€€",
                "area": "Old Town Promenade"
            },
            {
                "name": "Lakeview Artisan Chocolate & Pastry Cafe",
                "cuisine": "Swiss Patisserie",
                "price_band": "€€",
                "area": "Lakeside Quay"
            }
        ],
        "route_tip": "Validate Swiss Travel Pass beforehand; panoramic trains like the Glacier Express require advance seat reservations.",
        "etiquette": {
            "dress": "Smart casual; sturdy weather-proof layers and hiking shoes are essential for alpine excursions.",
            "tipping": "Service is legally included in bills; rounding up to the nearest 5-10 CHF for good service is customary.",
            "commute": "Public transit is world-famous for punctuality; trains depart precisely on the minute.",
            "water": "Tap water from municipal taps and public mountain fountains is clean, pristine Alpine drinking water.",
            "plugs": "230V, 50Hz, Type J (three round pins) and Type C (europlug)."
        },
        "eco": {
            "priorities": [
                "Travel via Switzerland's 100% hydro-powered electric SBB rail network",
                "Stay in 'Swisstainable' certified eco-hotels and mountain lodges",
                "Refill water bottles directly from pristine Alpine public fountains",
                "Explore car-free mountain villages like Zermatt, Wengen, and Mürren"
            ],
            "hotel_preference": "Choose Swisstainable-certified alpine stays with geothermal heating and farm-to-table breakfast."
        },
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
            "rate_to_inr": 0.58
        },
        "emergency": {
            "general": "110",
            "police": "110",
            "ambulance": "119",
            "fire": "119"
        },
        "best_season": "March to May (Cherry Blossoms) or September to November (Autumn Foliage)",
        "hotels": [
            {
                "name": "Traditional Ryokan with Onsen Bath",
                "area": "Kyoto Gion / Hakone",
                "nightly_inr": 16000,
                "rating": 4.9
            },
            {
                "name": "Modern Shinjuku Skytower Hotel",
                "area": "Tokyo Shinjuku / Shibuya",
                "nightly_inr": 11000,
                "rating": 4.6
            }
        ],
        "transport": [
            {
                "mode": "Shinkansen Bullet Train",
                "note": "High-speed intercity transit between Tokyo, Kyoto, Osaka & Hiroshima",
                "estimated_inr": 8000
            },
            {
                "mode": "Tokyo Metro & JR Yamanote Line",
                "note": "Load an IC card (Suica or Pasmo on mobile) for tap-and-go gates",
                "estimated_inr": 1200
            }
        ],
        "restaurants": [
            {
                "name": "Tsukiji Outer Market Sushi Counter",
                "cuisine": "Fresh Edomae Sushi",
                "price_band": "¥¥¥",
                "area": "Tsukiji / Ginza"
            },
            {
                "name": "Kyoto Ramen & Gyoza Alley",
                "cuisine": "Authentic Tonkotsu & Miso Ramen",
                "price_band": "¥¥",
                "area": "Pontocho Alley"
            }
        ],
        "route_tip": "Purchase a digital Suica/Pasmo card on Apple Wallet or Google Wallet for immediate subway, bus, and vending machine payments.",
        "etiquette": {
            "dress": "Neat and modest; slip-on shoes recommended as shoes are removed at temples, ryokans, and traditional restaurants.",
            "tipping": "Strictly no tipping; good service is standard and leaving extra money can cause confusion or embarrassment.",
            "commute": "Keep mobile phones on silent ('manner mode') on trains; avoid speaking on calls or talking loudly.",
            "water": "Tap water is 100% safe and drinkable throughout Japan.",
            "plugs": "100V, 50/60Hz, Type A and Type B (two flat parallel pins)."
        },
        "eco": {
            "priorities": [
                "Rely on Japan's world-leading low-emission Shinkansen rail network",
                "Sort waste meticulously at station recycling bins",
                "Carry a small hand towel and reusable shopping bag (furoshiki)",
                "Support certified eco-ryokans with natural hot spring geothermal heating"
            ],
            "hotel_preference": "Choose Green Key certified eco-hotels near transit hubs that use non-disposable amenities."
        },
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
            "rate_to_inr": 92.5
        },
        "emergency": {
            "general": "112",
            "police": "17",
            "ambulance": "15",
            "fire": "18"
        },
        "best_season": "April to June or September to November (Mild weather, manageable queues)",
        "hotels": [
            {
                "name": "Boutique Boulevard Hotel",
                "area": "Saint-Germain / Latin Quarter",
                "nightly_inr": 15000,
                "rating": 4.7
            },
            {
                "name": "Charming Montmartre Studio Hotel",
                "area": "Montmartre / Opera",
                "nightly_inr": 9500,
                "rating": 4.4
            }
        ],
        "transport": [
            {
                "mode": "TGV InOui High-Speed Rail",
                "note": "Connects Paris to Lyon, Marseille, Nice, and Bordeaux in 2-3 hours",
                "estimated_inr": 5000
            },
            {
                "mode": "Paris Metro & RER Network",
                "note": "Use Navigo Easy contactless pass for unlimited daily zones 1-2 rides",
                "estimated_inr": 950
            }
        ],
        "restaurants": [
            {
                "name": "Classic Parisian Bistro & Brasserie",
                "cuisine": "Traditional French (Duck Confit, Beef Bourguignon)",
                "price_band": "€€€",
                "area": "Le Marais"
            },
            {
                "name": "Artisan Boulangerie & Creperie",
                "cuisine": "Fresh Baguettes, Croissants & Galettes",
                "price_band": "€",
                "area": "Rue Cler"
            }
        ],
        "route_tip": "Book timed-entry tickets for the Louvre, Eiffel Tower, and Palace of Versailles at least 3 weeks in advance.",
        "etiquette": {
            "dress": "Smart casual and chic; avoid overly casual gym wear when dining out in the evening.",
            "tipping": "Service is included ('service compris'); leaving 5-10% in coins for attentive restaurant service is polite.",
            "commute": "Always greet shopkeepers and drivers with 'Bonjour' upon entering and 'Merci, au revoir' upon leaving.",
            "water": "Tap water ('carafe d'eau') is free and high quality in all cafes and restaurants.",
            "plugs": "230V, 50Hz, Type C and Type E plugs."
        },
        "eco": {
            "priorities": [
                "Prioritize TGV rail journeys over short-haul domestic flights",
                "Utilize Velib bike-share programs along the Seine riverbanks",
                "Purchase from local open-air farmers markets (marches)",
                "Support eco-labeled hotels near pedestrian zones"
            ],
            "hotel_preference": "Opt for Clef Verte (Green Key) certified hotels with organic breakfast and towel reuse programs."
        },
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
            "rate_to_inr": 92.5
        },
        "emergency": {
            "general": "112",
            "police": "113",
            "ambulance": "118",
            "fire": "115"
        },
        "best_season": "April to June or September to October (Golden light, comfortable temperatures)",
        "hotels": [
            {
                "name": "Historic Piazza Boutique Hotel",
                "area": "Rome Centro Storico / Florence Santa Maria",
                "nightly_inr": 14500,
                "rating": 4.7
            },
            {
                "name": "Canal-View Venetian Inn",
                "area": "Venice Cannaregio / Dorsoduro",
                "nightly_inr": 13000,
                "rating": 4.5
            }
        ],
        "transport": [
            {
                "mode": "Frecciarossa High-Speed Rail",
                "note": "Rome to Florence in 1h 35m; Florence to Venice in 2h 15m",
                "estimated_inr": 4500
            },
            {
                "mode": "Vaporetto Water Bus & Metro",
                "note": "Venice water buses and Rome ATAC metro cards",
                "estimated_inr": 1100
            }
        ],
        "restaurants": [
            {
                "name": "Family-run Roman Trattoria",
                "cuisine": "Authentic Carbonara & Cacio e Pepe",
                "price_band": "€€",
                "area": "Trastevere, Rome"
            },
            {
                "name": "Artisan Wood-Fired Pizzeria & Gelateria",
                "cuisine": "Neapolitan Pizza & Handcrafted Gelato",
                "price_band": "€",
                "area": "Piazza Navona quarter"
            }
        ],
        "route_tip": "Validate train tickets at platform yellow stamping machines before boarding regional trains to avoid hefty fines.",
        "etiquette": {
            "dress": "Shoulders and knees must be covered inside all basilicas, including St. Peter's and the Pantheon.",
            "tipping": "A 'coperto' (cover charge) is often added to bills; rounding up a few Euros is appreciated but not mandatory.",
            "commute": "Cappuccino is strictly a morning drink; order espresso ('un caffe') after 11:00 AM.",
            "water": "Clean drinking water flows freely from historic public fountains ('nasoni') throughout Rome and Italian cities.",
            "plugs": "230V, 50Hz, Type C, F, and L plugs."
        },
        "eco": {
            "priorities": [
                "Travel intercity exclusively via Italy's extensive high-speed rail network (Trenitalia / Italo)",
                "Refill water bottles from ancient public fountains instead of buying single-use plastic",
                "Eat seasonal, zero-kilometer ('chilometro zero') produce at local trattorias",
                "Choose certified agriturismi (sustainable farm stays) in the countryside"
            ],
            "hotel_preference": "Select eco-certified historic palazzos that support local conservation and use solar water heating."
        },
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
            "rate_to_inr": 86.8
        },
        "emergency": {
            "general": "911",
            "police": "911",
            "ambulance": "911",
            "fire": "911"
        },
        "best_season": "April to June (Spring) or September to November (Fall)",
        "hotels": [
            {
                "name": "Midtown Manhattan Boutique Hotel",
                "area": "Manhattan / SoHo / Brooklyn",
                "nightly_inr": 19000,
                "rating": 4.6
            },
            {
                "name": "Pacific Coast Skyline Hotel",
                "area": "San Francisco / Seattle",
                "nightly_inr": 15000,
                "rating": 4.5
            }
        ],
        "transport": [
            {
                "mode": "MTA Subway & City Transit",
                "note": "OMNY contactless tap-and-go payment with weekly fare capping",
                "estimated_inr": 850
            },
            {
                "mode": "Amtrak Acela & Regional Rail",
                "note": "Convenient Northeast Corridor travel between NYC, Boston & Washington DC",
                "estimated_inr": 5500
            }
        ],
        "restaurants": [
            {
                "name": "Iconic Neighborhood Deli & Bagel House",
                "cuisine": "New York Pastrami, Bagels & Lox",
                "price_band": "$$",
                "area": "Lower East Side"
            },
            {
                "name": "Farm-to-Table American Bistro",
                "cuisine": "Modern American & Craft Burgers",
                "price_band": "$$$",
                "area": "Greenwich Village"
            }
        ],
        "route_tip": "Use contactless credit cards or phone wallets directly at subway turnstiles without waiting in ticket lines.",
        "etiquette": {
            "dress": "Casual and practical; comfortable walking sneakers are essential for extensive city walking.",
            "tipping": "Tipping is customary: 18-20% at sit-down restaurants, 10-15% for taxis, and $1-$2 per drink at bars.",
            "commute": "Stand to the right, walk to the left on escalators; allow subway passengers to exit before boarding.",
            "water": "Tap water is filtered and completely safe to drink in all US cities.",
            "plugs": "120V, 60Hz, Type A and Type B plugs."
        },
        "eco": {
            "priorities": [
                "Utilize comprehensive subway and bus transit instead of ride-hailing rentals",
                "Rent public city bikes (CitiBike) for park and river greenways",
                "Visit national and state parks adhering to 'Leave No Trace' principles",
                "Dine at B-Corp or zero-waste certified urban restaurants"
            ],
            "hotel_preference": "Choose LEED-certified sustainable hotels that eliminate single-use plastics."
        },
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
        "region": "Northern Europe",
        "currency": {
            "code": "GBP",
            "symbol": "£",
            "rate_to_inr": 110.2
        },
        "emergency": {
            "general": "999",
            "police": "999",
            "ambulance": "999",
            "fire": "999"
        },
        "best_season": "May to September (Warmest days, lush parks, long evening daylight)",
        "hotels": [
            {
                "name": "Historic West End Boutique Stay",
                "area": "Covent Garden / Bloomsbury",
                "nightly_inr": 17500,
                "rating": 4.7
            },
            {
                "name": "Riverside South Bank Hotel",
                "area": "South Bank / London Bridge",
                "nightly_inr": 13500,
                "rating": 4.5
            }
        ],
        "transport": [
            {
                "mode": "London Underground (The Tube)",
                "note": "Tap in and out with contactless card; daily cap automatically applied",
                "estimated_inr": 900
            },
            {
                "mode": "National Rail & LNER Express",
                "note": "Fast intercity routes connecting London to Edinburgh in 4h 20m",
                "estimated_inr": 4800
            }
        ],
        "restaurants": [
            {
                "name": "Traditional British Gastropub",
                "cuisine": "Fish & Chips, Sunday Roast, Shepherd's Pie",
                "price_band": "££",
                "area": "Soho / Mayfair"
            },
            {
                "name": "Borough Market Artisan Food Hall",
                "cuisine": "Artisan British Cheeses, Pasties & Global Street Food",
                "price_band": "£",
                "area": "London Bridge"
            }
        ],
        "route_tip": "The British Museum, National Gallery, and Tate Modern offer free general admission; book timed entry passes online to bypass queues.",
        "etiquette": {
            "dress": "Layered smart-casual; a compact umbrella or trench coat is recommended year-round.",
            "tipping": "A 12.5% discretionary service charge is often added to restaurant bills; no extra tip needed.",
            "commute": "Always stand on the right side of escalators; hold doors open for people behind you.",
            "water": "Tap water is fresh, clean, and perfectly safe to drink across the UK.",
            "plugs": "230V, 50Hz, Type G (three rectangular prongs)."
        },
        "eco": {
            "priorities": [
                "Travel intercity via the UK's electrified train lines instead of domestic flights",
                "Hire Santander Cycles for park routes across Hyde Park and Regent's Canal",
                "Stay in Green Tourism certified hotels and B&Bs",
                "Shop at independent neighborhood high streets and vintage markets"
            ],
            "hotel_preference": "Select Green Tourism Gold accredited accommodations with renewable electricity."
        },
        "suggestions": [
            "Big Ben, Westminster Abbey, and Houses of Parliament",
            "Tower of London and iconic Tower Bridge glass walkway",
            "British Museum treasures and Rosetta Stone",
            "Borough Market food crawl and South Bank river walk",
            "Buckingham Palace Changing of the Guard and St. James's Park",
            "Covent Garden street performers and Royal Opera House",
            "Edinburgh Castle and the historic Royal Mile",
            "Windsor Castle and Thames royal riverside walk"
        ]
    },
    "germany": {
        "name": "Germany",
        "region": "Central Europe",
        "currency": {
            "code": "EUR",
            "symbol": "€",
            "rate_to_inr": 92.5
        },
        "emergency": {
            "general": "112",
            "police": "110",
            "ambulance": "112",
            "fire": "112"
        },
        "best_season": "May to October (Pleasant outdoors, biergartens, festival season)",
        "hotels": [
            {
                "name": "Mitte Design Boutique Hotel",
                "area": "Berlin Mitte / Alexanderplatz",
                "nightly_inr": 11500,
                "rating": 4.6
            },
            {
                "name": "Bavarian Heritage City Hotel",
                "area": "Munich Marienplatz / Altstadt",
                "nightly_inr": 13000,
                "rating": 4.7
            }
        ],
        "transport": [
            {
                "mode": "Deutsche Bahn ICE High-Speed Train",
                "note": "Quiet, punctually engineered trains linking Berlin, Munich & Frankfurt",
                "estimated_inr": 4200
            },
            {
                "mode": "U-Bahn & S-Bahn City Rail",
                "note": "Validate paper tickets before boarding; barrier-free transit with spot checks",
                "estimated_inr": 750
            }
        ],
        "restaurants": [
            {
                "name": "Traditional Bavarian Wirtshaus",
                "cuisine": "Pretzels, Schnitzel, Spätzle & Knödel",
                "price_band": "€€",
                "area": "Viktualienmarkt, Munich"
            },
            {
                "name": "Berlin Street Food & Currywurst Stall",
                "cuisine": "Currywurst, Döner Kebab & Craft Cider",
                "price_band": "€",
                "area": "Kreuzberg, Berlin"
            }
        ],
        "route_tip": "Buy the 24-hour city transit pass for unlimited U-Bahn, S-Bahn, and tram travel across city zones.",
        "etiquette": {
            "dress": "Practical and weather-sensible; comfortable walking shoes are universal.",
            "tipping": "Round up bills by 5-10% ('Stimmt so') directly when handing cash or paying by card.",
            "commute": "Never jaywalk; wait for the green pedestrian light ('Ampelmann') even if no cars are visible.",
            "water": "Tap water ('Leitungswasser') is strictly controlled and among the purest in Europe.",
            "plugs": "230V, 50Hz, Type C and Type F (Schuko plug)."
        },
        "eco": {
            "priorities": [
                "Ride on Germany's world-class DB railway network running largely on green power",
                "Participate in the 'Pfand' bottle recycling system (return bottles for cash deposits)",
                "Cycle along dedicated city bike paths in Berlin and Munich",
                "Support certified Bio-Hotels serving 100% organic regional cuisine"
            ],
            "hotel_preference": "Choose certified Bio-Hotels with energy-efficient heat pumps and organic linen."
        },
        "suggestions": [
            "Brandenburg Gate and Reichstag glass dome tour",
            "Museum Island UNESCO art and history complex",
            "Berlin Wall Memorial and East Side Gallery outdoor art",
            "Marienplatz Glockenspiel and Munich Residenz palace",
            "Neuschwanstein fairytale castle day excursion",
            "English Garden Munich and Eisbach river surfers",
            "Heidelberg Castle and historic Neckar river bridge",
            "Cologne Cathedral twin Gothic spires tour"
        ]
    },
    "spain": {
        "name": "Spain",
        "region": "Southern Europe",
        "currency": {
            "code": "EUR",
            "symbol": "€",
            "rate_to_inr": 92.5
        },
        "emergency": {
            "general": "112",
            "police": "091",
            "ambulance": "061",
            "fire": "080"
        },
        "best_season": "April to June or September to November (Warm sunshine, comfortable touring)",
        "hotels": [
            {
                "name": "Eixample Modernist Boutique Hotel",
                "area": "Barcelona Eixample / Gothic Quarter",
                "nightly_inr": 13500,
                "rating": 4.7
            },
            {
                "name": "Historic Gran Via Palace Hotel",
                "area": "Madrid Centro / Retiro",
                "nightly_inr": 12000,
                "rating": 4.5
            }
        ],
        "transport": [
            {
                "mode": "Renfe AVE High-Speed Train",
                "note": "Zips between Madrid and Barcelona in just 2 hours 30 minutes",
                "estimated_inr": 4000
            },
            {
                "mode": "TMB Metro & City Buses",
                "note": "Purchase a T-Casual multi-trip card for discounted inner-city journeys",
                "estimated_inr": 800
            }
        ],
        "restaurants": [
            {
                "name": "Lively Tapas & Pintxos Bar",
                "cuisine": "Patatas Bravas, Jamón Ibérico, Gambas al Ajillo",
                "price_band": "€€",
                "area": "El Born, Barcelona"
            },
            {
                "name": "Traditional Seafood Paella House",
                "cuisine": "Valencian Paella & Sangria",
                "price_band": "€€€",
                "area": "Barceloneta Beachfront"
            }
        ],
        "route_tip": "Dinner in Spain begins late: restaurants open around 8:30 PM and peak between 9:30 PM and 11:00 PM.",
        "etiquette": {
            "dress": "Stylish casual wear; cover up when leaving beaches (walking shirtless on streets is fined).",
            "tipping": "Tipping is modest; rounding up 5-10% in cash for good service is customary.",
            "commute": "Many smaller shops observe afternoon siesta (2:00 PM - 5:00 PM); plan shopping accordingly.",
            "water": "Tap water is safe across Spain; bottled water is also inexpensive.",
            "plugs": "230V, 50Hz, Type C and Type F plugs."
        },
        "eco": {
            "priorities": [
                "Use AVE bullet trains instead of short domestic flights across Spain",
                "Walk the pedestrianized Gothic and historic quarters",
                "Select Biosphere Sustainable Lifestyle certified accommodations",
                "Savor seasonal, locally harvested olive oils, citrus, and produce"
            ],
            "hotel_preference": "Book Biosphere certified boutique hotels that prioritize water conservation."
        },
        "suggestions": [
            "Sagrada Familia basilica and Gaudi architecture tour",
            "Park Güell mosaic terraces and city skyline vista",
            "Barcelona Gothic Quarter and lively Las Ramblas stroll",
            "Madrid Prado Museum and historic Retiro Park rowboats",
            "Royal Palace of Madrid and Plaza Mayor tapas crawl",
            "Alhambra palace and Generalife gardens in Granada",
            "Seville Cathedral and Alcazar royal palace complex",
            "Costa Brava Mediterranean hidden coves and fishing villages"
        ]
    },
    "united arab emirates": {
        "name": "United Arab Emirates",
        "region": "Middle East",
        "currency": {
            "code": "AED",
            "symbol": "AED",
            "rate_to_inr": 23.6
        },
        "emergency": {
            "general": "999",
            "police": "999",
            "ambulance": "998",
            "fire": "997"
        },
        "best_season": "November to March (Pleasant 24-28°C sunny days, cool evenings)",
        "hotels": [
            {
                "name": "Downtown Skyline Luxury Hotel",
                "area": "Downtown Dubai / Burj Khalifa",
                "nightly_inr": 16000,
                "rating": 4.8
            },
            {
                "name": "Marina Waterfront Promenade Resort",
                "area": "Dubai Marina / JBR",
                "nightly_inr": 13500,
                "rating": 4.6
            }
        ],
        "transport": [
            {
                "mode": "Dubai Metro (Red & Green lines)",
                "note": "Driverless, air-conditioned metro; purchase a Silver Nol Card",
                "estimated_inr": 600
            },
            {
                "mode": "Traditional Abra Boat & Careem/Uber",
                "note": "1 AED abra ride across Dubai Creek; app taxis for long hops",
                "estimated_inr": 1200
            }
        ],
        "restaurants": [
            {
                "name": "Emirati & Levantine Fine Dining",
                "cuisine": "Al Machboos, Hummus, Shawarma & Fresh Grills",
                "price_band": "$$$",
                "area": "Al Fahidi / Downtown"
            },
            {
                "name": "Dubai Creek Heritage Cafe",
                "cuisine": "Arabic Coffee (Gahwa), Dates & Luqaimat",
                "price_band": "$$",
                "area": "Al Seef Heritage District"
            }
        ],
        "route_tip": "Book Burj Khalifa 'At the Top' observation deck tickets during sunset hours for spectacular desert-to-sea twilight views.",
        "etiquette": {
            "dress": "Respectful dress in malls and public places (cover shoulders and knees); swimwear is fine at beach resorts.",
            "tipping": "10-15% is standard in restaurants if no service fee is included; round up taxi fares.",
            "commute": "Dubai Metro has dedicated Gold Class and Women & Children carriages; check signs before boarding.",
            "water": "Desalinated tap water is safe for boiling/brushing; bottled or filtered water is preferred for drinking.",
            "plugs": "230V, 50Hz, Type G (three rectangular prongs)."
        },
        "eco": {
            "priorities": [
                "Utilize the fully electric, autonomous Dubai Metro and Tram system",
                "Explore eco-conservation desert reserves (DDCR) with authorized green operators",
                "Support Dubai Sustainable Tourism (DST) accredited hotels",
                "Visit indoor solar-cooled attractions and shaded heritage courtyards"
            ],
            "hotel_preference": "Choose DST-certified green hotels with energy-efficient cooling and zero-waste initiatives."
        },
        "suggestions": [
            "Burj Khalifa 124th floor observation deck and fountain show",
            "Dubai Mall and underwater aquarium walk",
            "Al Fahidi historic neighborhood and Gold & Spice Souks",
            "Desert safari dune drive, camel ride, and Bedouin dinner",
            "Dubai Marina promenade and JBR beach stroll",
            "Museum of the Future architectural marvel tour",
            "Sheikh Zayed Grand Mosque day tour to Abu Dhabi",
            "Louvre Abu Dhabi dome and sea-gallery pavilion"
        ]
    },
    "thailand": {
        "name": "Thailand",
        "region": "Southeast Asia",
        "currency": {
            "code": "THB",
            "symbol": "฿",
            "rate_to_inr": 2.55
        },
        "emergency": {
            "general": "191",
            "police": "191",
            "ambulance": "1669",
            "tourist_police": "1155"
        },
        "best_season": "November to February (Cool and dry season with pleasant tropical breezes)",
        "hotels": [
            {
                "name": "Riverside Tropical Boutique Resort",
                "area": "Chao Phraya River, Bangkok",
                "nightly_inr": 7500,
                "rating": 4.7
            },
            {
                "name": "Island Clifftop Villa",
                "area": "Phuket / Krabi / Koh Samui",
                "nightly_inr": 9000,
                "rating": 4.6
            }
        ],
        "transport": [
            {
                "mode": "BTS Skytrain & MRT Subway",
                "note": "Fast air-conditioned escape from Bangkok street traffic; Rabbit card accepted",
                "estimated_inr": 450
            },
            {
                "mode": "Chao Phraya Express Boat & Tuk-Tuks",
                "note": "River boats reach Grand Palace and Wat Arun for under 30 THB",
                "estimated_inr": 350
            }
        ],
        "restaurants": [
            {
                "name": "Chinatown Michelin Bib Gourmand Stall",
                "cuisine": "Pad Thai, Crab Fried Rice & Tom Yum Goong",
                "price_band": "฿",
                "area": "Yaowarat (Chinatown)"
            },
            {
                "name": "Authentic Riverside Thai Pavilion",
                "cuisine": "Green Curry, Massaman & Mango Sticky Rice",
                "price_band": "฿฿",
                "area": "Riverside Old Town"
            }
        ],
        "route_tip": "Carry modest attire (long pants/skirt, sleeves) in your daypack for temple visits, as sarongs are strictly enforced at entrance gates.",
        "etiquette": {
            "dress": "Temples require covered shoulders, long pants or skirts, and removing shoes; beachwear is strictly for beaches.",
            "tipping": "Tipping is not traditional but 20-50 THB in small eateries and 10% in upscale restaurants is warmly appreciated.",
            "commute": "Never touch anyone's head (considered sacred) or point your feet at religious statues or people.",
            "water": "Do not drink unboiled tap water; bottled water is abundant and inexpensive.",
            "plugs": "220V, 50Hz, Type A, B, and C plugs."
        },
        "eco": {
            "priorities": [
                "Choose ethical elephant sanctuaries (strictly observation-only, no riding)",
                "Avoid single-use plastic straws and bags at 7-Elevens",
                "Use public ferries and Skytrain over idling tuk-tuks in heavy traffic",
                "Support community-based eco-tourism villages in Chiang Mai and Krabi"
            ],
            "hotel_preference": "Stay at Green Leaf certified eco-resorts that support local marine and forest conservation."
        },
        "suggestions": [
            "Grand Palace and Temple of the Emerald Buddha",
            "Wat Arun (Temple of Dawn) riverside porcelain spire",
            "Chatuchak Weekend Market and Yaowarat night street food",
            "Chao Phraya river longtail boat canal tour",
            "Phi Phi Islands and Maya Bay turquoise lagoon cruise",
            "Chiang Mai old city moat, night bazaar, and Doi Suthep temple",
            "Ayutthaya UNESCO ancient kingdom ruins day excursion",
            "Railay Beach limestone cliffs and Phra Nang cave beach"
        ]
    },
    "australia": {
        "name": "Australia",
        "region": "Oceania",
        "currency": {
            "code": "AUD",
            "symbol": "$",
            "rate_to_inr": 56.2
        },
        "emergency": {
            "general": "000",
            "police": "000",
            "ambulance": "000",
            "fire": "000"
        },
        "best_season": "September to November (Spring) or March to May (Autumn)",
        "hotels": [
            {
                "name": "Harbour View Boutique Hotel",
                "area": "The Rocks / Circular Quay, Sydney",
                "nightly_inr": 16500,
                "rating": 4.8
            },
            {
                "name": "Laneway Art Heritage Stay",
                "area": "Melbourne CBD / Southbank",
                "nightly_inr": 12500,
                "rating": 4.5
            }
        ],
        "transport": [
            {
                "mode": "Sydney Ferries & Opal Network",
                "note": "Scenic harbour ferries to Manly and Taronga; tap with credit cards",
                "estimated_inr": 750
            },
            {
                "mode": "Melbourne Free Tram Zone",
                "note": "Hop on and off any city tram within the central grid for free",
                "estimated_inr": 0
            }
        ],
        "restaurants": [
            {
                "name": "Waterfront Seafood & Oyster Bar",
                "cuisine": "Sydney Rock Oysters, Barramundi & Aussie Pavlova",
                "price_band": "$$$",
                "area": "Circular Quay"
            },
            {
                "name": "Melbourne Laneway Specialty Coffee Hub",
                "cuisine": "Artisan Flat Whites, Avocado Toast & Brunch",
                "price_band": "$$",
                "area": "Degraves Street / Flinders"
            }
        ],
        "route_tip": "Take the public ferry from Circular Quay to Manly for panoramic harbour views at a fraction of tourist cruise prices.",
        "etiquette": {
            "dress": "Relaxed and casual; sun protection (broad-spectrum SPF 50+, hat, sunglasses) is essential under the strong Southern sun.",
            "tipping": "Tipping is never expected as workers earn fair minimum wages; 10% for exceptional dining is a generous bonus.",
            "commute": "Swim strictly between the red and yellow flags on beaches where surf lifesavers patrol.",
            "water": "Tap water is thoroughly treated, fresh, and safe across Australia.",
            "plugs": "230V, 50Hz, Type I (two angled flat pins)."
        },
        "eco": {
            "priorities": [
                "Use public electric trains and ferries connecting coastal routes",
                "Choose Master Reef Guides and Eco-Certified operators for Great Barrier Reef trips",
                "Observe wildlife like koalas and kangaroos only in accredited nature reserves",
                "Carry a reusable keep-cup for takeaway flat whites"
            ],
            "hotel_preference": "Choose Ecotourism Australia certified accommodations that utilize rainwater harvesting."
        },
        "suggestions": [
            "Sydney Opera House and Harbour Bridge walk",
            "Bondi to Coogee scenic coastal cliff walk",
            "Manly Beach scenic ferry cruise across Sydney Harbour",
            "Melbourne street art laneways and coffee trail",
            "Great Barrier Reef snorkeling and coral reef tour",
            "Great Ocean Road and Twelve Apostles limestone stacks",
            "Blue Mountains National Park and Three Sisters viewpoint",
            "Uluru-Kata Tjuta sacred desert sunrise and culture tour"
        ]
    },
    "singapore": {
        "name": "Singapore",
        "region": "Southeast Asia",
        "currency": {
            "code": "SGD",
            "symbol": "$",
            "rate_to_inr": 65.4
        },
        "emergency": {
            "general": "999",
            "police": "999",
            "ambulance": "995",
            "fire": "995"
        },
        "best_season": "November to January (Festive light-ups) or July to September (Great Singapore Sale & F1)",
        "hotels": [
            {
                "name": "Marina Bay Luxury Bayview Hotel",
                "area": "Marina Bay / Downtown",
                "nightly_inr": 18500,
                "rating": 4.9
            },
            {
                "name": "Heritage Shophouse Boutique Hotel",
                "area": "Chinatown / Tanjong Pagar",
                "nightly_inr": 10500,
                "rating": 4.6
            }
        ],
        "transport": [
            {
                "mode": "SMRT Subway Network",
                "note": "World's most efficient, fully air-conditioned metro; tap with any credit card",
                "estimated_inr": 350
            },
            {
                "mode": "Grab Ride-Hailing",
                "note": "Convenient fixed-price rides across the island",
                "estimated_inr": 750
            }
        ],
        "restaurants": [
            {
                "name": "Maxwell Hawker Food Centre",
                "cuisine": "Tian Tian Hainanese Chicken Rice & Laksa",
                "price_band": "$",
                "area": "Chinatown"
            },
            {
                "name": "Marina Waterfront Seafood Restaurant",
                "cuisine": "Chilli Crab, Black Pepper Crab & Mantou",
                "price_band": "$$$",
                "area": "Clarke Quay"
            }
        ],
        "route_tip": "Visit Gardens by the Bay's outdoor Supertree Grove at 7:45 PM or 8:45 PM for the free Garden Rhapsody musical light show.",
        "etiquette": {
            "dress": "Lightweight breathable fabrics; carry a light jacket for heavily air-conditioned malls and MRT trains.",
            "tipping": "No tipping culture; 10% service charge and GST are already included in final restaurant bills.",
            "commute": "Chewing gum is prohibited; no eating or drinking (even water) on MRT trains or stations.",
            "water": "Tap water is potable, clean, and tested to WHO standards.",
            "plugs": "230V, 50Hz, Type G (three rectangular pins)."
        },
        "eco": {
            "priorities": [
                "Travel entirely on Singapore's low-carbon MRT network",
                "Explore the Green Corridor and park connector networks by foot or shared bike",
                "Dine at UNESCO-recognized hawker centres that prioritize local food supply chains",
                "Experience biophilic architecture like Jewel Changi and Gardens by the Bay"
            ],
            "hotel_preference": "Choose BCA Green Mark Platinum certified eco-hotels like PARKROYAL on Pickering."
        },
        "suggestions": [
            "Gardens by the Bay Supertree Grove and Cloud Forest dome",
            "Marina Bay Sands SkyPark observation deck",
            "Chinatown heritage street food and Buddha Tooth Relic temple",
            "Little India colourful spice alleys and Sri Veeramakaliamman temple",
            "Sentosa Island beaches and cable car ride",
            "Jewel Changi Airport indoor waterfall rain vortex",
            "Singapore Botanic Gardens UNESCO tropical orchid garden",
            "Clarke Quay riverside dining and evening boat cruise"
        ]
    },
    "canada": {
        "name": "Canada",
        "region": "North America",
        "currency": {
            "code": "CAD",
            "symbol": "$",
            "rate_to_inr": 62.5
        },
        "emergency": {
            "general": "911",
            "police": "911",
            "ambulance": "911",
            "fire": "911"
        },
        "best_season": "June to September (Warm summer, lakes thawed) or December to March (Winter sports)",
        "hotels": [
            {
                "name": "Rocky Mountain Alpine Chalet",
                "area": "Banff / Lake Louise",
                "nightly_inr": 17500,
                "rating": 4.8
            },
            {
                "name": "Downtown Waterfront Hotel",
                "area": "Vancouver Coal Harbour / Toronto",
                "nightly_inr": 13000,
                "rating": 4.6
            }
        ],
        "transport": [
            {
                "mode": "VIA Rail & Rocky Mountaineer",
                "note": "Scenic trans-Canadian passenger rail connecting major provinces",
                "estimated_inr": 6000
            },
            {
                "mode": "TTC Subway & Vancouver SkyTrain",
                "note": "Clean, contactless transit through metropolitan downtowns",
                "estimated_inr": 650
            }
        ],
        "restaurants": [
            {
                "name": "Quebecois Traditional Brasserie",
                "cuisine": "Authentic Poutine, Maple Glazed Salmon, Tourtiere",
                "price_band": "$$",
                "area": "Old Montreal / Quebec"
            },
            {
                "name": "Pacific Coast Salmon & Oyster Bar",
                "cuisine": "Wild BC Salmon, Spot Prawns & Local Cider",
                "price_band": "$$$",
                "area": "Gastown, Vancouver"
            }
        ],
        "route_tip": "Purchase a Parks Canada Discovery Pass if visiting more than two national parks like Banff and Jasper.",
        "etiquette": {
            "dress": "Layered outdoor clothing; warm thermal underlayers and waterproof outer shells in winter/shoulder seasons.",
            "tipping": "15-20% is standard in restaurants and bars; 10% for taxis.",
            "commute": "Always hold doors open and say 'sorry' and 'thank you'—politeness is a genuine cultural hallmark.",
            "water": "Tap water is fresh, clean, and safe across all Canadian cities and towns.",
            "plugs": "120V, 60Hz, Type A and Type B plugs."
        },
        "eco": {
            "priorities": [
                "Stick to marked trails to protect sensitive alpine tundra and national park flora",
                "Store food in bear-proof bins and maintain distance from wildlife",
                "Use public shuttle buses (Roam Transit) in Banff to avoid car congestion",
                "Support Indigenous-led eco-tourism experiences"
            ],
            "hotel_preference": "Choose Green Key Eco-Rating certified mountain lodges powered by renewable hydro."
        },
        "suggestions": [
            "Lake Louise turquoise glacial waters and Moraine Lake",
            "Banff National Park gondola and sulfur mountain boardwalk",
            "Niagara Falls boat cruise and panoramic gorge viewpoints",
            "Vancouver Stanley Park seawall cycling and Gastown steam clock",
            "Toronto CN Tower glass floor and harbor ferry cruise",
            "Old Quebec City cobblestone historic ramparts and Chateau Frontenac",
            "Icefields Parkway scenic glacial highway drive",
            "Whistler Blackcomb mountain village and Peak 2 Peak gondola"
        ]
    },
    "egypt": {
        "name": "Egypt",
        "region": "North Africa",
        "currency": {
            "code": "EGP",
            "symbol": "E£",
            "rate_to_inr": 1.75
        },
        "emergency": {
            "general": "122",
            "police": "122",
            "ambulance": "123",
            "tourist_police": "126"
        },
        "best_season": "October to April (Comfortable desert temperatures and sunny days)",
        "hotels": [
            {
                "name": "Pyramid-View Heritage Palace Hotel",
                "area": "Giza / Cairo",
                "nightly_inr": 12000,
                "rating": 4.7
            },
            {
                "name": "Nile Riverside Luxury Resort",
                "area": "Luxor / Aswan",
                "nightly_inr": 9500,
                "rating": 4.6
            }
        ],
        "transport": [
            {
                "mode": "Nile River Cruise Boat",
                "note": "Multi-day cruise linking Luxor and Aswan past historic temples",
                "estimated_inr": 4500
            },
            {
                "mode": "Cairo Metro & Uber",
                "note": "Use Uber for upfront metered pricing in Cairo rather than hailing taxis",
                "estimated_inr": 400
            }
        ],
        "restaurants": [
            {
                "name": "Traditional Egyptian Grill & Mezze House",
                "cuisine": "Koshary, Shish Taouk, Molokhia & Fresh Pita",
                "price_band": "E£",
                "area": "Zamalek / Giza"
            },
            {
                "name": "Historic Khan el-Khalili Tea Lounge",
                "cuisine": "Mint Tea, Hibiscus (Karkadeh) & Baklava",
                "price_band": "E£",
                "area": "Islamic Cairo"
            }
        ],
        "route_tip": "Visit the Pyramids of Giza early in the morning right at 8:00 AM opening to beat tour buses and afternoon desert heat.",
        "etiquette": {
            "dress": "Modest clothing covering shoulders, upper arms, and knees; light linen scarves are handy for mosques.",
            "tipping": "Tipping ('Baksheesh') is an everyday part of culture; carry small EGP banknotes for drivers, porters, and restroom attendants.",
            "commute": "Haggling is polite and expected in souks and traditional bazaars; negotiate with a friendly smile.",
            "water": "Drink only sealed bottled water; avoid ice in drinks at street stalls.",
            "plugs": "220V, 50Hz, Type C and Type F plugs."
        },
        "eco": {
            "priorities": [
                "Support local felucca sailboat captains over noisy diesel motorboats on the Nile",
                "Never climb or touch ancient temple carvings and tomb paintings",
                "Buy handcrafted alabaster and papyrus from registered artisan cooperatives",
                "Carry reusable water canteens and UV water purifiers"
            ],
            "hotel_preference": "Choose Green Star certified hotels in the Nile Valley and Red Sea resorts."
        },
        "suggestions": [
            "Great Pyramids of Giza and the Sphinx panorama",
            "Grand Egyptian Museum (GEM) and Tutankhamun treasures",
            "Karnak Temple hypostyle hall of towering stone pillars",
            "Valley of the Kings royal pharaoh tombs in Luxor",
            "Khan el-Khalili historic bazaar and Islamic Cairo lanes",
            "Felucca sailboat cruise on the Nile River at sunset",
            "Abu Simbel colossal temples carved into sandstone mountains",
            "Alexandria Mediterranean Corniche and ancient Citadel of Qaitbay"
        ]
    },
    "greece": {
        "name": "Greece",
        "region": "Southern Europe",
        "currency": {
            "code": "EUR",
            "symbol": "€",
            "rate_to_inr": 92.5
        },
        "emergency": {
            "general": "112",
            "police": "100",
            "ambulance": "166",
            "tourist_police": "171"
        },
        "best_season": "April to June or September to October (Warm sea, golden sunshine, no scorching crowds)",
        "hotels": [
            {
                "name": "Caldera View Clifftop Suites",
                "area": "Oia / Fira, Santorini",
                "nightly_inr": 18000,
                "rating": 4.9
            },
            {
                "name": "Acropolis View Boutique Hotel",
                "area": "Plaka / Monastiraki, Athens",
                "nightly_inr": 11000,
                "rating": 4.6
            }
        ],
        "transport": [
            {
                "mode": "Aegean Sea High-Speed Ferry",
                "note": "Blue Star & Seajets connect Athens to Santorini, Mykonos, and Crete",
                "estimated_inr": 4800
            },
            {
                "mode": "Athens Metro & Island Scooters",
                "note": "Direct metro from airport to city center; quad bikes on islands",
                "estimated_inr": 650
            }
        ],
        "restaurants": [
            {
                "name": "Traditional Greek Seaside Taverna",
                "cuisine": "Greek Salad, Souvlaki, Moussaka, Fresh Calamari",
                "price_band": "€€",
                "area": "Plaka, Athens"
            },
            {
                "name": "Oia Sunset Seafood Terrace",
                "cuisine": "Grilled Octopus, Fava Dip & Santorini Assyrtiko Wine",
                "price_band": "€€€",
                "area": "Oia Cliffs, Santorini"
            }
        ],
        "route_tip": "Visit the Acropolis right at 8:00 AM or after 5:00 PM to avoid the intense midday Mediterranean sun and tour groups.",
        "etiquette": {
            "dress": "Comfortable summer clothing; sturdy sneakers for slippery ancient marble ruins; cover up in monasteries.",
            "tipping": "Tipping 5-10% is customary at tavernas; leave cash on the table or add to the card payment.",
            "commute": "Island ferry schedules can occasionally shift with high Aegean winds ('Meltemi'); keep a buffer day.",
            "water": "Tap water is safe in Athens and mainland cities; on islands, bottled or desalinated water is standard.",
            "plugs": "230V, 50Hz, Type C and Type F plugs."
        },
        "eco": {
            "priorities": [
                "Travel between nearby islands via conventional passenger ferries with lower fuel burns",
                "Choose family-owned island pensions and agro-tavernas serving homegrown olive oil",
                "Protect fragile marine habitats by using reef-safe sunscreen in the Aegean",
                "Walk ancient village stone paths and mule tracks ('monopatia')"
            ],
            "hotel_preference": "Choose Green Key certified boutique hotels using solar thermal water systems."
        },
        "suggestions": [
            "Acropolis, Parthenon, and new Acropolis Museum",
            "Plaka historic quarter cobblestones and bougainvillea cafes",
            "Oia village sunset viewpoint overlooking Santorini caldera",
            "Delphi ancient oracle sanctuary and mountain vista",
            "Mykonos windmills and picturesque Little Venice waterfront",
            "Meteora cliff-top Eastern Orthodox monasteries",
            "Knossos Minoan palace archaeological site in Crete",
            "Monastiraki flea market and vibrant street food tavernas"
        ]
    },
    "india": {
        "name": "India",
        "region": "South Asia",
        "currency": {
            "code": "INR",
            "symbol": "₹",
            "rate_to_inr": 1.0
        },
        "emergency": {
            "general": "112",
            "police": "100",
            "ambulance": "108",
            "tourist_police": "1363"
        },
        "best_season": "October to March (Pleasant sunny days, cool evenings across most states)",
        "hotels": [
            {
                "name": "Heritage Haveli Palace Hotel",
                "area": "Central Heritage District / Old City",
                "nightly_inr": 5500,
                "rating": 4.6
            },
            {
                "name": "Eco-Friendly Boutique Resort",
                "area": "Lakeside / Plantation Area",
                "nightly_inr": 4200,
                "rating": 4.4
            }
        ],
        "transport": [
            {
                "mode": "Vande Bharat Express & Indian Railways",
                "note": "High-speed and comfortable intercity train travel",
                "estimated_inr": 1200
            },
            {
                "mode": "Metro Rail & Pre-Paid Auto-Rickshaw",
                "note": "Fast city transit with contactless QR ticketing; Uber/Ola for cabs",
                "estimated_inr": 350
            }
        ],
        "restaurants": [
            {
                "name": "Regional Heritage Thali House",
                "cuisine": "Authentic Regional Specialties & Breads",
                "price_band": "₹₹",
                "area": "Historic Bazaar District"
            },
            {
                "name": "Artisan Street Food & Chai Trail",
                "cuisine": "Fresh Chaat, Samosas, Dosas & Masala Chai",
                "price_band": "₹",
                "area": "Old Market Quarter"
            }
        ],
        "route_tip": "Group attractions by neighborhood to avoid midday traffic; book monuments like Taj Mahal and Red Fort online via ASI.",
        "etiquette": {
            "dress": "Modest clothing covering shoulders and knees; footwear must be removed before entering shrines and homes.",
            "tipping": "5-10% is customary in sit-down restaurants; tipping small change for luggage assistance is polite.",
            "commute": "Pre-paid taxi booths at railway stations and airports offer safe, fixed transparent fares.",
            "water": "Stick to sealed bottled or purified water; ensure hot, freshly cooked food at busy street stalls.",
            "plugs": "230V, 50Hz, Type C, D, and M plugs."
        },
        "eco": {
            "priorities": [
                "Prioritize electrified Indian Railways and Vande Bharat trains over domestic flights",
                "Choose verified heritage havelis and eco-stays supporting local craftspeople",
                "Use electric auto-rickshaws (e-rickshaws) and city metro rails",
                "Support handloom cooperatives and GI-tagged artisan bazaars"
            ],
            "hotel_preference": "Choose certified heritage homestays and eco-resorts with solar heating and rainwater harvesting."
        },
        "suggestions": [
            "Amber Fort royal courtyard and scenic walking route",
            "City Palace complex and astronomical observatory",
            "Hawa Mahal landmark viewpoint and bazaar walk",
            "Historic spice market and authentic thali lunch",
            "Sunset viewpoint overlooking the ancient city ramparts",
            "Lakeside promenade and evening classical music showcase",
            "Artisan block printing and textile workshop visit",
            "Local street food discovery trail with a culinary guide"
        ]
    },
    "turkey": {
        "name": "Turkey",
        "region": "Eurasia",
        "currency": {
            "code": "TRY",
            "symbol": "₺",
            "rate_to_inr": 2.5
        },
        "emergency": {
            "general": "112",
            "police": "155",
            "ambulance": "112",
            "fire": "110"
        },
        "best_season": "April to May and September to October",
        "hotels": [
            {
                "name": "Sultanahmet Heritage Boutique Hotel",
                "area": "Old City Istanbul",
                "nightly_inr": 9500,
                "rating": 4.7
            },
            {
                "name": "Cave Suites & Terrace",
                "area": "Goreme, Cappadocia",
                "nightly_inr": 12000,
                "rating": 4.8
            }
        ],
        "transport": [
            {
                "mode": "Istanbulkart Ferry & Tram",
                "note": "Use contactless card for Bosphorus ferries and scenic T1 tram line",
                "estimated_inr": 450
            },
            {
                "mode": "High-Speed YHT Rail",
                "note": "Modern high-speed train connecting Istanbul and Ankara",
                "estimated_inr": 2200
            }
        ],
        "restaurants": [
            {
                "name": "Traditional Ottoman Palace Cuisine",
                "cuisine": "Turkish Imperial",
                "price_band": "$$$",
                "area": "Sultanahmet"
            },
            {
                "name": "Bosphorus Fresh Meze & Catch of the Day",
                "cuisine": "Mediterranean Seafood",
                "price_band": "$$",
                "area": "Karakoy / Ortakoy"
            }
        ],
        "route_tip": "Buy the Museum Pass Istanbul to skip ticket lines at Topkapi Palace and Galata Tower.",
        "etiquette": {
            "dress": "Modest clothing at mosques; headscarf and covered arms/legs required inside Blue Mosque.",
            "tipping": "5-10% at casual dining, 10-15% at upscale restaurants; round up taxi meters.",
            "commute": "Get an Istanbulkart card for ferries, trams, and metro; take Bosphorus public ferries for scenic views.",
            "water": "Drink bottled water; tap water is used mainly for washing and boiling tea.",
            "plugs": "230V, 50Hz, Type C and Type F."
        },
        "eco": {
            "priorities": [
                "Take scenic electric city trams and shared public Bosphorus commuter ferries",
                "Stay in restored historic cave suites and traditional Ottoman heritage konaks",
                "Support family-run carpet weaving and ceramic artisan cooperatives in Cappadocia",
                "Choose walking culinary tours across historic Spice Bazaar and Kadikoy markets"
            ],
            "hotel_preference": "Eco-conscious cave lodges and restored timber mansions utilizing passive stone cooling and solar thermal water heating."
        },
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
            "rate_to_inr": 92.5
        },
        "emergency": {
            "general": "112",
            "police": "112",
            "ambulance": "112",
            "fire": "112"
        },
        "best_season": "April to May (Tulips) or June to September",
        "hotels": [
            {
                "name": "Canal House Heritage Boutique",
                "area": "Jordaan Canal Ring, Amsterdam",
                "nightly_inr": 16500,
                "rating": 4.7
            },
            {
                "name": "Historic Waterfront Hotel",
                "area": "Oosterdok / De Pijp",
                "nightly_inr": 12500,
                "rating": 4.5
            }
        ],
        "transport": [
            {
                "mode": "NS Dutch Railways & City Trams",
                "note": "Tap in and out using contactless bank cards or OV-chipkaart",
                "estimated_inr": 850
            },
            {
                "mode": "City Rental Bicycle",
                "note": "Netherlands possesses the world's most extensive cycling network",
                "estimated_inr": 1200
            }
        ],
        "restaurants": [
            {
                "name": "Traditional Dutch Brown Cafe & Bitterballen",
                "cuisine": "Dutch Historic Pub",
                "price_band": "$$",
                "area": "Prinsengracht"
            },
            {
                "name": "Artisan Indonesian Rijsttafel Dining",
                "cuisine": "Indo-Dutch Heritage",
                "price_band": "$$$",
                "area": "Museumplein"
            }
        ],
        "route_tip": "Book Van Gogh and Anne Frank House tickets several weeks in advance; never walk on red bicycle paths.",
        "etiquette": {
            "dress": "Casual and bike-friendly; water-resistant rain jacket and flat shoes are essentials.",
            "tipping": "5-10% for good service is standard, though service is included in the bill.",
            "commute": "Never walk in designated reddish cycling lanes; rent an OV-chipkaart or tap contactless for transit.",
            "water": "Dutch tap water is of the purest quality in Europe, unfiltered straight from the tap.",
            "plugs": "230V, 50Hz, Type C and Type F."
        },
        "eco": {
            "priorities": [
                "Cycle everywhere on designated Dutch bicycle highways ('fietspaden')",
                "Travel intercity via 100% wind-powered NS electric trains",
                "Stay in Green Key certified carbon-neutral canal hotels",
                "Drink pure municipal tap water and skip single-use plastic bottles"
            ],
            "hotel_preference": "Accommodations with Green Key gold certification and geothermal heating along canal belts."
        },
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
            "rate_to_inr": 92.5
        },
        "emergency": {
            "general": "112",
            "police": "112",
            "ambulance": "112",
            "fire": "112"
        },
        "best_season": "March to June and September to November",
        "hotels": [
            {
                "name": "Alfama Azulejo Historic Residence",
                "area": "Old Alfama Quarter, Lisbon",
                "nightly_inr": 11500,
                "rating": 4.6
            },
            {
                "name": "Douro Riverfront Wine Boutique",
                "area": "Ribeira, Porto",
                "nightly_inr": 13000,
                "rating": 4.7
            }
        ],
        "transport": [
            {
                "mode": "CP Portuguese Railways & Historic Trams",
                "note": "Use Viva Viagem card across Lisbon metro, vintage funiculars, and suburban lines",
                "estimated_inr": 600
            },
            {
                "mode": "Regional Coastal Trains",
                "note": "Scenic railway along Cascais beachline and Douro valley",
                "estimated_inr": 1100
            }
        ],
        "restaurants": [
            {
                "name": "Traditional Portuguese Tasca & Bacalhau",
                "cuisine": "Portuguese Seafood",
                "price_band": "$$",
                "area": "Bairro Alto"
            },
            {
                "name": "Historic Fado House & Port Wine Cellar",
                "cuisine": "Fado Dinner & Port Tasting",
                "price_band": "$$$",
                "area": "Alfama / Gaia"
            }
        ],
        "route_tip": "Catch vintage Tram 28 early in the morning before crowds; buy advance train tickets for Sintra day trip.",
        "etiquette": {
            "dress": "Smart-casual; sturdy rubber-soled shoes for steep cobblestone streets ('calcada').",
            "tipping": "5-10% at restaurants if satisfied; small coins at cafes.",
            "commute": "Tram 28 in Lisbon is historic; Viva Viagem card covers metro, funiculars, and ferries.",
            "water": "Tap water is strictly safe and drinkable everywhere in Portugal.",
            "plugs": "230V, 50Hz, Type C and Type F."
        },
        "eco": {
            "priorities": [
                "Ride electric historic trams and suburban rail to Sintra and Cascais",
                "Choose family-owned guest houses ('solares') supporting regional communities",
                "Eat seasonal fresh sardines, coastal seafood, and locally harvested olive oils",
                "Explore dramatic Algarve cliff trails on foot via the Seven Hanging Valleys trail"
            ],
            "hotel_preference": "Heritage solar manor stays and eco-resorts with solar photovoltaic arrays and organic herb gardens."
        },
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
            "rate_to_inr": 92.5
        },
        "emergency": {
            "general": "112",
            "police": "133",
            "ambulance": "144",
            "fire": "122"
        },
        "best_season": "May to September (Alpine lakes) or December to March (Skiing)",
        "hotels": [
            {
                "name": "Imperial Ringstrasse Grand Hotel",
                "area": "Innere Stadt, Vienna",
                "nightly_inr": 17500,
                "rating": 4.8
            },
            {
                "name": "Alpine Lakeview Chalet Resort",
                "area": "Hallstatt / Salzkammergut",
                "nightly_inr": 15000,
                "rating": 4.7
            }
        ],
        "transport": [
            {
                "mode": "ÖBB Austrian Federal Railways",
                "note": "Railjet high-speed trains link Vienna, Salzburg, and Innsbruck seamlessly",
                "estimated_inr": 3200
            },
            {
                "mode": "Vienna Wiener Linien Transit",
                "note": "Efficient subways, buses, and scenic Ringstrasse trams",
                "estimated_inr": 750
            }
        ],
        "restaurants": [
            {
                "name": "Historic Viennese Coffeehouse & Melange",
                "cuisine": "Viennese Cafe Culture",
                "price_band": "$$",
                "area": "Herrengasse / Graben"
            },
            {
                "name": "Traditional Wiener Schnitzel & Tafelspitz Gasthaus",
                "cuisine": "Austrian Classical",
                "price_band": "$$$",
                "area": "Spittelberg"
            }
        ],
        "route_tip": "Validate subway tickets before boarding; reserve classical concert tickets at Musikverein or Opera in advance.",
        "etiquette": {
            "dress": "Elegant smart casual; formal attire expected at evening classical concerts and opera.",
            "tipping": "5-10% standard; round up total directly when paying waiter.",
            "commute": "Vienna U-Bahn operates on an honor system; buy and validate ticket before boarding.",
            "water": "Tap water is pure spring water brought directly by aqueducts from the Styrian Alps.",
            "plugs": "230V, 50Hz, Type C and Type F."
        },
        "eco": {
            "priorities": [
                "Travel on ÖBB trains powered entirely by renewable green hydroelectricity",
                "Stay in Austrian Eco-Label ('Österreichisches Umweltzeichen') certified hotels",
                "Drink pristine mountain spring water sourced straight from the Alps",
                "Hike clearly marked Alpine Club ('ÖAV') trail networks without motor vehicles"
            ],
            "hotel_preference": "Hotels certified under the Austrian Eco-Label featuring zero-emission biomass or alpine geothermal systems."
        },
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
            "rate_to_inr": 51.5
        },
        "emergency": {
            "general": "111",
            "police": "111",
            "ambulance": "111",
            "fire": "111"
        },
        "best_season": "December to March (Summer) or June to August (Snow sports)",
        "hotels": [
            {
                "name": "Lake Wakatipu Alpine Lodge",
                "area": "Queenstown Lakefront",
                "nightly_inr": 16000,
                "rating": 4.8
            },
            {
                "name": "Harbour Panorama Hotel",
                "area": "Auckland Central",
                "nightly_inr": 12500,
                "rating": 4.5
            }
        ],
        "transport": [
            {
                "mode": "InterCity Coach & KiwiRail",
                "note": "TranzAlpine scenic train through Southern Alps is one of the world's top rail journeys",
                "estimated_inr": 4800
            },
            {
                "mode": "Self-Drive Campervan",
                "note": "Popular mode for touring both North and South islands with freedom camping",
                "estimated_inr": 6500
            }
        ],
        "restaurants": [
            {
                "name": "Fiordland Wild Venison & Seafood Bistro",
                "cuisine": "Modern New Zealand",
                "price_band": "$$$",
                "area": "Queenstown Waterfront"
            },
            {
                "name": "Artisan Fergburger & Local Bakery",
                "cuisine": "Gourmet Burgers & Pastries",
                "price_band": "$$",
                "area": "Shotover Street"
            }
        ],
        "route_tip": "Allow extra driving time for winding mountain roads; book Milford Sound excursions in advance.",
        "etiquette": {
            "dress": "Outdoor adventure layers; strong windbreaker and waterproof outerwear.",
            "tipping": "No tipping culture; bills are final, tips for exceptional service are appreciated.",
            "commute": "Drive on the left side of the road; rental campervans are the premier way to tour both islands.",
            "water": "Tap water is fresh, clean, and drinkable across all towns.",
            "plugs": "230V, 50Hz, Type I three-pin angled plugs."
        },
        "eco": {
            "priorities": [
                "Uphold the 'Tiaki Promise' to protect natural habitats and care for wildlife",
                "Choose Qualmark certified sustainable eco-lodges and tour operators",
                "Stick strictly to designated DOC tracks on Great Walks to protect native flora",
                "Dispose of all waste responsibly and practice Leave No Trace principles"
            ],
            "hotel_preference": "Qualmark Enviro-Gold rated eco-lodges utilizing solar micro-grids and rainwater harvesting."
        },
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
            "rate_to_inr": 0.0055
        },
        "emergency": {
            "general": "112",
            "police": "110",
            "ambulance": "118",
            "fire": "113",
            "tourist": "021-3838899"
        },
        "best_season": "April to October (Dry season)",
        "hotels": [
            {
                "name": "Ayung River Jungle Valley Villa",
                "area": "Ubud, Bali",
                "nightly_inr": 11000,
                "rating": 4.8
            },
            {
                "name": "Sunset Clifftop Ocean Resort",
                "area": "Uluwatu / Seminyak, Bali",
                "nightly_inr": 14000,
                "rating": 4.7
            }
        ],
        "transport": [
            {
                "mode": "Private Chauffeur & Day Charter",
                "note": "Most comfortable and stress-free way to explore Bali temples and waterfalls",
                "estimated_inr": 2800
            },
            {
                "mode": "Fast Boat Island Transfer",
                "note": "Catamarans connecting Sanur to Nusa Penida and Gili Islands",
                "estimated_inr": 1500
            }
        ],
        "restaurants": [
            {
                "name": "Traditional Balinese Warung & Bebek Betutu",
                "cuisine": "Balinese Spice & Roast Duck",
                "price_band": "$$",
                "area": "Ubud Center"
            },
            {
                "name": "Jimbaran Bay Candlelit Seafood BBQ on the Sand",
                "cuisine": "Grilled Snapper & Prawns",
                "price_band": "$$$",
                "area": "Jimbaran Beach"
            }
        ],
        "route_tip": "Start temple tours at 7 AM to avoid tropical midday sun and coach tour arrivals.",
        "etiquette": {
            "dress": "Wear a sarong and sash when entering Balinese Hindu temples; modest clothing outside beaches.",
            "tipping": "5-10% at restaurants is customary; round up taxi fares.",
            "commute": "Rent a scooter with international license or use Grab/Gojek ride-hailing; hire a private driver for day tours.",
            "water": "Do not drink tap water; always drink sealed bottled or mineral water.",
            "plugs": "230V, 50Hz, Type C and Type F."
        },
        "eco": {
            "priorities": [
                "Refuse single-use plastics and carry insulated reusable flasks",
                "Support community-based tourism and fair-trade artisans in rural Balinese villages",
                "Choose reef-safe oxybenzone-free mineral sunscreen to protect coral reefs",
                "Stay in sustainable bamboo architecture villas designed with natural river ventilation"
            ],
            "hotel_preference": "Open-air bamboo resorts built with local reclaimed timber, gray-water recycling, and organic permaculture gardens."
        },
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
            "rate_to_inr": 0.062
        },
        "emergency": {
            "general": "112",
            "police": "112",
            "ambulance": "119",
            "fire": "119",
            "tourist": "1330"
        },
        "best_season": "September to November (Autumn foliage) or April to May (Cherry blossoms)",
        "hotels": [
            {
                "name": "Hanok Heritage Guest House",
                "area": "Bukchon Traditional Village, Seoul",
                "nightly_inr": 11500,
                "rating": 4.7
            },
            {
                "name": "Haeundae Ocean View Grand Hotel",
                "area": "Haeundae Beach, Busan",
                "nightly_inr": 13500,
                "rating": 4.6
            }
        ],
        "transport": [
            {
                "mode": "KTX High-Speed Bullet Rail",
                "note": "Whisks travelers from Seoul to Busan in under 2.5 hours",
                "estimated_inr": 3800
            },
            {
                "mode": "Seoul Metropolitan Subway",
                "note": "Use reloadable T-Money card; comprehensive, heated seats and bilingual signs",
                "estimated_inr": 450
            }
        ],
        "restaurants": [
            {
                "name": "Authentic Korean BBQ & Hanwoo Beef",
                "cuisine": "Korean Grill & Banchan",
                "price_band": "$$$",
                "area": "Gangnam / Hongdae"
            },
            {
                "name": "Gwangjang Traditional Market Kalguksu & Bindaetteok",
                "cuisine": "Korean Street Market",
                "price_band": "$",
                "area": "Jongno, Seoul"
            }
        ],
        "route_tip": "Wear or rent a traditional Hanbok near Gyeongbokgung for free entrance to all royal Joseon palaces.",
        "etiquette": {
            "dress": "Trendy and modern; renting a Hanbok provides free admission to royal palaces.",
            "tipping": "No tipping in Korea; service charge is not required and staff may decline tips.",
            "commute": "Get a T-Money card for subways, buses, and taxis; subways feature heated seats and English displays.",
            "water": "Tap water is strictly safe, though water purifiers ('Jeongsugi') are ubiquitous in all cafes and hotels.",
            "plugs": "220V, 60Hz, Type C and Type F."
        },
        "eco": {
            "priorities": [
                "Utilize Korea's electric KTX rail and extensive urban subway systems",
                "Participate in the nationwide high-efficiency food waste recycling program",
                "Stay in traditional timber Hanoks built with natural clay, wood, and paper",
                "Hike on Korea's well-maintained National Mountain trails without off-roading"
            ],
            "hotel_preference": "Certified green hotels or traditional Hanok stays utilizing Korean ondol floor heating and energy-efficient climate control."
        },
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
            "rate_to_inr": 5.6
        },
        "emergency": {
            "general": "119",
            "police": "119",
            "ambulance": "102",
            "fire": "118"
        },
        "best_season": "November to April (Dry northeast monsoon)",
        "hotels": [
            {
                "name": "Overwater Sunrise Villa Resort",
                "area": "North Male Atoll",
                "nightly_inr": 35000,
                "rating": 4.9
            },
            {
                "name": "Eco-Friendly Tropical Island Beach Chalet",
                "area": "Ari Atoll",
                "nightly_inr": 22000,
                "rating": 4.7
            }
        ],
        "transport": [
            {
                "mode": "Twin Otter Scenic Seaplane",
                "note": "Breathtaking low-altitude aerial panoramas of turquoise coral rings and sandbars",
                "estimated_inr": 18000
            },
            {
                "mode": "Speedboat Resort Transfer",
                "note": "Fast ocean transit from Velana International Airport to resort docks",
                "estimated_inr": 6500
            }
        ],
        "restaurants": [
            {
                "name": "Underwater Coral Reef Restaurant",
                "cuisine": "Fine Dining Seafood",
                "price_band": "$$$$",
                "area": "Lagoon Sub-Surface"
            },
            {
                "name": "Barefoot Sunset Beach Grill & Mas Huni",
                "cuisine": "Maldivian Fresh Tuna & Coconut",
                "price_band": "$$$",
                "area": "Resort Shoreline"
            }
        ],
        "route_tip": "Check luggage weight limits beforehand as domestic seaplanes have strict baggage restrictions (typically 20kg).",
        "etiquette": {
            "dress": "Resort islands are fully relaxed; on local inhabited islands, dress modestly covering shoulders and knees.",
            "tipping": "10% service charge is added to bills; extra $2-5 per day for room attendants and boat crew is customary.",
            "commute": "Transport between islands is exclusively by speedboat or picturesque de Havilland seaplane.",
            "water": "Desalinated tap water is standard in resorts; complimentary bottled water is replenished daily.",
            "plugs": "230V, 50Hz, Type G (British three-pin)."
        },
        "eco": {
            "priorities": [
                "Select resorts with active coral reef propagation and marine biology nurseries",
                "Ensure sunscreens are strictly non-nano zinc oxide reef-safe formulas",
                "Patronize islands utilizing solar micro-grids and self-contained water desalination",
                "Never touch or step on living corals while snorkeling or scuba diving"
            ],
            "hotel_preference": "Carbon-neutral certified private island resorts operating full solar generation, glass-bottled desalinated water, and active coral regeneration programs."
        },
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
            "rate_to_inr": 8.1
        },
        "emergency": {
            "general": "112",
            "police": "112",
            "ambulance": "113",
            "fire": "110"
        },
        "best_season": "June to August (Midnight Sun) or December to March (Northern Lights)",
        "hotels": [
            {
                "name": "Historic Fjordland Wooden Hotel",
                "area": "Flåm / Geirangerfjord",
                "nightly_inr": 16500,
                "rating": 4.8
            },
            {
                "name": "Hanseatic Wharf Waterfront Stay",
                "area": "Bryggen, Bergen",
                "nightly_inr": 13500,
                "rating": 4.6
            }
        ],
        "transport": [
            {
                "mode": "Vy Electric Train & Flåm Railway",
                "note": "Norway's railways run on hydro-power; Flåm line features 20 tunnels and waterfall halts",
                "estimated_inr": 4200
            },
            {
                "mode": "Electric Zero-Emission Fjord Catamaran",
                "note": "Silent electric vessel sailing past sheer UNESCO fjord walls",
                "estimated_inr": 3100
            }
        ],
        "restaurants": [
            {
                "name": "New Nordic Salmon & King Crab Dining",
                "cuisine": "Arctic Coastal Norwegian",
                "price_band": "$$$",
                "area": "Bergen Fish Market / Oslo"
            },
            {
                "name": "Traditional Kaffistova & Brown Cheese Waffle",
                "cuisine": "Norwegian Homestyle",
                "price_band": "$$",
                "area": "Oslo Sentrum"
            }
        ],
        "route_tip": "Book the Norway in a Nutshell tour for seamless connections between trains, fjord boats, and mountain coaches.",
        "etiquette": {
            "dress": "Outdoor thermal layers and sturdy waterproof boots; follow 'allemannsretten' (right to roam responsibly).",
            "tipping": "Tipping is not required; rounding up to the nearest 10-20 NOK for good service is standard.",
            "commute": "Flåm Railway and electric fjord catamarans offer incredible views; contactless cards used everywhere (almost cashless).",
            "water": "Tap water is among the cleanest, sweetest, and most refreshing natural water on Earth.",
            "plugs": "230V, 50Hz, Type C and Type F."
        },
        "eco": {
            "priorities": [
                "Cruise silent fjords aboard world-leading 100% battery-electric catamarans",
                "Travel aboard hydro-electric powered rail networks between Oslo and Bergen",
                "Practice 'Allemannsretten' (Right to Roam) with total Leave No Trace stewardship",
                "Stay in eco-lighthouse certified timber lodges built to passive house standards"
            ],
            "hotel_preference": "Eco-Lighthouse ('Miljøfyrtårn') certified hotels utilizing geothermal heating and 100% regional organic produce."
        },
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
            "rate_to_inr": 0.62
        },
        "emergency": {
            "general": "112",
            "police": "112",
            "ambulance": "112",
            "fire": "112"
        },
        "best_season": "June to August (Hiking & Puffins) or September to March (Aurora Borealis)",
        "hotels": [
            {
                "name": "Geothermal Lava Field Retreat",
                "area": "Grindavik / Blue Lagoon",
                "nightly_inr": 24000,
                "rating": 4.9
            },
            {
                "name": "Reykjavik Harpa Design Boutique",
                "area": "Reykjavik Old Harbor",
                "nightly_inr": 14500,
                "rating": 4.6
            }
        ],
        "transport": [
            {
                "mode": "4x4 Ring Road Exploration Vehicle",
                "note": "Crucial for navigating weather conditions, gravel surfaces, and scenic Ring Road stops",
                "estimated_inr": 7200
            },
            {
                "mode": "Super Jeep Glacier Excursion",
                "note": "Specialized high-clearance jeeps accessing ice caves and highlands",
                "estimated_inr": 9500
            }
        ],
        "restaurants": [
            {
                "name": "Geothermal Volcanic Bakery & Rye Bread",
                "cuisine": "Earth-Baked Arctic Specialties",
                "price_band": "$$",
                "area": "Laugarvatn Fontana"
            },
            {
                "name": "Reykjavik Fresh Arctic Char & Langoustine Bistro",
                "cuisine": "Icelandic Nordic Cuisine",
                "price_band": "$$$",
                "area": "Grandagarður Harbor"
            }
        ],
        "route_tip": "Check road.is and vedur.is daily before driving; winds can be strong enough to damage car doors.",
        "etiquette": {
            "dress": "Windproof and waterproof shell jackets; shower with soap without swimwear before entering thermal pools.",
            "tipping": "No tipping culture; service is included in all prices.",
            "commute": "Rent a 4x4 vehicle for Ring Road and F-roads; monitor vedur.is for sudden weather changes.",
            "water": "Tap water is pure glacier runoff; cold water is untouched, hot water has a natural sulfur scent.",
            "plugs": "230V, 50Hz, Type C and Type F."
        },
        "eco": {
            "priorities": [
                "Utilize Iceland's 100% renewable geothermal and hydroelectric energy infrastructure",
                "Never walk on delicate fragile sub-Arctic moss which takes decades to recover",
                "Stay strictly on designated trails to prevent catastrophic soil erosion",
                "Refill water bottles directly from pure glacial cold tap water"
            ],
            "hotel_preference": "Properties heated 100% by geothermal hot springs with zero carbon footprint and Nordic Swan ecolabel."
        },
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
            "rate_to_inr": 8.7
        },
        "emergency": {
            "general": "19",
            "police": "19",
            "ambulance": "15",
            "fire": "15",
            "tourist": "0524384444"
        },
        "best_season": "March to May and September to November",
        "hotels": [
            {
                "name": "Authentic Medina Riad & Courtyard Pool",
                "area": "Medina, Marrakech",
                "nightly_inr": 9500,
                "rating": 4.8
            },
            {
                "name": "Oceanfront White Fortress Riad",
                "area": "Essaouira Ramparts",
                "nightly_inr": 8000,
                "rating": 4.6
            }
        ],
        "transport": [
            {
                "mode": "ONCF Al Boraq High-Speed Bullet Train",
                "note": "Africa's fastest train connecting Tangier, Rabat, and Casablanca",
                "estimated_inr": 1800
            },
            {
                "mode": "Private Berber Atlas Mountain Transfer",
                "note": "Scenic mountain pass journey to Sahara desert dunes",
                "estimated_inr": 4200
            }
        ],
        "restaurants": [
            {
                "name": "Traditional Tagine & Saffron Couscous Dining",
                "cuisine": "Moroccan Royal Tagine",
                "price_band": "$$",
                "area": "Mouassine, Marrakech"
            },
            {
                "name": "Rooftop Mint Tea & Almond Pastry Salon",
                "cuisine": "Traditional Cafe & Sweets",
                "price_band": "$",
                "area": "Jemaa el-Fnaa"
            }
        ],
        "route_tip": "Download offline maps for Medina alleys; agree on taxi fares before getting in if no meter is used.",
        "etiquette": {
            "dress": "Respectful modest dress covering shoulders and knees; avoid photographing locals without asking.",
            "tipping": "Tipping is customary; 10% in cafes and restaurants, 10-20 DH for luggage porters in medinas.",
            "commute": "Al Boraq high-speed train connects Tangier to Casablanca; negotiate 'petit taxi' fares or demand meter.",
            "water": "Drink bottled mineral water (Sidi Ali / Ain Saiss); avoid tap water.",
            "plugs": "220V, 50Hz, Type C and Type E."
        },
        "eco": {
            "priorities": [
                "Stay in family-preserved authentic historic Riads within the UNESCO ancient medinas",
                "Buy handcrafted ceramics, argan oil, and carpets directly from verified women's cooperatives",
                "Use high-speed rail lines to travel between northern coastal and imperial capitals",
                "Conserve water strictly while journeying near fragile pre-Saharan oases"
            ],
            "hotel_preference": "Historic Riads restored by master artisans using traditional tadelakt lime plaster and courtyard rainwater fountains."
        },
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
            "rate_to_inr": 15.2
        },
        "emergency": {
            "general": "190",
            "police": "190",
            "ambulance": "192",
            "fire": "193"
        },
        "best_season": "December to March (Summer & Carnival) or May to September",
        "hotels": [
            {
                "name": "Copacabana Oceanfront Heritage Hotel",
                "area": "Copacabana Beach, Rio de Janeiro",
                "nightly_inr": 15500,
                "rating": 4.7
            },
            {
                "name": "Santa Teresa Bohemian Boutique",
                "area": "Santa Teresa Hilltop, Rio",
                "nightly_inr": 11000,
                "rating": 4.6
            }
        ],
        "transport": [
            {
                "mode": "Rio de Janeiro Metrô & VLT Tram",
                "note": "Air-conditioned transit linking South Zone beaches to historic center and airport",
                "estimated_inr": 350
            },
            {
                "mode": "Licensed Airport Taxi & Uber",
                "note": "Use app ride-hailing for safe and trackable door-to-door transit",
                "estimated_inr": 900
            }
        ],
        "restaurants": [
            {
                "name": "Traditional Brazilian Churrascaria Rodizio",
                "cuisine": "Prime Picanha & Grilled Meats",
                "price_band": "$$$",
                "area": "Ipanema / Botafogo"
            },
            {
                "name": "Beachside Kiosk Fresh Coconut & Açaí Bowl",
                "cuisine": "Tropical Fruit & Snacks",
                "price_band": "$",
                "area": "Leblon Shoreline"
            }
        ],
        "route_tip": "Visit Christ the Redeemer early on the first cogwheel train of the morning for clear skies and shorter queues.",
        "etiquette": {
            "dress": "Vibrant and casual; keep jewelry and high-end smartphones discreet on public city streets.",
            "tipping": "10% service fee ('dez por cento') is almost always included on restaurant bills.",
            "commute": "Use registered Uber or airport transfer booths; Rio Metro is air-conditioned and reliable.",
            "water": "Drink filtered or bottled water in all cities and accommodations.",
            "plugs": "127V/220V, 60Hz, Type N (three round pins) and Type C."
        },
        "eco": {
            "priorities": [
                "Support certified community ecotourism guides in Tijuca National Forest",
                "Choose sustainably harvested wild açaí certified by rainforest preservation alliances",
                "Ride electric VLT urban trams and modern subway lines across Rio and São Paulo",
                "Select coastal lodges supporting Atlantic Forest ('Mata Atlântica') reforestation"
            ],
            "hotel_preference": "Eco-pousadas utilizing solar hot water, local timber certification, and zero single-use plastics."
        },
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
            "rate_to_inr": 4.3
        },
        "emergency": {
            "general": "911",
            "police": "911",
            "ambulance": "911",
            "fire": "911",
            "tourist": "078"
        },
        "best_season": "November to April (Dry winter and spring)",
        "hotels": [
            {
                "name": "Colonial Courtyard Hacienda Hotel",
                "area": "Centro Historico / Roma Norte, Mexico City",
                "nightly_inr": 11000,
                "rating": 4.7
            },
            {
                "name": "Jungle Beach Eco-Resort",
                "area": "Tulum Beach Road",
                "nightly_inr": 18000,
                "rating": 4.6
            }
        ],
        "transport": [
            {
                "mode": "ADO First-Class Coach & Tren Maya",
                "note": "Comfortable, air-conditioned intercity travel across Yucatan and Riviera Maya",
                "estimated_inr": 1400
            },
            {
                "mode": "Mexico City Metrobús & Metro",
                "note": "Inexpensive transit; specialized women-only cars available during rush hours",
                "estimated_inr": 200
            }
        ],
        "restaurants": [
            {
                "name": "Artisan Taqueria & Al Pastor Trompo",
                "cuisine": "Authentic Mexican Street Tacos",
                "price_band": "$",
                "area": "Condesa / Narvarte"
            },
            {
                "name": "Contemporary Mexican Gastronomy & Mole",
                "cuisine": "Modern Mexican Haute Cuisine",
                "price_band": "$$$$",
                "area": "Polanco, CDMX"
            }
        ],
        "route_tip": "Book Frida Kahlo Museum tickets at least three weeks early; arrive at Chichen Itza right at opening.",
        "etiquette": {
            "dress": "Smart casual; linen and lightweight cottons for coastal areas.",
            "tipping": "10-15% ('propina') is standard and customary at restaurants and bars.",
            "commute": "Use Uber or authorized 'Sitio' taxis; ADO first-class buses are safe and luxurious across Yucatan.",
            "water": "Do not drink tap water; ask for 'agua purificada' everywhere.",
            "plugs": "127V, 60Hz, Type A and Type B."
        },
        "eco": {
            "priorities": [
                "Shower thoroughly before swimming in sacred cenotes to protect delicate underground freshwater aquifers",
                "Wear strictly chemical-free biodegradable mineral sunscreen in Caribbean lagoons",
                "Support indigenous artisan textile and pottery weavers in Oaxaca and Chiapas",
                "Eat locally grown heirloom maize and seasonal produce from community chinampas"
            ],
            "hotel_preference": "Eco-boutique hotels with solar power, natural ventilation design, and certified wastewater treatment wetlands."
        },
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
            "rate_to_inr": 4.8
        },
        "emergency": {
            "general": "112",
            "police": "10111",
            "ambulance": "10177",
            "fire": "10177"
        },
        "best_season": "May to September (Wildlife safari) or November to March (Cape Town beaches)",
        "hotels": [
            {
                "name": "Table Mountain View Heritage Boutique",
                "area": "Kloof Street / Camps Bay, Cape Town",
                "nightly_inr": 13500,
                "rating": 4.7
            },
            {
                "name": "Private Wildlife Safari Camp & Lodge",
                "area": "Greater Kruger National Park",
                "nightly_inr": 26000,
                "rating": 4.9
            }
        ],
        "transport": [
            {
                "mode": "Self-Drive Rental Car",
                "note": "Superb highway infrastructure for the scenic Garden Route and Cape Point drive",
                "estimated_inr": 2800
            },
            {
                "mode": "MyCiTi Rapid Transit & Uber",
                "note": "Safe, reliable, and inexpensive around Cape Town central areas",
                "estimated_inr": 500
            }
        ],
        "restaurants": [
            {
                "name": "Cape Malay Curries & Bobotie",
                "cuisine": "Historic Bo-Kaap Flavors",
                "price_band": "$$",
                "area": "Bo-Kaap, Cape Town"
            },
            {
                "name": "Oceanfront Seafood & Karoo Lamb Fine Dining",
                "cuisine": "Modern South African",
                "price_band": "$$$",
                "area": "V&A Waterfront"
            }
        ],
        "route_tip": "Take Table Mountain cableway on the first clear sunny day as coastal clouds can roll in rapidly.",
        "etiquette": {
            "dress": "Safari neutral khaki and olive for reserves; stylish smart-casual in Cape Town and Winelands.",
            "tipping": "10-15% is standard at restaurants; R10-20 for car guards and petrol station attendants.",
            "commute": "Use Uber in cities; rent a car for the Garden Route and Cape Peninsula scenic drives.",
            "water": "Tap water is of the highest international quality and completely safe to drink in major cities.",
            "plugs": "230V, 50Hz, Type M (three large round pins) and Type C/N."
        },
        "eco": {
            "priorities": [
                "Support accredited national parks and verified ethical wildlife conservation reserves",
                "Observe animals silently from designated safari vehicles without off-track driving",
                "Conserve water mindfully in the Western Cape region",
                "Buy certified fair-trade crafts supporting local empowerment programs"
            ],
            "hotel_preference": "Fair Trade Tourism ('FTT') certified safari lodges with solar off-grid energy, zero waste, and local community equity."
        },
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
    }
}

COUNTRY_ALIASES: dict[str, str] = {
    "swiss": "switzerland",
    "zurich": "switzerland",
    "geneva": "switzerland",
    "interlaken": "switzerland",
    "lucerne": "switzerland",
    "zermatt": "switzerland",
    "bern": "switzerland",
    "basel": "switzerland",
    "alps": "switzerland",
    "swiss alps": "switzerland",
    "tokyo": "japan",
    "kyoto": "japan",
    "osaka": "japan",
    "hiroshima": "japan",
    "nara": "japan",
    "sapporo": "japan",
    "fukuoka": "japan",
    "paris": "france",
    "nice": "france",
    "lyon": "france",
    "marseille": "france",
    "bordeaux": "france",
    "cannes": "france",
    "strasbourg": "france",
    "rome": "italy",
    "florence": "italy",
    "venice": "italy",
    "milan": "italy",
    "naples": "italy",
    "amalfi": "italy",
    "tuscany": "italy",
    "sicily": "italy",
    "usa": "united states",
    "us": "united states",
    "america": "united states",
    "new york": "united states",
    "nyc": "united states",
    "los angeles": "united states",
    "san francisco": "united states",
    "chicago": "united states",
    "las vegas": "united states",
    "miami": "united states",
    "seattle": "united states",
    "boston": "united states",
    "hawaii": "united states",
    "uk": "united kingdom",
    "britain": "united kingdom",
    "england": "united kingdom",
    "scotland": "united kingdom",
    "wales": "united kingdom",
    "london": "united kingdom",
    "edinburgh": "united kingdom",
    "manchester": "united kingdom",
    "oxford": "united kingdom",
    "cambridge": "united kingdom",
    "bath": "united kingdom",
    "berlin": "germany",
    "munich": "germany",
    "frankfurt": "germany",
    "hamburg": "germany",
    "cologne": "germany",
    "bavaria": "germany",
    "barcelona": "spain",
    "madrid": "spain",
    "seville": "spain",
    "valencia": "spain",
    "granada": "spain",
    "mallorca": "spain",
    "ibiza": "spain",
    "uae": "united arab emirates",
    "dubai": "united arab emirates",
    "abu dhabi": "united arab emirates",
    "sharjah": "united arab emirates",
    "bangkok": "thailand",
    "phuket": "thailand",
    "chiang mai": "thailand",
    "krabi": "thailand",
    "koh samui": "thailand",
    "pattaya": "thailand",
    "sydney": "australia",
    "melbourne": "australia",
    "brisbane": "australia",
    "perth": "australia",
    "adelaide": "australia",
    "gold coast": "australia",
    "cairns": "australia",
    "singapore city": "singapore",
    "toronto": "canada",
    "vancouver": "canada",
    "montreal": "canada",
    "banff": "canada",
    "ottawa": "canada",
    "calgary": "canada",
    "quebec": "canada",
    "cairo": "egypt",
    "giza": "egypt",
    "luxor": "egypt",
    "aswan": "egypt",
    "alexandria": "egypt",
    "hurghada": "egypt",
    "athens": "greece",
    "santorini": "greece",
    "mykonos": "greece",
    "crete": "greece",
    "rhodes": "greece",
    "corfu": "greece",
    "jaipur": "india",
    "delhi": "india",
    "new delhi": "india",
    "mumbai": "india",
    "goa": "india",
    "kerala": "india",
    "kochi": "india",
    "varanasi": "india",
    "udaipur": "india",
    "mysuru": "india",
    "rishikesh": "india",
    "darjeeling": "india",
    "bangalore": "india",
    "bengaluru": "india",
    "agra": "india",
    "ladakh": "india",
    "kashmir": "india",
    "himachal": "india",
    "himachal pradesh": "india",
    "kolkata": "india",
    "pondicherry": "india",
    "okinawa": "japan",
    "hakone": "japan",
    "fuji": "japan",
    "toulouse": "france",
    "versailles": "france",
    "turin": "italy",
    "bologna": "italy",
    "pisa": "italy",
    "liverpool": "united kingdom",
    "belfast": "united kingdom",
    "dresden": "germany",
    "heidelberg": "germany",
    "malaga": "spain",
    "phi phi": "thailand",
    "sentosa": "singapore",
    "changi": "singapore",
    "whistler": "canada",
    "sharm": "egypt",
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
    "hyderabad": "india",
    "chennai": "india",
    "manali": "india",
    "shimla": "india",
    "amritsar": "india"
}

def resolve_country(destination: str) -> dict[str, Any]:
    """
    Intelligently resolve any destination (city, country, region, landmark) to its
    authentic country intelligence profile, with a robust fallback for unknown destinations.
    """
    clean = (destination or "").strip().lower()
    if not clean:
        return GLOBAL_COUNTRIES["india"]

    # Direct match or alias match
    parts = [p.strip() for p in clean.replace("-", " ").split(",")]

    # Check exact match on full string or individual parts
    candidates = [clean] + parts + [clean.split()[0] if clean.split() else ""]

    for candidate in candidates:
        if candidate in GLOBAL_COUNTRIES:
            return GLOBAL_COUNTRIES[candidate]
        if candidate in COUNTRY_ALIASES:
            matched_key = COUNTRY_ALIASES[candidate]
            if matched_key in GLOBAL_COUNTRIES:
                return GLOBAL_COUNTRIES[matched_key]

    # Substring search
    for key, data in GLOBAL_COUNTRIES.items():
        if key in clean or data["name"].lower() in clean:
            return data

    for alias, key in COUNTRY_ALIASES.items():
        if alias in clean and key in GLOBAL_COUNTRIES:
            return GLOBAL_COUNTRIES[key]

    # Universal Global Fallback for any unknown destination
    city_title = destination.split(",")[0].strip().title() or "Destination"
    return {
        "name": city_title,
        "region": "Global Travel Hub",
        "currency": {"code": "USD", "symbol": "$", "rate_to_inr": 86.8},
        "emergency": {"general": "112 / 911", "police": "112", "ambulance": "112", "fire": "112", "tourist": "112"},
        "best_season": "May to October (Spring and Autumn shoulder seasons)",
        "hotels": [
            {"name": f"{city_title} Central Landmark Hotel", "area": "City Center & Historic District", "nightly_inr": 12500, "rating": 4.6},
            {"name": f"{city_title} Boutique Riverside Stay", "area": "Cultural Neighborhood", "nightly_inr": 8500, "rating": 4.4},
        ],
        "transport": [
            {"mode": "Metropolitan Rail & City Metro", "note": f"Fast public transit across {city_title}; contactless payment recommended", "estimated_inr": 750},
            {"mode": "Licensed Taxi & Ride-Hailing", "note": "Use registered apps or pre-paid counters for transparent fares", "estimated_inr": 1200},
        ],
        "restaurants": [
            {"name": f"Traditional {city_title} Culinary House", "cuisine": "Regional Cuisine & Specialties", "price_band": "$$", "area": "Historic Market District"},
            {"name": f"{city_title} Artisan Street Food & Cafe", "cuisine": "Local street eats and fresh roast coffee", "price_band": "$", "area": "Central Boulevard"},
        ],
        "route_tip": f"Cluster visits by district in {city_title} and reserve tickets online for popular cultural monuments.",
        "etiquette": {
            "dress": "Respectful smart-casual clothing; carry a layer for indoor air-conditioned venues and shrines.",
            "tipping": "Check restaurant bill; leaving 5-10% for attentive service is standard in most international destinations.",
            "commute": "Keep metro cards or contactless payment handy; validate paper tickets where required.",
            "water": "Drink filtered or bottled water when in unfamiliar regions.",
            "plugs": "Standard international dual-voltage plugs (Type C/G/A/B compatible).",
        },
        "eco": {
            "priorities": [
                f"Prioritize public trains and metro systems throughout {city_title}",
                "Explore downtown pedestrian walkways and rent shared public bicycles",
                "Support independent locally owned family businesses and regional artisans",
                "Select certified sustainable accommodations with verified green practices",
            ],
            "hotel_preference": "Choose accommodations with verified environmental certifications, solar energy, and towel reuse policies.",
        },
        "suggestions": [
            f"{city_title} historic center and heritage architecture walk",
            f"{city_title} national museum and cultural galleries",
            f"{city_title} vibrant artisan market and local food crawl",
            f"{city_title} scenic riverbank or lakefront promenade",
            f"{city_title} panoramic sunset viewpoint and rooftop dining",
            f"{city_title} botanical gardens and green spaces exploration",
            f"{city_title} historic fortress or landmark palace visit",
            f"{city_title} traditional evening performing arts showcase",
        ],
    }
