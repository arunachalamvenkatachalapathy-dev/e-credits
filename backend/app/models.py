import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, JSON, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)
    full_name: Mapped[str | None] = mapped_column(Text)
    role: Mapped[str] = mapped_column(String(50), default="analyst")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_name: Mapped[str] = mapped_column(Text, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    default_target_geography: Mapped[str | None] = mapped_column(String(20))
    default_target_year: Mapped[int | None] = mapped_column(Integer)
    org_boundary: Mapped[str | None] = mapped_column(String(100))
    base_year: Mapped[int | None] = mapped_column(Integer)
    materiality_threshold: Mapped[float | None] = mapped_column(Float)
    scope2_method: Mapped[str | None] = mapped_column(String(50))
    created_by_user_id: Mapped[str | None] = mapped_column(String, ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)


class LciProcess(Base):
    __tablename__ = "lci_processes"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    process_uuid: Mapped[str] = mapped_column(String(255), nullable=False)
    database_source: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    database_version: Mapped[str | None] = mapped_column(String(50))
    process_name: Mapped[str] = mapped_column(Text, nullable=False)
    reference_product: Mapped[str] = mapped_column(Text, nullable=False)
    reference_unit: Mapped[str] = mapped_column(String(20), nullable=False)
    geography: Mapped[str] = mapped_column(String(20), nullable=False)
    system_model: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    sector_isic: Mapped[str | None] = mapped_column(String(50))
    description: Mapped[str | None] = mapped_column(Text)
    emission_factor: Mapped[float | None] = mapped_column(Float)
    emission_factor_source: Mapped[str | None] = mapped_column(Text)
    data_quality_status: Mapped[str | None] = mapped_column(String(20))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    superseded_by_uuid: Mapped[str | None] = mapped_column(String(255))
    embedding: Mapped[list[float]] = mapped_column(JSON, default=list)
    embedding_model: Mapped[str] = mapped_column(String(100), default="local-hash-v1")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)


class BomMappingAudit(Base):
    __tablename__ = "bom_mapping_audits"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    project_id: Mapped[str] = mapped_column(String, ForeignKey("projects.id"), nullable=False, index=True)
    raw_bom_input: Mapped[str] = mapped_column(Text, nullable=False)
    raw_bom_quantity: Mapped[float] = mapped_column(Numeric(12, 4), nullable=False)
    raw_bom_unit: Mapped[str] = mapped_column(String(20), nullable=False)
    converted_quantity: Mapped[float | None] = mapped_column(Numeric(12, 4))
    converted_unit: Mapped[str | None] = mapped_column(String(20))
    unit_conversion_factor: Mapped[float | None] = mapped_column(Numeric(14, 8))
    target_geography: Mapped[str] = mapped_column(String(20), nullable=False)
    target_year: Mapped[int] = mapped_column(Integer, nullable=False)
    matched_process_id: Mapped[str | None] = mapped_column(String, ForeignKey("lci_processes.id"))
    matched_process_uuid: Mapped[str | None] = mapped_column(String(255))
    matched_process_name: Mapped[str | None] = mapped_column(Text)
    vector_similarity_score: Mapped[float | None] = mapped_column(Float)
    embedding_model_used: Mapped[str | None] = mapped_column(String(100))
    requires_process_chaining: Mapped[bool] = mapped_column(Boolean, default=False)
    secondary_chained_process_id: Mapped[str | None] = mapped_column(String, ForeignKey("lci_processes.id"))
    secondary_chained_quantity: Mapped[float | None] = mapped_column(Numeric(12, 4))
    dqr_technological_score: Mapped[int | None] = mapped_column(Integer)
    dqr_geographical_score: Mapped[int | None] = mapped_column(Integer)
    dqr_temporal_score: Mapped[int | None] = mapped_column(Integer)
    proxy_substitutions: Mapped[list[dict]] = mapped_column(JSON, default=list)
    audit_risk_level: Mapped[str | None] = mapped_column(String(20), index=True)
    audit_reasoning: Mapped[str | None] = mapped_column(Text)
    mandatory_data_gap_warning: Mapped[str | None] = mapped_column(Text)
    is_human_approved: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    reviewed_by_user_id: Mapped[str | None] = mapped_column(String, ForeignKey("users.id"))
    human_override_process_id: Mapped[str | None] = mapped_column(String, ForeignKey("lci_processes.id"))
    human_review_notes: Mapped[str | None] = mapped_column(Text)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now_utc)

    matched_process = relationship("LciProcess", foreign_keys=[matched_process_id])

