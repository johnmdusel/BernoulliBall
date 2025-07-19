from pydantic import BaseModel
from typing import List, Optional


class PDFPoint(BaseModel):
    x: float
    y: float


class EstimateResponse(BaseModel):
    a: float
    b: float
    hdi_mass: float
    pdf: List[PDFPoint]
    hdi_lower_x: Optional[float]
    hdi_upper_x: Optional[float]
    mode: Optional[float]

class EvaluateResponse(BaseModel):
    a: float
    b: float
    confidence: float
    prob_requirement_met: float
    evaluation: str
