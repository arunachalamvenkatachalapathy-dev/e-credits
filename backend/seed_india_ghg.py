import csv
import os
import sys

# Ensure backend path is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, Base, engine
from app.models import LciProcess
from app.matching import EMBEDDING_MODEL, embed_text

# Ensure tables are created
Base.metadata.create_all(bind=engine)

def seed():
    csv_paths = [
        os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "downloads", "1 downloaded", "iso 14064", "india_ghg_factors.csv"),
        r"D:\downloads\1 downloaded\iso 14064\india_ghg_factors.csv",
        "india_ghg_factors.csv"
    ]
    
    target_csv = None
    for p in csv_paths:
        if os.path.exists(p):
            target_csv = p
            break
            
    if not target_csv:
        print("Error: india_ghg_factors.csv not found!")
        return

    print(f"Reading factors from: {target_csv}")
    db = SessionLocal()
    count = 0
    try:
        with open(target_csv, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                key = row["key"].strip()
                label = row["label"].strip()
                unit = row["unit"].strip()
                factor_val = float(row["factor_kgco2e"])
                status = row["status"].strip()
                source = row["source"].strip()
                
                uuid_key = f"india-ghg-{key}"
                existing = db.query(LciProcess).filter(LciProcess.process_uuid == uuid_key).first()
                text = f"{label} {key} {source}"
                emb = embed_text(text)
                
                if existing:
                    existing.process_name = label
                    existing.reference_product = label
                    existing.reference_unit = unit
                    existing.description = source
                    existing.emission_factor = factor_val
                    existing.emission_factor_source = source
                    existing.data_quality_status = status
                    existing.factor_status = status
                    existing.factor_source = source
                    existing.embedding = emb
                else:
                    proc = LciProcess(
                        process_uuid=uuid_key,
                        database_source="India_GHG_Factors",
                        database_version="v6",
                        process_name=label,
                        reference_product=label,
                        reference_unit=unit,
                        geography="IN",
                        system_model="Direct Factor",
                        description=source,
                        emission_factor=factor_val,
                        emission_factor_source=source,
                        data_quality_status=status,
                        factor_status=status,
                        factor_source=source,
                        embedding=emb,
                        embedding_model=EMBEDDING_MODEL,
                    )
                    db.add(proc)
                count += 1
        db.commit()
        print(f"Successfully seeded/updated {count} India GHG Factors!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding India GHG Factors: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
