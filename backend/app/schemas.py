from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ProjectCreate(BaseModel):
    project_name: str
    description: str | None = None
    default_target_geography: str = "US"
    default_target_year: int = 2024


class BomLineMatch(BaseModel):
    project_id: str
    raw_bom_input: str
    quantity: float
    unit: str
    required_unit: str = "kg"
    target_geography: str = "US"
    target_year: int = 2024
    database_source: str = "USLCI"
    system_model: str = "Cut-off"


class ReviewRequest(BaseModel):
    user_id: str
    notes: str | None = None


class RejectRequest(BaseModel):
    user_id: str
    notes: str


class OverrideRequest(BaseModel):
    user_id: str
    process_id: str
    notes: str


class AiChatRequest(BaseModel):
    question: str
    rows: list[dict] = Field(default_factory=list)
    api_url: str | None = None
    model: str | None = None
    api_key: str | None = None
