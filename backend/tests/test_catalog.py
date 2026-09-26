import json

from app.catalog import CATALOG_PATH, load_places


def test_seed_has_ten_to_twenty_distinct_localized_places_with_sources():
    places = load_places()
    assert len(places) >= 10
    assert len({place.id for place in places}) == len(places)
    assert all(set(place.texts) == {'kk', 'ru', 'en'} for place in places)
    assert all(place.access in {'walk', 'transit'} for place in places)

    provenance = json.loads((CATALOG_PATH.parent / 'provenance.json').read_text(encoding='utf-8'))
    assert {item['id'] for item in provenance['places']} == {place.id for place in places}
    assert all(item['urls'] for item in provenance['places'])
