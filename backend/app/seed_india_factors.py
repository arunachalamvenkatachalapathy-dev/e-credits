import pandas as pd
from backend.app.database import engine, SessionLocal
from backend.app.models import Base, IndiaGHGFactor
import os

def seed():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    csv_path = os.path.join(os.path.dirname(__file__), 'india_ghg_factors.csv')
    if not os.path.exists(csv_path):
        print("CSV not found:", csv_path)
        return

    df = pd.read_csv(csv_path)
    
    db = SessionLocal()
    try:
        count = 0
        for _, row in df.iterrows():
            if pd.isna(row['Lookup Key']):
                continue
            lookup_key = str(row['Lookup Key']).strip()
            ef = float(row['Emission Factor'])
            notes = str(row['Source / Notes']) if pd.notna(row['Source / Notes']) else None
            
            existing = db.query(IndiaGHGFactor).filter_by(lookup_key=lookup_key).first()
            if not existing:
                factor = IndiaGHGFactor(
                    lookup_key=lookup_key,
                    emission_factor=ef,
                    source_notes=notes
                )
                db.add(factor)
                count += 1
            else:
                existing.emission_factor = ef
                existing.source_notes = notes
        
        db.commit()
        print(f"Successfully seeded {count} new India GHG factors.")
    except Exception as e:
        print("Error seeding:", e)
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
