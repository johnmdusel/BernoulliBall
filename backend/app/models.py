from decimal import Decimal
from typing import Optional, List

from pydantic import BaseModel, Field


class PDFPoint(BaseModel):
    x: float
    y: float

class BaseResponse(BaseModel):
    pdf: List[PDFPoint]

class EstimateResponse(BaseResponse):
    hdi_lower_x: Optional[Decimal] = Field(ge=0, le=1, decimal_places=2)
    hdi_upper_x: Optional[Decimal] = Field(ge=0, le=1, decimal_places=2)
    mode: Optional[Decimal] = Field(ge=0, le=1, decimal_places=2)

class EvaluateResponse(BaseResponse):
    prob_requirement_met: float = Field(gt=0, lt=1)
    evaluation: str
