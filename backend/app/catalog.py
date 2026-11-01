from .countries import GLOBAL_COUNTRIES, COUNTRY_ALIASES

DESTINATION_SUGGESTIONS: dict[str, list[str]] = {
    'Rishikesh': [
        'Ganga riverside sunrise',
        'Yoga and wellness session',
        'River rafting adventure',
        'Beatles Ashram art walk',
    ],
    'Darjeeling': [
        'Tiger Hill sunrise',
        'Darjeeling Himalayan Railway',
        'Tea estate tasting',
        'Peace Pagoda viewpoint',
    ],
    'Pondicherry': [
        'French Quarter heritage walk',
        'Promenade sunrise',
        'Auroville day visit',
        'South Indian cafe trail',
    ],
    'Mysuru': [
        'Mysore Palace evening lights',
        'Chamundi Hill viewpoint',
        'Devaraja Market food walk',
        'Brindavan Gardens visit',
    ],
    'Jaipur': [
        'Amber Fort sunrise visit',
        'City Palace and Jantar Mantar',
        'Hawa Mahal heritage walk',
        'Johari Bazaar street food crawl',
    ],
    'Delhi': [
        'Old Delhi food walk',
        'Humayun\'s Tomb and Lodhi Garden',
        'India Gate evening stroll',
        'Qutub Minar heritage visit',
    ],
    'Mumbai': [
        'Colaba and Gateway of India walk',
        'Kala Ghoda art district',
        'Marine Drive sunset',
        'Mohammed Ali Road food trail',
    ],
    'Goa': [
        'Fontainhas Latin Quarter walk',
        'Baga and Anjuna beach time',
        'Panaji local food route',
        'Dudhsagar Falls day trip',
    ],
    'Kochi': [
        'Fort Kochi heritage walk',
        'Chinese fishing nets at sunset',
        'Mattancherry spice market',
        'Kerala seafood tasting',
    ],
    'Paris': [
        'Louvre Museum',
        'Eiffel Tower (viewpoint)',
        'Le Marais walking route',
        'Seine riverbank picnic',
    ],
    'Tokyo': [
        'Senso-ji Temple',
        'Shibuya Crossing viewpoint',
        'Tsukiji food stalls',
        'Meiji Shrine and Yoyogi Park',
    ],
    'Lisbon': [
        'Belém Tower',
        'Alfama neighborhood walk',
        'Time Out Market food crawl',
        'Miradouro viewpoint',
    ],
    'Cape Town': [
        'Table Mountain viewpoint',
        'V&A Waterfront',
        'Bo-Kaap cultural walk',
        'Kirstenbosch Garden',
    ],
}

# Populate countries and capital cities into suggestions catalog
for c_key, c_data in GLOBAL_COUNTRIES.items():
    country_name = c_data["name"]
    sugg = c_data.get("suggestions", [])
    if country_name not in DESTINATION_SUGGESTIONS:
        DESTINATION_SUGGESTIONS[country_name] = sugg
    if c_key.capitalize() not in DESTINATION_SUGGESTIONS:
        DESTINATION_SUGGESTIONS[c_key.capitalize()] = sugg

# Populate aliases
for alias, c_key in COUNTRY_ALIASES.items():
    alias_title = alias.title()
    if alias_title not in DESTINATION_SUGGESTIONS and c_key in GLOBAL_COUNTRIES:
        DESTINATION_SUGGESTIONS[alias_title] = GLOBAL_COUNTRIES[c_key]["suggestions"]
