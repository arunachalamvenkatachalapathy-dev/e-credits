CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    role VARCHAR(50) DEFAULT 'analyst',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_name TEXT NOT NULL,
    description TEXT,
    default_target_geography VARCHAR(20),
    default_target_year INT,
    created_by_user_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lci_processes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    process_uuid VARCHAR(255) NOT NULL,
    database_source VARCHAR(100) NOT NULL,
    database_version VARCHAR(50),
    process_name TEXT NOT NULL,
    reference_product TEXT NOT NULL,
    reference_unit VARCHAR(20) NOT NULL,
    geography VARCHAR(20) NOT NULL,
    system_model VARCHAR(50) NOT NULL,
    sector_isic VARCHAR(50),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    superseded_by_uuid VARCHAR(255),
    embedding vector(1536),
    embedding_model VARCHAR(100) NOT NULL DEFAULT 'text-embedding-3-small',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (process_uuid, database_source, database_version)
);

CREATE INDEX idx_lci_processes_embedding ON lci_processes USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 64);
CREATE INDEX idx_lci_processes_source_geo ON lci_processes(database_source, geography);
CREATE INDEX idx_lci_processes_system_model ON lci_processes(system_model);
CREATE INDEX idx_lci_processes_active ON lci_processes(is_active) WHERE is_active = TRUE;

CREATE TABLE bom_mapping_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id),
    raw_bom_input TEXT NOT NULL,
    raw_bom_quantity NUMERIC(12,4) NOT NULL,
    raw_bom_unit VARCHAR(20) NOT NULL,
    converted_quantity NUMERIC(12,4),
    converted_unit VARCHAR(20),
    unit_conversion_factor NUMERIC(14,8),
    target_geography VARCHAR(20) NOT NULL,
    target_year INT NOT NULL,
    matched_process_id UUID REFERENCES lci_processes(id),
    matched_process_uuid VARCHAR(255),
    matched_process_name TEXT,
    vector_similarity_score NUMERIC(5,4),
    embedding_model_used VARCHAR(100),
    requires_process_chaining BOOLEAN DEFAULT FALSE,
    secondary_chained_process_id UUID REFERENCES lci_processes(id),
    secondary_chained_quantity NUMERIC(12,4),
    dqr_technological_score INT CHECK (dqr_technological_score BETWEEN 1 AND 5),
    dqr_geographical_score INT CHECK (dqr_geographical_score BETWEEN 1 AND 5),
    dqr_temporal_score INT CHECK (dqr_temporal_score BETWEEN 1 AND 5),
    proxy_substitutions JSONB,
    audit_risk_level VARCHAR(20) CHECK (audit_risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
    audit_reasoning TEXT,
    mandatory_data_gap_warning TEXT,
    is_human_approved BOOLEAN DEFAULT FALSE,
    reviewed_by_user_id UUID REFERENCES users(id),
    human_override_process_id UUID REFERENCES lci_processes(id),
    human_review_notes TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bom_mapping_audits_project ON bom_mapping_audits(project_id);
CREATE INDEX idx_bom_mapping_audits_risk ON bom_mapping_audits(audit_risk_level);
CREATE INDEX idx_bom_mapping_audits_approved ON bom_mapping_audits(is_human_approved);
