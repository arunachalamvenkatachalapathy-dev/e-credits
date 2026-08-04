import sqlite3
import os

db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "bom_lci.db")
if not os.path.exists(db_path):
    print("No app.db file found, skipped ALTER TABLE.")
else:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check & add columns to lci_processes
    cursor.execute("PRAGMA table_info(lci_processes)")
    cols = [row[1] for row in cursor.fetchall()]
    if "factor_status" not in cols:
        cursor.execute("ALTER TABLE lci_processes ADD COLUMN factor_status VARCHAR(20)")
        print("Added factor_status column to lci_processes")
    if "factor_source" not in cols:
        cursor.execute("ALTER TABLE lci_processes ADD COLUMN factor_source TEXT")
        print("Added factor_source column to lci_processes")
        
    # Check & add columns to bom_mapping_audits
    cursor.execute("PRAGMA table_info(bom_mapping_audits)")
    audit_cols = [row[1] for row in cursor.fetchall()]
    if "scenario" not in audit_cols:
        cursor.execute("ALTER TABLE bom_mapping_audits ADD COLUMN scenario VARCHAR(20)")
        print("Added scenario column to bom_mapping_audits")
        
    conn.commit()
    conn.close()
    print("Database migration finished!")
