# Future annotations disabled - causes Pydantic ForwardRef issues

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class DocumentBase(BaseModel):
    filename: Optional[str] = None
    file_url: Optional[str] = None


class DocumentCreate(DocumentBase):
    filename: str
    file_url: str


class DocumentUpdate(DocumentBase):
    pass


class DocumentInDBBase(DocumentBase):
    id: uuid.UUID
    case_id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Document(DocumentInDBBase):
    pass
