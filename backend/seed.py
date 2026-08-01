from app.database import Base, SessionLocal, engine
from app.matching import EMBEDDING_MODEL, embed_text
from app.models import LciProcess

Base.metadata.create_all(bind=engine)

SEED = [
    ("uslci-aluminum-ingot", "USLCI", "2024-demo", "aluminium production, primary, ingot", "aluminium ingot", "kg", "US", "Cut-off", "Primary aluminium production including smelting and casting to ingot."),
    ("uslci-steel-low-alloy", "USLCI", "2024-demo", "steel production, low-alloy, at plant", "low-alloy steel", "kg", "US", "Cut-off", "Steel production at plant for low alloy grades."),
    ("uslci-polypropylene-granulate", "USLCI", "2024-demo", "polypropylene production, granulate", "polypropylene granulate", "kg", "US", "Cut-off", "Polypropylene resin granulate production."),
    ("uslci-electricity-grid", "USLCI", "2024-demo", "electricity, medium voltage, grid mix", "electricity", "kWh", "US", "Cut-off", "US medium voltage grid electricity mix."),
    ("uslci-road-freight", "USLCI", "2024-demo", "transport, freight, lorry", "freight transport", "tkm", "US", "Cut-off", "Road freight transport by lorry."),
    ("elcd-copper-rer", "ELCD", "demo", "copper production, cathode, RER", "copper cathode", "kg", "RER", "Cut-off", "European copper cathode production."),
    ("agribalyse-wheat-glo", "Agribalyse", "demo", "wheat grain production", "wheat grain", "kg", "GLO", "Cut-off", "Open demonstration crop production dataset."),
]

db = SessionLocal()
try:
    if db.query(LciProcess).count() == 0:
        for row in SEED:
            text = " ".join([row[3], row[4], row[8]])
            db.add(LciProcess(process_uuid=row[0], database_source=row[1], database_version=row[2], process_name=row[3], reference_product=row[4], reference_unit=row[5], geography=row[6], system_model=row[7], description=row[8], embedding=embed_text(text), embedding_model=EMBEDDING_MODEL))
        db.commit()
        print("Seeded demo LCI processes.")
    else:
        print("Database already has LCI processes; no seed needed.")
finally:
    db.close()

