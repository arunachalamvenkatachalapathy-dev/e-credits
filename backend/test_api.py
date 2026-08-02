from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# 1. Create a project
proj_resp = client.post('/projects', json={
    'project_name': 'Test India GHG Project',
    'target_geography': 'IN',
    'target_year': 2024,
    'default_database_source': 'India_GHG_Factors',
    'default_system_model': 'Direct Factor',
    'org_boundary': 'Operational Control',
    'base_year': 2020,
    'materiality_threshold': 5.0,
    'scope2_method': 'Location-Based'
})
assert proj_resp.status_code == 200, proj_resp.text
project = proj_resp.json()
print('[OK] Created project:', project['id'])

# 2. Match non-placeholder line (Diesel generator fuel)
match1 = client.post('/bom/match', json={
    'project_id': project['id'],
    'raw_bom_input': 'Diesel generator fuel',
    'quantity': 1000.0,
    'unit': 'Liters',
    'target_geography': 'IN',
    'target_year': 2024,
    'database_source': 'India_GHG_Factors',
    'system_model': 'Direct Factor',
    'required_unit': 'Liters'
})
assert match1.status_code == 200, match1.text
data1 = match1.json()
print('\n[OK] Test 1 Match Result (Diesel Generator Fuel):')
print('  - Matched Process:', data1['matched_process_name'])
print('  - Result tCO2e:', data1['result_tco2e'])
print('  - Data Quality Status:', data1.get('matched_data_quality_status') or data1.get('data_quality_status'))
print('  - Candidates count:', len(data1.get('candidate_options') or data1.get('candidates') or []))
assert data1['result_tco2e'] is not None and data1['result_tco2e'] > 0
assert len(data1.get('candidate_options') or data1.get('candidates') or []) >= 1

# 3. Match placeholder line (Product Use-Phase Energy)
match2 = client.post('/bom/match', json={
    'project_id': project['id'],
    'raw_bom_input': 'Product Use Phase Energy',
    'quantity': 500.0,
    'unit': 'Units Sold',
    'target_geography': 'IN',
    'target_year': 2024,
    'database_source': 'India_GHG_Factors',
    'system_model': 'Direct Factor',
    'required_unit': 'Units Sold'
})
assert match2.status_code == 200, match2.text
data2 = match2.json()
print('\n[OK] Test 2 Match Result (Placeholder Factor):')
print('  - Matched Process:', data2['matched_process_name'])
print('  - Result tCO2e:', data2['result_tco2e'])
print('  - Data Quality Status:', data2.get('matched_data_quality_status') or data2.get('data_quality_status'))
print('  - Risk Level:', data2.get('audit_risk_level'))
assert data2.get('matched_data_quality_status') == 'placeholder' or data2.get('data_quality_status') == 'placeholder'
assert data2.get('audit_risk_level') == 'HIGH'

print('\nALL BACKEND VERIFICATIONS PASSED SUCCESSFULLY!')
