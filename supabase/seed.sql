insert into race_events
  (slug, name, date, gun_start, distances, location, lat, lng,
   registration_url, description, status, source)
values
  (
    'iloilo-city-marathon-2025',
    'Iloilo City Marathon 2025',
    '2025-01-26', '04:00',
    '{5,10,21,42}',
    'Plaza Libertad, Iloilo City',
    10.6966, 122.5695,
    'https://example.com/register',
    'The premier annual marathon of Iloilo City, held in celebration of Dinagyang season.',
    'published', 'admin'
  ),
  (
    'dinagyang-fun-run-2025',
    'Dinagyang Fun Run 2025',
    '2025-01-19', '05:00',
    '{5,10}',
    'Iloilo Sports Complex, Mandurriao, Iloilo City',
    10.6995, 122.5621,
    null,
    'A fun run timed with the Dinagyang Festival celebrations.',
    'published', 'admin'
  ),
  (
    'iloilo-river-run-2025',
    'Iloilo River Run 2025',
    '2025-03-08', '05:30',
    '{10,21}',
    'Iloilo City Esplanade, Iloilo City',
    10.7076, 122.5732,
    'https://example.com/river-run',
    'Run along the scenic Iloilo River Esplanade.',
    'published', 'admin'
  );
